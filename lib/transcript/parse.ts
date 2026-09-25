/**
 * Transcript parsing.
 *
 * Cue does not record your calls. Every conferencing tool already produces a
 * transcript, and the interesting work starts after that file exists -- so
 * the front door is an import, not a bot that joins your meeting. That is a
 * product decision as much as a technical one: it means Cue works on the
 * meetings you have already had.
 *
 * Three formats cover what Zoom, Google Meet and Teams actually hand you:
 * WebVTT, SubRip, and the plain "Name: what they said" text people paste out
 * of a chat log. One parser, because the differences are surface: a cue is a
 * time, a speaker and some words.
 *
 * Pure and dependency-free so the same function runs in the browser for the
 * preview and on the server for the authoritative write -- one implementation,
 * so the preview cannot disagree with what is stored.
 */

export type ParsedCue = {
  tSec: number;
  endSec: number | null;
  speaker: string | null;
  text: string;
};

export type ParsedTurn = {
  speaker: string;
  tSec: number;
  sentences: { tSec: number; text: string }[];
};

export type ParsedTranscript = {
  format: "vtt" | "srt" | "text";
  turns: ParsedTurn[];
  speakers: string[];
  durationSec: number;
  /** Cues we could read but that carried no speaker attribution. */
  unattributed: number;
};

export class TranscriptParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranscriptParseError";
  }
}

/* ------------------------------------------------------------- timestamps */

/** `00:01:02.345`, `01:02.345`, `00:01:02,345` -- all of them, in seconds. */
function toSeconds(stamp: string): number | null {
  const m = stamp.trim().match(/^(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?$/);
  if (!m) return null;
  const [, h, mm, ss, ms] = m;
  return (
    (h ? Number(h) * 3600 : 0) +
    Number(mm) * 60 +
    Number(ss) +
    (ms ? Number(ms.padEnd(3, "0")) / 1000 : 0)
  );
}

const TIME_RANGE = /^(.+?)\s*-->\s*(.+?)(?:\s+.*)?$/;

/* --------------------------------------------------------------- speakers */

/**
 * Pulls the speaker off a line, if it carries one.
 *
 * Four shapes in the wild: the VTT voice span, a leading "Name:", a bracketed
 * "[Name]", and Teams' "Name   0:12" header line. Anything else keeps its
 * text intact rather than guessing -- a mis-split sentence is worse than an
 * unattributed one.
 */
function splitSpeaker(line: string): { speaker: string | null; text: string } {
  const voice = line.match(/^<v\s+([^>]+)>\s*(.*?)(?:<\/v>)?$/i);
  if (voice) return { speaker: voice[1].trim(), text: voice[2].trim() };

  const bracket = line.match(/^\[([^\]]{1,48})\]\s*[:-]?\s*(.+)$/);
  if (bracket && !/^\d/.test(bracket[1])) {
    return { speaker: bracket[1].trim(), text: bracket[2].trim() };
  }

  /* A colon only marks a speaker when what precedes it looks like a name:
     short, no sentence punctuation. "So: here is the thing" is not a
     speaker, and treating it as one silently invents a person. */
  const colon = line.match(/^([^:]{1,48}):\s+(.+)$/);
  if (colon) {
    const candidate = colon[1].trim();
    const looksLikeName =
      candidate.length > 1 &&
      !/[.!?,;]/.test(candidate) &&
      candidate.split(/\s+/).length <= 4;
    if (looksLikeName) return { speaker: candidate, text: colon[2].trim() };
  }

  return { speaker: null, text: line.trim() };
}

/* ------------------------------------------------------------- cue blocks */

function parseCueBlocks(raw: string): ParsedCue[] {
  const blocks = raw
    .replace(/^﻿/, "")
    .replace(/\r\n?/g, "\n")
    .replace(/^WEBVTT.*$/im, "")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const cues: ParsedCue[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");

    /* SRT numbers its cues; VTT sometimes labels them. Either way the line
       before the timing is not content. */
    const timingIndex = lines.findIndex((l) => TIME_RANGE.test(l) && l.includes("-->"));
    if (timingIndex === -1) continue;

    const range = lines[timingIndex].match(TIME_RANGE);
    if (!range) continue;

    const tSec = toSeconds(range[1]);
    if (tSec === null) continue;
    const endSec = toSeconds(range[2]);

    const body = lines.slice(timingIndex + 1).join(" ").trim();
    if (!body) continue;

    const { speaker, text } = splitSpeaker(body);
    if (text) cues.push({ tSec, endSec, speaker, text });
  }

  return cues;
}

