"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CueMark } from "@/components/brand/CueMark";
import { Starfield } from "./Starfield";

/**
 * Diagram coordinate space. Pills are positioned as percentages of the same
 * box the SVG uses, so HTML and vector stay aligned at any width.
 */
const VB = { w: 1000, h: 355 };
const HUB = { x: 504, y: 184, r: 82 };

type Node = {
  id: string;
  label: string;
  side: "left" | "right";
  /** Pill edge the connector leaves from. */
  x: number;
  y: number;
  /** Where the connector meets the hub. */
  hx: number;
  hy: number;
  Icon: () => React.ReactElement;
};

const NODES: Node[] = [
  { id: "meet", label: "Google Meet", side: "left", x: 320, y: 70, hx: 462, hy: 122, Icon: MeetIcon },
  { id: "zoom", label: "Zoom", side: "left", x: 224, y: 185, hx: 432, hy: 200, Icon: ZoomIcon },
  { id: "gmail", label: "Gmail", side: "left", x: 276, y: 316, hx: 462, hy: 246, Icon: GmailIcon },
  { id: "slack", label: "Slack", side: "right", x: 776, y: 28, hx: 566, hy: 133, Icon: SlackIcon },
  { id: "teams", label: "Microsoft Teams", side: "right", x: 783, y: 170, hx: 586, hy: 186, Icon: TeamsIcon },
  { id: "asana", label: "Asana", side: "right", x: 735, y: 323, hx: 566, hy: 238, Icon: AsanaIcon },
];

/** Gap between two connectors starting, and how long one takes to draw. */
const STAGGER = 170;
const DRAW = 780;
/** The endpoint lands just before its line finishes arriving. */
const ARRIVE = DRAW - 140;
const ALL_IN = (NODES.length - 1) * STAGGER + DRAW;

const lengthOf = (n: Node) => Math.hypot(n.hx - n.x, n.hy - n.y);

