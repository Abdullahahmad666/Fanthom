import type { Meeting } from "./types";

/**
 * Resolving a cue back to the moment it points at.
 *
 * A timestamp on its own is a claim about where something was said. Being
 * able to read the sentence without leaving the summary is what turns it into
 * evidence -- you check the quote in place, and only open the transcript when
 * you want the conversation around it.
 */

export type Excerpt = {
  speaker: string;
  text: string;
  tSec: number;
  /** The sentence before and after, for context on hover. */
  before?: string;
  after?: string;
};

type Flat = { tSec: number; text: string; speakerId: string };

function flatten(meeting: Meeting): Flat[] {
  return meeting.transcript
    .flatMap((turn) =>
      turn.sentences.map((s) => ({
        tSec: s.tSec,
        text: s.text,
        speakerId: turn.speakerId,
      })),
    )
    .sort((a, b) => a.tSec - b.tSec);
}

/**
 * The sentence a cue refers to.
 *
 * Nearest rather than exact: a cue stores the second a turn started, while
 * the sentence inside it may be recorded a beat later, and an exact match
 * would silently return nothing for a cue that is obviously valid.
 */
export function excerptAt(meeting: Meeting, tSec: number): Excerpt | null {
  const flat = flatten(meeting);
  if (flat.length === 0) return null;

  let bestIndex = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < flat.length; i++) {
    const d = Math.abs(flat[i].tSec - tSec);
    if (d < bestDistance) {
      bestDistance = d;
      bestIndex = i;
    }
  }

  /* Beyond half a minute it is not the same moment, and showing it anyway
     would be the sort of near-miss that makes provenance untrustworthy. */
  if (bestDistance > 30) return null;

  const hit = flat[bestIndex];
  const speaker =
    meeting.participants.find((p) => p.id === hit.speakerId)?.name ?? hit.speakerId;

  return {
    speaker,
    text: hit.text,
    tSec: hit.tSec,
    before: flat[bestIndex - 1]?.text,
    after: flat[bestIndex + 1]?.text,
  };
}

/** Every cue on a summary, deduplicated, for a "check all" affordance. */
export function cuesIn(sections: Meeting["summaries"][keyof Meeting["summaries"]]): number[] {
  const all = new Set<number>();
  for (const section of sections ?? []) {
    for (const block of section.blocks) {
      if (block.kind !== "bullets") continue;
      for (const item of block.items) for (const c of item.cues ?? []) all.add(c);
    }
  }
  return [...all].sort((a, b) => a - b);
}
