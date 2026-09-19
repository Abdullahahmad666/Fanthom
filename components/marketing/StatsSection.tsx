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
  const ref = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);

  /* Subscribed rather than read into state in an effect, so there is no
     render-then-correct flash and the server sees a stable false. */
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the section enters from below, 1 once it has fully passed up.
      const progress = (vh - rect.top) / (vh + rect.height);
      setT(Math.min(Math.max(progress, 0), 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <section ref={ref} className="overflow-hidden bg-[#f7f5f5] px-10 py-32 text-neutral-900">
      <h2 className="text-center text-[clamp(34px,5vw,62px)] leading-tight font-light">
        Fathom teams
        <br />
        work smarter
      </h2>

      <div className="mx-auto mt-24 grid max-w-[1180px] gap-10 sm:grid-cols-3">
        {STATS.map((s, i) => {
          // Staggered reveal, then a per-column parallax that settles at t=0.5.
          const enter = reduced ? 1 : Math.min(Math.max((t - i * 0.08) / 0.3, 0), 1);
          const rise = (1 - enter) * 70;
          const parallax = reduced ? 0 : (t - 0.5) * (34 + i * 30);
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
