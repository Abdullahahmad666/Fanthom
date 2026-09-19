"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Info, Play, UserRound, Users } from "lucide-react";
import { Starfield } from "./Starfield";

type Pillar = {
  id: string;
  title: string;
  eyebrow: string;
  body: string;
  /** Eyebrow + CTA colour, and the three concentric planet rings. */
  accent: string;
  cta: string;
  rings: [string, string, string];
};

const PILLARS: Pillar[] = [
  {
    id: "clarity",
    title: "Clarity",
    eyebrow: "Unforgettable meetings…quite literally",
    body: "Shockingly accurate transcripts, instant summaries, and action items with consistent quality across every call – delivered straight to your inbox, like magic.",
    accent: "#73BFFF",
    cta: "linear-gradient(90deg,#a9d5ff,#73bfff)",
    rings: ["#74C1FE", "#88DFFD", "#A2FFFF"],
  },
  {
    id: "momentum",
    title: "Momentum",
    eyebrow: "Eliminate overhead & maximize productivity",
    body: "'Ask Fathom' anything about your meetings – a place to search everything, and get customizable AI summaries tailored to your team's workflow and priorities so you spend less time searching and more time doing.",
    accent: "#EDEFA6",
    cta: "linear-gradient(90deg,#f5f7bf,#edefa6)",
    rings: ["#D87E33", "#B55D0A", "#EAB569"],
  },
  {
    id: "ease",
    title: "Ease",
    eyebrow: "Works wherever you do",
    body: "Meeting notes, insights and action items sync automatically with your tools – Slack, Salesforce, HubSpot, Notion, Asana, and beyond – without you lifting a finger.",
    accent: "#F0B6D0",
    cta: "linear-gradient(90deg,#f7cfe0,#f0b6d0)",
    rings: ["#6A4BC8", "#A581FA", "#E1BBFB"],
  },
];

/**
 * The Clarity / Momentum / Ease section.
 *
 * Driven by scroll rather than clicks: the section is three viewports tall with
 * a sticky stage inside it, and scroll position picks the active pillar. Each
 * pillar brings its own accent colour, planet rings and product card.
 *
 * Clicking a heading still works, for keyboard users and anyone who would
 * rather not scroll through it.
 */
