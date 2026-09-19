"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Starfield } from "./Starfield";
import { MockAppWindow } from "./MockAppWindow";

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
 * cross-fade as you scroll a sticky stage.
 *
 * The statements are stacked and faded rather than swapped, so moving back up
 * reverses cleanly instead of snapping.
 */
export function UnstoppableSection() {
  const stageRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = stageRef.current;
      if (!el) return;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const p = -el.getBoundingClientRect().top / travel;
      setActive(Math.floor(Math.min(Math.max(p, 0), 0.999) * STATEMENTS.length));
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

      <section ref={stageRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-10">
          <Starfield />

          <div className="relative flex w-full max-w-[900px] items-center justify-center">
            {STATEMENTS.map((text, i) => (
              <p
                key={i}
                aria-hidden={i !== active}
                className={`text-center text-[clamp(24px,2.9vw,40px)] leading-[1.35] font-light text-fg transition-all duration-500 ${
                  i === active
                    ? "relative opacity-100 blur-0"
                    : "pointer-events-none absolute inset-x-0 opacity-0 blur-[6px]"
                }`}
                style={{ transform: i === active ? "none" : "translateY(14px)" }}
              >
                {text}
              </p>
            ))}
          </div>

          <Link
            href="/signup"
            className="relative mt-20 inline-flex rounded-full bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] px-8 py-3.5 text-[14px] font-semibold tracking-wide text-black uppercase transition-opacity hover:opacity-90"
          >
            Try Fathom for your team
          </Link>

          <div className="relative mt-10 flex gap-2">
            {STATEMENTS.map((_, i) => (
              <span
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 28 : 12,
                  background: i === active ? "#73bfff" : "#3a3a3f",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
