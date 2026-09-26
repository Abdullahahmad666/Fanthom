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
 * The wires draw as the diagram comes into view, each one from its source
 * toward the hub, staggered so the four arrive in sequence rather than as one
 * flash. Each carries its own length as a custom property; see `lengthTo`.
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

/**
 * Each wire's length, in viewBox units.
 *
 * `pathLength="1"` looked like it would make this unnecessary -- set the dash
 * in normalised units and every line behaves identically regardless of how
 * long it really is. It does not work for dash values set from CSS: measured,
 * `stroke-dasharray: 0.05 0.95` computed to `0.05px, 0.95px` against a path
 * 40.71 units long, so the pattern repeated forty times and the "packet" was a
 * row of forty dots. The base wire had the same problem, which is why its draw
 * animation moved the number without ever looking like drawing.
 *
 * Real lengths, in the units the path is actually in, and the dash maths is
 * honest again.
 */
const lengthTo = (p: { x: number; y: number }) => Math.hypot(HUB.x - p.x, HUB.y - p.y);

/**
 * A dash pattern of exactly one mark per wire.
 *
 * Built here rather than with `calc()` in the stylesheet: measured, a gap
 * written as `calc(var(--len) - 2)` computed to the literal string
 * `calc(38.7063px)` and Chrome did not apply it to stroke-dasharray, falling
 * back to a single value -- which means dash and gap are equal, and the wire
 * becomes a row of evenly spaced dots instead of one travelling packet.
 */
const oneMark = (p: { x: number; y: number }, mark: number) => {
  const len = lengthTo(p);
  return { dash: `${mark} ${Math.max(0, len - mark)}`, len };
};

/**
 * Stroke widths are in viewBox units, not pixels, and none of these lines uses
 * `vectorEffect="non-scaling-stroke"`.
 *
 * That attribute keeps a stroke crisp by measuring it in device pixels -- but
 * it measures the dash pattern there too, while the path length stays in user
 * units. The viewBox is about 12x smaller than the rendered box, so a pattern
 * built to fit the path exactly repeated a dozen times and one travelling
 * packet came out as a row of dots. Measured: dasharray computed correctly to
 * `2px, 38.7063px` on a 40.71-unit path and still rendered as twelve marks.
 *
 * In user units the numbers are small, but the dash maths and the geometry are
 * finally in the same space.
 */
const W = { wire: 0.1, flow: 0.34, pulse: 0.3 };
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
                  className="wire"
                  style={
                    {
                      "--len": lengthTo(p),
                      animationDelay: `${i * 130}ms`,
                    } as React.CSSProperties
                  }
                  stroke="var(--cue-line-strong)"
                  strokeWidth={W.wire}
                />
                {/* The ambient packet. Always travelling, offset per wire so
                    the four never move in step. */}
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={HUB.x}
                  y2={HUB.y}
                  className="wire-flow"
                  strokeDasharray={oneMark(p, 3.2).dash}
                  style={
                    {
                      "--len": lengthTo(p),
                      animationDelay: `${i * 850}ms`,
                    } as React.CSSProperties
                  }
                  stroke="var(--cue-mark)"
                  strokeWidth={W.flow}
                  strokeLinecap="round"
                />
                {/* The pulse. Sits on top of the wire and only runs while its
                    source is hovered. */}
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={HUB.x}
                  y2={HUB.y}
                  className={active === i ? "wire-pulse is-live" : "wire-pulse"}
                  strokeDasharray={oneMark(p, 7).dash}
                  style={{ "--len": lengthTo(p) } as React.CSSProperties}
                  stroke={SOURCES[i].tint}
                  strokeWidth={W.pulse}
                  strokeLinecap="round"
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
                  ? "is-lit border-mark shadow-[0_0_0_10px_var(--cue-mark-soft)]"
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
              /*
               * Two elements, and they must stay two.
               *
               * The positioning uses `-translate-x-1/2 -translate-y-1/2`, which
               * Tailwind v4 compiles to the `translate` property -- the same one
               * card-cue's hover lift uses. On one element the hover overwrote
               * the centring, so the card jumped half its own width away from
               * the pointer, which ended the hover, which snapped it back, which
               * started it again: a flicker that only stopped if you found the
               * spot where both states overlap.
               *
               * The wrapper owns the position and the button owns the hover, so
               * neither can clobber the other.
               */
              <div
                key={s.id}
                className="absolute w-[248px] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: pct(p.y) }}
              >
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${s.name}: ${s.path}`}
                className="card-cue w-full rounded-xl border border-line bg-surface p-4 text-left"
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
              </div>
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
