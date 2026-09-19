"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

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
 * Two effects combine. A staggered fade-and-rise brings the bubbles in left to
 * right, and a parallax gives each column a slightly faster upward travel than
 * the one before it, so they form a staircase on the way through and sit level
 * as the section passes the middle of the viewport -- which is the resting
 * state the capture shows.
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
         Drives the parallax, so the columns sit level when centred. */
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

      <div ref={gridRef} className="mx-auto mt-24 grid max-w-[1180px] gap-10 sm:grid-cols-3">
        {STATS.map((s, i) => {
          /* Reveal: each column starts 18% of the way later than the one to its
             left, and takes 42% of the travel to arrive. */
          const enter = reduced ? 1 : Math.min(Math.max((t - i * 0.18) / 0.42, 0), 1);
          const rise = (1 - enter) * 110;
          /* Parallax: each column climbs faster than the last, so they staircase
             on the way through and sit level when the row is centred. */
          const parallax = reduced ? 0 : q * (70 + i * 55);
          const y = rise - parallax;

          return (
            <div key={s.value} className="relative flex justify-center">
              <div
                aria-hidden="true"
                className="absolute top-[55%] h-[300px] w-[210px]"
                style={{
                  background: `linear-gradient(180deg, ${s.column} 0%, transparent 100%)`,
                  transform: `translateY(${y}px)`,
                  opacity: enter,
                }}
              />
              <div
                className="relative flex h-[300px] w-[300px] flex-col items-center justify-center rounded-full px-10 text-center will-change-transform"
                style={{
                  background: s.circle,
                  transform: `translateY(${y}px)`,
                  opacity: enter,
                }}
              >
                <p className="text-[24px] font-bold">{s.value}</p>
                <p className="mt-3 text-[17px] leading-snug">{s.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
