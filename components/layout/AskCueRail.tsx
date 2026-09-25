"use client";

import { useRef, useState } from "react";
import { ArrowUp, ChevronDown, Loader2, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";
import { CueMark } from "@/components/brand/CueMark";
import type { SearchResults } from "@/backend/src/repositories/search";
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
 * Account-scoped Ask Cue rail, shown on list pages only.
 *
 * The header, suggestions and composer stay put. The conversation area only
 * becomes scrollable once a thread exists, so an empty rail shows no scrollbar.
 *
 * As on the detail page, there is no model here. Answers are retrieved from
 * the seeded transcripts and cited with real timestamps.
 */
/**
 * Ask, answered from the search index.
 *
 * This used to scan every transcript in the browser for keyword hits, which
 * is why the list page had to load every transcript to render. But "where was
 * this said?" is exactly what moment search already answers, ranked and
 * indexed -- so asking is now the same query, phrased as a question.
 *
 * It still does not invent an answer. It says where the thing came up and
 * lets the citations speak, which is the same promise the summaries make.
 */
export function AskCueRail() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toBottom = () =>
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }),
    );

  const ask = async (question: string) => {
    setMessages((m) => [...m, { role: "user", text: question }]);
    setThinking(true);
    toBottom();

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(question)}`);
      const data: SearchResults = await res.json();

      const cites = data.moments.slice(0, 4).map((m) => ({
        label: `${m.speaker}: ${m.parts.join("").slice(0, 60)}`,
        meetingId: m.meetingSlug,
        tSec: m.tSec,
      }));

      const heard = new Set(data.moments.map((m) => m.meetingSlug)).size;
      const text = !data.ok
        ? "Search is unavailable right now, so I cannot check your meetings."
        : cites.length
          ? `That came up ${data.moments.length} time${data.moments.length === 1 ? "" : "s"} across ${heard} meeting${heard === 1 ? "" : "s"}. Here is where.`
          : "Nothing in your transcripts matches that. Try wording it the way someone would have said it on the call.";

      setMessages((m) => [...m, { role: "ai", text, cites }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "That search could not be completed.", cites: [] },
      ]);
    } finally {
      setThinking(false);
      toBottom();
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    void ask(draft.trim());
    setDraft("");
  };

  if (!open) {
    return (
      <div className="hidden shrink-0 border-l border-line bg-canvas p-3 xl:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Ask Cue"
          className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-surface hover:text-fg"
        >
          <PanelRightOpen className="h-[18px] w-[18px]" />
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden w-[var(--rail-w)] shrink-0 flex-col border-l border-line bg-canvas xl:flex">
      <div className="flex shrink-0 items-center gap-2 px-5 pt-5 pb-3">
        <Sparkles className="h-[15px] w-[15px] text-fg" />
        <span className="section-label text-fg-muted">
          Ask <span className="font-bold text-fg">Cue</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Collapse Ask Cue"
          className="ml-auto rounded-md p-1 text-fg-muted transition-colors hover:bg-surface hover:text-fg"
        >
          <PanelRightClose className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Conversation. Only becomes a scroll container once there is a thread
          to scroll -- an empty rail should not show a scrollbar. */}
      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 px-4 pb-2 ${
          messages.length > 0 ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        {showBanner && (
          <div className="mb-4 rounded-lg bg-amberbg px-4 py-3 text-[12px] leading-relaxed text-amber">
            <span aria-hidden="true">🎁 </span>
            <strong className="font-bold">Account-level Ask Cue is here!</strong>{" "}
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
              <CueMark className="h-5 w-6 text-brand" />
            </span>
            <p className="mt-4 text-[13px] text-fg-muted">
              Ask across every meeting you have recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p key={i} className="text-right">
                  <span className="inline-block max-w-[85%] rounded-lg bg-field px-3 py-2 text-left text-[13px] text-fg">
                    {m.text}
                  </span>
                </p>
              ) : (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface">
                    <CueMark className="h-2.5 w-3 text-brand" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-relaxed text-fg/90">{m.text}</p>
                    {m.cites?.length ? (
                      <ul className="mt-2 space-y-1.5">
                        {m.cites.map((c, j) => (
                          <li key={j}>
                            <a
                              href={`/calls/${c.meetingId}?t=${c.tSec}`}
                              className="block text-[12px] leading-snug text-brand hover:underline"
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

            {/* Searching is a real round trip now, so it has to be visible. */}
            {thinking && (
              <p className="flex items-center gap-2 text-[13px] text-fg-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Checking your transcripts…
              </p>
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
              onClick={() => void ask(s)}
              className="rounded-lg bg-field px-3 py-1.5 text-[12px] text-fg transition-colors hover:bg-bubble"
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
          aria-label="Ask Cue anything"
          className="w-full bg-transparent text-[13px] text-fg placeholder:text-fg-muted focus:outline-none"
        />
        <div className="mt-5 flex items-center">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-fg transition-colors hover:bg-field"
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
