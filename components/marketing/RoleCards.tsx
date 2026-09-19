"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Starfield } from "./Starfield";

/**
 * "Fathom for your role" -- the horizontal strip of six role cards.
 *
 * Three sit on screen at a time and the strip steps sideways, so the cut-off
 * fourth is what tells you there is more. The arrows disable at the ends
 * rather than wrapping: this is a list you read through, not a loop.
 *
 * Each card's illustration is line art drawn in the card, not an image, so the
 * section ships no assets and the art stays sharp behind the copy.
 */

const CARD_W = 470;
const GAP = 44;
const STEP = CARD_W + GAP;
/** How many fit before the strip needs to move. */
const VISIBLE = 3;

const PINK = "#EDB6CC";
const PURPLE = "#8420F5";

type Role = {
  title: string;
  eyebrow: string;
  body: string;
  cta: string;
  href: string;
  Art: () => ReactNode;
};

const ROLES: Role[] = [
  {
    title: "Sales",
    eyebrow: "Stay sharp, engage deeper, close faster",
    body: "Fathom captures context, tracks engagement and updates your CRM, while you handle the close. AI Scorecards help managers coach with confidence, improving performance effortlessly.",
    cta: "See Fathom for Sales",
    href: "/signup",
    Art: RocketArt,
  },
  {
    title: "Customer Success",
    eyebrow: "Stronger relationships, better retention",
    body: "Fathom captures key moments, surfaces risks and opportunities, automates CRM updates and follow-ups, and spots trends across conversations — so your team can spend less time on admin and more time delivering value.",
    cta: "See Fathom for CS",
    href: "/signup",
    Art: CompassArt,
  },
  {
    title: "Marketing",
    eyebrow: "Less clerical, more creative",
    body: "Spot trending feedback and changes in user sentiment, harvest invaluable insights for content, capture context, campaigns, brainstorms, project calls, and so much more.",
    cta: "See Fathom for Marketing",
    href: "/signup",
    Art: DishArt,
  },
  {
    title: "Operations",
    eyebrow: "Less overhead, more progress",
    body: "Track everything, get clear action points from every conversation, and watch as your team moves from 'we should do that' to 'consider it done'",
    cta: "How it works",
    href: "/signup",
    Art: ConsoleArt,
  },
  {
    title: "HR & Talent",
    eyebrow: "Stronger, happier teams",
    body: "Spot the patterns that predict success, streamline interviews and evaluate candidates with Ask Fathom. Highlights playlists give new employees the tools to flourish.",
    cta: "How it works",
    href: "/signup",
    Art: HelmetArt,
  },
  {
    title: "Product & Engineering",
    eyebrow: "Build what matters",
    body: "Track and synthesize feature requests, monitor user satisfaction, and build the features that matter most to your customers.",
    cta: "How it works",
    href: "/signup",
    Art: HandsArt,
  },
];

const MAX = ROLES.length - VISIBLE;

