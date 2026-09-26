"use client";

import { useEffect, useRef, useState } from "react";
import { CueMark } from "@/components/brand/CueMark";
import { Reveal } from "@/components/ui/Reveal";
import { SOURCES } from "@/lib/sources";

/**
 * Four sources, one place they arrive.
 *
 * The section this takes its shape from wired six app icons into a hub, which
 * implied six live integrations. Here the same diagram is literally true: each
 * of these tools writes a transcript, and Cue reads all four formats. Nothing
 * is connected, nothing is authorised, and the picture says so -- the lines run
 * inward only, because that is the whole direction of travel.
 *
 * The wires draw as you scroll to them, using `pathLength="1"` so the dash
 * maths is the same for every line regardless of its real length -- the two
 * short diagonals and the two long ones fill at the same rate, which is what
 * makes them read as one diagram assembling rather than four lines racing.
 *
 * Hovering a source sends a pulse down its wire toward the hub. That is the
 * claim restated as a gesture: this file, into Cue.
 */

/*
 * A 100x64 field. The hub sits at the centre, the sources at the corners.
 *
 * These are viewBox units, and the y axis runs 0..64 while x runs 0..100 --
 * so a y of 32 is halfway down, not 32% down. The SVG handles that itself;
 * CSS percentages do not, which is why `pct()` exists. Positioning the cards
 * with `top: 32%` put every one of them a sixth of the field above the line
 * that was supposed to reach it: the wires were correct and the HTML was not.
 */
const FIELD_H = 52;
const pct = (y: number) => `${(y / FIELD_H) * 100}%`;

const HUB = { x: 50, y: 26 };
const POS = [
  { x: 14, y: 7 },
  { x: 86, y: 7 },
  { x: 14, y: 45 },
  { x: 86, y: 45 },
];

export function SourcesHub() {
  const [active, setActive] = useState<number | null>(null);
  const field = useRef<SVGSVGElement>(null);

  /*
   * Start the wires when the diagram is actually on screen.
   *
   * A class rather than state: this only ever needs to happen once, and adding
   * a class costs one DOM write where a re-render would rebuild the whole
   * diagram. The wires are drawn from the first paint if the observer is
   * unavailable, so the picture is never left half-built.
   */
  useEffect(() => {
    const el = field.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-drawn");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-drawn");
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="sources"
      className="scroll-mt-24 overflow-hidden px-6 py-24 sm:px-10"
      aria-labelledby="sources-heading"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="reveal-lead max-w-[52ch]">
          <p className="section-label">Sources</p>
          <h2
            id="sources-heading"
            className="write-on font-display mt-3 text-[clamp(30px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text"
          >
            Works wherever you already meet.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted">
            There is nothing to connect and no permissions to grant. Cue reads
            the transcript your conferencing tool already wrote — including for
            meetings that happened before you had heard of Cue.
          </p>
        </Reveal>

        {/* The diagram. Hidden below lg, where four corners and a centre will
            not fit without becoming a diagram of nothing; the list below is
            the real content at every size. */}
        <Reveal
          delay={120}
          className="hub-field relative mt-16 hidden aspect-[100/52] w-full lg:block"
        >
          <svg
            ref={field}
            viewBox="0 0 100 52"
            className="wire-field absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {POS.map((p, i) => (
              <g key={SOURCES[i].id}>
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={HUB.x}
                  y2={HUB.y}
                  pathLength={1}
                  className="wire"
                  style={{ animationDelay: `${i * 130}ms` }}
                  stroke="var(--cue-line-strong)"
                  strokeWidth={1.25}
                  vectorEffect="non-scaling-stroke"
                />
                {/* The pulse. Sits on top of the wire and only runs while its
                    source is hovered. */}
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={HUB.x}
                  y2={HUB.y}
                  pathLength={1}
                  className={active === i ? "wire-pulse is-live" : "wire-pulse"}
                  stroke={SOURCES[i].tint}
                  strokeWidth={3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>

          {/* The hub. */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${HUB.x}%`, top: pct(HUB.y) }}
          >
            <span
              data-hub
              className={`flex h-24 w-24 items-center justify-center rounded-full border bg-surface transition-[box-shadow,border-color] duration-500 ${
                active !== null
                  ? "border-mark shadow-[0_0_0_10px_var(--cue-mark-soft)]"
                  : "border-line"
              }`}
            >
              <CueMark className="h-10 w-10 text-mark" />
            </span>
            <span className="absolute inset-x-0 -bottom-8 text-center text-[13px] font-medium text-text">
              Cue
            </span>
          </div>

          {POS.map((p, i) => {
            const s = SOURCES[i];
            return (
              <button
                key={s.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${s.name}: ${s.path}`}
                className="card-cue absolute w-[248px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface p-4 text-left"
                style={{ left: `${p.x}%`, top: pct(p.y) }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="h-1.5 w-6 shrink-0 rounded-full"
                    style={{ background: s.tint }}
                  />
                  <span className="text-[15px] font-semibold text-text">{s.name}</span>
                  <span className="ml-auto text-[11px] tracking-[0.06em] text-mark">
                    {s.file}
                  </span>
                </span>
                <span className="mt-2.5 block text-[12.5px] leading-relaxed text-muted">
                  {s.path}
                </span>
              </button>
            );
          })}
        </Reveal>

        {/* Every size gets this; below lg it is the only version. */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:hidden">
          {SOURCES.map((s) => (
            <Reveal key={s.id} className="card-cue bg-surface p-6">
              <span
                aria-hidden
                className="block h-1.5 w-9 rounded-full"
                style={{ background: s.tint }}
              />
              <h3 className="mt-4 text-[16px] font-semibold text-text">{s.name}</h3>
              <p className="mt-1 text-[12px] tracking-[0.06em] text-mark">{s.file}</p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{s.path}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
