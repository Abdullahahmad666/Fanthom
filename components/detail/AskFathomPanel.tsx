"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useMeeting } from "./MeetingProvider";
import { FathomMark } from "@/components/brand/FathomMark";
import { formatClock } from "@/lib/types";

const SUGGESTIONS = [
  "Detail all timelines discussed",
  "Describe the key stakeholders?",
  "Who else should we speak to?",
  "Why was this meeting scheduled?",
];

type Msg = { role: "user" | "ai"; text: string; cites?: { label: string; tSec: number }[] };

/**
 * Meeting-scoped Ask Fathom.
 *
 * There is no model behind this. Rather than fake an answer, it retrieves real
 * transcript lines that match the question and cites them with timestamps that
 * seek the player -- so the citations are genuine even though the prose is not.
 */
export function AskFathomPanel() {
  const { meeting, seek, actionItems } = useMeeting();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");

  const answer = (question: string) => {
    const words = question
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4);

    const matches = meeting.transcript
      .flatMap((t) => t.sentences.map((s) => ({ ...s, speakerId: t.speakerId })))
      .filter((s) => words.some((w) => s.text.toLowerCase().includes(w)))
      .slice(0, 3);

    const cites = matches.map((m) => ({
      label: `${m.text.slice(0, 70)}${m.text.length > 70 ? "…" : ""}`,
      tSec: m.tSec,
    }));

    const text = matches.length
      ? `Based on ${meeting.transcript.length} turns in this call, here is what was said on that. ${
          actionItems.length
            ? `It also produced ${actionItems.length} action item${actionItems.length === 1 ? "" : "s"}.`
            : ""
        }`
      : "Nothing in this transcript matches that closely. Try a phrase someone would actually have said on the call.";

    setMessages((m) => [...m, { role: "user", text: question }, { role: "ai", text, cites }]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    answer(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex min-h-[420px] flex-col px-6 pt-8 pb-6">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-surface">
            <FathomMark className="h-7 w-8 text-brand" />
          </span>
          <p className="mt-5 text-[15px] font-semibold text-fg">
            Hi, what can I tell you about this meeting?
          </p>
          <div className="mt-10 grid w-full max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => answer(s)}
                className="rounded-lg bg-surface px-4 py-3.5 text-left text-[13px] text-fg ring-1 ring-line transition-colors hover:bg-raised"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-5">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <p key={i} className="text-right text-[13px] text-fg">
                <span className="inline-block rounded-lg bg-bubble px-3.5 py-2.5 text-left">
                  {m.text}
                </span>
              </p>
            ) : (
              <div key={i} className="flex gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface">
                  <FathomMark className="h-3 w-4 text-brand" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-relaxed text-fg/90">{m.text}</p>
                  {m.cites?.length ? (
                    <ul className="mt-3 space-y-1.5">
                      {m.cites.map((c, j) => (
                        <li key={j}>
                          <button
                            type="button"
                            onClick={() => seek(c.tSec)}
                            className="text-left text-[13px] leading-snug text-brand hover:underline"
                          >
                            {c.label}{" "}
                            <span className="font-medium">@{formatClock(c.tSec)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <form onSubmit={submit} className="relative mt-6">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask Fathom AI"
          aria-label="Ask Fathom AI"
          className="h-[52px] w-full rounded-lg bg-surface pr-16 pl-4 text-[13px] text-fg ring-1 ring-line placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
        <button
          type="submit"
          aria-label="Send"
          className="absolute top-1/2 right-2 flex h-9 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-accentsoft text-brand transition-colors hover:bg-[#27404d]"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
