#!/usr/bin/env node
/**
 * 8x assignment capture hook.
 *
 * Wired in .claude/settings.json to two Claude Code lifecycle events:
 *   UserPromptSubmit -> `node capture.mjs prompt`    (uses payload.prompt)
 *   Stop             -> `node capture.mjs response`  (uses payload.last_assistant_message)
 *
 * Writes one markdown file per session to <repo>/.agent-logs/.
 * Captures the prompt and the final response only -- no thinking, no tool calls.
 *
 * Rules this script must never break:
 *   - never write to stdout (Stop-hook stdout is injected into the model's context)
 *   - never exit non-zero (exit 2 blocks the prompt / prevents the turn ending)
 *   - never rewrite an entry once written, except the one-time `model: unknown` backfill
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..'); // .claude/hooks -> repo root
const LOG_DIR = path.join(ROOT, '.agent-logs');
const DEBUG_LOG = path.join(LOG_DIR, '.capture-debug.log');

const MODE = process.argv[2]; // 'prompt' | 'response'

function debug(msg) {
  try {
    fs.appendFileSync(DEBUG_LOG, new Date().toISOString() + ' [' + MODE + '] ' + msg + '\n');
  } catch {}
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function loadConfig() {
  const defaults = { author: 'unknown', project: path.basename(ROOT), tool: 'claude-code' };
  try {
    const raw = fs.readFileSync(path.join(HERE, 'capture.config.json'), 'utf8');
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

/** Newest assistant model named in the session transcript, or null. */
function modelFromTranscript(transcriptPath) {
  if (!transcriptPath) return null;
  try {
    const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (!line) continue;
      let entry;
      try {
        entry = JSON.parse(line);
      } catch {
        continue;
      }
      if (entry && entry.type === 'assistant' && entry.message && entry.message.model) {
        return entry.message.model;
      }
    }
  } catch (err) {
    debug('modelFromTranscript failed: ' + err.message);
  }
  return null;
}

/** Synchronous sleep. This script is sync end-to-end and must stay that way. */
function sleepSync(ms) {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  } catch {}
}

/**
 * The Stop hook can fire before Claude Code has flushed the assistant message
 * to the transcript -- observed on turns that finish in ~2s, which left the
 * model recorded as 'unknown'. The hook payload carries no model field, so the
 * transcript is the only source; poll it briefly rather than give up.
 */
function modelFromTranscriptWithRetry(transcriptPath, attempts = 10, delayMs = 300) {
  for (let i = 0; i < attempts; i++) {
    const model = modelFromTranscript(transcriptPath);
    if (model) {
      if (i > 0) debug('model resolved after ' + i + ' retr' + (i === 1 ? 'y' : 'ies'));
      return model;
    }
    sleepSync(delayMs);
  }
  debug('model unresolved after ' + attempts + ' attempts');
  return null;
}

/**
 * Fallback for when the Stop payload carries no last_assistant_message:
 * the trailing run of assistant text blocks, i.e. everything after the last
 * tool result. Deliberately drops thinking and tool_use blocks.
 */
