"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
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

/** Three claims that swap as the section is scrolled, each highlighting a phrase. */
const STATEMENTS: ReactNode[] = [
  <>
    Accurate meeting notes, call summaries, and alerts mean your team stays
    perfectly aligned without the extra overhead &ndash;{" "}
    <span className="text-[#EFC9A6]">even if they weren&apos;t able to attend live.</span>
  </>,
  <>
    Every call offers{" "}
    <span className="text-[#A855F7]">
      real-time coaching moments and follow-up metrics with AI Scorecards
    </span>{" "}
    that elevate performance across the board.
  </>,
  <>
    Smart AI-generated action items and{" "}
    <span className="text-[#F08A6C]">
      call insights from every conversation automatically flow to your tools
    </span>
    , driving business forward without the manual updates.
  </>,
];

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
            {STATEMENTS.map((text, i) => {
              /* Each statement owns a slice of the stage. d runs 0 to 1 across
                 its own slice, so the text travels upward continuously instead
                 of cutting between fixed positions.

                 The first and last are clamped into their hold window outside
                 their slice, so the stage never opens or closes on a CTA with
                 no text above it. */
              const d = p * STATEMENTS.length - i;
              const held =
                i === 0 ? Math.max(d, 0.15)
                : i === STATEMENTS.length - 1 ? Math.min(d, 0.8)
                : d;
              const vis = phase(held);
              const y = (held - 0.5) * -90;

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
                  {text}
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