export function WorksWhereYouMeet() {
  const [hovered, setHovered] = useState<string | null>(null);

  /**
   * The six apps wire themselves to the hub when the diagram comes into view,
   * one after another, rather than being drawn already. It is the one moment
   * on the page where the product's claim -- that it plugs into what you
   * already use -- can be shown instead of stated.
   *
   * Fires once. Re-running it on every pass would turn a flourish into a tic
   * for anyone scrolling back up.
   */
  const [connected, setConnected] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = diagramRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setConnected(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setConnected(true);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden px-10 py-28">
      <Starfield />

      <div className="relative mx-auto max-w-[1240px]">
        <p className="text-center text-[15px] text-[#EDEFA6]">
          ✦ Zero friction, maximum flexibility.
        </p>
        <h2 className="mt-3 text-center text-[clamp(28px,3.2vw,40px)] font-light text-fg">
          Works where you meet
        </h2>

        {/* Diagram */}
        <div
          ref={diagramRef}
          className="relative mx-auto mt-10 w-full max-w-[1000px]"
          style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
        >
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <pattern id="wwym-grid" width="34" height="34" patternUnits="userSpaceOnUse">
                <path d="M34 0H0V34" fill="none" stroke="#6d4bd8" strokeWidth="0.5" opacity="0.28" />
              </pattern>
              <radialGradient id="wwym-fade">
                <stop offset="55%" stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <mask id="wwym-mask">
                <rect width={VB.w} height={VB.h} fill="url(#wwym-fade)" />
              </mask>
              <radialGradient id="wwym-glow">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width={VB.w} height={VB.h} fill="url(#wwym-grid)" mask="url(#wwym-mask)" />

            {/* Decorative amber triangle from the source design. */}
            <path
              d="M186 8 L636 196 L536 352 Z"
              fill="none"
              stroke="#c2410c"
              strokeWidth="2"
              opacity="0.75"
            />

            <circle cx={HUB.x} cy={HUB.y} r={HUB.r * 2.1} fill="url(#wwym-glow)" />

            {NODES.map((n, i) => {
              const on = hovered === n.id;
              const len = lengthOf(n);
              const delay = i * STAGGER;
              const ends = { x1: n.x, y1: n.y, x2: n.hx, y2: n.hy };

              return (
                <g key={n.id}>
                  <line
                    {...ends}
                    stroke="#fff"
                    strokeWidth={on ? 1.8 : 1}
                    opacity={hovered && !on ? 0.2 : on ? 1 : 0.65}
                    style={{
                      strokeDasharray: len,
                      strokeDashoffset: connected ? 0 : len,
                      transition: `stroke-dashoffset ${DRAW}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, stroke-width 200ms, opacity 200ms`,
                    }}
                  />

                  {/* Surge tracing the line as it draws, then clearing to
                      leave the white connector behind it. */}
                  {connected && (
                    <line
                      {...ends}
                      stroke="#02beff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: len,
                        animation: `wwym-surge ${DRAW + 320}ms ease-out ${delay}ms both`,
                      }}
                    />
                  )}

                  {/* Charge looping toward the hub while hovered. */}
                  {on && connected && (
                    <line
                      {...ends}
                      stroke="#02beff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      style={{
                        ["--len" as string]: len,
                        strokeDasharray: `14 ${Math.max(len - 14, 1)}`,
                        animation: "wwym-charge 900ms linear infinite",
                      }}
                    />
                  )}

                  <circle
                    cx={n.hx}
                    cy={n.hy}
                    r={on ? 5 : 3.6}
                    fill="#fff"
                    style={{
                      transformBox: "view-box",
                      transformOrigin: `${n.hx}px ${n.hy}px`,
                      transform: connected ? "scale(1)" : "scale(0)",
                      transition: `transform 420ms cubic-bezier(0.34,1.56,0.64,1) ${delay + ARRIVE}ms, r 200ms`,
                      animation: connected
                        ? `wwym-land 900ms ease-out ${delay + ARRIVE}ms both`
                        : undefined,
                    }}
                  />
                </g>
              );
            })}

            <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="#050505" stroke="#2a2a2e" strokeWidth="1" />

            {/* One ring off the hub once the last connector lands. */}
            {connected && (
              <circle
                cx={HUB.x}
                cy={HUB.y}
                r={HUB.r}
                fill="none"
                stroke="#02beff"
                strokeWidth="1.6"
                style={{
                  transformBox: "view-box",
                  transformOrigin: `${HUB.x}px ${HUB.y}px`,
                  animation: `wwym-hub 1500ms ease-out ${ALL_IN - 120}ms both`,
                }}
              />
            )}
          </svg>

          {/* Hub glyph */}
          <span
            className="pointer-events-none absolute flex items-center justify-center"
            style={{
              left: `${(HUB.x / VB.w) * 100}%`,
              top: `${(HUB.y / VB.h) * 100}%`,
              transform: "translate(-50%,-50%)",
            }}
          >
            <CueMark className="h-[clamp(28px,4vw,52px)] w-[clamp(34px,5vw,64px)] text-[#5eb0f5]" />
          </span>

          {/* Pills */}
          {NODES.map((n, i) => {
            const on = hovered === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                /* No transition class: the inline one below staggers the
                   arrival and would override it anyway. */
                className="absolute flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-2.5 text-[clamp(11px,1.1vw,15px)] font-medium whitespace-nowrap text-neutral-900"
                style={{
                  left: `${(n.x / VB.w) * 100}%`,
                  top: `${(n.y / VB.h) * 100}%`,
                  transform: `translate(${n.side === "left" ? "-100%" : "0"},-50%) scale(${
                    connected ? (on ? 1.06 : 1) : 0.9
                  })`,
                  opacity: connected ? 1 : 0,
                  transition: `opacity 420ms ease-out ${i * STAGGER}ms, transform 420ms cubic-bezier(0.34,1.56,0.64,1) ${i * STAGGER}ms, box-shadow 200ms`,
                  boxShadow: on ? "0 0 0 2px #02beff, 0 8px 24px rgba(2,190,255,0.25)" : undefined,
                }}
              >
                <n.Icon />
                {n.label}
              </button>
            );
          })}
        </div>

        <h3 className="mt-14 text-center text-[clamp(26px,3vw,38px)] leading-[1.25] font-light text-fg">
          Cue adapts to
          <br />
          your workflow, not
          <br />
          the other way around.
        </h3>

        <div className="mt-28 text-center">
          <p className="text-[15px] text-[#EDEFA6]">
            ✦ Empower your team&apos;s best work with seriously accurate AI notetaking
          </p>
          <h3 className="mt-3 text-[clamp(28px,3.2vw,40px)] font-light text-fg">
            Every team in flow
          </h3>
          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] px-8 py-3.5 text-[14px] font-semibold tracking-wide text-black uppercase transition-opacity hover:opacity-90"
          >
            Get started. It&apos;s free.
          </Link>
        </div>
      </div>
    </section>
  );
}

