"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Starfield } from "./Starfield";
import { MockAppWindow } from "./MockAppWindow";

/**
 * Visibility across a statement's own slice of the stage.
 *
 * Deliberately a plateau rather than a crossfade: each claim fades in, holds
 * fully readable for most of its slice, fades out, then leaves a short gap
 * before the next arrives -- so one is clearly gone before the next appears.
 */
function phase(d: number) {
  if (d < 0) return 0;
  if (d < 0.15) return d / 0.15; // in
  if (d < 0.8) return 1; // hold
  if (d < 0.95) return 1 - (d - 0.8) / 0.15; // out
  return 0;
}

/**
 * Three claims that swap as the section is scrolled.
 *
 * Held as coloured runs rather than JSX so each can be split into words and
 * written in one at a time, the way the hero headline is -- a highlight span
 * would otherwise be an atom the typing could not get inside.
 */
type Segment = { text: string; color?: string };

const STATEMENTS: Segment[][] = [
  [
    {
      text: "Accurate meeting notes, call summaries, and alerts mean your team stays perfectly aligned without the extra overhead –",
    },
    { text: "even if they weren’t able to attend live.", color: "#EFC9A6" },
  ],
  [
    { text: "Every call offers" },
    {
      text: "real-time coaching moments and follow-up metrics with AI Scorecards",
      color: "#A855F7",
    },
    { text: "that elevate performance across the board." },
  ],
  [
    { text: "Smart AI-generated action items and" },
    {
      text: "call insights from every conversation automatically flow to your tools,",
      color: "#F08A6C",
    },
    { text: "driving business forward without the manual updates." },
  ],
];

/** Gap between words landing, and how long one takes. */
const WORD_STEP = 42;
const WORD_MS = 460;

/**
 * One statement, written in a word at a time.
 *
 * The space between words sits outside the animated span: adjacent
 * inline-blocks with nothing between them give the browser no break
 * opportunity, and the paragraph would run off the stage rather than wrap.
 */
function TypedStatement({ segments }: { segments: Segment[] }) {
  let n = 0;

  return (
    <>
      {segments.map((seg, si) => {
        const words = seg.text.split(" ").filter(Boolean);
        return (
          <span key={si} style={seg.color ? { color: seg.color } : undefined}>
            {words.map((word, wi) => {
              const delay = n++ * WORD_STEP;
              return (
                <Fragment key={wi}>
                  <span
                    className="inline-block"
                    style={{
                      animation: `word-in ${WORD_MS}ms cubic-bezier(0.22,1,0.36,1) both`,
                      animationDelay: `${delay}ms`,
                    }}
                  >
                    {word}
                  </span>
                  {wi < words.length - 1 ? " " : ""}
                </Fragment>
              );
            })}
            {si < segments.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
}

/**
 * "Make your team unstoppable" -- the product shot, then three claims that
 * travel through a sticky stage as you scroll.
 *
 * Deliberately not a carousel: there are no pager dots, the text moves upward
 * continuously rather than swapping in a fixed spot, and the starfield drifts
 * with it, so the stage reads as a page being scrolled rather than a slideshow
 * advancing. Everything is derived from scroll offset, so it reverses.
 */
export function UnstoppableSection() {
  const stageRef = useRef<HTMLElement>(null);
  /** Continuous 0-1 progress through the stage, not a step index. */
  const [p, setP] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = stageRef.current;
      if (!el) return;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const raw = -el.getBoundingClientRect().top / travel;
      setP(Math.min(Math.max(raw, 0), 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /**
   * Each statement owns a slice of the stage. d runs 0 to 1 across its own
   * slice, so the text travels upward continuously instead of cutting between
   * fixed positions.
   *
   * The first and last are clamped into their hold window outside their
   * slice, so the stage never opens or closes on a CTA with no text above it.
   */
  const slices = useMemo(
    () =>
      STATEMENTS.map((_, i) => {
        const d = p * STATEMENTS.length - i;
        const held =
          i === 0
            ? Math.max(d, 0.15)
            : i === STATEMENTS.length - 1
              ? Math.min(d, 0.8)
              : d;
        return { vis: phase(held), y: (held - 0.5) * -90 };
      }),
    [p],
  );

  /* One counter per statement, bumped each time it comes back into view. */
  const [runs, setRuns] = useState<number[]>(() => STATEMENTS.map(() => 0));
  const onStage = useRef<boolean[]>(STATEMENTS.map(() => false));

  useEffect(() => {
    slices.forEach(({ vis }, i) => {
      const showing = vis > 0.05;
      if (showing === onStage.current[i]) return;
      onStage.current[i] = showing;
      if (showing) {
        setRuns((r) => r.map((n, j) => (j === i ? n + 1 : n)));
      }
    });
  }, [slices]);

  return (
    <>
      <section className="relative overflow-hidden px-10 pt-28 pb-20">
        <Starfield />
        <div className="relative mx-auto max-w-[1240px]">
          <p className="text-center text-[16px] text-[#73BFFF]">
            ✦ Shared understanding. Faster execution. Better results.
          </p>
          <h2 className="mt-4 text-center text-[clamp(34px,4.6vw,58px)] leading-[1.15] font-light text-fg">
            Make your team
            <br />
            unstoppable
          </h2>
          <div className="mt-20">
            <MockAppWindow />
          </div>
        </div>
      </section>

      <section ref={stageRef} className="relative h-[450vh]">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-10">
          {/* The stars drift up through the stage. Without this the sticky
              section reads as frozen and the text looks like a carousel
              swapping in place rather than a page being scrolled. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 will-change-transform"
            style={{ transform: `translateY(${-p * 26}vh) scale(${1 + p * 0.12})` }}
          >
            <Starfield />
          </div>

          <div className="relative flex w-full max-w-[900px] items-center justify-center">
            {STATEMENTS.map((segments, i) => {
              const { vis, y } = slices[i];

              return (
                <p
                  key={i}
                  aria-hidden={vis < 0.6}
                  className="absolute inset-x-0 text-center text-[clamp(24px,2.9vw,40px)] leading-[1.35] font-light text-fg will-change-transform"
                  style={{
                    opacity: vis,
                    transform: `translateY(${y}px)`,
                    filter: vis < 1 ? `blur(${(1 - vis) * 8}px)` : undefined,
                    pointerEvents: vis > 0.6 ? "auto" : "none",
                  }}
                >
                  {/* Keyed on the run counter: remounting is what restarts the
                      CSS animation, so the claim writes itself in again each
                      time it is scrolled back to. */}
                  <TypedStatement key={runs[i]} segments={segments} />
                </p>
              );
            })}
          </div>

          <Link
            href="/signup"
            className="relative mt-[260px] inline-flex rounded-full bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] px-8 py-3.5 text-[14px] font-semibold tracking-wide text-black uppercase transition-opacity hover:opacity-90"
          >
            Try Fathom for your team
          </Link>
        </div>
      </section>
    </>
  );
}
