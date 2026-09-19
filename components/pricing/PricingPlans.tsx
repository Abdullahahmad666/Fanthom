"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * The plan picker: audience tabs, the billing switch, the free-plan strip and
 * the three cards.
 *
 * Individuals and Teams are different card sets rather than the same cards
 * relabelled -- Team appears in both, but as the top tier on one and the
 * entry tier on the other, with different copy either side. Prices are held
 * as the annual figure plus a monthly one, so the switch changes real numbers
 * instead of a label.
 */

type Plan = {
  audience: string;
  name: string;
  /** Annual and monthly per-user price; 0 renders as "Free forever." */
  annual: number;
  monthly: number;
  minUsers?: string;
  cta: string;
  ctaStyle: "outline" | "solid";
  /** Card edge. The product colour-codes the tiers. */
  edge: string;
  inherits?: string;
  features: string[];
};

const INDIVIDUALS: Plan[] = [
  {
    audience: "For individuals",
    name: "Free",
    annual: 0,
    monthly: 0,
    cta: "Get started",
    ctaStyle: "outline",
    edge: "rgba(255,255,255,0.14)",
    features: [
      "Unlimited recordings + transcriptions",
      "Choice of bot-free (in beta) or bot capture",
      "Instant AI call summaries",
      "Clips, playlists + search across calls",
    ],
  },
  {
    audience: "For individuals",
    name: "Premium",
    annual: 16,
    monthly: 21,
    cta: "Start free trial",
    ctaStyle: "outline",
    edge: "rgba(255,255,255,0.14)",
    inherits: "Everything from Free",
    features: [
      "Advanced call summaries",
      "AI-generated action items",
      "Conversational meeting assistant",
      "Custom meeting bot",
    ],
  },
  {
    audience: "For teams",
    name: "Team",
    annual: 15,
    monthly: 20,
    minUsers: "(2 user min)",
    cta: "Start free team trial (2+ users)",
    ctaStyle: "solid",
    edge: "#E8C64A",
    inherits: "Everything from Premium",
    features: [
      "Global search across calls",
      "Playlists of highlights from meetings",
      "Collaboration using comments, folders, keyword alerts, + more",
    ],
  },
];

const TEAMS: Plan[] = [
  {
    audience: "For teams",
    name: "Team",
    annual: 15,
    monthly: 20,
    minUsers: "(2 user min)",
    cta: "Start free trial",
    ctaStyle: "solid",
    edge: "#E8721E",
    features: [
      "Unlimited meetings captured & instant AI summaries",
      "AI generated action items",
      "Conversational meeting assistant",
      "Playlists of highlights from meetings",
      "Collaboration using comments, folders, keyword alerts, + more",
    ],
  },
  {
    audience: "For teams",
    name: "Business",
    annual: 25,
    monthly: 33,
    minUsers: "(2 user min)",
    cta: "Start free trial",
    ctaStyle: "outline",
    edge: "#4BA3F0",
    inherits: "Everything from Team",
    features: [
      "CRM field sync, updating records after meetings automatically",
      "Deal View summarizing insights",
      "Coaching metrics & AI scorecards",
      "Advanced call summaries, including custom summaries*",
    ],
  },
  {
    audience: "For teams",
    name: "Enterprise",
    annual: 35,
    monthly: 47,
    minUsers: "(2 user min)",
    cta: "Book a meeting",
    ctaStyle: "outline",
    edge: "#8B18F5",
    inherits: "Everything from Business",
    features: [
      "Launch Assist Onboarding Program",
      "Organization-wide security controls",
      "SSO & SCIM provisioning",
      "Custom data retention programs",
      "Dedicated Success Manager & priority Support SLAs",
    ],
  },
];

