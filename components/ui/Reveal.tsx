"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Reveals its children once, when they first come into view.
 *
 * Scroll-driven rather than on-mount, because a list of forty meetings that
 * all animate at once on load is a flash, not an arrival -- and anything
 * below the fold would have finished animating before you ever saw it.
 *
 * It fires once and then stops observing. Re-animating on every pass turns a
 * page you are scrolling through into a page that keeps interrupting you,
 * which is the failure mode of most scroll animation.
 *
 * The class is added rather than state being set, so this costs one DOM write
 * per element and no re-render. `prefers-reduced-motion` is honoured by the
 * global rule that collapses every duration, and the element is visible from
 * the start either way -- it can never trap content at opacity zero.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  /** How much of the element must be showing before it counts as seen. */
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

    /* No observer support, or already on screen at load: show it and stop. */
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
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A list whose children arrive one after another.
 *
 * The stagger is capped: past about ten items the tail is still animating
 * long after you have started reading, so everything beyond the cap arrives
 * with the last staggered item rather than continuing to count.
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