export function PillarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const progress = -el.getBoundingClientRect().top / travel;
      const clamped = Math.min(Math.max(progress, 0), 0.999);
      setActive(Math.floor(clamped * PILLARS.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + (travel * (i + 0.5)) / PILLARS.length,
      behavior: "smooth",
    });
  };

  const p = PILLARS[active];

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Starfield />

        {/* Gradient slab the planet sits on, bleeding off the right edge. */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-0 hidden h-[78%] w-[46%] -translate-y-1/2 rounded-l-[80px] lg:block"
          style={{ background: "linear-gradient(160deg,#f0b6d0 0%,#c084fc 45%,#8b2ff5 100%)" }}
        />

        <div className="relative mx-auto grid w-full max-w-[1560px] items-center gap-20 px-10 xl:gap-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Pillars */}
          <div className="space-y-6">
            {PILLARS.map((pillar, i) => {
              const isActive = i === active;
              return (
                <div key={pillar.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-expanded={isActive}
                    className={`block text-left text-[clamp(38px,5vw,60px)] leading-none transition-colors duration-300 ${
                      isActive ? "text-fg" : "text-[#6b6b70] hover:text-fg-muted"
                    }`}
                  >
                    {pillar.title}
                  </button>

                  <div
                    className={`grid transition-all duration-500 ${
                      isActive
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[17px]" style={{ color: pillar.accent }}>
                        ✦ {pillar.eyebrow}
                      </p>
                      <p className="mt-4 max-w-[540px] text-[18px] leading-relaxed text-fg">
                        {pillar.body}
                      </p>
                      <Link
                        href="/signup"
                        className="mt-7 inline-flex rounded-full px-7 py-3.5 text-[15px] font-semibold tracking-wide text-black uppercase transition-opacity hover:opacity-90"
                        style={{ background: pillar.cta }}
                      >
                        Get started. It&apos;s free.
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Planet + product card */}
          <div className="relative hidden h-[620px] lg:block">
            <div
              className="absolute top-1/2 left-0 aspect-square w-[620px] -translate-y-1/2 rounded-full border-[6px] border-[#f8f5f5] transition-colors duration-500"
              style={{ background: p.rings[0] }}
            >
              <span
                className="absolute inset-[13%] rounded-full transition-colors duration-500"
                style={{ background: p.rings[1] }}
              />
              <span
                className="absolute inset-[30%] rounded-full transition-colors duration-500"
                style={{ background: p.rings[2] }}
              />
            </div>

            <div className="absolute top-1/2 left-[90px] w-[640px] -translate-y-1/2 overflow-hidden rounded-2xl bg-[#1c1b20] p-6 shadow-2xl">
              {p.id === "clarity" && <ClarityCard />}
              {p.id === "momentum" && <MomentumCard />}
              {p.id === "ease" && <EaseCard />}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function ClarityCard() {
  return (
    <div className="text-fg">
      <div className="flex items-baseline gap-4">
        <h3 className="text-[22px] font-bold">Summary</h3>
        <span className="text-[14px] text-fg-muted underline underline-offset-2">
          Change Template
        </span>
      </div>

      <p className="mt-5 text-[15px] font-bold">Meeting Purpose</p>
      <Bullet>Quarterly sales performance review of ThinkBionics</Bullet>

      <p className="mt-4 text-[15px] font-bold">Topics:</p>
      <p className="mt-3 text-[15px] font-bold">New Feature Launch Impact:</p>
      <p className="mt-2 flex gap-2 text-[15px] leading-snug text-[#73BFFF]">
        <Play className="mt-1 h-3.5 w-3.5 shrink-0 fill-current" />
        The recent release of the AI-driven analytics module positively impacted user
        engagement and retention.
      </p>
      <Bullet>
        Several users provided positive feedback regarding the ease of use and the added
        value this feature brings to their operations.
      </Bullet>

      <p className="mt-4 text-[15px] font-bold">Customer Feedback Insights:</p>
      <Bullet>
        A summary of user feedback revealed a consistent demand for enhanced mobile
        compatibility.
      </Bullet>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 flex gap-2.5 text-[15px] leading-snug text-fg">
      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-fg-muted" />
      <span>{children}</span>
    </p>
  );
}

const INTEGRATIONS = [
  { name: "Slack", body: "Automatically send highlights to Slack in real-time.", mark: "#4A154B", label: "S" },
  { name: "Salesforce", body: "Sync call summaries & highlights to matching Contacts, Accounts, and open Opportunities.", mark: "#00A1E0", label: "SF" },
  { name: "HubSpot", body: "Sync call summaries & highlights to matching Contacts, Accounts, and open Opportunities.", mark: "#FF7A59", label: "H" },
];

function MomentumCard() {
  return (
    <div>
      <p className="section-label mb-4">Integrations</p>
      <div className="space-y-2.5">
        {INTEGRATIONS.map((it) => (
          <div key={it.name} className="flex gap-3 rounded-xl bg-[#232228] p-3.5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
              style={{ background: it.mark }}
            >
              {it.label}
            </span>
            <span className="min-w-0">
              <span className="block text-[16px] font-bold text-fg">{it.name}</span>
              <span className="block text-[14px] leading-snug text-fg-muted">
                {it.body} <Info className="inline h-3 w-3" />
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-6 text-[15px] font-bold text-fg-muted">
        <span className="text-[#00A1E0]">salesforce</span>
        <span className="text-[#FF7A59]">HubSpot</span>
        <span className="text-[#6BBF59]">Asana</span>
        <span className="text-fg">_zapier</span>
      </div>
    </div>
  );
}

function EaseCard() {
  return (
    <div className="text-center">
      <p className="text-[14px] tracking-[0.06em] text-fg-muted uppercase">
        Personalizing your account
      </p>
      <h3 className="mt-3 text-[22px] text-fg">How are you planning to use Fathom?</h3>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {[
          { Icon: UserRound, title: "By Myself", body: "Record, transcribe & manage your meetings with AI-powered insights.", on: false },
          { Icon: Users, title: "With My Team", body: "Collaborate effortlessly. Share and organize meetings in one place.", on: true },
        ].map(({ Icon, title, body, on }) => (
          <div
            key={title}
            className={`rounded-xl px-5 py-6 ${
              on ? "bg-[#232228] ring-2 ring-[#73BFFF]" : "bg-[#232228]"
            }`}
          >
            <Icon className={`mx-auto h-7 w-7 ${on ? "text-fg" : "text-fg-muted"}`} strokeWidth={1.6} />
            <p className={`mt-3 text-[17px] font-bold ${on ? "text-fg" : "text-fg-muted"}`}>
              {title}
            </p>
            <p className="mt-2 text-[13px] leading-snug text-fg-muted">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-[#73BFFF] py-3 text-[17px] font-bold text-[#73BFFF]">
        Continue
      </div>
    </div>
  );
}