export function RoleCards() {
  const [i, setI] = useState(0);

  return (
    <section className="relative overflow-hidden bg-black py-20">
      <Starfield />

      <div className="relative mx-auto max-w-[1560px]">
        <div className="flex justify-end gap-3 px-10 pb-8">
          <Arrow label="Previous roles" disabled={i === 0} onClick={() => setI((v) => Math.max(0, v - 1))}>
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </Arrow>
          <Arrow label="More roles" disabled={i === MAX} onClick={() => setI((v) => Math.min(MAX, v + 1))}>
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </Arrow>
        </div>

        <div className="overflow-hidden px-10">
          <div
            className="flex transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${i * STEP}px)` }}
          >
            {ROLES.map((role, n) => (
              <RoleCard key={role.title} role={role} last={n === ROLES.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleCard({ role, last }: { role: Role; last: boolean }) {
  const { title, eyebrow, body, cta, href, Art } = role;

  return (
    <article
      style={{ width: CARD_W, marginRight: last ? 0 : GAP }}
      className="relative h-[452px] shrink-0 overflow-hidden rounded-[30px] ring-1 ring-white/45"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Art />
      </div>

      <div className="relative flex h-full flex-col items-center px-9 pt-11 text-center">
        <h3 className="text-[32px] leading-tight font-light text-fg">{title}</h3>
        <p className="mt-2 text-[15px]" style={{ color: PINK }}>
          ✦ {eyebrow}
        </p>
        <p className="mt-3 text-[16px] leading-[1.45] text-fg">{body}</p>

        <Link
          href={href}
          style={{ background: PURPLE }}
          className="mt-auto mb-12 rounded-full px-8 py-3.5 text-[14px] font-bold tracking-[0.06em] whitespace-nowrap text-white uppercase transition-opacity hover:opacity-90"
        >
          {cta}
        </Link>
      </div>
    </article>
  );
}

function Arrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6C6D7] text-black transition-opacity hover:opacity-90 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------- illustrations */

/**
 * Line art, sized to sit behind the copy and bleed off the card's bottom
 * edge. Faint enough to read as texture rather than competing with the text.
 */
function ArtFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 470 452"
      className="absolute inset-0 h-full w-full opacity-[0.38]"
      fill="none"
      stroke="#cfd4e0"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {children}
    </svg>
  );
}

function RocketArt() {
  return (
    <ArtFrame>
      {/* Nose cone down-left, body climbing to the right */}
      <path d="M118 452 210 330l96-70 60-44c14-10 30 4 22 19l-38 66-64 96-88 122" fill="#15161a" />
      <path d="M306 260 366 216" />
      <path d="M232 318l52 38" />
      <circle cx="286" cy="286" r="22" fill="#1d1f26" />
      <path d="M196 340 148 336l-26 44 44 12" fill="#15161a" />
      <path d="M262 406l4 46 50-12-14-42" fill="#15161a" />
      <path d="m150 452 34-52" stroke="#8b4a2f" />
      <path d="m196 452 26-40" stroke="#8b4a2f" />
    </ArtFrame>
  );
}

function CompassArt() {
  return (
    <ArtFrame>
      {/* Eight-point star, the rest of it clipped by the card */}
      <g transform="translate(235 400)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <path
            key={deg}
            d="M0 0 -20 -60 0 -170 20 -60Z"
            fill="#1b1a20"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="26" fill="#22212a" />
        {Array.from({ length: 24 }, (_, k) => (
          <path key={k} d="M0 -180 0 -212" transform={`rotate(${k * 15})`} strokeWidth="1.4" />
        ))}
      </g>
    </ArtFrame>
  );
}

function DishArt() {
  return (
    <ArtFrame>
      <g transform="translate(250 352)">
        <ellipse rx="150" ry="104" transform="rotate(-24)" fill="#191b24" />
        <ellipse rx="104" ry="70" transform="rotate(-24)" strokeWidth="1.4" />
        <ellipse rx="56" ry="36" transform="rotate(-24)" strokeWidth="1.4" />
        <path d="M0 0 108 -66" />
        <circle cx="118" cy="-72" r="16" fill="#1d1f26" />
        <path d="M-26 62 -10 150M34 44 70 150" />
        <path d="M-60 150h180" />
      </g>
    </ArtFrame>
  );
}

function ConsoleArt() {
  return (
    <ArtFrame>
      {/* Cockpit desk with an astronaut seen from behind */}
      <path d="M0 330h470v122H0z" fill="#221a2c" />
      <path d="M0 330h470" />
      <g strokeWidth="1.6">
        <rect x="26" y="352" width="120" height="78" rx="6" fill="#3a2410" />
        <rect x="166" y="352" width="120" height="78" rx="6" fill="#33200e" />
        <rect x="306" y="352" width="140" height="48" rx="6" fill="#2a1b2e" />
        <path d="M40 386h92M40 404h64M180 372h92M180 392h92M180 412h56" />
        <circle cx="348" cy="424" r="14" fill="#3a2410" />
        <circle cx="392" cy="424" r="14" fill="#3a2410" />
        <circle cx="436" cy="424" r="14" fill="#3a2410" />
      </g>
      <circle cx="150" cy="330" r="66" fill="#171922" />
      <circle cx="150" cy="330" r="46" strokeWidth="1.6" />
      <path d="M62 452c8-56 40-92 88-92s80 36 88 92" fill="#1b1d27" />
    </ArtFrame>
  );
}

function HelmetArt() {
  return (
    <ArtFrame>
      <g transform="translate(235 452)">
        <ellipse rx="150" ry="164" cy="-40" fill="#191920" />
        <ellipse rx="116" ry="118" cy="-62" strokeWidth="1.6" fill="#101017" />
        <path d="M-92 -136a116 116 0 0 1 64-44" strokeWidth="6" stroke="#e9ecf4" opacity="0.6" />
        <path d="M-150 -40h300" strokeWidth="1.4" />
        <path d="M-124 20h248" strokeWidth="1.4" />
      </g>
    </ArtFrame>
  );
}

function HandsArt() {
  return (
    <ArtFrame>
      {/* Gloved hands cradling a device */}
      <g transform="translate(235 300)">
        <rect x="-70" y="-74" width="140" height="96" rx="10" fill="#1c1e27" />
        <circle r="30" cy="-26" fill="#252833" />
        <circle r="16" cy="-26" strokeWidth="1.4" />
        <rect x="-52" y="-96" width="44" height="22" rx="5" fill="#1c1e27" />
        <g strokeWidth="1.8" fill="#1a1c24">
          <path d="M-86 22c-26 6-44 26-44 56v74h74V22Z" />
          <path d="M86 22c26 6 44 26 44 56v74H56V22Z" />
          <path d="M-112 54h56M-112 82h56M56 54h56M56 82h56" strokeWidth="1.4" />
        </g>
      </g>
      <rect x="392" y="286" width="42" height="26" rx="4" strokeWidth="1.4" fill="#1c1e27" />
    </ArtFrame>
  );
}
