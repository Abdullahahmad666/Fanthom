"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import { Cue } from "@/components/ui/Cue";
import { formatClock } from "@/lib/types";
import { DEMO_ACTIONS, DEMO_SUMMARY, turnAt } from "./demo";

/**
 * The product's central gesture, running on the landing page.
 *
 * Not a screenshot and not a video: the cues below are the same component the
 * meeting page uses, over a real transcript excerpt. Pick any line, press its
 * timestamp, and the sentence it was taken from appears underneath. If the
 * summary had invented something, this control is where you would catch it --
 * which is the entire argument the page is making, made checkable rather than
 * asserted.
 *
 * It opens on the first decision rather than empty, because a demo whose
 * payload is hidden behind a click mostly gets scrolled past.
 */
export function ReceiptCard() {
  const [open, setOpen] = useState<number>(184);
  const turn = turnAt(open);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-40px_rgb(0_0_0/0.6)]">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <span className="text-[13px] font-medium text-text">Launch readiness</span>
        <span className="text-[12px] text-faint">· 41 min · 3 people</span>
        <span className="ml-auto section-label">Summary</span>
      </div>

      <div className="px-5 py-5">
        {["Decisions", "Risks"].map((heading) => {
          const lines = DEMO_SUMMARY.filter((l) => l.heading === heading);
          if (!lines.length) return null;
          return (
            <div key={heading} className="mb-5 last:mb-0">
              <p className="section-label">{heading}</p>
              <ul className="mt-2 space-y-3">
                {lines.map((line) => (
                  <li key={line.text} className="text-[14px] leading-relaxed text-muted">
                    <span className="text-text">{line.text}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {line.cues.map((c) => (
                        <Cue key={c} tSec={c} onPlay={setOpen} active={open === c} />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div className="mb-1">
          <p className="section-label">Action items</p>
          <ul className="mt-2 space-y-3">
            {DEMO_ACTIONS.map((line) => (
              <li key={line.text} className="text-[14px] leading-relaxed">
                <span className="font-medium text-text">{line.heading}: </span>
                <span className="text-muted">{line.text}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {line.cues.map((c) => (
                    <Cue key={c} tSec={c} onPlay={setOpen} active={open === c} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The receipt. Keyed on the timestamp so switching cues replays the
          arrival, which is what makes it read as fetching a new quote rather
          than editing the old one in place. */}
      {turn && (
        <div
          key={turn.tSec}
          className="border-t border-line bg-mark-soft px-5 py-4"
          style={{ animation: "cue-reveal var(--cue-slow) var(--cue-ease) both" }}
        >
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-mark uppercase">
            <Quote className="h-3 w-3" />
            What was actually said at {formatClock(turn.tSec)}
          </p>
          <p className="measure mt-2 text-[14px] leading-relaxed text-text">
            <span className="font-medium">{turn.speaker}:</span> “{turn.text}”
          </p>
        </div>
      )}
    </div>
  );
}
