"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/** Height of one rung of the ladder, in px. */
const STEP = 96;

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
    body: "say Fathom helps them stay fully present in meetings",
    circle: "#B54E00",
    column: "rgba(181,78,0,0.14)",
  },
  {
    value: "6+ hours saved",
    body: "per team member every week on follow-up work",
    circle: "#DCA9B7",
    column: "rgba(220,169,183,0.26)",
  },
  {
    value: "3X Faster",
    body: "from meeting insights to actionable next steps",
    circle: "#92C0FE",
    column: "rgba(146,192,254,0.24)",
  },
];

/**
 * "Fathom teams work smarter".
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
    <section className="overflow-hidden bg-[#f7f5f5] px-10 py-32 text-neutral-900">
      <h2 className="text-center text-[clamp(34px,5vw,62px)] leading-tight font-light">
        Fathom teams
        <br />
        work smarter
      </h2>

      <div
        ref={gridRef}
        className="mx-auto mt-28 grid min-h-[460px] max-w-[1080px] items-start gap-8 sm:grid-cols-3"
      >
        {STATS.map((s, i) => {
          /* Sequential reveal: each column waits until the one to its left has
             almost finished, so they arrive one at a time rather than together. */
          const raw = Math.min(Math.max((t - i * 0.2) / 0.26, 0), 1);
          const enter = reduced ? 1 : easeOutCubic(raw);

          /* The ladder: a permanent step per column -- low, medium, high. */
          const step = -i * STEP;
          /* Each arrives from below, and drifts gently on past as it leaves. */
          const rise = (1 - enter) * 130;
          const drift = reduced ? 0 : q * (26 + i * 14);
          const y = step + rise - drift;

          return (
            <div key={s.value} className="flex justify-center">
              <div
                className="relative will-change-transform"
                style={{
                  transform: `translateY(${y}px) scale(${0.88 + 0.12 * enter})`,
                  opacity: enter,
                  filter: enter < 1 ? `blur(${(1 - enter) * 7}px)` : undefined,
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute top-[58%] left-1/2 h-[230px] w-[125px] -translate-x-1/2"
                  style={{
                    background: `linear-gradient(180deg, ${s.column} 0%, transparent 100%)`,
                  }}
                />
                <div
                  className="relative flex h-[190px] w-[190px] flex-col items-center justify-center rounded-full px-6 text-center"
                  style={{ background: s.circle }}
                >
                  <p className="text-[17px] font-bold">{s.value}</p>
                  <p className="mt-1.5 text-[13px] leading-snug">{s.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
