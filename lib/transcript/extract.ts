import type { ParsedTurn } from "./parse";
import type { SummarySection } from "../types";

/**
 * Turning a transcript into notes.
 *
 * Cue has no language model, and rather than treat that as a hole to be
 * filled later it is the product's position: **Cue does not write your
 * summary, it finds it.** Every line below is a sentence somebody actually
 * said, carried over verbatim with the second it was said at. Nothing is
 * paraphrased, so nothing can be subtly wrong -- the failure mode of a
 * generated summary is that it reads plausibly whether or not it is true,
 * and an extractive one simply cannot do that.
 *
 * It is also why every bullet carries `cues`. A quote with a timestamp is
 * checkable in one click; a paraphrase is something you have to take on
 * trust. That difference is the whole reason this product is called Cue.
 */

type Line = { tSec: number; text: string; speaker: string };

function lines(turns: ParsedTurn[]): Line[] {
  return turns.flatMap((t) =>
    t.sentences.map((s) => ({ tSec: s.tSec, text: s.text, speaker: t.speaker })),
  );
}

/* Cue phrases. Deliberately narrow: a false positive puts a sentence under a
   heading it does not belong to, which is worse than omitting it. */
const DECISION = /\b(we'?ll|we will|let'?s|we're going to|we are going to|decided|agreed|the plan is|going with|we should just|final answer)\b/i;
/* `i can` must not match `I can't`: the negation inverts the meaning, and an
   action item that says the opposite of what was said is the worst output
   this file can produce. */
const COMMITMENT = /\b(i'?ll|i will|i can(?!'?t)|i'?m going to|i am going to|can you|could you|please|owns?|take(s)? that|by (mon|tues|wednes|thurs|fri|satur|sun)day|by (eod|tomorrow|next week|the end of)|before (mon|tues|wednes|thurs|fri)day)\b/i;

/** A commitment word sitting inside a negation, a condition or a question. */
const NOT_A_COMMITMENT = /\b(can'?t|cannot|won'?t|will not|unless|if i|if we|should we|do we)\b/i;

/* "let's get into it" is chairing, not deciding. Without this, the first line
   of every meeting gets filed as a decision. */
const PROCEDURAL = /\b(get into it|get started|getting started|let'?s start|let'?s begin|we'?re all here|we are all here|move on|moving on|next up|wrap (this )?up|take it from the top|any other business|over to you|go ahead)\b/i;
const RISK = /\b(risk|blocker|blocked|concern|worried|problem|issue|fails?|failing|broken|breaks?|can'?t|cannot|behind schedule|slip)\b/i;
const METRIC = /\b\d+([.,]\d+)?\s*(%|percent|k\b|million|users|customers|seconds|minutes|hours|days|weeks)\b/i;

const FILLER = /^(yeah|yes|no|ok|okay|right|sure|mm-?hmm|uh|um|exactly|agreed|got it|thanks|thank you|hello|hi|bye)[.!,]?$/i;

/** Weight a sentence by how much it is likely to matter later. */
function score(line: Line): number {
  const words = line.text.split(/\s+/).length;
  if (words < 5 || FILLER.test(line.text.trim())) return 0;

  let s = 0;
  /* A sweet spot: one-liners carry no context, and a 60-word run is usually
     thinking out loud rather than a conclusion. */
  if (words >= 8 && words <= 42) s += 2;
  if (DECISION.test(line.text)) s += 4;
  if (RISK.test(line.text)) s += 3;
  if (METRIC.test(line.text)) s += 3;
  if (COMMITMENT.test(line.text)) s += 2;
  if (/\?$/.test(line.text.trim())) s -= 1; // questions have their own section
  return s;
}

/**
 * Pick the best lines, but never several from the same minute.
 *
 * Without the spread, a heated two minutes wins every slot and the notes
 * describe one argument instead of the meeting. Time diversity is what makes
 * an extractive summary read like a summary.
 */
function pickSpread(candidates: Line[], want: number, minGapSec: number): Line[] {
  const ranked = [...candidates].sort((a, b) => score(b) - score(a));
  const chosen: Line[] = [];

  for (const line of ranked) {
    if (chosen.length >= want) break;
    if (chosen.some((c) => Math.abs(c.tSec - line.tSec) < minGapSec)) continue;
    chosen.push(line);
  }

  return chosen.sort((a, b) => a.tSec - b.tSec);
}

const bullet = (l: Line) => ({ label: l.speaker, text: l.text, cues: [l.tSec] });

export type Extraction = {
  sections: SummarySection[];
  actionItems: { text: string; ownerName: string; tSec: number }[];
  /** Surfaced in the import preview so the result is never a black box. */
  stats: { lines: number; considered: number; kept: number };
};

export function extractNotes(turns: ParsedTurn[], durationSec: number): Extraction {
  const all = lines(turns);
  const substantive = all.filter((l) => score(l) > 0);

  /* Scale with the meeting: a five-minute call does not need eight bullets
     and an hour does not fit in three. */
  const minutes = Math.max(1, durationSec / 60);
  const want = Math.min(8, Math.max(3, Math.round(minutes / 6)));
  const gap = Math.max(20, durationSec / (want * 2.5));

  const decisions = substantive.filter(
    (l) => DECISION.test(l.text) && !PROCEDURAL.test(l.text),
  );
  const risks = substantive.filter((l) => RISK.test(l.text) && !DECISION.test(l.text));
  const questions = all.filter(
    (l) => /\?$/.test(l.text.trim()) && l.text.split(/\s+/).length >= 5,
  );

  /* Key moments exclude anything already shown under its own heading, so the
     reader is not told the same thing twice in one page. */
  const claimed = new Set([...decisions, ...risks].map((l) => l.text));
  const key = pickSpread(
    substantive.filter((l) => !claimed.has(l.text)),
    want,
    gap,
  );

  const sections: SummarySection[] = [];

  if (key.length) {
    sections.push({ heading: "Key moments", blocks: [{ kind: "bullets", items: key.map(bullet) }] });
  }
  if (decisions.length) {
    sections.push({
      heading: "Decisions",
      blocks: [{ kind: "bullets", items: pickSpread(decisions, 5, 15).map(bullet) }],
    });
  }
  if (risks.length) {
    sections.push({
      heading: "Risks raised",
      blocks: [{ kind: "bullets", items: pickSpread(risks, 5, 15).map(bullet) }],
    });
  }
  if (questions.length) {
    sections.push({
      heading: "Questions asked",
      blocks: [
        { kind: "bullets", items: questions.slice(0, 6).map(bullet) },
      ],
    });
  }

  /* An honest floor. A short or chatty transcript can score nothing at all,
     and an empty summary that says nothing is worse than one that says the
     meeting was brief. */
  if (sections.length === 0) {
    const opening = all.slice(0, 3);
    sections.push({
      heading: "What was said",
      blocks: [
        {
          kind: "para",
          text:
            "Nothing in this transcript matched the patterns Cue looks for — " +
            "decisions, risks, commitments or figures. The opening lines are below, " +
            "and the full transcript is on the Transcript tab.",
        },
        { kind: "bullets", items: opening.map(bullet) },
      ],
    });
  }

  return {
    sections,
    actionItems: extractActionItems(all),
    stats: { lines: all.length, considered: substantive.length, kept: countBullets(sections) },
  };
}

function countBullets(sections: SummarySection[]) {
  return sections.reduce(
    (n, s) =>
      n + s.blocks.reduce((m, b) => m + (b.kind === "bullets" ? b.items.length : 0), 0),
    0,
  );
}

/**
 * Commitments, with the person who made them.
 *
 * "I'll do X" is owned by whoever said it; "can you do X" is owned by nobody
 * we can name, so it is left unassigned rather than guessed at. Assigning
 * work to the wrong person is the one error here that has consequences
 * outside the app.
 */
function extractActionItems(all: Line[]) {
  const items: { text: string; ownerName: string; tSec: number }[] = [];
  const seen = new Set<string>();

  for (const l of all) {
    if (!COMMITMENT.test(l.text)) continue;
    if (NOT_A_COMMITMENT.test(l.text)) continue;
    const words = l.text.split(/\s+/).length;
    if (words < 4 || words > 40) continue;

    const key = l.text.toLowerCase().replace(/\W+/g, " ").trim();
    if (seen.has(key)) continue;
    seen.add(key);

    const firstPerson = /\b(i'?ll|i will|i can|i'?m going to|i am going to)\b/i.test(l.text);
    items.push({
      text: l.text,
      ownerName: firstPerson ? l.speaker : "",
      tSec: l.tSec,
    });

    if (items.length >= 12) break;
  }

  return items;
}
