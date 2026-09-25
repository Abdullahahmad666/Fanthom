"use client";

import { useEffect, useRef } from "react";
import {
  Expand, Info, Maximize, MicOff, Pause, PictureInPicture2, Play, Volume2,
} from "lucide-react";
import { PLAYBACK_RATES, useMeeting, type PlayerSize } from "./MeetingProvider";
import { PlayerMenu } from "./PlayerMenu";
import { VideoPoster } from "@/components/ui/VideoPoster";
import { formatClock, formatDuration, HIGHLIGHT_META } from "@/lib/types";

const SIZE_OPTIONS = [
  { value: "regular" as const, label: "Regular", hint: "Default", icon: <PictureInPicture2 className="h-3.5 w-3.5" /> },
  { value: "expanded" as const, label: "Expanded", hint: "Wide", icon: <Expand className="h-3.5 w-3.5" /> },
  { value: "fullscreen" as const, label: "Full screen", hint: "F", icon: <Maximize className="h-3.5 w-3.5" /> },
];

/**
 * Recording player.
 *
 * There is no media file -- capture is stubbed -- so VideoPoster stands in for
 * the frame and playback runs off the virtual clock in MeetingProvider. Everything a real player would drive (scrubbing, seeking,
 * speed, transcript follow) behaves identically.
 */
export function Player() {
  const {
    meeting, currentTime, playing, rate, seek, togglePlay, setRate, highlights,
    playerSize, setPlayerSize,
  } = useMeeting();
  const trackRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  /**
   * "Full screen" is the real Fullscreen API, not a CSS trick, so it covers
   * the OS chrome as a viewer expects. Leaving fullscreen by Escape or the
   * browser's own control has to fall back to a normal size, hence the
   * listener rather than trusting our own state.
   */
  const applySize = (next: PlayerSize) => {
    const el = shellRef.current;
    if (next === "fullscreen") {
      el?.requestFullscreen?.().catch(() => setPlayerSize("expanded"));
      setPlayerSize("fullscreen");
      return;
    }
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    setPlayerSize(next);
  };

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && playerSize === "fullscreen") {
        setPlayerSize("regular");
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [playerSize, setPlayerSize]);

  /* F toggles full screen, which is what the menu's hint advertises. Skipped
     while typing so transcript search keeps the key. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
        return;
      }
      if (e.key !== "f" && e.key !== "F") return;
      e.preventDefault();
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
        setPlayerSize("regular");
      } else {
        shellRef.current?.requestFullscreen?.().catch(() => {});
        setPlayerSize("fullscreen");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setPlayerSize]);

  const pct = (currentTime / meeting.durationSec) * 100;
  const owner = meeting.participants[0];

  const scrub = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    seek(((clientX - left) / width) * meeting.durationSec);
  };

  return (
    <div
      ref={shellRef}
      className={`overflow-hidden rounded-xl bg-content ${
        playerSize === "fullscreen" ? "flex h-full flex-col justify-center" : ""
      }`}
    >
      {/* Header strip: start time, meeting code. Small, but very characteristic. */}
      <div className="flex items-center gap-2 px-4 py-2.5 text-[12px] text-fg-muted">
        <span>{meeting.startTime}</span>
        <span className="text-fg-dim">|</span>
        <span>{meeting.meetingCode}</span>
        <Info className="h-3.5 w-3.5 text-fg-dim" />
        <span className="ml-auto text-fg-dim">{meeting.platform}</span>
      </div>

      <VideoPoster
        participants={meeting.participants}
        poster={meeting.poster}
        className="aspect-video w-full"
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        >
          {!playing && (
            <span className="flex flex-col items-center gap-1 rounded-2xl bg-black/35 px-6 py-4 backdrop-blur-[2px]">
              <Play className="h-12 w-12 fill-white/85 text-white/85" />
              <span className="text-[13px] text-white/85">
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
            {owner?.name}&apos;s Cue Notetaker
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

          <PlayerMenu
            label="Screen size"
            value={playerSize}
            onChange={applySize}
            options={SIZE_OPTIONS}
            trigger={
              playerSize === "fullscreen" ? (
                <Maximize className="h-5 w-5" />
              ) : playerSize === "expanded" ? (
                <Expand className="h-5 w-5" />
              ) : (
                <PictureInPicture2 className="h-5 w-5" />
              )
            }
          />
        </div>
      </VideoPoster>
    </div>
  );
}
