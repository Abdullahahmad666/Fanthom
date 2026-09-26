/**
 * Where a transcript can come from.
 *
 * Plain data in a plain module, for two reasons. It is needed by both a
 * Server Component (the onboarding step, to phrase its lede) and two client
 * components, and a value exported from a `"use client"` file is not that
 * value on the server -- it arrives as a client reference proxy, so
 * `SOURCES.find(...)` throws "is not a function" at render time. It was also
 * written out twice, here and in the marketing section, which is how the two
 * copies would have drifted.
 *
 * The export paths are the point of the whole thing: "export your transcript"
 * is where people actually get stuck, so each entry carries the exact menu
 * path rather than a description of one.
 */

export type SourceId = "zoom" | "meet" | "teams" | "other";

export type Source = {
  id: SourceId;
  name: string;
  /** What the file extension will be. */
  file: string;
  /** The menu path that produces it. */
  path: string;
  /** Card accent. A CSS colour or a token reference. */
  tint: string;
};

export const SOURCES: Source[] = [
  {
    id: "zoom",
    name: "Zoom",
    file: ".vtt",
    path: "Recordings → the meeting → Audio transcript",
    tint: "#2D8CFF",
  },
  {
    id: "meet",
    name: "Google Meet",
    file: ".txt",
    path: "Drive → Meet Recordings → the transcript file",
    tint: "#00AC47",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    file: ".vtt",
    path: "Chat → Recordings → Download transcript",
    tint: "#5B5FC7",
  },
  {
    id: "other",
    name: "Something else",
    file: ".srt / .txt",
    path: "A plain “Name: what they said” log parses too",
    tint: "var(--cue-mark)",
  },
];

export function findSource(id: string | null | undefined): Source | null {
  return SOURCES.find((s) => s.id === id) ?? null;
}
