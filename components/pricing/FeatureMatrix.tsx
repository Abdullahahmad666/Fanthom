"use client";

import { useState } from "react";
import { ChevronUp, Info } from "lucide-react";

/**
 * The five-plan feature comparison.
 *
 * Header and body are separate grids sharing one column template, because a
 * sticky row inside a single grid does not stick -- and the header has to
 * stay put or the checkmarks halfway down the table belong to nothing.
 *
 * Each plan column carries its own tint all the way down, which is what lets
 * you track a column across forty rows without a hairline every few pixels.
 */

const COLS = "minmax(230px,1.45fr) repeat(5, minmax(110px,1fr))";

type Cell = boolean | "soon" | "paid" | string;

const PLANS = [
  { name: "Free", cta: "Get started", head: "bg-[#1b1b1d] text-fg", body: "bg-transparent", pill: "border-white/60 text-fg" },
  { name: "Premium", cta: "Start free trial", head: "bg-[#1b1b1d] text-fg", body: "bg-white/[0.02]", pill: "border-white/60 text-fg" },
  {
    name: "Team",
    cta: "Start free trial",
    head: "bg-gradient-to-r from-[#E8821E] to-[#F5DC7A] text-black",
    body: "bg-[rgba(232,130,30,0.13)]",
    pill: "border-black/70 text-black",
  },
  {
    name: "Business",
    cta: "Start free trial",
    head: "bg-[#7CC4FB] text-black",
    body: "bg-[rgba(124,196,251,0.11)]",
    pill: "border-black/70 text-black",
  },
  {
    name: "Enterprise",
    cta: "Contact sales",
    head: "bg-[#8B18F5] text-white",
    body: "bg-[rgba(139,24,245,0.16)]",
    pill: "border-white/70 text-white",
  },
];

type Row = { label: string; note?: string; info?: boolean; cells: Cell[] };
type Group = { title: string; rows: Row[] };

const yes: Cell[] = [true, true, true, true, true];
const teamUp: Cell[] = [false, false, true, true, true];
const premiumUp: Cell[] = [false, true, true, true, true];
const businessUp: Cell[] = [false, false, false, true, true];
const enterpriseOnly: Cell[] = [false, false, false, false, true];

const GROUPS: Group[] = [
  {
    title: "Capturing & managing content",
    rows: [
      {
        label: "NEW! Choice of bot-free* and bot capture-types",
        note: "(*Beta feature for Mac)",
        cells: yes,
      },
      { label: "Recordings & call storage (unlimited)", cells: yes },
      { label: "Transcription (unlimited)", cells: yes },
      { label: "Call downloads and clips (unlimited)", cells: yes },
      { label: "Playlists of clips & highlights for your meetings", cells: yes },
      {
        label: "Playlists of clips & highlights for all team meetings",
        info: true,
        cells: teamUp,
      },
    ],
  },
  {
    title: "Insights",
    rows: [
      { label: "Automated summaries", info: true, cells: yes },
      {
        label: "Advanced summaries",
        info: true,
        cells: ["soon", true, true, true, true],
      },
      { label: "AI action items", info: true, cells: premiumUp },
      { label: "AI follow-up emails", cells: premiumUp },
      { label: "Coaching metrics", info: true, cells: businessUp },
      { label: "Custom summaries", info: true, cells: enterpriseOnly },
    ],
  },
  {
    title: "Search, discovery & alerts",
    rows: [
      { label: "Attendee and keyword search in your meetings", cells: yes },
      { label: "Ask Fathom: AI within a single call", info: true, cells: yes },
      {
        label: "Account-wide Ask Fathom: AI for all calls",
        note: "(*Beta feature)",
        info: true,
        cells: teamUp,
      },
      { label: "Attendee and keyword search in all team meetings", cells: teamUp },
      { label: "AI search alerts", info: true, cells: teamUp },
      { label: "Keyword alerts", info: true, cells: teamUp },
    ],
  },
  {
    title: "Team workspace",
    rows: [
      { label: "Team members", cells: teamUp },
      { label: "Team recordings view", cells: teamUp },
      { label: "Team folders", cells: teamUp },
      { label: "Comments & mentions", cells: teamUp },
      { label: "Customer view", info: true, cells: teamUp },
      { label: "Deal view", info: true, cells: businessUp },
    ],
  },
  {
    title: "Admin, integrations & security",
    rows: [
      { label: "NEW! Claude & ChatGPT Integrations", info: true, cells: yes },
      { label: "Zapier, Make & other automation integrations", info: true, cells: yes },
      { label: "Slack integration", cells: yes },
      { label: "Public API & MCP", info: true, cells: yes },
      {
        label: "CRM syncs",
        info: true,
        cells: ["Max 3 users/ domain", "Max 3 users/ domain", "Max 3 users/ domain", true, true],
      },
      { label: "Disable in-meeting banner", cells: premiumUp },
      { label: "Custom bot name", cells: premiumUp },
      { label: "CRM Field sync", info: true, cells: businessUp },
      {
        label: "Launch Assist Onboarding",
        info: true,
        cells: [false, false, false, "paid", true],
      },
      { label: "Custom data retention policies", cells: enterpriseOnly },
      { label: "Single sign-on integration", cells: enterpriseOnly },
      { label: "Okta SCIM provisioning", cells: enterpriseOnly },
      { label: "Organization wide security controls", cells: enterpriseOnly },
      { label: "Increased cyber security insurance coverage", cells: enterpriseOnly },
      { label: "Custom contracts & red-line support", cells: enterpriseOnly },
      { label: "Dedicated Customer Success & channel", cells: enterpriseOnly },
      { label: "HIPAA: signed BAA", cells: enterpriseOnly },
    ],
  },
];

