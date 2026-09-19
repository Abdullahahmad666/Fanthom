"use client";

import { useState } from "react";
import Link from "next/link";

const PILLARS = [
  {
    id: "clarity",
    title: "Clarity",
    eyebrow: "Unforgettable meetings…quite literally",
    body: "Shockingly accurate transcripts, instant summaries, and action items with consistent quality across every call – delivered straight to your inbox, like magic.",
    cta: "Get started. It's free.",
  },
  {
    id: "momentum",
    title: "Momentum",
    eyebrow: "Nothing stalls between meetings",
    body: "Commitments come out of the call with an owner and a timestamp, so the next step is obvious before anyone has closed the tab.",
    cta: "See it in action",
  },
  {
    id: "ease",
    title: "Ease",
    eyebrow: "No setup tax",
    body: "Connect a calendar and you are done. Fathom joins what you ask it to, stays out of what you don't, and never asks you to configure it again.",
    cta: "Connect your calendar",
  },
];

/**
 * The Clarity / Momentum / Ease accordion. One pillar expanded at a time, with
 * the collapsed ones rendered as large muted headings.
 */
export function PillarAccordion() {
  const [open, setOpen] = useState("clarity");

  return (
    <div className="space-y-7">
      {PILLARS.map((p) => {
        const isOpen = p.id === open;
        return (
          <div key={p.id}>
            <button
              type="button"
              onClick={() => setOpen(p.id)}
              aria-expanded={isOpen}
              className={`block text-left text-[clamp(34px,4.5vw,52px)] leading-none transition-colors ${
                isOpen ? "text-fg" : "text-fg-dim hover:text-fg-muted"
              }`}
            >
              {p.title}
            </button>

            {isOpen && (
              <div className="mt-4 max-w-[520px]">
                <p className="text-[16px] text-[#73bfff]">✦ {p.eyebrow}</p>
                <p className="mt-4 text-[17px] leading-relaxed text-fg/90">{p.body}</p>
                <Link
                  href="/signup"
                  className="mt-7 inline-flex rounded-full bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] px-6 py-3 text-[14px] font-semibold tracking-wide text-black uppercase transition-opacity hover:opacity-90"
                >
                  {p.cta}
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
