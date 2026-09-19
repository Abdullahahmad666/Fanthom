"use client";

import { useState } from "react";
import Link from "next/link";
import { ListChecks, Rocket, ScanSearch, Zap } from "lucide-react";

const PANELS = {
  teams: {
    heading: "Shared visibility. Smarter execution.",
    body: [
      "Fathom gives teams a shared source of truth across every customer conversation, internal sync, and strategy call – so decisions are visible, follow-through is consistent, and nothing gets lost between meetings.",
      "Search conversations, spot patterns, and keep work moving without the manual work.",
    ],
    features: [
      { Icon: Zap, text: "Automatic notes, summaries, and updates reduce follow-ups and admin across the team." },
      { Icon: Rocket, text: "Turn conversations into clear next steps that move deals and projects forward." },
      { Icon: ScanSearch, text: "Keep decisions, commitments, and customer signals visible across meetings and teams." },
      { Icon: ListChecks, text: "Spot patterns, risks, and opportunities across conversations before they become problems." },
    ],
  },
  individuals: {
    heading: "Stay present. Remember everything.",
    body: [
      "Stop splitting your attention between the conversation and your notes. Fathom writes them for you, and has them ready before you have left the call.",
      "Every commitment you make comes back with a timestamp, so nothing quietly falls off your list.",
    ],
    features: [
      { Icon: Zap, text: "Summaries land the moment the call ends, in the format you prefer." },
      { Icon: ListChecks, text: "Your action items are pulled out and attributed automatically." },
      { Icon: ScanSearch, text: "Search everything you have ever said, and jump to the moment you said it." },
      { Icon: Rocket, text: "Share a clip instead of retelling the meeting to whoever missed it." },
    ],
  },
};

export function TeamTabs() {
  const [tab, setTab] = useState<keyof typeof PANELS>("teams");
  const panel = PANELS[tab];

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-[#0a0a0c]/85 ring-1 ring-white/10 backdrop-blur">
      <div className="flex gap-2 border-b border-white/10 px-6 pt-6 sm:px-10">
        {(["teams", "individuals"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-current={tab === id}
            className={`relative px-4 pb-4 text-[20px] transition-colors sm:px-8 sm:text-[24px] ${
              tab === id ? "text-[#f2f0a0]" : "text-fg hover:text-fg-muted"
            }`}
          >
            Fathom for {id}
            {tab === id && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#f2f0a0]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h3 className="text-[22px] font-semibold text-fg">{panel.heading}</h3>
          {panel.body.map((p) => (
            <p key={p} className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-fg/85">
              {p}
            </p>
          ))}
          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] px-6 py-3 text-[14px] font-semibold tracking-wide text-black uppercase transition-opacity hover:opacity-90"
          >
            See our pricing
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {panel.features.map(({ Icon, text }) => (
            <div key={text}>
              <Icon className="h-7 w-7 text-[#73bfff]" strokeWidth={1.5} />
              <p className="mt-3 text-[15px] leading-snug text-fg/85">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
