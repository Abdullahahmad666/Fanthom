"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  ActionItem,
  Highlight,
  HighlightKind,
  Meeting,
  SummarySection,
  TranscriptTurn,
} from "@/lib/types";
import { deriveSummary } from "@/lib/deriveSummary";
import { resolveTemplates, type ResolvedTemplate } from "@/lib/summaryTemplates";
import { translateSections, type LangCode } from "@/lib/translations";

/** "auto" follows the transcript; the rest are explicit choices. */
export type SummaryLang = "auto" | LangCode;

export type DetailTab = "summary" | "transcript" | "ask";

/** How much room the recording takes. Full screen uses the Fullscreen API. */
export type PlayerSize = "regular" | "expanded" | "fullscreen";

export const PLAYBACK_RATES = [1, 1.2, 1.5, 2];

/** A catalogue template resolved against this meeting, plus any rewrite. */
export type SummaryTemplate = ResolvedTemplate & { customized: boolean };

/** How long a regeneration takes to run its progress bar. */
const REGEN_MS = 2200;

type Ctx = {
  meeting: Meeting;
  /* playback */
  currentTime: number;
  playing: boolean;
  rate: number;
  seek: (t: number) => void;
  /**
   * Seek, and tell the transcript to come with you.
   *
   * Plain seek moves the playhead; following it only happens while playing,
   * which is right for a scrubber and wrong for a cue. Checking a citation
   * from a paused summary has to land you on the line, so this carries a
   * nonce the transcript watches -- jumping to the same second twice still
   * counts as two jumps.
   */
  jumpTo: (t: number) => void;
  /**
   * The jump in flight, or null.
   *
   * Owned here rather than in the transcript because "we just arrived from a
   * citation" is a fact about the meeting view, not about one panel -- and
   * keeping it here means the panel only reads it, instead of setting state
   * inside an effect to track something it did not cause.
   */
  jumpTarget: { tSec: number; nonce: number } | null;
  togglePlay: () => void;
  setRate: (r: number) => void;
  playerSize: PlayerSize;
  setPlayerSize: (s: PlayerSize) => void;
  /* annotations, mutable so the transcript can write into the rail */
  actionItems: ActionItem[];
  highlights: Highlight[];
  addActionItem: (turn: TranscriptTurn, text: string) => void;
  toggleActionItem: (id: string) => void;
  addHighlight: (turn: TranscriptTurn, kind: HighlightKind, note: string) => void;
  removeHighlight: (id: string) => void;
  renameHighlight: (id: string, note: string) => void;
  /* view */
  tab: DetailTab;
  setTab: (t: DetailTab) => void;
  /* summary templates, built-in plus anything the user has generated */
  templates: SummaryTemplate[];
  template: string;
  setTemplate: (id: string) => void;
  sections: SummarySection[] | null;
  /** 0-100 while a regeneration runs, null otherwise. */
  generating: number | null;
  regenerate: (instruction: string) => void;
  /* Summary language. "auto" follows the transcript, which is English
     here -- the product lists both, so they stay distinct states. */
  language: SummaryLang;
  setLanguage: (l: SummaryLang) => void;
  /** Lines the dictionary could not translate in the current view. */
  untranslated: number;
};

const MeetingCtx = createContext<Ctx | null>(null);

export function useMeeting() {
  const ctx = useContext(MeetingCtx);
  if (!ctx) throw new Error("useMeeting must be used inside MeetingProvider");
  return ctx;
}

/**
 * Shared state for the meeting detail page.
 *
 * Playback is a virtual clock rather than a real <video>. The capture layer is
 * stubbed, so there is no media file to play -- but every behaviour that
 * depends on a playhead (transcript following along, seeking from a timestamp,
 * highlight ranges on the scrubber) is real and driven from here.
 */