/* Simplified brand marks -- recognisable shapes rather than official assets,
   so the page ships no third-party logo files. */

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      {children}
    </svg>
  );
}

function MeetIcon() {
  return (
    <Mark>
      <rect x="2" y="6" width="13" height="12" rx="2.5" fill="#00832D" />
      <path d="M15 10.5 21 7v10l-6-3.5z" fill="#FFBA00" />
      <rect x="2" y="6" width="6" height="12" rx="2.5" fill="#0066DA" />
      <rect x="6" y="6" width="9" height="12" fill="#00832D" />
    </Mark>
  );
}

function ZoomIcon() {
  return (
    <Mark>
      <circle cx="12" cy="12" r="10" fill="#2D8CFF" />
      <path d="M7 9.5h6.2v5H7z" fill="#fff" />
      <path d="M13.6 11.4 17 9.4v5.2l-3.4-2z" fill="#fff" />
    </Mark>
  );
}

function GmailIcon() {
  return (
    <Mark>
      <path d="M3 6.5 12 13l9-6.5V18a1 1 0 0 1-1 1h-2.5v-7L12 16 6.5 12v7H4a1 1 0 0 1-1-1z" fill="#EA4335" />
      <path d="M3 6.5 12 13l9-6.5A1.5 1.5 0 0 0 19.5 5h-15A1.5 1.5 0 0 0 3 6.5z" fill="#D93025" />
      <path d="M17.5 12v7H20a1 1 0 0 0 1-1V6.5z" fill="#34A853" />
      <path d="M3 6.5V18a1 1 0 0 0 1 1h2.5v-7z" fill="#4285F4" />
    </Mark>
  );
}

function SlackIcon() {
  return (
    <Mark>
      <rect x="3" y="10" width="7" height="3" rx="1.5" fill="#36C5F0" />
      <rect x="10.5" y="3" width="3" height="7" rx="1.5" fill="#2EB67D" />
      <rect x="14" y="11" width="7" height="3" rx="1.5" fill="#ECB22E" />
      <rect x="10.5" y="14" width="3" height="7" rx="1.5" fill="#E01E5A" />
    </Mark>
  );
}

function TeamsIcon() {
  return (
    <Mark>
      <rect x="9" y="6" width="12" height="12" rx="2" fill="#5059C9" />
      <text x="15" y="15.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
        T
      </text>
      <circle cx="6" cy="8" r="3" fill="#7B83EB" />
      <rect x="2" y="11" width="8" height="8" rx="2" fill="#7B83EB" />
    </Mark>
  );
}

function AsanaIcon() {
  return (
    <Mark>
      <circle cx="12" cy="6.5" r="3.4" fill="#F06A6A" />
      <circle cx="6.5" cy="15.5" r="3.4" fill="#F06A6A" />
      <circle cx="17.5" cy="15.5" r="3.4" fill="#F06A6A" />
    </Mark>
  );
}
