"use client";

import Link, { useLinkStatus } from "next/link";
import { Check, Link2, MoreVertical, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { VideoPoster } from "@/components/ui/VideoPoster";
import { BrandSpinner } from "@/components/ui/BrandLoader";
import { MenuItem, Popover } from "@/components/ui/Popover";
import { formatDuration, type Meeting } from "@/lib/types";

/**
 * Feedback the instant a card is clicked, before the detail route resolves.
 * Must live inside the <Link> -- useLinkStatus reports on its nearest ancestor.
 */
function PendingOverlay() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
      <BrandSpinner size={40} />
    </span>
  );
}

/**
 * A call in the list. Measured at ~500px wide with a 16:9 poster and a 70px
 * footer (docs/UI-SPEC.md 3).
 *
 * Recordings here have no still frames, so VideoPoster stands in: a
 * participant tile grid for group calls, and the product's audio-only radial
 * treatment for a solo one.
 *
 * The whole card is clickable via a stretched overlay link rather than by
 * wrapping everything in an anchor, because the overflow menu is a real button
 * and nesting a button inside an anchor is invalid HTML.
 */
export function CallCard({
  meeting,
  onDelete,
}: {
  meeting: Meeting;
  onDelete?: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/calls/${meeting.id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-raised transition-colors hover:bg-[#2f2f34] focus-within:outline-2 focus-within:outline-brand">
      <VideoPoster
        participants={meeting.participants}
        poster={meeting.poster}
        className="aspect-video w-full"
      >
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
            <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
          </span>
        </span>

        <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-[12px] text-fg">
          {meeting.participants.length}{" "}
          {meeting.participants.length === 1 ? "person" : "people"}
        </span>

        <span className="absolute right-3 bottom-3 rounded bg-black/70 px-2 py-1 text-[12px] font-medium text-fg">
          {formatDuration(meeting.durationSec)}
        </span>
      </VideoPoster>

      <div className="flex h-[54px] items-center gap-3 px-3.5">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-fg">
            {meeting.title}
          </span>
          <span className="block truncate text-[12px] text-fg-muted">
            {meeting.startTime} · {meeting.platform}
          </span>
        </span>

        {/* Sits above the stretched link so its own clicks win. */}
        <div className="relative z-20">
          <Popover
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                aria-label={`Options for ${meeting.title}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bubble text-fg transition-colors hover:bg-[#5a5b5b]"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </button>
            )}
          >
            {(close) => (
              <>
                <MenuItem
                  icon={<Link2 className="h-4 w-4" />}
                  label={copied ? "Link copied" : "Copy Share Link"}
                  description="Anyone with the link can view"
                  onClick={() => {
                    copyLink();
                    close();
                  }}
                />
                <MenuItem
                  icon={<Trash2 className="h-4 w-4" />}
                  label="Delete Recording"
                  danger
                  onClick={() => {
                    onDelete?.(meeting.id);
                    close();
                  }}
                />
              </>
            )}
          </Popover>
        </div>
      </div>

      <Link
        href={`/calls/${meeting.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Open ${meeting.title}`}
      >
        <span className="sr-only">Open {meeting.title}</span>
        <PendingOverlay />
      </Link>
    </div>
  );
}
