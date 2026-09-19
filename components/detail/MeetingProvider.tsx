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
  TemplateId,
  TranscriptTurn,
} from "@/lib/types";

export type DetailTab = "summary" | "transcript" | "ask";

type Ctx = {
  meeting: Meeting;
  /* playback */
  currentTime: number;
  playing: boolean;
  rate: number;
  seek: (t: number) => void;
  togglePlay: () => void;
  cycleRate: () => void;
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
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
};

const MeetingCtx = createContext<Ctx | null>(null);

export function useMeeting() {
  const ctx = useContext(MeetingCtx);
  if (!ctx) throw new Error("useMeeting must be used inside MeetingProvider");
  return ctx;
}

const RATES = [1, 1.2, 1.5, 2];

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
  const [actionItems, setActionItems] = useState<ActionItem[]>(meeting.actionItems);
  const [highlights, setHighlights] = useState<Highlight[]>(meeting.highlights);

  const firstTemplate = (Object.keys(meeting.summaries)[0] ?? "general") as TemplateId;
  const [template, setTemplate] = useState<TemplateId>(firstTemplate);

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

  const cycleRate = useCallback(
    () => setRate((r) => RATES[(RATES.indexOf(r) + 1) % RATES.length]),
    [],
  );

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
      cycleRate,
      actionItems,
      highlights,
      addActionItem,
      toggleActionItem,
      addHighlight,
      removeHighlight,
      renameHighlight,
      tab,
      setTab,
      template,
      setTemplate,
    }),
    [
      meeting, currentTime, playing, rate, seek, togglePlay, cycleRate,
      actionItems, highlights, addActionItem, toggleActionItem, addHighlight,
      removeHighlight, renameHighlight, tab, template,
    ],
  );

  return <MeetingCtx.Provider value={value}>{children}</MeetingCtx.Provider>;
}
