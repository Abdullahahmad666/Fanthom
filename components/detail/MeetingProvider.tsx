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
  TemplateId,
  TranscriptTurn,
} from "@/lib/types";
import { TEMPLATE_LABELS } from "@/lib/types";
import { deriveSummary } from "@/lib/deriveSummary";

export type DetailTab = "summary" | "transcript" | "ask";

/** How much room the recording takes. Full screen uses the Fullscreen API. */
export type PlayerSize = "regular" | "expanded" | "fullscreen";

export const PLAYBACK_RATES = [1, 1.2, 1.5, 2];

/** A template the summary tab can render, built-in or generated. */
export type SummaryTemplate = { id: string; label: string; sections: SummarySection[] };

/** How long a regeneration takes to run its progress bar. */
const REGEN_MS = 2200;

type Ctx = {
  meeting: Meeting;
  /* playback */
  currentTime: number;
  playing: boolean;
  rate: number;
  seek: (t: number) => void;
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
  sections: SummarySection[];
  /** 0-100 while a regeneration runs, null otherwise. */
  generating: number | null;
  regenerate: (instruction: string) => void;
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

  /* Built-in templates come from the meeting; generated ones are appended as
     the user asks for them, and both render through the same picker. */
  const builtIns = useMemo<SummaryTemplate[]>(
    () =>
      (Object.keys(meeting.summaries) as TemplateId[]).map((id) => ({
        id,
        label: TEMPLATE_LABELS[id],
        sections: meeting.summaries[id] ?? [],
      })),
    [meeting.summaries],
  );

  const [customs, setCustoms] = useState<SummaryTemplate[]>([]);
  const [template, setTemplate] = useState<string>(builtIns[0]?.id ?? "general");
  const [generating, setGenerating] = useState<number | null>(null);
  const regenTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const templates = useMemo(() => [...builtIns, ...customs], [builtIns, customs]);
  const sections = useMemo(
    () => templates.find((t) => t.id === template)?.sections ?? [],
    [templates, template],
  );

  /**
   * Regeneration runs a progress bar and then swaps in the new template.
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

        setCustoms((prev) => {
          const base = [...builtIns, ...prev].find((t) => t.id === template)?.sections ?? [];
          const others = builtIns.filter((t) => t.id !== template).map((t) => t.sections);
          const { label, sections: next } = deriveSummary({
            base,
            others,
            instruction,
            index: prev.length,
          });
          const id = `custom-${prev.length + 1}`;
          setTemplate(id);
          return [...prev, { id, label, sections: next }];
        });

        setGenerating(null);
      }, 90);
    },
    [builtIns, template],
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

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      // Restarting from the end rather than sitting stuck there.
      if (!p && currentTime >= meeting.durationSec) setCurrentTime(0);
      return !p;
    });
  }, [currentTime, meeting.durationSec]);

  /**
   * Player keyboard control. Skipped while typing, so the transcript search
   * and Ask Fathom composer keep their space bar.
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
    }),
    [
      meeting, currentTime, playing, rate, seek, togglePlay, playerSize,
      actionItems, highlights, addActionItem, toggleActionItem, addHighlight,
      removeHighlight, renameHighlight, tab, templates, template, sections,
      generating, regenerate,
    ],
  );

  return <MeetingCtx.Provider value={value}>{children}</MeetingCtx.Provider>;
}
