"use client";

import { Play } from "lucide-react";
import { formatClock } from "@/lib/types";

/**
 * A cue: a timestamp you can play.
 *
 * The product's smallest unit, and the thing that separates it from the
 * reference. Every generated line -- a summary bullet, an action item, an
 * answer -- carries the moment it came from, so nothing the model says is
 * unfalsifiable. "Trust me" becomes "here, listen".
 *
 * Deliberately not styled as a link. A link promises navigation; this
 * promises playback, and it uses the provenance colour that nothing else in
 * the palette is allowed to use, so a cue is recognisable anywhere it
 * appears without reading the label.
 */
export function Cue({
  tSec,
  endSec,
  label,
  onPlay,
  active = false,
  className = "",
}: {
  tSec: number;
  /** Present for a range; the chip then reads as a span rather than a point. */
  endSec?: number;
  /** Overrides the timecode, e.g. a speaker name plus time. */
  label?: string;
  onPlay?: (tSec: number) => void;
  /** True when the playhead is inside this cue. */
  active?: boolean;
  className?: string;
}) {
  const text = label ?? (endSec ? `${formatClock(tSec)}–${formatClock(endSec)}` : formatClock(tSec));
  const interactive = Boolean(onPlay);

  const body = (
    <>
      <Play className="h-2.5 w-2.5 fill-current" strokeWidth={0} aria-hidden />
      {text}
    </>
  );

  const tone = active
    ? "bg-mark text-[var(--cue-on-accent)]"
    : "cue-chip hover:brightness-125";

  if (!interactive) {
    return (
      <span className={`cue-chip ${active ? tone : ""} ${className}`} title={`At ${text}`}>
        {body}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onPlay?.(tSec)}
      aria-label={`Play from ${text}`}
      className={`cue-chip cue-chip-interactive ${
        active ? "brightness-125 ring-1 ring-mark" : "hover:brightness-125"
      } ${className}`}
    >
      {body}
    </button>
  );
}

/**
 * A row of cues under a generated claim.
 *
 * Capped, because a bullet drawn from nine moments should not push the text
 * off the screen to prove it; the overflow is counted instead.
 */
export function CueList({
  cues,
  onPlay,
  max = 3,
  currentTime,
}: {
  cues: { tSec: number; endSec?: number; label?: string }[];
  onPlay?: (tSec: number) => void;
  max?: number;
  currentTime?: number;
}) {
  if (cues.length === 0) return null;
  const shown = cues.slice(0, max);
  const extra = cues.length - shown.length;

  const isActive = (c: { tSec: number; endSec?: number }) =>
    currentTime !== undefined &&
    currentTime >= c.tSec &&
    currentTime <= (c.endSec ?? c.tSec + 20);

  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
      {shown.map((c) => (
        <Cue
          key={`${c.tSec}-${c.label ?? ""}`}
          tSec={c.tSec}
          endSec={c.endSec}
          label={c.label}
          onPlay={onPlay}
          active={isActive(c)}
        />
      ))}
      {extra > 0 && (
        <span className="text-[11px] text-faint" title={`${extra} more source moments`}>
          +{extra} more
        </span>
      )}
    </span>
  );
}
