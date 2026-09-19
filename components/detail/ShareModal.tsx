"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Globe, Link2, Search, X } from "lucide-react";
import { useMeeting } from "./MeetingProvider";
import { Avatar } from "@/components/ui/Avatar";
import { formatClock } from "@/lib/types";

/**
 * Share Recording. Two-tone -- lighter body, darker footer bar -- which is how
 * the product renders it (docs/UI-SPEC.md 4.8).
 *
 * The clip selector is the one addition: the brief asks about sharing a clip
 * with someone who was not on the call, so a share can be scoped to a single
 * annotated moment rather than the whole recording.
 */
export function ShareModal({ onClose }: { onClose: () => void }) {
  const { meeting, highlights } = useMeeting();
  const [copied, setCopied] = useState(false);
  const [clipId, setClipId] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const clip = highlights.find((h) => h.id === clipId);
  const url =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/calls/${meeting.id}${clip ? `?t=${clip.tSec}&clip=${clip.id}` : ""}`;

  const copy = () => {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share Recording"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[660px] overflow-hidden rounded-xl bg-raised"
      >
        <div className="flex items-center justify-between px-7 pt-6 pb-5">
          <h2 className="text-[26px] font-semibold text-fg">Share Recording</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-fg-muted transition-colors hover:text-fg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-7 pb-6">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-fg-muted" />
            <input
              placeholder="Add users and emails"
              aria-label="Add users and emails"
              className="h-[52px] w-full rounded-lg bg-[#2d2c31] pr-4 pl-11 text-[16px] text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>

          {highlights.length > 0 && (
            <div className="mt-6">
              <p className="section-label mb-2">Share a clip</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setClipId(null)}
                  className={`rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${
                    clipId === null
                      ? "bg-brand text-black"
                      : "bg-surface text-fg-muted hover:text-fg"
                  }`}
                >
                  Whole recording
                </button>
                {highlights.slice(0, 4).map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setClipId(h.id)}
                    title={h.note}
                    className={`max-w-[220px] truncate rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${
                      clipId === h.id
                        ? "bg-brand text-black"
                        : "bg-surface text-fg-muted hover:text-fg"
                    }`}
                  >
                    @{formatClock(h.tSec)} · {h.note}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="section-label mt-7 mb-3">People with access</p>
          <ul className="space-y-4">
            {meeting.participants.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Avatar participant={p} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-semibold text-fg">
                    {p.name}
                  </span>
                  <span className="block truncate text-[14px] text-fg-muted">
                    {p.email ?? `${p.role}, ${p.company}`}
                  </span>
                </span>
                <span className="shrink-0 text-[15px] text-fg-muted">
                  {p.isOwner ? "Owner" : "Can view"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-modalfoot px-7 py-4">
          <button
            type="button"
            className="flex items-center gap-2 text-[15px] text-fg transition-colors hover:text-brand"
          >
            <Globe className="h-4 w-4" />
            Anyone with the link can view
            <ChevronDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-2 rounded-md border border-brand px-4 py-2 text-[15px] font-semibold text-brand transition-colors hover:bg-brand/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Copied" : clip ? "Copy Clip Link" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
