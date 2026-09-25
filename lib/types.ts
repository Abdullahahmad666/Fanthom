/**
 * Domain model for the prototype.
 *
 * The capture layer is deliberately stubbed: there is no recording bot, no
 * calendar integration and no ASR. Everything below is seed data shaped to
 * match what those systems would actually produce, so the UI above it is the
 * real thing rather than a mock.
 */

export type Participant = {
  id: string;
  name: string;
  /** Shown in the attendee rail under the name. */
  role: string;
  company: string;
  /** Deterministic avatar fill, since there are no real profile photos. */
  color: string;
  /** True for the account owner, who is labelled "Owner" when sharing. */
  isOwner?: boolean;
  email?: string;
};

/** One sentence inside a speaker turn. Fathom bubbles each sentence separately. */
export type TranscriptSentence = {
  id: string;
  tSec: number;
  text: string;
};

export type TranscriptTurn = {
  id: string;
  speakerId: string;
  tSec: number;
  sentences: TranscriptSentence[];
};

export type SummaryBlock =
  | { kind: "para"; text: string }
  | {
      kind: "bullets";
      items: {
        label?: string;
        text: string;
        /**
         * The moments this line came from.
         *
         * Cue's whole argument: a generated claim carries its sources, so it
         * can be checked by playing them rather than believed. Optional only
         * because the authored seed summaries predate it.
         */
        cues?: number[];
      }[];
    };

export type SummarySection = {
  heading: string;
  blocks: SummaryBlock[];
};

/**
 * Summary templates. The brief calls out switching between them, so a meeting
 * carries several rather than one -- swapping template genuinely re-renders
 * different content, it is not a cosmetic dropdown.
 */
export type TemplateId = "general" | "enhanced" | "sales" | "standup";

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  general: "General",
  enhanced: "Enhanced",
  sales: "Sales Call",
  standup: "Team Sync",
};

export type ActionItem = {
  id: string;
  text: string;
  ownerId: string;
  tSec: number;
  done: boolean;
  /** Present when the user created it from the transcript rather than the AI. */
  manual?: boolean;
};

/** Matches the annotation types in the transcript's ⊕ menu. */
export type HighlightKind =
  | "highlight"
  | "positive"
  | "review"
  | "feedback"
  | "bookmark"
  | "action";

export const HIGHLIGHT_META: Record<
  HighlightKind,
  { label: string; className: string; bar: string; bubble: string; live: string }
> = {
  highlight: { label: "Highlight", className: "text-brand", bar: "bg-brand", bubble: "bg-[#126080]", live: "bg-brand" },
  positive: { label: "Positive Reaction", className: "text-success", bar: "bg-success", bubble: "bg-[#14532d]", live: "bg-success" },
  review: { label: "Needs Review", className: "text-amber", bar: "bg-amber", bubble: "bg-[#4a3a0c]", live: "bg-amber" },
  feedback: { label: "Feedback", className: "text-orange-400", bar: "bg-orange-400", bubble: "bg-[#5a2c0c]", live: "bg-orange-400" },
  bookmark: { label: "Bookmark", className: "text-blue-400", bar: "bg-blue-400", bubble: "bg-[#1e3a8a]", live: "bg-blue-400" },
  action: { label: "Action Item", className: "text-fg", bar: "bg-fg-muted", bubble: "bg-bubble", live: "bg-fg-muted" },
};

export type Highlight = {
  id: string;
  kind: HighlightKind;
  tSec: number;
  /** Optional end, for clip sharing. */
  endSec?: number;
  note: string;
  createdBy: string;
};

export type Meeting = {
  id: string;
  title: string;
  /** ISO date, used for grouping into Today / Yesterday / older. */
  date: string;
  startTime: string;
  meetingCode: string;
  platform: "Google Meet" | "Zoom" | "Microsoft Teams";
  durationSec: number;
  /** Radial-gradient stops for the poster; recordings have no still frames here. */
  poster: [string, string];
  participants: Participant[];
  summaries: Partial<Record<TemplateId, SummarySection[]>>;
  transcript: TranscriptTurn[];
  actionItems: ActionItem[];
  highlights: Highlight[];
};

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return h > 0
    ? `${h}:${mm}:${String(sec).padStart(2, "0")}`
    : `${mm}:${String(sec).padStart(2, "0")}`;
}

/** Card badge copy: the product writes "3 mins" / "1 hr 2 mins". */
export function formatDuration(totalSeconds: number): string {
  const mins = Math.round(totalSeconds / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"}`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min${m === 1 ? "" : "s"}`;
}

export function participantById(meeting: Meeting, id: string) {
  return meeting.participants.find((p) => p.id === id);
}

/**
 * Clip lengths are short enough that rounding to whole minutes erases them --
 * formatDuration turns a 40-second clip into "1 min".
 */
export function formatClipLength(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  if (s < 60) return `${s} sec${s === 1 ? "" : "s"}`;
  return formatDuration(s);
}