/**
 * Plain text, with or without timestamps.
 *
 * Without them the transcript still has order, so cues are spaced by reading
 * time rather than dropped. An approximate clock is worth more than none:
 * every downstream feature in Cue is anchored to a timestamp.
 */
const WORDS_PER_SECOND = 2.6;

function parsePlainText(raw: string): ParsedCue[] {
  const lines = raw
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const cues: ParsedCue[] = [];
  let clock = 0;

  for (const line of lines) {
    /* A leading timestamp, as Teams and most copy-paste logs produce. */
    const stamped = line.match(/^\(?\[?((?:\d+:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?)\]?\)?\s*[-–]?\s*(.+)$/);
    let tSec: number | null = null;
    let rest = line;

    if (stamped) {
      const t = toSeconds(stamped[1]);
      if (t !== null) {
        tSec = t;
        rest = stamped[2];
      }
    }

    const { speaker, text } = splitSpeaker(rest);
    if (!text) continue;

    if (tSec === null) tSec = clock;
    clock = Math.max(clock, tSec) + text.split(/\s+/).length / WORDS_PER_SECOND;

    /* Whole seconds: the column is an integer, and a synthetic clock implying
       millisecond precision would be claiming accuracy it does not have. */
    cues.push({ tSec: Math.round(tSec), endSec: null, speaker, text });
  }

  return cues;
}

/* ------------------------------------------------------------------ turns */

/** Sentence split that keeps the terminator and survives "e.g." and "Dr.". */
function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"'‘“])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Consecutive cues from one speaker become a single turn.
 *
 * A caption file breaks on line length, not on thought -- a two-minute answer
 * arrives as forty cues. Left that way, every transcript reads as stichomythia
 * and the summary has nothing to quote. Grouping restores the shape of the
 * conversation.
 */
function toTurns(cues: ParsedCue[]): ParsedTurn[] {
  const turns: ParsedTurn[] = [];
  let unknownRun = 0;

  for (const cue of cues) {
    const speaker = cue.speaker ?? turns.at(-1)?.speaker ?? `Speaker ${++unknownRun}`;
    const last = turns.at(-1);

    /* A gap long enough to be a new thought starts a new turn even from the
       same speaker, so a monologue does not become one unreadable block. */
    const newThought = last && cue.tSec - (last.sentences.at(-1)?.tSec ?? last.tSec) > 45;

    if (last && last.speaker === speaker && !newThought) {
      for (const s of sentencesOf(cue.text)) last.sentences.push({ tSec: cue.tSec, text: s });
    } else {
      turns.push({
        speaker,
        tSec: cue.tSec,
        sentences: sentencesOf(cue.text).map((text) => ({ tSec: cue.tSec, text })),
      });
    }
  }

  return turns.filter((t) => t.sentences.length > 0);
}

/* ----------------------------------------------------------------- public */

export function detectFormat(raw: string, filename = ""): ParsedTranscript["format"] {
  if (/^﻿?WEBVTT/i.test(raw.trimStart()) || filename.toLowerCase().endsWith(".vtt")) {
    return "vtt";
  }
  if (filename.toLowerCase().endsWith(".srt")) return "srt";
  /* An SRT without its extension still announces itself: a bare index line
     followed by a comma-millisecond time range. */
  if (/^\s*\d+\s*\n\s*[\d:,]+\s*-->/m.test(raw)) return "srt";
  if (/-->/.test(raw)) return "vtt";
  return "text";
}

export function parseTranscript(raw: string, filename = ""): ParsedTranscript {
  if (!raw.trim()) throw new TranscriptParseError("The file is empty.");

  const format = detectFormat(raw, filename);
  const cues = format === "text" ? parsePlainText(raw) : parseCueBlocks(raw);

  if (cues.length === 0) {
    throw new TranscriptParseError(
      "No transcript lines were found. Cue reads WebVTT (.vtt), SubRip (.srt) " +
        "and plain text with one line per speaker turn.",
    );
  }

  const turns = toTurns(cues);
  const speakers = [...new Set(turns.map((t) => t.speaker))];
  const last = cues.at(-1);
  const durationSec = Math.round(last?.endSec ?? last?.tSec ?? 0);

  return {
    format,
    turns,
    speakers,
    durationSec,
    unattributed: cues.filter((c) => !c.speaker).length,
  };
}
