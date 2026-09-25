"use client";

import { useState } from "react";
import { Check, ClipboardCopy, FileText } from "lucide-react";
import { MeetingProvider, useMeeting, type DetailTab } from "./MeetingProvider";
import { Player } from "./Player";
import { SummaryPanel } from "./SummaryPanel";
import { TranscriptPanel } from "./TranscriptPanel";
import { AskCuePanel } from "./AskCuePanel";
import { RightRail } from "./RightRail";
import type { Meeting } from "@/lib/types";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "transcript", label: "Transcript" },
  { id: "ask", label: "Ask Cue" },
];

/** Copy button at the right of the tab row; its label follows the active tab. */
function TabAction() {
  /* `sections` rather than meeting.summaries[template], so Copy Recap picks
     up a generated template too. */
  const { meeting, tab, sections } = useMeeting();
  const [copied, setCopied] = useState(false);

  if (tab === "ask") return null;

  const copy = () => {
    const text =
      tab === "summary"
        ? (sections ?? [])
            .map(
              (s) =>
                `${s.heading}\n${s.blocks
                  .map((b) =>
                    b.kind === "para"
                      ? b.text
                      : b.items.map((i) => `• ${i.label ? `${i.label}: ` : ""}${i.text}`).join("\n"),
                  )
                  .join("\n")}`,
            )
            .join("\n\n")
        : meeting.transcript
            .map((t) => `[${t.tSec}s] ${t.speakerId}: ${t.sentences.map((s) => s.text).join(" ")}`)
            .join("\n");

    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="press ml-auto flex shrink-0 items-center gap-2 rounded-lg bg-accentsoft px-4 py-2 text-[13px] font-semibold text-brand transition-colors hover:bg-[#27404d]"
    >
      {copied ? "Copied" : tab === "summary" ? "Copy Summary" : "Copy Transcript"}
      {copied ? (
        <Check className="h-4 w-4" />
      ) : tab === "summary" ? (
        <FileText className="h-4 w-4" />
      ) : (
        <ClipboardCopy className="h-4 w-4" />
      )}
    </button>
  );
}

function Body() {
  const { tab, setTab, actionItems, highlights, playerSize } = useMeeting();

  const counts: Partial<Record<DetailTab, number>> = {
    transcript: highlights.length,
  };

  /* Expanded gives the recording the full container and drops the rail
     beneath it, rather than just scaling the video inside its column. */
  const expanded = playerSize !== "regular";

  return (
    <div
      className={`grid grid-cols-1 gap-7 pt-6 ${
        expanded ? "" : "xl:grid-cols-[662px_minmax(0,1fr)]"
      }`}
    >
      <div className="min-w-0">
        <Player />

        <div className="mt-2 overflow-hidden rounded-xl bg-content">
          <div className="flex items-center gap-7 border-b border-line px-6 pt-4">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`tab-label relative pb-3 transition-colors ${
                  tab === id ? "text-brand" : "text-fg-muted hover:text-fg"
                }`}
              >
                {label}
                {!!counts[id] && (
                  <span className="ml-2 rounded bg-surface px-1.5 py-0.5 text-[11px] tracking-normal text-fg-muted">
                    {counts[id]}
                  </span>
                )}
                {tab === id && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-t bg-brand" />
                )}
              </button>
            ))}
            <div className="ml-auto pb-2">
              <TabAction />
            </div>
          </div>

          {tab === "summary" && <SummaryPanel />}
          {tab === "transcript" && <TranscriptPanel />}
          {tab === "ask" && <AskCuePanel />}
        </div>

        <p className="px-1 pt-3 text-[12px] text-fg-dim">
          Recording capture is stubbed in this prototype — playback runs on a
          simulated clock, and {actionItems.length} action item
          {actionItems.length === 1 ? "" : "s"} and {highlights.length} annotation
          {highlights.length === 1 ? "" : "s"} are live state you can change.
        </p>
      </div>

      <RightRail />
    </div>
  );
}

export function MeetingDetail({
  meeting,
  initialTime,
}: {
  meeting: Meeting;
  initialTime?: number;
}) {
  return (
    <MeetingProvider meeting={meeting} initialTime={initialTime}>
      <Body />
    </MeetingProvider>
  );
}
