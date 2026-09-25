"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Ladder geometry, measured off the product.
 *
 * The column is exactly as wide as its bubble and the three sit close
 * together -- the gap is under a quarter of a bubble. Spreading them across a
 * three-column grid, which is what this did, broke the read: the bubbles
 * stopped looking like the tops of bars and started looking like three
 * unrelated circles.
 */
const DIAMETER = 200;
const COL_GAP = 46;
/** Height of one rung. */
const STEP = 113;
/** How far the lowest bar runs on past its bubble. */
const TAIL = 75;

/** Decelerating arrival -- fast in, soft landing. */
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const STATS = [
  {
    value: "95% of users",
    body: "say Cue helps them stay fully present in meetings",
    circle: "#D94A08",
    column: "rgba(217,74,8,0.16)",
  },
  {
    value: "6+ hours saved",
    body: "per team member every week on follow-up work",
    circle: "#F0A8C2",
    column: "rgba(240,168,194,0.26)",
  },
  {
    value: "3X Faster",
    body: "from meeting insights to actionable next steps",
    circle: "#3FA3EE",
    column: "rgba(63,163,238,0.22)",
  },
];

/** Tallest bubble's top to the foot of the bars. */
const ROW_H = (STATS.length - 1) * STEP + DIAMETER + TAIL;

/**
 * "Cue teams work smarter".
 *
 * Scroll-driven, and reversible because everything is derived from scroll
 * position rather than fired as a one-shot animation.
 *
 * The three bubbles arrive one at a time, left to right, each fading up from
 * below with a blur and scale that resolve as it lands. They settle into a
 * ladder -- low, medium, high -- rather than a level row, and a gentle drift
 * carries them on as the section leaves.
 *
 * Everything derives from scroll position, so the whole sequence plays
 * backwards on the way up.
 */
export function StatsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  /** Reveal progress, and a signed value for the parallax. */
  const [{ t, q }, setProgress] = useState({ t: 0, q: 0 });

  /* Subscribed rather than read into state in an effect, so there is no
     render-then-correct flash and the server sees a stable false. */
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );

  useEffect(() => {
    if (reduced) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = gridRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      /* Measured against the bubble row, not the whole section. Tracking the
         section meant the reveal finished while the bubbles were still below
         the fold, so by the time you could see them they had already settled
         and the section looked static. */
      const t = (vh - rect.top) / (vh * 0.75);

      /* Signed distance of the row's centre from the viewport centre, in
         viewport heights: negative below, zero when centred, positive above.
         Drives the drift, which is zero when centred so the ladder reads
         cleanly at rest and only spreads as the section enters and leaves. */
      const q = (vh / 2 - (rect.top + rect.height / 2)) / vh;

      setProgress({ t: Math.min(Math.max(t, 0), 1), q: Math.min(Math.max(q, -1), 1) });
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
  }, [reduced]);

  return (
    <section className="overflow-hidden bg-[#f7f5f5] px-10 pt-28 pb-6 text-neutral-900">
      <h2 className="text-center text-[clamp(34px,5vw,62px)] leading-tight font-light">
        Cue teams
        <br />
        work smarter
      </h2>

      {/* The bars all end on the same line -- the foot of the row -- so the
          higher a bubble sits, the longer its bar. That is what makes the
          three read as one chart rather than three badges. */}
      <div
        ref={gridRef}
        style={{ height: ROW_H, gap: COL_GAP }}
        className="mx-auto mt-8 flex justify-center"
      >
        {STATS.map((s, i) => {
          /* Sequential reveal: each column waits until the one to its left has
             almost finished, so they arrive one at a time rather than together. */
          const raw = Math.min(Math.max((t - i * 0.2) / 0.26, 0), 1);
          const enter = reduced ? 1 : easeOutCubic(raw);

          /* The ladder: the rightmost bubble sits highest. */
          const top = (STATS.length - 1 - i) * STEP;
          /* Each arrives from below, and drifts gently on past as it leaves. */
          const rise = (1 - enter) * 130;
          const drift = reduced ? 0 : q * (26 + i * 14);
          const y = rise - drift;

          return (
            <div key={s.value} style={{ width: DIAMETER }} className="relative shrink-0">
              <div
                className="absolute inset-x-0 will-change-transform"
                style={{
                  top,
                  height: DIAMETER,
                  transform: `translateY(${y}px) scale(${0.88 + 0.12 * enter})`,
                  opacity: enter,
                  filter: enter < 1 ? `blur(${(1 - enter) * 7}px)` : undefined,
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0"
                  style={{
                    top: DIAMETER / 2,
                    height: ROW_H - top - DIAMETER / 2,
                    background: `linear-gradient(180deg, ${s.column} 0%, transparent 100%)`,
                  }}
                />
                <div
                  style={{ background: s.circle, width: DIAMETER, height: DIAMETER }}
                  className="relative flex flex-col items-center justify-center rounded-full px-6 text-center"
                >
                  <p className="text-[20px] leading-tight font-bold">{s.value}</p>
                  <p className="mt-1.5 text-[15px] leading-snug">{s.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