export function PricingPlans() {
  const [audience, setAudience] = useState<"individuals" | "teams">("individuals");
  const [annual, setAnnual] = useState(true);

  const plans = audience === "individuals" ? INDIVIDUALS : TEAMS;

  return (
    <>
      <div className="flex justify-center">
        <div className="flex rounded-full bg-[#202024] p-1">
          {(["individuals", "teams"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAudience(a)}
              aria-pressed={audience === a}
              className={`rounded-full px-9 py-2.5 text-[17px] capitalize transition-colors ${
                audience === a ? "bg-[#4A6076] text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 text-[17px]">
        <span className={annual ? "text-fg-muted" : "text-fg"}>Monthly</span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-label="Bill annually"
          onClick={() => setAnnual((v) => !v)}
          className="relative h-7 w-[52px] rounded-full bg-black ring-1 ring-white/25"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full transition-all ${
              annual ? "left-[27px] bg-[#4BA3F0]" : "left-1 bg-white"
            }`}
          />
        </button>
        <span className={annual ? "font-bold text-fg" : "text-fg-muted"}>Annually</span>
        <span className="text-fg-muted">(save 25%+)</span>
      </div>

      {/* Free-plan strip. Its own row above the cards, because the free tier
          is an always-available floor rather than a column to compare. */}
      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-[#111112] px-7 py-4">
        <p className="min-w-0 flex-1 text-[16px] text-fg">
          <span className="font-bold">Free plan</span>{" "}
          <span className="text-fg-muted">
            Unlimited recordings, instant call summaries, integrations with LLMs &amp; more.
          </span>
        </p>
        <Link
          href="/signup"
          className="flex shrink-0 items-center gap-1.5 text-[16px] font-semibold text-fg hover:underline"
        >
          Sign up. Free forever. <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <PlanCard key={`${audience}-${p.name}`} plan={p} annual={annual} />
        ))}
      </div>

      <p className="mt-10 text-center text-[16px] text-fg">
        Get the best plan for your team.{" "}
        <Link href="/signup" className="underline underline-offset-4 hover:text-brand">
          Talk to sales →
        </Link>
      </p>
    </>
  );
}

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const price = annual ? plan.annual : plan.monthly;
  const solid = plan.ctaStyle === "solid";

  return (
    <article
      style={{ borderColor: plan.edge }}
      className="flex flex-col rounded-2xl border bg-[#0d0d0f] px-7 pt-6 pb-8"
    >
      <p className="text-[12px] font-semibold tracking-[0.1em] text-fg-muted uppercase">
        {plan.audience}
      </p>
      <h3 className="mt-2 text-[30px] font-light text-fg">{plan.name}</h3>

      <div className="mt-4 border-t border-white/12 pt-7">
        <p className="flex items-baseline gap-3">
          <span className="text-[44px] leading-none font-light text-fg">${price}</span>
          {price === 0 ? (
            <span className="text-[17px] text-fg">Free forever.</span>
          ) : (
            <span className="text-[16px] leading-tight text-fg">
              /month / per user
              {plan.minUsers && (
                <>
                  <br />
                  <span className="text-fg-muted">{plan.minUsers}</span>
                </>
              )}
            </span>
          )}
        </p>

        <Link
          href="/signup"
          style={solid ? undefined : { borderColor: "rgba(255,255,255,0.35)" }}
          className={`mt-7 flex items-center justify-center rounded-full px-6 py-3.5 text-center text-[15px] font-semibold tracking-[0.04em] uppercase transition-opacity hover:opacity-90 ${
            solid ? "bg-[#F4EFA0] text-black" : "border text-fg"
          }`}
        >
          {plan.cta}
        </Link>

        <p className="mt-3 text-center text-[14px] text-fg-muted">90 day guarantee</p>
      </div>

      <ul className="mt-7 space-y-3.5 border-t border-white/12 pt-7">
        {plan.inherits && (
          <Feature accent>{plan.inherits}</Feature>
        )}
        {plan.features.map((f) => (
          <Feature key={f}>{f}</Feature>
        ))}
      </ul>
    </article>
  );
}

function Feature({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <li className={`flex gap-2.5 text-[15px] leading-snug ${accent ? "font-bold" : ""}`}>
      <Check
        className={`mt-0.5 h-4 w-4 shrink-0 ${accent ? "text-[#E8C64A]" : "text-fg"}`}
        strokeWidth={2.5}
      />
      <span className={accent ? "text-[#E8C64A]" : "text-fg"}>{children}</span>
    </li>
  );
}
