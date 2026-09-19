"use client";

import { useRef } from "react";
import { Info, MicOff, Pause, PictureInPicture2, Play, Volume2 } from "lucide-react";
import { useMeeting } from "./MeetingProvider";
import { Avatar } from "@/components/ui/Avatar";
import { formatClock, formatDuration, HIGHLIGHT_META } from "@/lib/types";

/**
 * Recording player.
 *
 * There is no media file -- capture is stubbed -- so this renders the product's
 * audio-only poster treatment and runs off the virtual clock in
 * MeetingProvider. Everything a real player would drive (scrubbing, seeking,
 * speed, transcript follow) behaves identically.
 */
export function Player() {
  const {
    meeting, currentTime, playing, rate, seek, togglePlay, cycleRate, highlights,
  } = useMeeting();
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = (currentTime / meeting.durationSec) * 100;
  const owner = meeting.participants[0];

  const scrub = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    seek(((clientX - left) / width) * meeting.durationSec);
  };

  return (
    <div className="overflow-hidden rounded-xl bg-content">
      {/* Header strip: start time, meeting code. Small, but very characteristic. */}
      <div className="flex items-center gap-2 px-4 py-2.5 text-[12px] text-fg-muted">
        <span>{meeting.startTime}</span>
        <span className="text-fg-dim">|</span>
        <span>{meeting.meetingCode}</span>
        <Info className="h-3.5 w-3.5 text-fg-dim" />
        <span className="ml-auto text-fg-dim">{meeting.platform}</span>
      </div>

      <div
        className="relative aspect-video w-full"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${meeting.poster[0]}, ${meeting.poster[1]})`,
        }}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
        >
          <span className="flex items-center gap-2">
            {meeting.participants.slice(0, 5).map((p) => (
              <Avatar key={p.id} participant={p} size={64} ring />
            ))}
          </span>
          {!playing && (
            <span className="flex flex-col items-center gap-1">
              <Play className="h-14 w-14 fill-white/80 text-white/80" />
              <span className="text-[13px] text-white/80">
                {formatDuration(meeting.durationSec)}
              </span>
            </span>
          )}
        </button>

        {/* Notetaker PiP tile. */}
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

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-4 pb-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="flex flex-col items-center text-white"
          >
            {playing ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
            <span className="mt-0.5 text-[10px] leading-none text-white/80">
              {owner?.name.split(" ")[0]}
            </span>
          </button>

          <span className="w-12 shrink-0 text-[13px] font-medium text-white tabular-nums">
            {formatClock(currentTime)}
          </span>

          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={meeting.durationSec}
            aria-valuenow={Math.round(currentTime)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seek(currentTime + 5);
              if (e.key === "ArrowLeft") seek(currentTime - 5);
            }}
            onClick={(e) => scrub(e.clientX)}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              scrub(e.clientX);
            }}
            onPointerMove={(e) => e.buttons === 1 && scrub(e.clientX)}
            className="relative h-6 flex-1 cursor-pointer"
          >
            <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/35" />

            {/* Highlight ranges sit on the track, which is how a highlight
                "lands" somewhere you can see after you create it. */}
            {highlights.map((h) => {
              const start = (h.tSec / meeting.durationSec) * 100;
              const width = (((h.endSec ?? h.tSec + 20) - h.tSec) / meeting.durationSec) * 100;
              return (
                <div
                  key={h.id}
                  title={`${HIGHLIGHT_META[h.kind].label}: ${h.note}`}
                  style={{ left: `${start}%`, width: `${Math.max(width, 0.8)}%` }}
                  className={`absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full ${
                    h.kind === "highlight"
                      ? "bg-brand"
                      : h.kind === "feedback"
                        ? "bg-purple-400"
                        : h.kind === "action"
                          ? "bg-success"
                          : "bg-blue-400"
                  }`}
                />
              );
            })}

            <div
              style={{ left: `${pct}%` }}
              className="absolute top-1/2 h-4 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
            />
          </div>

          <button
            type="button"
            onClick={cycleRate}
            className="shrink-0 text-[13px] font-semibold text-white"
            aria-label={`Playback speed ${rate}x`}
          >
            {rate}
            <span className="text-[12px] font-normal">×</span>
          </button>

          <PictureInPicture2 className="h-5 w-5 shrink-0 text-white" />
        </div>
      </div>
    </div>
  );
}
