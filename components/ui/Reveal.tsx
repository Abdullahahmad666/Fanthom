"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Content that arrives as you scroll to it.
 *
 * Two mechanisms, and which one runs is decided by the browser rather than by
 * this component:
 *
 *   - Where CSS view timelines exist, the `.reveal` class is all that is
 *     needed. Progress is tied to the element's position in the viewport, so
 *     it rises as you scroll toward it, settles as it lands, and plays
 *     backwards if you scroll up. No JavaScript runs at all.
 *
 *   - Where they do not, the observer below adds `.revealed` once, which runs
 *     the old time-based animation. The element is visible from the first
 *     paint either way, so a failure here can never trap content at opacity
 *     zero -- it can only mean the content did not animate.
 *
 * The observer is skipped entirely when view timelines are supported, which is
 * why `delay` no longer applies there: a stagger is a property of a trigger,
 * and there is no trigger any more. Scroll position already separates the
 * items, because you reach them one after another.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  /** How much of the element must show before it counts as seen (fallback only). */
  threshold = 0.12,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* The CSS is already handling this one. Touching it here would restart the
       animation on its own clock, which is the exact jitter this replaced. */
    const cssDriven =
      typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()");
    if (cssDriven) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("revealed");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.animationDelay = `${delay}ms`;
        el.classList.add("revealed");
        io.disconnect();
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay, threshold]);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * A list whose items arrive one after another.
 *
 * Kept for the fallback path, where a stagger is still the only way to stop a
 * grid landing as one block. Where motion is scroll-linked the delays are
 * ignored, and scroll position does the separating instead.
 */
export function RevealList({
  children,
  step = 45,
  max = 10,
  className = "",
}: {
  children: ReactNode[];
  step?: number;
  max?: number;
  className?: string;
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} delay={Math.min(i, max) * step} className={className}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
