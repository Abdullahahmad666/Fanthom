# CAPTURE-TEST.md

Proof that automatic prompt/response capture is installed and firing on its own.

## 1. Tool and model

| | |
|---|---|
| **Tool** | Claude Code (v2.1.276), running as the VS Code native extension on Windows 11 |
| **Model (plan + execute)** | `claude-opus-5` — the transcript records the id as `claude-opus-5`; the session banner reports it as Opus 5 with a 1M context window (`claude-opus-5[1m]`) |
| **Split of duties** | None. A single model both plans and executes. There is no separate planner/executor model. If that changes mid-build, the `model:` field on every entry will show it, because it is read per-turn from the live session transcript rather than hardcoded. |
| **Automatic hook mechanism?** | **Yes.** Claude Code has a first-class hooks system in `settings.json`. Confirmed against the docs at `code.claude.com/docs/en/hooks` and against the settings JSON schema shipped inside the extension (`claude-code-settings.schema.json`), not from memory. |

## 2. Mechanism, and the config I changed

Two lifecycle events drive the capture:

- **`UserPromptSubmit`** → fires the moment a prompt is submitted. Payload carries `prompt` verbatim.
- **`Stop`** → fires at end of turn. Payload carries `last_assistant_message`, which is exactly the final response with no thinking, tool calls, or intermediate steps in it.

Because `Stop` hands over the final message directly, the log gets the prompt and the final response and nothing else — no filtering of tool calls is needed, since they never arrive in the first place.

**Files added** (both committed):

| File | Role |
|---|---|
| `.claude/settings.json` | Hook registration. This is the only config file changed. |
| `.claude/hooks/capture.mjs` | The capture script. Node, no dependencies. |
| `.claude/hooks/capture.config.json` | Author / project / tool names for the frontmatter. |

Hook registration, verbatim from `.claude/settings.json`:

```json
"UserPromptSubmit": [
  { "hooks": [ { "type": "command", "command": "node",
      "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/capture.mjs", "prompt"],
      "timeout": 15 } ] }
],
"Stop": [
  { "hooks": [ { "type": "command", "command": "node",
      "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/capture.mjs", "response"],
      "timeout": 30 } ] }
]
```

Exec form (`args`) rather than shell form is deliberate: on Windows the project path is `D:\Work\Projects\Naano`, and exec form substitutes `${CLAUDE_PROJECT_DIR}` per-element as a plain string, so backslashes never reach a shell parser.

Three properties the script holds to, each of which would otherwise cause a real problem:

- **Never writes to stdout.** On `UserPromptSubmit` and `Stop`, hook stdout is injected into the model's context. A chatty hook would pollute every single turn of the build.
- **Never exits non-zero.** Exit code 2 on `UserPromptSubmit` erases the prompt; on `Stop` it prevents the turn from ending. `main()` is wrapped in try/catch and the process always exits 0, so a bug in the logger can never break the session it is logging.
- **Never rewrites an entry once written.** The only exception is a one-time `model: unknown` backfill, explained in §5.

## 3. Where the canaries landed

Log directory: **`.agent-logs/`** in the repo root. Not gitignored — verified with `git check-ignore`, which reports it as not ignored. There is no `.gitignore` at the repo root at all.

| Canary | File |
|---|---|
| **#1** | [`.agent-logs/2026-09-19_10-19-01_0258a7d1-c233-4f5a-8b65-9e6905702ba6.md`](.agent-logs/2026-09-19_10-19-01_0258a7d1-c233-4f5a-8b65-9e6905702ba6.md) |
| **#2** | [`.agent-logs/2026-09-19_10-19-55_c44f2661-c00d-4a7e-aced-d511cba74a14.md`](.agent-logs/2026-09-19_10-19-55_c44f2661-c00d-4a7e-aced-d511cba74a14.md) |

These are two **separate sessions** with different session ids, each launched as its own `claude` process. Canary #2 landing proves the hook is installed at the project level and is not an artifact of whichever session created it.

## 4. Both canary entries, raw

### Canary #1 — session `0258a7d1`

````
[LOG_ENTRY type=PROMPT num=1 session=0258a7d1]
timestamp: 2026-09-19T10:19:01.790Z
model: claude-opus-5

CAPTURE TEST — 8x assignment, Abdullah Ahmad


[LOG_ENTRY type=RESPONSE num=1 session=0258a7d1]
timestamp: 2026-09-19T10:19:38.258Z
model: claude-opus-5

Capture hook is wired and working. Here's what I verified.

**Prompt side — confirmed working.** This turn's prompt landed in `.agent-logs/2026-09-19_10-19-01_0258a7d1-….md` with full frontmatter (session, date, author `Abdullahahmad666`, project `naano-rebuild`) and a `[LOG_ENTRY type=PROMPT num=1]` block containing the exact prompt text. `.capture-debug.log:4` confirms the write.

**Response side — will be confirmed a moment from now.** The Stop hook fires after I finish this message; it appends `[LOG_ENTRY type=RESPONSE num=1]` and backfills `model: unknown` → `claude-opus-5[1m]`. Check the file after this turn to see both halves paired.

