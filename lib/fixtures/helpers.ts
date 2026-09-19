import type { TranscriptTurn } from "../types";

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${++seq}`;

/**
 * Compact transcript authoring for a single-speaker run:
 *   turns("abdullah", [[4, "sentence one", "sentence two"], ...])
 *
 * Sentences inside a turn are spaced evenly across the gap to the next turn,
 * so per-sentence seeking lands somewhere sensible rather than all at once.
 */
export function turns(
  speakerId: string,
  rows: [number, ...string[]][],
): TranscriptTurn[] {
  return rows.map(([tSec, ...sentences], i) => {
    const next = rows[i + 1]?.[0] ?? tSec + sentences.length * 6;
    const step = (next - tSec) / Math.max(sentences.length, 1);
    return {
      id: nextId("turn"),
      speakerId,
      tSec,
      sentences: sentences.map((text, j) => ({
        id: nextId("s"),
        tSec: Math.round(tSec + step * j),
        text,
      })),
    };
  });
}

/**
 * Multi-speaker authoring:
 *   dialogue([[12, "maya", "sentence", "sentence"], [40, "tom", "..."]])
 */
export function dialogue(
  rows: [number, string, ...string[]][],
): TranscriptTurn[] {
  return rows.map(([tSec, speakerId, ...sentences], i) => {
    const next = rows[i + 1]?.[0] ?? tSec + sentences.length * 8;
    const step = (next - tSec) / Math.max(sentences.length, 1);
    return {
      id: nextId("turn"),
      speakerId,
      tSec,
      sentences: sentences.map((text, j) => ({
        id: nextId("s"),
        tSec: Math.round(tSec + step * j),
        text,
      })),
    };
  });
}
