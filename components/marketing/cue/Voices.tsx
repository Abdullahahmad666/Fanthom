"use client";

import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The testimonial section, with one substitution.
 *
 * Cue has no customers, so it has no testimonials. The page these were asked
 * for used to carry a quote from "Rosanne K., Executive" and a 5.0 rating from
 * 6,500 reviews, and both were removed earlier for the same reason: attaching
 * a stranger's name to praise they never gave is inventing a person, not
 * designing a section.
 *
 * What is here instead is the same shape and the same motion -- a card that
 * types itself out, a row that advances on its own -- carrying the moments
 * where the product either earns its keep or does not. They are written as
 * situations, in the second person, and attributed to the situation rather
 * than to a face. Nobody is quoted who does not exist.
 *
 * Swap in real quotes and this component does not change: give each entry a
 * `name` and a `role` and the attribution line renders them instead.
 */

type Voice = {
  /** The line that types itself. */
  quote: string;
  /** Who or what it is attributed to. */
  attribution: string;
  /** The situation, in a few words. */
  context: string;
};

const VOICES: Voice[] = [
  {
    quote:
      "Someone asks what we agreed. You have the sentence, and the second it was said.",
    attribution: "The week after a decision",
    context: "Decisions",
  },
  {
    quote:
      "A summary says a date moved. You press the timestamp and hear it move.",
    attribution: "When the notes look wrong",
    context: "Provenance",
  },
  {
    quote:
      "You remember a risk being raised and not who raised it. Search finds the line, not the meeting.",
    attribution: "Two weeks and forty calls later",
    context: "Search",
  },
  {
    quote:
      "Nobody has to be told a recorder joined, because nothing joined.",
    attribution: "Every meeting, quietly",
    context: "No bot",
  },
];

/** How long each card holds before the row advances. */
const HOLD_MS = 6200;

export function Voices() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;

    /* Honour the system preference directly rather than relying on the CSS
       override: this is a timer, and no stylesheet can stop a timer. */
    const reduce =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    timer.current = setInterval(() => setIndex((i) => (i + 1) % VOICES.length), HOLD_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const active = VOICES[index];

  return (
    <section
      id="voices"
      className="scroll-mt-24 overflow-hidden px-6 py-24 sm:px-10"
      aria-labelledby="voices-heading"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="reveal-lead max-w-[46ch]">
          <p className="section-label">In practice</p>
          <h2
            id="voices-heading"
            className="write-on font-display mt-3 text-[clamp(30px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text"
          >
            The moments it pays off.
          </h2>
        </Reveal>

        <div
          className="relative mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* The live card. Keyed on the index so React remounts it, which is
              what restarts the typing -- animating an element in place would
              keep the old text on screen underneath. */}
          <figure
            key={index}
            className="cue-slide-in relative rounded-xl border border-line bg-surface p-8 sm:p-12"
          >
            <span
              aria-hidden
              className="absolute top-8 right-8 flex h-9 w-9 items-center justify-center rounded-full bg-mark-soft text-mark"
            >
              <Quote className="h-4 w-4" />
            </span>

            <p className="section-label">{active.context}</p>

            {/* aria-live so the change is announced; the typing itself is
                decorative and the full text is in the DOM from the start. */}
            <blockquote aria-live="polite" className="mt-4">
              <p className="font-display measure text-[clamp(22px,3vw,34px)] leading-[1.25] text-text">
                <span className="type-line">{active.quote}</span>
              </p>
            </blockquote>

            <figcaption className="mt-7 text-[14px] text-muted">
              {active.attribution}
            </figcaption>
          </figure>

          {/* Which one you are on, and a way to choose. */}
          <div className="mt-6 flex items-center gap-2.5" role="tablist" aria-label="Situations">
            {VOICES.map((v, i) => (
              /* The dot is 6px tall, which is a target you would miss on a
                 phone. The button is 24px and transparent; the dot inside it
                 is what you see. */
              <button
                key={v.context}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={v.context}
                onClick={() => setIndex(i)}
                /* 24px in both directions: the inactive dot is only 16px
                   wide, so height alone did not make this a real target. */
                className="group flex h-6 min-w-6 items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-10 bg-mark" : "w-4 bg-line group-hover:bg-line-strong"
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-[12px] text-faint">
              {paused ? "Paused" : `${index + 1} of ${VOICES.length}`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