export function FeatureMatrix() {
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 pb-24">
      <p className="text-center text-[15px] text-[#EDEFA6]">✦ Features</p>
      <h2 className="mt-3 text-center text-[clamp(30px,4.4vw,56px)] leading-tight font-light text-fg">
        Meet your brilliant AI meeting partner
      </h2>

      <div className="mt-12 overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Plan header. Sticks so the columns stay named all the way down. */}
          <div
            style={{ gridTemplateColumns: COLS }}
            className="sticky top-0 z-20 grid overflow-hidden rounded-t-2xl"
          >
            <span className="bg-black" />
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col items-center gap-3 px-3 py-5 ${p.head}`}
              >
                <span className="text-[24px] font-medium">{p.name}</span>
                <span
                  className={`rounded-full border px-5 py-2 text-[13px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase ${p.pill}`}
                >
                  {p.cta}
                </span>
              </div>
            ))}
          </div>

          {GROUPS.map((g) => {
            const open = !closed[g.title];
            return (
              <div key={g.title}>
                <button
                  type="button"
                  onClick={() => setClosed((c) => ({ ...c, [g.title]: open }))}
                  aria-expanded={open}
                  className="flex items-center gap-2 py-4 pl-2 text-[15px] font-semibold tracking-[0.08em] text-fg uppercase"
                >
                  <ChevronUp
                    className={`h-4 w-4 transition-transform ${open ? "" : "rotate-180"}`}
                  />
                  {g.title}
                </button>

                {open &&
                  g.rows.map((row) => (
                    <div
                      key={row.label}
                      style={{ gridTemplateColumns: COLS }}
                      className="grid border-t border-white/8"
                    >
                      <div className="flex items-center gap-2 py-4 pr-4 pl-4">
                        <span className="min-w-0 text-[15px] leading-snug text-fg">
                          {row.label}
                          {row.note && (
                            <span className="block text-[12px] text-fg-muted">{row.note}</span>
                          )}
                        </span>
                        {row.info && (
                          <Info className="h-3.5 w-3.5 shrink-0 text-fg-dim" strokeWidth={2} />
                        )}
                      </div>

                      {row.cells.map((cell, i) => (
                        <div
                          key={PLANS[i].name}
                          className={`flex items-center justify-center px-2 py-4 text-center ${PLANS[i].body}`}
                        >
                          <CellMark value={cell} />
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CellMark({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#F4EFA0]">
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-label="Included">
          <path
            d="M3.5 8.5 6.5 11.5 12.5 4.5"
            fill="none"
            stroke="#111"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (value === false) {
    return (
      <span
        aria-label="Not included"
        className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-white/35"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M4.5 4.5l7 7M11.5 4.5l-7 7"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  if (value === "soon") {
    return (
      <span className="text-[17px] text-fg-muted" title="Coming soon">
        ⧗
      </span>
    );
  }

  if (value === "paid") {
    return (
      <span className="text-[17px] text-fg" title="Available as a paid add-on">
        $
      </span>
    );
  }

  return <span className="text-[13px] leading-snug text-fg">{value}</span>;
}
