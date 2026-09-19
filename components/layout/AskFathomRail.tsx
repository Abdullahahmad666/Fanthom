"use client";

import { useState } from "react";
import { ArrowUp, ChevronDown, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Any looming deadlines?",
  "Surprise me with an insight",
  "Things I promised I'd do by this week",
];

/**
 * Account-scoped Ask Fathom rail, shown on list pages only.
 *
 * Observed at ~557px on a 1606px viewport, which is wider than it needs to be;
 * spec calls for a fixed 400px and hiding it below 1280px (docs/UI-SPEC.md 3.2).
 */
export function AskFathomRail() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div className="hidden shrink-0 border-l-2 border-surface bg-canvas p-3 xl:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Ask Fathom"
          className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-surface hover:text-fg"
        >
          <PanelRightOpen className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden w-[var(--rail-w)] shrink-0 flex-col border-l-2 border-surface bg-canvas xl:flex">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <Sparkles className="h-4 w-4 text-fg" />
        <span className="section-label text-fg-muted">
          Ask <span className="font-bold text-fg">Fathom</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Collapse Ask Fathom"
          className="ml-auto rounded-md p-1 text-fg-muted transition-colors hover:bg-surface hover:text-fg"
        >
          <PanelRightClose className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-4 rounded-lg bg-amberbg px-4 py-3 text-[14px] leading-relaxed text-amber">
        <span aria-hidden="true">🎁 </span>
        <strong className="font-bold">Account-level Ask Fathom is here!</strong>{" "}
        We&apos;re gifting you unlimited use until Oct 1. Limits may apply after.{" "}
        <button type="button" className="underline underline-offset-2">
          Learn More
        </button>
      </div>

      {/* Conversation area. Empty on a fresh account, which is what the
          screenshots show -- suggestions sit at the bottom, above the composer. */}
      <div className="flex-1" />

      <div className="flex flex-wrap justify-end gap-2 px-4 pb-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="rounded-lg bg-field px-3.5 py-2 text-[14px] text-fg transition-colors hover:bg-bubble"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="m-4 mt-0 rounded-lg bg-surface p-3">
        <input
          placeholder="Ask anything..."
          aria-label="Ask Fathom anything"
          className="w-full bg-transparent text-[15px] text-fg placeholder:text-fg-muted focus:outline-none"
        />
        <div className="mt-6 flex items-center">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[15px] text-fg transition-colors hover:bg-field"
          >
            My Calls
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Send"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-brand hover:text-brand"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
