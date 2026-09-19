"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Starfield } from "./Starfield";
import {
  ActionItemsSlide,
  AskSlide,
  LiveCallSlide,
  SummarySlide,
} from "./FeatureSlides";

/**
 * Slide geometry, in CSS rather than JS.
 *
 * The slide was a fixed 520px, which a 390px phone cut a quarter off. Holding
 * the width and the gap as custom properties lets the translate be a calc()
 * over the same values, so the strip stays aligned at any width without
 * measuring anything on resize.
 */
const SLIDE_W = "min(520px, calc(100vw - 40px))";
const GAP = "clamp(24px, 9vw, 150px)";
const STEP = `calc(${SLIDE_W} + ${GAP})`;

const SLIDES: { caption: ReactNode; Art: () => ReactNode }[] = [
  {
    caption: (
      <>
        Capture notes your way &ndash; <strong className="font-bold">bot or no bot</strong> &ndash;
        <br />
        so you can stay focused on the meeting
      </>
    ),
    Art: LiveCallSlide,
  },
  {
    caption: (
      <>
        AI summaries instantly
        <br />
        available after your call
      </>
    ),
    Art: SummarySlide,
  },
  {
    caption: (
      <>
        Every commitment pulled out
        <br />
        with an owner and a timestamp
      </>
    ),
    Art: ActionItemsSlide,
  },
  {
    caption: (
      <>
        Ask anything across
        <br />
        every meeting you have had
      </>
    ),
    Art: AskSlide,
  },
];

/**
 * The product filmstrip.
 *
 * Not a one-at-a-time carousel: the whole strip slides, so the next panel is
 * already half on screen with its own caption above it. That is what tells you
 * there is more to see, and it is why the captions travel with their slides
 * rather than sitting in one fixed slot above the stage.
 *
 * Centring is done with a percentage padding on the track and a pixel
 * translate, so the active slide lands dead centre at any viewport width
 * without measuring anything.
 */
export function FeatureCarousel() {
  const [i, setI] = useState(0);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative overflow-hidden bg-black pt-24 pb-16">
      <Starfield />

      {/* The band lifts out of black into blue behind the pager, then settles
          back down so it meets the black marquee below without a seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(38,64,85,0.5) 48%, #3c6183 82%, #0a1018 100%)",
        }}
      />

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              paddingLeft: `calc(50% - (${SLIDE_W}) / 2)`,
              paddingRight: `calc(50% - (${SLIDE_W}) / 2)`,
              transform: `translateX(calc(-1 * ${i} * ${STEP}))`,
            }}
          >
            {SLIDES.map(({ caption, Art }, n) => (
              <div
                key={n}
                style={{
                  width: SLIDE_W,
                  marginRight: n === SLIDES.length - 1 ? 0 : GAP,
                }}
                className="shrink-0"
              >
                <p className="mb-10 flex min-h-[66px] items-start justify-center text-center text-[22px] leading-[1.35] text-fg">
                  <span>{caption}</span>
                </p>
                <Art />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(i - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-amber text-black transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div className="flex items-center gap-3">
            {SLIDES.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Slide ${n + 1}`}
                aria-current={n === i}
                onClick={() => setI(n)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  n === i ? "bg-amber" : "bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => go(i + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-amber text-black transition-transform hover:scale-105"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
}
