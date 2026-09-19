"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, Bookmark, MessageSquare, MoreHorizontal, Pencil, Plus,
  Scissors, SquareCheck, UserRound, X,
} from "lucide-react";
import { useMeeting } from "./MeetingProvider";
import { Popover } from "@/components/ui/Popover";
import {
  formatClock, HIGHLIGHT_META, participantById,
  type HighlightKind, type TranscriptTurn,
} from "@/lib/types";

const ANNOTATION_KINDS: HighlightKind[] = ["highlight", "positive", "review", "feedback"];

/** The ⊕ gutter menu, reproduced from the product: two grouped sections. */
function AddMenu({ turn }: { turn: TranscriptTurn }) {
  const { addActionItem, addHighlight } = useMeeting();
  const firstSentence = turn.sentences[0]?.text ?? "";
  const short = firstSentence.length > 90 ? `${firstSentence.slice(0, 90)}…` : firstSentence;

  return (
    <Popover
      align="left"
      className="min-w-[300px] overflow-hidden bg-[#1d1e1f] py-0"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label="Add annotation"
          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand text-brand transition-opacity ${
            open ? "opacity-100" : "opacity-0 group-hover/turn:opacity-100 focus:opacity-100"
          }`}
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                addActionItem(turn, short);
                close();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] font-bold tracking-wide text-fg uppercase transition-colors hover:bg-surface"
            >
              <SquareCheck className="h-5 w-5" /> Action Item
            </button>
            <button
              type="button"
              onClick={() => {
                addHighlight(turn, "bookmark", short);
                close();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] font-bold tracking-wide text-fg uppercase transition-colors hover:bg-surface"
            >
              <Bookmark className="h-5 w-5" /> Bookmark
            </button>
          </div>

          <div className="border-y border-line py-1">
            <span
              title="Comments are not part of this prototype"
              className="flex w-full cursor-not-allowed items-center gap-3 px-4 py-3 text-[15px] font-bold tracking-wide text-fg/35 uppercase"
            >
              <MessageSquare className="h-5 w-5" /> Comment
            </span>
          </div>

          <div className="bg-[#29292e] py-1">
            {ANNOTATION_KINDS.map((kind) => {
              const meta = HIGHLIGHT_META[kind];
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => {
                    addHighlight(turn, kind, short);
                    close();
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] font-bold tracking-wide uppercase transition-colors hover:bg-surface ${meta.className}`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded border-2 border-current">
                    <span className="h-0 w-0 border-y-[3px] border-l-[5px] border-y-transparent border-l-current" />
                  </span>
                  {meta.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </Popover>
  );
}

/** The ⋯ row menu: edit / change speaker / trim. */
function RowMenu() {
  const items = [
    { icon: Pencil, label: "Edit transcript" },
    { icon: UserRound, label: "Change speaker" },
    { icon: Scissors, label: "Trim this section" },
    { icon: Scissors, label: "Trim all sections after this section" },
  ];
  return (
    <Popover
      align="left"
      className="min-w-[280px] bg-popover"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label="Transcript options"
          className={`flex h-7 w-7 items-center justify-center rounded-full bg-bubble text-fg transition-opacity ${
            open ? "opacity-100" : "opacity-0 group-hover/turn:opacity-100 focus:opacity-100"
          }`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}
    >
      {() => (
        <div className="py-1">
          {items.map(({ icon: Icon, label }) => (
            <span
              key={label}
              title="Transcript editing is not part of this prototype"
              className="flex w-full cursor-not-allowed items-start gap-3 px-4 py-2.5 text-[15px] font-semibold text-fg/40"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              {label}
            </span>
          ))}
        </div>
      )}
    </Popover>
  );
}

export function TranscriptPanel() {
  const {
    meeting, currentTime, seek, highlights, removeHighlight, playing,
  } = useMeeting();
  const [q, setQ] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const term = q.trim().toLowerCase();

  const turns = useMemo(() => {
    if (!term) return meeting.transcript;
    return meeting.transcript.filter((t) =>
      t.sentences.some((s) => s.text.toLowerCase().includes(term)),
    );
  }, [meeting.transcript, term]);

  /** The turn the playhead currently sits in. */
  const activeTurnId = useMemo(() => {
    let id: string | null = null;
    for (const t of meeting.transcript) {
      if (t.tSec <= currentTime) id = t.id;
      else break;
    }
    return id;
  }, [meeting.transcript, currentTime]);

  useEffect(() => {
    if (!autoScroll || !playing || term) return;
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeTurnId, autoScroll, playing, term]);

  const highlightFor = (turn: TranscriptTurn) =>
    highlights.find((h) => h.tSec === turn.tSec);

  return (
    <div className="relative">
      {/* Floating search. Absolutely positioned so it sits *over* the scrolling
          transcript, visibly overlapping bubbles, which is how the product
          renders it -- not a row in the flow above the list. */}
      <div className="pointer-events-none absolute top-3 right-0 z-20 flex justify-end px-6">
        <div className="pointer-events-auto relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Transcript"
            aria-label="Search transcript"
            className="h-10 w-[260px] rounded-full bg-[#1d1e1f] pr-9 pl-10 text-[15px] text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-fg-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear transcript search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-fg-muted hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {term && (
        <p className="px-6 pt-4 text-[13px] text-fg-muted">
          {turns.length} matching {turns.length === 1 ? "turn" : "turns"}
        </p>
      )}

      <div
        ref={scrollRef}
        onScroll={() => setAutoScroll(false)}
        className="max-h-[620px] overflow-y-auto px-6 pt-16 pb-10"
      >
        {turns.map((turn) => {
          const speaker = participantById(meeting, turn.speakerId);
          const isOwner = speaker?.isOwner ?? false;
          const isActive = turn.id === activeTurnId;
          const hl = highlightFor(turn);
          const meta = hl ? HIGHLIGHT_META[hl.kind] : null;
          // Observed: a highlighted range renders full brand cyan while the
          // playhead is inside it, and a muted tint otherwise.
          const hlIsLive =
            !!hl && currentTime >= hl.tSec && currentTime <= (hl.endSec ?? hl.tSec + 30);

          return (
            <div
              key={turn.id}
              ref={isActive ? activeRef : undefined}
              className="group/turn relative py-3"
            >
              {hl && meta && (
                <div className="mb-2 flex items-center gap-2 pl-10">
                  <span className={`text-[15px] font-bold tracking-wide uppercase ${meta.className}`}>
                    {meta.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(hl.id)}
                    aria-label="Remove annotation"
                    className="text-fg-dim transition-colors hover:text-fg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <span className="truncate text-[15px] text-fg underline underline-offset-2">
                    {hl.note}
                  </span>
                </div>
              )}

              <div className="flex items-start gap-2">
                {/* Gutter: ⊕ and, when annotated, the coloured range rail. */}
                <div className="relative flex w-7 shrink-0 justify-center pt-1">
                  <AddMenu turn={turn} />
                  {hl && meta && (
                    <span
                      className={`absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2 ${meta.bar}`}
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`mb-1.5 text-[14px] text-fg-muted ${isOwner ? "text-right" : "text-left"}`}
                  >
                    {speaker?.name ?? "Unknown"}
                    <span className="ml-2 text-fg-dim">{formatClock(turn.tSec)}</span>
                  </p>

                  <div className={`flex flex-col gap-1.5 ${isOwner ? "items-end" : "items-start"}`}>
                    {turn.sentences.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => seek(s.tSec)}
                        className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-left text-[15px] leading-relaxed transition-colors ${
                          hl && meta
                            ? hlIsLive
                              ? `${meta.live} text-black`
                              : `${meta.bubble} text-fg`
                            : "bg-bubble text-fg hover:bg-[#5a5b5b]"
                        } ${isActive && !hl ? "ring-2 ring-brand/70" : ""}`}
                      >
                        {term ? <Marked text={s.text} term={term} /> : s.text}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-7 shrink-0 pt-1">
                  <RowMenu />
                </div>
              </div>
            </div>
          );
        })}

        {turns.length === 0 && (
          <p className="py-16 text-center text-[15px] text-fg-muted">
            No transcript matches for “{q}”.
          </p>
        )}
      </div>

      {!autoScroll && playing && (
        <button
          type="button"
          onClick={() => {
            setAutoScroll(true);
            activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
          }}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand px-4 py-2 text-[15px] font-semibold text-black shadow-lg"
        >
          <ArrowDown className="h-4 w-4" /> Resume Auto-Scroll
        </button>
      )}
    </div>
  );
}

function Marked({ text, term }: { text: string; term: string }) {
  const i = text.toLowerCase().indexOf(term);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-amber/40 px-0.5 text-fg">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
}