**The `model: unknown` in the log is expected, not a defect.** `modelFromTranscript` reads the session `.jsonl`, which Claude Code hasn't created yet when `UserPromptSubmit` fires on the first prompt of a session — hence the `ENOENT` lines at `.capture-debug.log:1,3`. `capture.mjs:272-274` handles exactly this with a one-time backfill on Stop. The hook catches the error and keeps going, so it never blocks a prompt.

**One thing to watch.** The earlier session `5be450a5` (10:18:38, same test prompt, 23s before this one) logged a PROMPT but no RESPONSE, and the debug log has no `[response]` line for it at all — the Stop hook never ran for that session. Most likely that session was cancelled or the process was killed before it ended, which is benign. But if you see the same orphan pattern after a turn you let finish normally, the Stop hook registration is the thing to look at, not `capture.mjs` — the script itself is defensive throughout (never writes stdout, always exits 0, wraps `main()` in try/catch).

No changes made — this was a read-only check.
````

### Canary #2 — session `c44f2661`

````
[LOG_ENTRY type=PROMPT num=1 session=c44f2661]
timestamp: 2026-09-19T10:19:55.372Z
model: unknown

CAPTURE TEST — 8x assignment, Abdullah Ahmad (second session). Reply with exactly one short sentence and do not use any tools.


[LOG_ENTRY type=RESPONSE num=1 session=c44f2661]
timestamp: 2026-09-19T10:19:57.880Z
model: unknown

Capture test acknowledged — second session for the 8x assignment, no tools used.
````

`model: unknown` on canary #2 is a real bug that canary #2 caught. It is left exactly as written — see §5. It is fixed now; the fix is verified in §5 and is visible in the later session files.

## 5. What I tried first that did not work

**a) `--max-turns 1` on the first canary swallowed the response.** First attempt at canary #1 was `claude -p "…" --max-turns 1`. The prompt was captured, then the run aborted with `Error: Reached max turns (1)` before the turn ended, so `Stop` never fired and no `RESPONSE` was written. That orphaned session is still in the log as `.agent-logs/2026-09-19_10-18-38_5be450a5-….md` — a `PROMPT` with no `RESPONSE`. I have left it there rather than deleting it, since it is an honest record of a failed attempt and it also demonstrates that the pairing logic does not invent a response it never saw.

**b) Heredoc mangled the script on the way to disk.** Writing `capture.mjs` through a `bash` heredoc failed with `unexpected EOF while looking for matching '` because the script's own backticks and quotes fought the shell. Wrote the file directly instead.

**c) Transcript-only model lookup was wrong for fast turns — caught by canary #2.** The hook payload contains no model field. I verified this empirically rather than assuming, by dumping the live payload keys:

```
session_id, transcript_path, cwd, scratchpad_dir, prompt_id, permission_mode,
effort, hook_event_name, stop_hook_active, last_assistant_message,
background_tasks, session_crons
```

So the model has to be read out of the session transcript. My first version read it once. That failed on canary #2, which was a ~2.5 second turn: Claude Code had not yet flushed the assistant message to the transcript when `Stop` fired, so both entries recorded `model: unknown`. Re-reading the same transcript afterwards showed `["claude-opus-5"]` sitting there, which confirmed it was a flush-timing race and not a parsing bug.

Fixed by polling the transcript on the response path (10 attempts, 300ms apart) instead of reading once. The prompt path deliberately still reads once, so capture adds no latency to the start of a turn. Verified by re-running the exact fast single-turn case that broke it:

```
2026-09-19T10:21:58.310Z [response] model resolved after 1 retry
2026-09-19T10:21:58.311Z [response] wrote RESPONSE num=1 -> 2026-09-19_10-21-55_caec5dd4-….md
```

That session records `model: claude-opus-5` on the frontmatter and on both entries.

**d) Two known gaps, stated rather than hidden.**

- *First prompt of a session can log `model: unknown`.* `UserPromptSubmit` fires before the transcript file exists, so there is genuinely nothing to read. The `Stop` hook backfills it at end of turn. This is the one and only case where the script rewrites something it already wrote.
- *This session's own first prompt is not in the log.* The hooks did not exist when the message that asked for them was submitted, so there was no `UserPromptSubmit` hook to fire. Every prompt from the next one onward is captured. Nothing was back-written to fake it.

## 6. Extra files in `.agent-logs/`

Beyond the two canaries the directory also holds the orphaned `--max-turns` attempt (§5a), and two throwaway `Say OK. No tools.` sessions used to probe the payload shape and then to verify the retry fix. All are left in place. None have been edited, tidied, or removed.

`.agent-logs/.capture-debug.log` is the hook's own diagnostic trail — every fire, every failure, with timestamps. It is not part of the transcript format; it is there as evidence the hook ran and to make the next failure diagnosable.

## 7. Repo was flattened after capture was verified

The Next.js app originally sat in a nested git repo at `naano-clone/`, which meant the code and the capture logs lived in two different repos and could never share a commit history. The inner `.git` was removed and its contents moved to the repo root, so this is now a single repo. `next build` passes after the move, and a further canary (`7b1eb9be`, 10:30:55) confirms capture still fires from the new root with the model resolved correctly.