function finalResponseFromTranscript(transcriptPath) {
  if (!transcriptPath) return null;
  try {
    const entries = fs
      .readFileSync(transcriptPath, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    let cut = 0;
    for (let i = entries.length - 1; i >= 0; i--) {
      const content = entries[i] && entries[i].message && entries[i].message.content;
      const isToolResult = Array.isArray(content) && content.some((b) => b && b.type === 'tool_result');
      if (isToolResult) {
        cut = i + 1;
        break;
      }
    }

    const chunks = [];
    for (const entry of entries.slice(cut)) {
      if (entry.type !== 'assistant') continue;
      const content = entry.message && entry.message.content;
      if (!Array.isArray(content)) continue;
      for (const block of content) {
        if (block && block.type === 'text' && block.text) chunks.push(block.text);
      }
    }
    return chunks.length ? chunks.join('\n\n') : null;
  } catch (err) {
    debug('finalResponseFromTranscript failed: ' + err.message);
    return null;
  }
}

/** YYYY-MM-DD_HH-MM-SS in UTC, to match the ISO timestamps inside the file. */
function utcStamp(date) {
  const iso = date.toISOString();
  return iso.slice(0, 10) + '_' + iso.slice(11, 19).replace(/:/g, '-');
}

function findSessionFile(sessionId) {
  try {
    const hit = fs.readdirSync(LOG_DIR).find((f) => f.endsWith('_' + sessionId + '.md'));
    return hit ? path.join(LOG_DIR, hit) : null;
  } catch {
    return null;
  }
}

function createSessionFile(sessionId, now, cfg, model) {
  const file = path.join(LOG_DIR, utcStamp(now) + '_' + sessionId + '.md');
  const ts = now.toISOString();
  const short = sessionId.slice(0, 8);
  const body = [
    '---',
    'session_id: ' + sessionId,
    'date: ' + ts.slice(0, 10),
    'author: ' + cfg.author,
    'model: ' + model,
    'tool: ' + cfg.tool,
    'project: ' + cfg.project,
    'total_exchanges: 0',
    'first_prompt_time: ' + ts,
    'last_prompt_time: ' + ts,
    '---',
    '',
    '# Session Log - ' + ts.slice(0, 10),
    '',
    'Session: `' + short + '` | Project: `' + cfg.project + '` | Author: `' + cfg.author + '`',
    '',
    '---',
    '',
    '',
  ].join('\n');
  fs.writeFileSync(file, body, 'utf8');
  return file;
}

/** Rewrite only the frontmatter counters. Entry bodies are never touched. */
function updateFrontmatter(text, patch) {
  const end = text.indexOf('\n---', 4);
  if (!text.startsWith('---\n') || end === -1) return text;
  let head = text.slice(4, end);
  const rest = text.slice(end);
  for (const [key, value] of Object.entries(patch)) {
    const re = new RegExp('^' + key + ': .*$', 'm');
    head = re.test(head) ? head.replace(re, key + ': ' + value) : head + '\n' + key + ': ' + value;
  }
  return '---\n' + head + rest;
}

function countEntries(text, type) {
  return (text.match(new RegExp('^\\[LOG_ENTRY type=' + type + ' ', 'gm')) || []).length;
}

function entryBlock(opts) {
  return (
    '[LOG_ENTRY type=' + opts.type + ' num=' + opts.num + ' session=' + opts.sessionId.slice(0, 8) + ']\n' +
    'timestamp: ' + opts.timestamp + '\n' +
    'model: ' + opts.model + '\n' +
    '\n' +
    opts.text + '\n' +
    '\n' +
    '\n'
  );
}

function main() {
  if (MODE !== 'prompt' && MODE !== 'response') {
    debug('unknown mode: ' + MODE);
    return;
  }

  const raw = readStdin();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    debug('unparseable stdin (' + raw.length + ' bytes)');
    return;
  }

  const sessionId = payload.session_id;
  if (!sessionId) {
    debug('no session_id in payload');
    return;
  }
  debug('payload keys: ' + Object.keys(payload).join(','));

  fs.mkdirSync(LOG_DIR, { recursive: true });

  const cfg = loadConfig();
  const now = new Date();
  const ts = now.toISOString();
  // Prompt path stays a single cheap read so it never adds latency to a turn.
  // Response path polls, because this is the write that backfills the session.
  const model =
    (MODE === 'response'
      ? modelFromTranscriptWithRetry(payload.transcript_path)
      : modelFromTranscript(payload.transcript_path)) || 'unknown';

  let file = findSessionFile(sessionId);

  if (MODE === 'prompt') {
    const text = payload.prompt;
    if (typeof text !== 'string' || !text.length) {
      debug('empty prompt');
      return;
    }
    if (!file) file = createSessionFile(sessionId, now, cfg, model);

    let doc = fs.readFileSync(file, 'utf8');
    const num = countEntries(doc, 'PROMPT') + 1;
    doc += entryBlock({ type: 'PROMPT', num, sessionId, timestamp: ts, model, text });
    doc = updateFrontmatter(doc, { total_exchanges: num, last_prompt_time: ts });
    if (model !== 'unknown') doc = updateFrontmatter(doc, { model });
    fs.writeFileSync(file, doc, 'utf8');
    debug('wrote PROMPT num=' + num + ' -> ' + path.basename(file));
    return;
  }

  // MODE === 'response'
  if (!file) {
    debug('Stop fired with no session file; nothing to pair');
    return;
  }

  let doc = fs.readFileSync(file, 'utf8');
  const prompts = countEntries(doc, 'PROMPT');
  const responses = countEntries(doc, 'RESPONSE');
  if (prompts <= responses) {
    debug('Stop with no unanswered prompt (P=' + prompts + ' R=' + responses + ')');
    return;
  }

  const fromPayload =
    typeof payload.last_assistant_message === 'string' && payload.last_assistant_message.trim()
      ? payload.last_assistant_message
      : null;
  const text =
    fromPayload ||
    finalResponseFromTranscript(payload.transcript_path) ||
    '(no final text response captured for this turn)';

  const num = responses + 1;
  // one-time backfill: the first prompt of a session is logged before any
  // assistant message exists, so its model was necessarily 'unknown'
  if (model !== 'unknown') {
    doc = doc.replace(/^model: unknown$/gm, 'model: ' + model);
  }
  doc += entryBlock({ type: 'RESPONSE', num, sessionId, timestamp: ts, model, text });
  fs.writeFileSync(file, doc, 'utf8');
  debug('wrote RESPONSE num=' + num + ' (' + text.length + ' chars) -> ' + path.basename(file));
}

try {
  main();
} catch (err) {
  debug('fatal: ' + (err && err.stack ? err.stack : err));
}
process.exit(0);