export function MeetingProvider({
  meeting,
  initialTime = 0,
  children,
}: {
  meeting: Meeting;
  initialTime?: number;
  children: ReactNode;
}) {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [tab, setTab] = useState<DetailTab>("summary");
  const [playerSize, setPlayerSize] = useState<PlayerSize>("regular");
  const [actionItems, setActionItems] = useState<ActionItem[]>(meeting.actionItems);
  const [highlights, setHighlights] = useState<Highlight[]>(meeting.highlights);

  /**
   * The catalogue resolved against this call: authored summaries where the
   * meeting ships them, derived ones where a scanner can build them, and null
   * where the template needs a model this prototype does not have.
   */
  const resolved = useMemo(() => resolveTemplates(meeting), [meeting]);

  /** Rewrites, keyed by the template they were asked for. */
  const [rewrites, setRewrites] = useState<Record<string, SummarySection[]>>({});
  const [template, setTemplate] = useState<string>(
    () => resolved.find((t) => t.sections)?.id ?? "enhanced",
  );
  const [generating, setGenerating] = useState<number | null>(null);
  const regenTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* A rewrite replaces its template rather than becoming a new row -- which
     is why the picker marks it "Customized" instead of growing a list. */
  const templates = useMemo<SummaryTemplate[]>(
    () =>
      resolved.map((t) => ({
        ...t,
        sections: rewrites[t.id] ?? t.sections,
        customized: t.id in rewrites,
      })),
    [resolved, rewrites],
  );

  const [language, setLanguage] = useState<SummaryLang>("auto");

  const raw = useMemo(
    () => templates.find((t) => t.id === template)?.sections ?? null,
    [templates, template],
  );

  const { sections, untranslated } = useMemo(() => {
    if (!raw) return { sections: null, untranslated: 0 };
    return translateSections(raw, language === "auto" ? "en" : language);
  }, [raw, language]);

  /**
   * Regeneration runs a progress bar and then swaps in the rewrite.
   *
   * The wait is presentation -- deriveSummary is synchronous -- but a summary
   * that appeared the instant you asked would not read as having been
   * generated, and the product shows a percentage here.
   */
  const regenerate = useCallback(
    (instruction: string) => {
      if (regenTimer.current) clearInterval(regenTimer.current);
      setGenerating(0);

      const started = performance.now();
      regenTimer.current = setInterval(() => {
        const pct = Math.min(((performance.now() - started) / REGEN_MS) * 100, 100);
        setGenerating(Math.round(pct));

        if (pct < 100) return;
        if (regenTimer.current) clearInterval(regenTimer.current);
        regenTimer.current = null;

        setRewrites((prev) => {
          const base = prev[template] ?? resolved.find((t) => t.id === template)?.sections ?? [];
          const others = resolved
            .filter((t) => t.id !== template && t.sections)
            .map((t) => t.sections as SummarySection[]);
          const { sections: next } = deriveSummary({ base, others, instruction, index: 0 });
          return { ...prev, [template]: next };
        });

        setGenerating(null);
      }, 90);
    },
    [resolved, template],
  );

  useEffect(
    () => () => {
      if (regenTimer.current) clearInterval(regenTimer.current);
    },
    [],
  );

  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();

    const tick = (now: number) => {
      const delta = ((now - last.current) / 1000) * rate;
      last.current = now;
      setCurrentTime((t) => {
        const next = t + delta;
        if (next >= meeting.durationSec) {
          setPlaying(false);
          return meeting.durationSec;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, rate, meeting.durationSec]);

  const seek = useCallback(
    (t: number) => setCurrentTime(Math.max(0, Math.min(t, meeting.durationSec))),
    [meeting.durationSec],
  );

  const [jumpTarget, setJumpTarget] = useState<{ tSec: number; nonce: number } | null>(null);
  const jumpCount = useRef(0);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* The nonce means jumping to the same second twice still reads as two
     separate arrivals, which is what checking a cue repeatedly should do. */
  const jumpTo = useCallback(
    (t: number) => {
      seek(t);
      setJumpTarget({ tSec: t, nonce: ++jumpCount.current });
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
      jumpTimer.current = setTimeout(() => setJumpTarget(null), 1600);
    },
    [seek],
  );

  useEffect(
    () => () => {
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
    },
    [],
  );

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      // Restarting from the end rather than sitting stuck there.
      if (!p && currentTime >= meeting.durationSec) setCurrentTime(0);
      return !p;
    });
  }, [currentTime, meeting.durationSec]);

  /**
   * Player keyboard control. Skipped while typing, so the transcript search
   * and Ask Cue composer keep their space bar.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentTime((t) => Math.min(t + 5, meeting.durationSec));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentTime((t) => Math.max(t - 5, 0));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [meeting.durationSec, togglePlay]);

  const addActionItem = useCallback((turn: TranscriptTurn, text: string) => {
    setActionItems((items) => [
      ...items,
      {
        id: `manual-${Date.now()}`,
        text,
        ownerId: turn.speakerId,
        tSec: turn.tSec,
        done: false,
        manual: true,
      },
    ]);
  }, []);

  const toggleActionItem = useCallback((id: string) => {
    setActionItems((items) =>
      items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    );
  }, []);

  const addHighlight = useCallback(
    (turn: TranscriptTurn, kind: HighlightKind, note: string) => {
      const turns = meeting.transcript;
      const idx = turns.findIndex((t) => t.id === turn.id);
      const endSec = turns[idx + 1]?.tSec ?? Math.min(turn.tSec + 30, meeting.durationSec);
      setHighlights((hs) => [
        ...hs,
        {
          id: `hl-${Date.now()}`,
          kind,
          tSec: turn.tSec,
          endSec,
          note,
          createdBy: "abdullah",
        },
      ]);
    },
    [meeting.transcript, meeting.durationSec],
  );

  const removeHighlight = useCallback(
    (id: string) => setHighlights((hs) => hs.filter((h) => h.id !== id)),
    [],
  );

  const renameHighlight = useCallback(
    (id: string, note: string) =>
      setHighlights((hs) => hs.map((h) => (h.id === id ? { ...h, note } : h))),
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      meeting,
      currentTime,
      playing,
      rate,
      seek,
      jumpTo,
      jumpTarget,
      togglePlay,
      setRate,
      playerSize,
      setPlayerSize,
      actionItems,
      highlights,
      addActionItem,
      toggleActionItem,
      addHighlight,
      removeHighlight,
      renameHighlight,
      tab,
      setTab,
      templates,
      template,
      setTemplate,
      sections,
      generating,
      regenerate,
      language,
      setLanguage,
      untranslated,
    }),
    [
      meeting, currentTime, playing, rate, seek, jumpTo, jumpTarget, togglePlay, playerSize,
      actionItems, highlights, addActionItem, toggleActionItem, addHighlight,
      removeHighlight, renameHighlight, tab, templates, template, sections,
      generating, regenerate, language, untranslated,
    ],
  );

  return <MeetingCtx.Provider value={value}>{children}</MeetingCtx.Provider>;
}
