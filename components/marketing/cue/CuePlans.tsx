"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Hammer } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Cue's plans.
 *
 * The page this replaces listed the reference product's tiers and features --
 * bot capture, CRM sync, conversational analytics -- none of which Cue does.
 * Pricing that describes another product's feature set is the least useful
 * page a product can ship, so these are Cue's own.
 *
 * Every row is marked for whether it is built or planned, and the marks are
 * accurate. A pricing page is where a product is most tempted to describe
 * itself in the future tense; saying which half is which costs nothing and is
 * the only version of this page worth showing.
 */

type Row = { label: string; built: boolean };
type Plan = {
  name: string;
  blurb: string;
  monthly: number;
  annual: number;
  cta: string;
  href: string;
  featured?: boolean;
  inherits?: string;
  rows: Row[];
};

const PLANS: Plan[] = [
  {
    name: "Free",
    blurb: "Everything the product currently does.",
    monthly: 0,
    annual: 0,
    cta: "Start importing",
    href: "/import",
    rows: [
      { label: "Import VTT, SRT and plain transcripts", built: true },
      { label: "Extractive notes: decisions, risks, actions", built: true },
      { label: "Every line carries its timestamps", built: true },
      { label: "Moment search across all meetings", built: true },
      { label: "Clips and playlists", built: true },
      { label: "Light and dark", built: true },
    ],
  },
  {
    name: "Pro",
    blurb: "For people whose week is mostly meetings.",
    monthly: 12,
    annual: 9,
    cta: "Start free trial",
    href: "/signup",
    featured: true,
    inherits: "Everything in Free",
    rows: [
      { label: "Unlimited meeting history", built: true },
      { label: "Export notes to Markdown", built: false },
      { label: "Recording upload alongside the transcript", built: false },
      { label: "Saved searches and alerts", built: false },
    ],
  },
  {
    name: "Team",
    blurb: "For a group that needs one shared record.",
    monthly: 20,
    annual: 16,
    cta: "Talk to us",
    href: "/signup",
    inherits: "Everything in Pro",
    rows: [
      { label: "Shared meeting library", built: false },
      { label: "Per-meeting access control", built: false },
      { label: "SSO and SCIM", built: false },
      { label: "Audit log", built: false },
    ],
  },
];

export function CuePlans() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="px-6 pt-16 pb-24 sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="text-center">
          <p className="section-label">Pricing</p>
          <h1 className="font-display mx-auto mt-3 max-w-[18ch] text-[clamp(34px,4.8vw,58px)] leading-[1.08] tracking-[-0.02em] text-text">
            Pay for the meetings, not the promises.
          </h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-[16px] leading-relaxed text-muted">
            Nothing is billed — Cue is a portfolio build. These are the plans it
            would ship with, and every row says whether it exists today.
          </p>
        </Reveal>

        {/* Billing switch. A real control over real numbers rather than a
            label change: the per-seat prices below actually differ. */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className={`text-[14px] ${annual ? "text-faint" : "text-text"}`}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Bill annually"
            onClick={() => setAnnual((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              annual ? "bg-accent" : "bg-line-strong"
            }`}
          >
            <span
              className="absolute top-1 h-4 w-4 rounded-full bg-[var(--cue-surface)] transition-[left] duration-200"
              style={{ left: annual ? 24 : 4 }}
            />
          </button>
          <span className={`text-[14px] ${annual ? "text-text" : "text-faint"}`}>
            Annually <span className="text-mark">save 25%</span>
          </span>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90} className="flex">
              <PlanCard plan={p} annual={annual} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-faint">
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-positive" strokeWidth={2.5} />
            Built and working today
          </span>
          <span className="flex items-center gap-2">
            <Hammer className="h-4 w-4 text-faint" strokeWidth={2} />
            Planned, not yet built
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const price = annual ? plan.annual : plan.monthly;

  return (
    <article
      className={`flex flex-1 flex-col rounded-xl border bg-surface px-7 pt-7 pb-8 ${
        plan.featured ? "border-accent" : "border-line"
      }`}
    >
      <div className="flex items-center gap-3">
        <h2 className="text-[17px] font-semibold text-text">{plan.name}</h2>
        {plan.featured && (
          <span className="rounded-full bg-accentsoft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
            Most useful
          </span>
        )}
      </div>
      <p className="mt-2 text-[13.5px] leading-snug text-muted">{plan.blurb}</p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-[42px] leading-none text-text">
          {price === 0 ? "Free" : `$${price}`}
        </span>
        {price > 0 && (
          <span className="text-[13px] text-faint">/ month / person</span>
        )}
      </p>

      <Link
        href={plan.href}
        className={`press mt-7 inline-flex items-center justify-center rounded-lg px-5 py-3 text-[14px] font-semibold transition-colors ${
          plan.featured
            ? "bg-accent text-on-accent hover:bg-accent-hover"
            : "border border-line text-text hover:border-line-strong"
        }`}
      >
        {plan.cta}
      </Link>

      {plan.inherits && (
        <p className="mt-7 text-[13px] font-medium text-muted">{plan.inherits}, plus:</p>
      )}

      <ul className={`space-y-3 ${plan.inherits ? "mt-3" : "mt-7"}`}>
        {plan.rows.map((r) => (
          <li key={r.label} className="flex gap-2.5 text-[13.5px] leading-snug">
            {r.built ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-positive" strokeWidth={2.5} />
            ) : (
              <Hammer className="mt-0.5 h-4 w-4 shrink-0 text-faint" strokeWidth={2} />
            )}
            <span className={r.built ? "text-muted" : "text-faint"}>{r.label}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
