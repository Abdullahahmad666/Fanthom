"use client";

import { useState } from "react";
import {
  Check, Download, Link2, ListPlus, Lock, MoreVertical, Play, Trash2,
} from "lucide-react";
import { useMeeting } from "./MeetingProvider";
import { ShareModal } from "./ShareModal";
import { AddToPlaylistDialog } from "./AddToPlaylistDialog";
import { canRenderVideo, downloadMeetingVideo } from "@/lib/downloadVideo";
import type { PlaylistItem } from "@/lib/playlists";
import { pushToast, updateToast } from "@/lib/toast";
import { EmptyBox } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { MenuItem, Popover } from "@/components/ui/Popover";
import { formatClock, HIGHLIGHT_META, participantById } from "@/lib/types";

export function RightRail() {
  const {
    meeting, actionItems, toggleActionItem, highlights, removeHighlight, seek, setTab,
  } = useMeeting();
  const [sharing, setSharing] = useState(false);
  const [copiedClip, setCopiedClip] = useState<string | null>(null);
  const [rendering, setRendering] = useState<string | null>(null);
  const [playlistItem, setPlaylistItem] =
    useState<Omit<PlaylistItem, "id" | "addedAt"> | null>(null);

  /**
   * Renders and downloads a real file, reporting progress in a toast --
   * encoding takes a few seconds, so silence would read as a dead click.
   * See lib/downloadVideo for what the file actually contains.
   */
  const download = async (
    key: string,
    range?: { startSec: number; endSec: number; caption: string },
  ) => {
    const what = range ? "clip" : "recording";

    if (!canRenderVideo()) {
      pushToast({
        status: "error",
        title: "Cannot render video here",
        description: "This browser does not support canvas recording. Try Chrome or Edge.",
      });
      return;
    }

    const toastId = pushToast({
      status: "loading",
      title: `Preparing ${what}…`,
      description: range ? range.caption : meeting.title,
      progress: 0,
    });

    setRendering(key);
    try {
      await downloadMeetingVideo({
        meeting,
        ...range,
        onProgress: (p) => updateToast(toastId, { progress: p }),
      });
      updateToast(toastId, {
        status: "success",
        title: `${what === "clip" ? "Clip" : "Recording"} downloaded`,
        description: "Check your downloads folder.",
      });
    } catch {
      updateToast(toastId, {
        status: "error",
        title: "Download failed",
        description: "The video could not be rendered.",
      });
    } finally {
      setRendering(null);
    }
  };

  /** Clip link for a single annotation -- the "share a moment" path. */
  const copyClip = (id: string, tSec: number) => {
    const url = `${window.location.origin}/calls/${meeting.id}?t=${Math.round(tSec)}&clip=${id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedClip(id);
    setTimeout(() => setCopiedClip(null), 1800);
  };

  const jump = (tSec: number) => {
    seek(tSec);
    setTab("transcript");
  };

  return (
    <aside className="pt-6">
      <h1 className="text-[22px] leading-tight font-semibold text-fg">{meeting.title}</h1>
      <p className="mt-1 text-[13px] text-fg-muted">
        {new Date(`${meeting.date}T00:00:00Z`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}
      </p>

      <div className="mt-5 flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => setSharing(true)}
          className="flex flex-1 items-center justify-between rounded-lg bg-accentsoft px-4 py-3 text-[13px] font-semibold text-brand transition-colors hover:bg-[#27404d]"
        >
          Share
          <Link2 className="h-4 w-4" />
        </button>
        <Popover
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="More options"
              className="flex h-full items-center rounded-lg bg-surface px-3 text-fg-muted transition-colors hover:text-fg"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          )}
        >
          {(close) => (
            <>
              <MenuItem
                icon={<Download className="h-4 w-4" />}
                label={rendering === "full" ? "Rendering video…" : "Download Video"}
                onClick={() => {
                  close();
                  void download("full");
                }}
              />
              <MenuItem
                icon={<Trash2 className="h-4 w-4" />}
                label="Delete Call"
                danger
                onClick={close}
              />
            </>
          )}
        </Popover>
      </div>

      {/* Attendees. Present in the older product UI and absent from the current
          captures; included because the brief asks for participants. */}
      <section className="mt-8">
        <p className="section-label mb-3">Attendees</p>
        <ul className="space-y-3">
          {meeting.participants.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <Avatar participant={p} size={32} />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold text-fg">
                  {p.name}
                </span>
                <span className="block truncate text-[12px] text-fg-muted">
                  {p.role}, {p.company}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <p className="section-label mb-3">
          Action Items
          {actionItems.length > 0 && (
            <span className="ml-2 text-fg-muted">{actionItems.length}</span>
          )}
        </p>

        {actionItems.length === 0 ? (
          <EmptyBox>None detected. Add manually on transcript tab</EmptyBox>
        ) : (
          <ul className="space-y-3.5">
            {actionItems.map((item) => {
              const owner = participantById(meeting, item.ownerId);
              return (
                <li key={item.id} className="flex gap-3">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.done}
                    onClick={() => toggleActionItem(item.id)}
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      item.done ? "border-brand bg-brand" : "border-fg-dim hover:border-fg"
                    }`}
                  >
                    {item.done && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-black" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[13px] leading-snug font-semibold ${
                        item.done ? "text-fg-dim line-through" : "text-fg"
                      }`}
                    >
                      {item.text}
                    </span>
                    <span className="mt-0.5 block text-[12px]">
                      <button
                        type="button"
                        onClick={() => jump(item.tSec)}
                        className="font-medium text-brand hover:underline"
                      >
                        @{formatClock(item.tSec)}
                      </button>
                      <span className="text-fg-muted"> · {owner?.name ?? "Unassigned"}</span>
                      {item.manual && (
                        <span className="ml-2 rounded bg-surface px-1.5 py-0.5 text-[11px] text-fg-muted">
                          added by you
                        </span>
                      )}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <p className="section-label mb-3 flex items-center gap-2">
          Annotations
          <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold text-amber">
            <Lock className="h-3 w-3" /> INTERNAL TEAM ONLY
          </span>
        </p>

        {highlights.length === 0 ? (
          <EmptyBox>
            No annotations yet. Hover a transcript line and use + to add one.
          </EmptyBox>
        ) : (
          <ul className="space-y-3.5">
            {highlights.map((h) => {
              const meta = HIGHLIGHT_META[h.kind];
              return (
                <li
                  key={h.id}
                  className="group/annot relative -mx-3 rounded-lg px-3 py-2 transition-colors hover:bg-raised"
                >
                  <button
                    type="button"
                    onClick={() => jump(h.tSec)}
                    className="flex w-full gap-2 pr-16 text-left"
                  >
                    <span className={`mt-0.5 shrink-0 ${meta.className}`}>
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                    <span className="min-w-0">
                      <span className={`text-[13px] font-semibold ${meta.className}`}>
                        {meta.label}
                      </span>
                      <span className="text-[13px] text-fg-muted">
                        {" "}
                        - {formatClock(h.tSec)}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-fg-muted group-hover/annot:text-fg">
                        {h.note}
                      </span>
                    </span>
                  </button>

                  {/* Row actions, revealed on hover. */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover/annot:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      aria-label="Copy clip link"
                      onClick={() => copyClip(h.id, h.tSec)}
                      className="rounded p-1 text-fg-muted transition-colors hover:text-fg"
                    >
                      {copiedClip === h.id ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Link2 className="h-4 w-4" />
                      )}
                    </button>
                    <Popover
                      className="min-w-[260px]"
                      trigger={({ toggle }) => (
                        <button
                          type="button"
                          onClick={toggle}
                          aria-label="Annotation options"
                          className="rounded bg-surface p-1 text-fg-muted transition-colors hover:text-fg"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      )}
                    >
                      {(close) => (
                        <>
                          <MenuItem
                            icon={<Trash2 className="h-4 w-4" />}
                            label="Delete Annotation"
                            onClick={() => {
                              removeHighlight(h.id);
                              close();
                            }}
                          />
                          <MenuItem
                            icon={<Download className="h-4 w-4" />}
                            label={
                              rendering === h.id ? "Rendering clip…" : "Download Video Clip"
                            }
                            onClick={() => {
                              close();
                              void download(h.id, {
                                startSec: h.tSec,
                                endSec: h.endSec ?? h.tSec + 30,
                                caption: `${meta.label} · ${h.note}`,
                              });
                            }}
                          />
                          <MenuItem
                            icon={<ListPlus className="h-4 w-4" />}
                            label="Add to Playlist"
                            onClick={() => {
                              close();
                              setPlaylistItem({
                                meetingId: meeting.id,
                                meetingTitle: meeting.title,
                                highlightId: h.id,
                                kind: h.kind,
                                note: h.note,
                                tSec: h.tSec,
                                endSec: h.endSec,
                              });
                            }}
                          />
                        </>
                      )}
                    </Popover>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {sharing && <ShareModal onClose={() => setSharing(false)} />}
      {playlistItem && (
        <AddToPlaylistDialog item={playlistItem} onClose={() => setPlaylistItem(null)} />
      )}
    </aside>
  );
}
