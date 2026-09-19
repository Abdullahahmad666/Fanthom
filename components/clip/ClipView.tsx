"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Info, Maximize2, MicOff, Pause, Play, Volume2 } from "lucide-react";
import { PlayerMenu } from "@/components/detail/PlayerMenu";
import { PLAYBACK_RATES } from "@/components/detail/MeetingProvider";
import { VideoPoster } from "@/components/ui/VideoPoster";
import {
  formatClipLength,
  formatClock,
  HIGHLIGHT_META,
  type Highlight,
  type Meeting,
} from "@/lib/types";

/** Matches the fallback the clip download uses, so a link and a file agree. */
const DEFAULT_CLIP_SEC = 30;

/**
 * A shared clip, on its own.
 *
 * Opening a clip link has to give the recipient the clip and nothing else --
 * not the whole call seeked to a timestamp. So this is a separate view rather
 * than the detail page with a banner: no tabs, no transcript, no rail, and a
 * player whose clock runs 0 to the clip's length.
 *
 * It keeps its own clock instead of reusing MeetingProvider, which is built
 * around the full recording -- bounds would have had to be threaded through
 * every consumer of it to serve one page.
 */
export function ClipView({ meeting, clip }: { meeting: Meeting; clip: Highlight }) {
  const length = Math.max(1, (clip.endSec ?? clip.tSec + DEFAULT_CLIP_SEC) - clip.tSec);

  /* Elapsed within the clip, not within the call. */
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();

    const tick = (now: number) => {
      const delta = ((now - last.current) / 1000) * rate;
      last.current = now;
      setElapsed((t) => {
        const next = t + delta;
        // Stopping at the clip's end is the whole point of this view.
        if (next >= length) {
          setPlaying(false);
          return length;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, rate, length]);

  const seek = (t: number) => setElapsed(Math.max(0, Math.min(t, length)));

  const toggle = () => {
    // Replay rather than sit on the last frame once the clip has run out.
    if (!playing && elapsed >= length) setElapsed(0);
    setPlaying((p) => !p);
  };

  const scrub = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    seek(((clientX - left) / width) * length);
  };

  const meta = HIGHLIGHT_META[clip.kind];
  const owner = meeting.participants[0];
  const pct = (elapsed / length) * 100;

  return (
    <div className="mx-auto w-full max-w-[940px] py-12">
      <div ref={shellRef} className="overflow-hidden rounded-xl bg-content">
        <div className="flex items-start gap-2 px-4 pt-3 pb-2">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[12px] text-fg-muted">
              <span>{meeting.startTime}</span>
              <span className="text-fg-dim">|</span>
              <span className="truncate">{meeting.meetingCode}</span>
              <Info className="h-3.5 w-3.5 shrink-0 text-fg-dim" />
            </p>
            <p className="text-[13px] font-medium text-fg">
              {new Date(`${meeting.date}T00:00:00Z`).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
          </div>

          {/* The only way out of a clip, so it is the one emphasised control. */}
          <Link
            href={`/calls/${meeting.id}?t=${Math.round(clip.tSec)}`}
            className="ml-auto flex shrink-0 items-center gap-2 rounded-md border border-brand px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-brand uppercase transition-colors hover:bg-brand hover:text-black"
          >
            View Call
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <VideoPoster
          participants={meeting.participants}
          poster={meeting.poster}
          className="aspect-video w-full"
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          >
            {!playing && (
              <>
                <Play className="h-16 w-16 fill-white/30 text-white/30" strokeWidth={0} />
                <span className="text-[14px] text-white/40">{formatClipLength(length)}</span>
              </>
            )}
          </button>

          <div className="absolute right-3 bottom-14 hidden w-[150px] rounded-md bg-black/80 px-2 py-1.5 sm:block">
            <div className="flex items-start justify-between">
              <span className="text-[9px] leading-tight text-fg-muted">
                Recording and taking notes
              </span>
              <MicOff className="h-3 w-3 shrink-0 text-fg-muted" />
            </div>
            <span className="mt-2 block truncate text-[9px] text-fg-muted">
              {owner?.name}&apos;s Fathom Notetaker
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-4 pb-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="text-white"
            >
              {playing ? <Pause className="h-5 w-5 fill-white" /> : <Volume2 className="h-5 w-5" />}
            </button>

            <span className="w-12 shrink-0 text-[13px] font-medium text-white tabular-nums">
              {formatClock(elapsed)}
            </span>

            <div
              ref={trackRef}
              role="slider"
              tabIndex={0}
              aria-label="Seek within clip"
              aria-valuemin={0}
              aria-valuemax={Math.round(length)}
              aria-valuenow={Math.round(elapsed)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") seek(elapsed + 2);
                if (e.key === "ArrowLeft") seek(elapsed - 2);
              }}
              onClick={(e) => scrub(e.clientX)}
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                scrub(e.clientX);
              }}
              onPointerMove={(e) => e.buttons === 1 && scrub(e.clientX)}
              className="relative h-6 flex-1 cursor-pointer"
            >
              {/* The track is the clip, so there are no highlight ranges on it
                  -- the whole bar is the one highlight. */}
              <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/35" />
              <div
                style={{ left: `${pct}%` }}
                className="absolute top-1/2 h-4 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
              />
            </div>

            <PlayerMenu
              label="Playback speed"
              value={rate}
              onChange={setRate}
              options={PLAYBACK_RATES.map((r) => ({ value: r, label: `${r}×` }))}
              trigger={
                <span className="text-[13px] font-semibold">
                  {rate}
                  <span className="text-[12px] font-normal">×</span>
                </span>
              }
            />

            <button
              type="button"
              aria-label="Full screen"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen?.().catch(() => {});
                } else {
                  shellRef.current?.requestFullscreen?.().catch(() => {});
                }
              }}
              className="text-white"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </VideoPoster>

        <p className="px-4 py-5 text-[18px]">
          <span className={`font-bold tracking-[0.02em] uppercase ${meta.className}`}>
            {meta.label}
          </span>
          <span className="text-fg-muted"> – </span>
          <span className="text-fg">{clip.note}</span>
        </p>
      </div>
    </div>
  );
}
