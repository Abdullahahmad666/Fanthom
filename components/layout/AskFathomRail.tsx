"use client";

import { useRef, useState } from "react";
import { ArrowUp, ChevronDown, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";
import { FathomMark } from "@/components/brand/FathomMark";
import { MEETINGS } from "@/lib/fixtures";
import { formatClock } from "@/lib/types";

const SUGGESTIONS = [
  "Any looming deadlines?",
  "Surprise me with an insight",
  "Things I promised I'd do by this week",
];

type Msg = {
  role: "user" | "ai";
  text: string;
  cites?: { label: string; meetingId: string; tSec: number }[];
};

/**
 * Account-scoped Ask Fathom rail, shown on list pages only.
 *
 * Owns its own scroll: the header, suggestions and composer stay put while the
 * conversation scrolls between them, so a long thread never moves the meeting
 * list behind it.
 *
 * As on the detail page, there is no model here. Answers are retrieved from
 * the seeded transcripts and cited with real timestamps.
 */
export function AskFathomRail() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = (question: string) => {
    const words = question
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4);

    const cites = MEETINGS.flatMap((m) =>
      m.transcript.flatMap((t) =>
        t.sentences
          .filter((s) => words.some((w) => s.text.toLowerCase().includes(w)))
          .map((s) => ({
            label: `${s.text.slice(0, 64)}${s.text.length > 64 ? "…" : ""}`,
            meetingId: m.id,
            tSec: s.tSec,
          })),
      ),
    ).slice(0, 4);

    const text = cites.length
      ? `Across your ${MEETINGS.length} recorded meetings, here is where that came up.`
      : "Nothing across your meetings matches that closely yet. Try wording it the way someone would have said it on a call.";

    setMessages((m) => [...m, { role: "user", text: question }, { role: "ai", text, cites }]);
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }),
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    ask(draft.trim());
    setDraft("");
  };

  if (!open) {
    return (
      <div className="hidden shrink-0 border-l border-line bg-canvas p-3 xl:block">
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
    <aside className="hidden w-[var(--rail-w)] shrink-0 flex-col border-l border-line bg-canvas xl:flex">
      <div className="flex shrink-0 items-center gap-2 px-5 pt-5 pb-3">
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

      {/* Conversation. The only part of the rail that scrolls. */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        {showBanner && (
          <div className="mb-4 rounded-lg bg-amberbg px-4 py-3 text-[13px] leading-relaxed text-amber">
            <span aria-hidden="true">🎁 </span>
            <strong className="font-bold">Account-level Ask Fathom is here!</strong>{" "}
            We&apos;re gifting you unlimited use until Oct 1.{" "}
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              className="underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-2 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
              <FathomMark className="h-5 w-6 text-brand" />
            </span>
            <p className="mt-4 text-[15px] text-fg-muted">
              Ask across every meeting you have recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p key={i} className="text-right">
                  <span className="inline-block max-w-[85%] rounded-lg bg-field px-3 py-2 text-left text-[14px] text-fg">
                    {m.text}
                  </span>
                </p>
              ) : (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface">
                    <FathomMark className="h-2.5 w-3 text-brand" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] leading-relaxed text-fg/90">{m.text}</p>
                    {m.cites?.length ? (
                      <ul className="mt-2 space-y-1.5">
                        {m.cites.map((c, j) => (
                          <li key={j}>
                            <a
                              href={`/calls/${c.meetingId}?t=${c.tSec}`}
                              className="block text-[13px] leading-snug text-brand hover:underline"
                            >
                              {c.label}{" "}
                              <span className="font-medium">@{formatClock(c.tSec)}</span>
                            </a>
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
      </div>

      {messages.length === 0 && (
        <div className="flex shrink-0 flex-wrap justify-end gap-2 px-4 pb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-lg bg-field px-3 py-1.5 text-[13px] text-fg transition-colors hover:bg-bubble"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="m-4 mt-0 shrink-0 rounded-lg bg-surface p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask anything..."
          aria-label="Ask Fathom anything"
          className="w-full bg-transparent text-[14px] text-fg placeholder:text-fg-muted focus:outline-none"
        />
        <div className="mt-5 flex items-center">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[14px] text-fg transition-colors hover:bg-field"
          >
            My Calls
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="submit"
            aria-label="Send"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-brand hover:text-brand"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
    </aside>
  );
}
