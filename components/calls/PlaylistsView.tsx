"use client";

import Link from "next/link";
import { ListPlus, Play, Trash2 } from "lucide-react";
import {
  deletePlaylist,
  playlistDuration,
  removeFromPlaylist,
  usePlaylists,
} from "@/lib/playlists";
import { posterFor } from "@/lib/poster";
import { Reveal } from "@/components/ui/Reveal";
import { formatClock, HIGHLIGHT_META, type HighlightKind } from "@/lib/types";

/**
 * Playlists, backed by the real store rather than a marketing placeholder.
 * Anything added from a meeting's annotation menu appears here and survives
 * a reload.
 */
export function PlaylistsView() {
  const playlists = usePlaylists();
  const populated = playlists.filter((p) => p.items.length > 0);

  if (populated.length === 0) {
    return (
      <div className="mx-auto max-w-[1180px] px-8 pt-16">
        <Reveal className="mx-auto max-w-[620px] text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface">
            <ListPlus className="h-6 w-6 text-brand" />
          </span>
          <h2 className="mt-5 text-[22px] font-semibold text-fg">
            Create shareable playlists of highlights
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-fg-muted">
            Playlists collect highlights from across your calls into one place. Open a
            meeting, annotate a moment, then use{" "}
            <span className="text-fg">Add to Playlist</span> on that annotation.
          </p>
          <Link
            href="/calls/q3-launch-readiness"
            className="press mt-7 inline-flex rounded-lg bg-accentsoft px-5 py-2.5 text-[14px] font-semibold text-brand transition-colors hover:bg-[#27404d]"
          >
            Open a meeting with annotations
          </Link>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] px-8 pt-8 pb-16">
      {populated.map((p) => {
        const mins = Math.max(1, Math.round(playlistDuration(p) / 60));
        return (
          <Reveal key={p.id} as="section" className="mb-12">
            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="text-[17px] font-semibold text-fg">{p.name}</h2>
              <span className="text-[13px] text-fg-muted">
                {p.items.length} {p.items.length === 1 ? "Highlight" : "Highlights"} ({mins} min)
                {" · "}
                Last updated{" "}
                {new Date(p.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <button
                type="button"
                onClick={() => deletePlaylist(p.id)}
                className="ml-auto text-[13px] text-fg-dim transition-colors hover:text-red-400"
              >
                Delete playlist
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {p.items.map((item, i) => {
                const meta = HIGHLIGHT_META[item.kind as HighlightKind] ?? HIGHLIGHT_META.highlight;
                return (
                  <Reveal
                    key={item.id}
                    /* Capped so a long playlist does not keep animating after
                       you have already started reading it. */
                    delay={Math.min(i, 8) * 45}
                    className="card-cue group relative overflow-hidden rounded-lg bg-raised"
                  >
                    <Link
                      href={`/calls/${item.meetingId}?t=${Math.round(item.tSec)}`}
                      className="block"
                    >
                      <span
                        className="relative flex aspect-video w-full items-center justify-center"
                        style={{
                          background: `linear-gradient(140deg, ${
                            posterFor(item.meetingId)[0]
                          }, ${posterFor(item.meetingId)[1]})`,
                        }}
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
                          <Play className="h-5 w-5 translate-x-0.5 fill-white text-white" />
                        </span>
                        <span className="absolute top-2 left-2 rounded bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold">
                          <span className={meta.className}>{meta.label}</span>
                        </span>
                        <span className="absolute right-2 bottom-2 rounded bg-black/65 px-1.5 py-0.5 text-[11px] text-fg">
                          @{formatClock(item.tSec)}
                        </span>
                      </span>

                      <span className="block px-3.5 py-3">
                        <span className="block truncate text-[13px] font-semibold text-fg">
                          {item.note}
                        </span>
                        <span className="block truncate text-[12px] text-fg-muted">
                          {item.meetingTitle}
                        </span>
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromPlaylist(p.id, item.id)}
                      aria-label="Remove from playlist"
                      className="absolute top-2 right-2 rounded-full bg-black/65 p-1.5 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400 focus-visible:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
