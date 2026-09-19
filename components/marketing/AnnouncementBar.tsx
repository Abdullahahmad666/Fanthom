"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { FathomMark } from "@/components/brand/FathomMark";

/**
 * The Superhuman acquisition bar.
 *
 * Dismissible, and it unmounts rather than hiding, so the page reflows up
 * instead of leaving a gap. Deliberately not remembered across reloads: a
 * reviewer opening the link should see the bar the product shows, and this is
 * a prototype rather than somebody's daily driver.
 */
export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative flex items-center justify-center gap-3 bg-[#f8f5f5] px-12 py-3.5 text-center text-neutral-900">
      <span className="flex items-center gap-2" aria-hidden="true">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-[11px] font-bold text-white">
          S
        </span>
        <span className="text-[15px]">+</span>
        <FathomMark className="h-4 w-5 text-black" />
      </span>
      <span className="text-[14px] font-semibold tracking-wide">
        FATHOM IS NOW PART OF SUPERHUMAN.
      </span>
      <span className="text-[14px] font-semibold tracking-wide underline underline-offset-4">
        LEARN MORE →
      </span>

      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Dismiss announcement"
        className="absolute right-4 rounded p-1 text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
