"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Holds a section's place until it is nearly on screen, then mounts it.
 *
 * `next/dynamic` alone does not help here. A lazily-imported component that
 * is still part of the first render tree is needed immediately, so its chunk
 * is fetched on load anyway -- measured, it deferred exactly nothing. The
 * code only stays out of the initial load if the component is not rendered
 * yet, which is what this does.
 *
 * `minHeight` is required rather than optional: a placeholder that collapses
 * makes the scrollbar jump as each section mounts, and a page that resizes
 * under your thumb is worse than one that loads slightly more code.
 *
 * It mounts 500px early, so the section is ready by the time it is looked at
 * rather than assembling in front of you.
 */
export function LazySection({
  children,
  minHeight,
  rootMargin = "500px",
  id,
}: {
  children: ReactNode;
  minHeight: number;
  rootMargin?: string;
  /** Anchor target. Lives on the wrapper, which exists before the section
      does, so an in-page link works while the chunk is still loading. */
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Without observer support, render it anyway: a missing section is a
       broken page, while extra code is only slower. Deferred by a tick so
       this is a callback rather than a synchronous set during the effect. */
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        io.disconnect();
      },
      { rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  /*
   * The floor stays on after mounting, and that is the whole trick.
   *
   * Releasing it at `show` looks harmless and is not: `next/dynamic` renders
   * nothing while its chunk is in flight, so the reserved height disappeared a
   * moment before the content arrived to replace it. The page collapsed by the
   * height of one section, which pulled the next section up into the observer's
   * margin, which mounted it, which collapsed the page again -- measured, all
   * five sections mounted on load without a single scroll, and the deferral
   * that this component exists to provide was worth exactly zero bytes.
   *
   * As a permanent floor it cannot do that. min-height is inert once the real
   * content is taller, and the values passed in are the smallest height each
   * section takes across the widths it was measured at, so it never pads.
   */
  return (
    <div ref={ref} id={id} style={{ minHeight }}>
      {show ? children : null}
    </div>
  );
}
