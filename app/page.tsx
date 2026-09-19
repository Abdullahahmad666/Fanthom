import Link from "next/link";
import { ChevronDown, Lock, X } from "lucide-react";
import { FathomMark, FathomWordmark } from "@/components/brand/FathomMark";
import { Starfield } from "@/components/marketing/Starfield";
import { HeroBubbles } from "@/components/marketing/HeroBubbles";
import { FeatureCarousel } from "@/components/marketing/FeatureCarousel";
import { TeamTabs } from "@/components/marketing/TeamTabs";
import { PillarAccordion } from "@/components/marketing/PillarAccordion";

const NAV = [
  { label: "Overview", caret: false },
  { label: "Solutions", caret: true },
  { label: "Integrations", caret: true },
  { label: "Resources", caret: true },
  { label: "Pricing", caret: false },
];

const LOGOS = ["HubSpot", "Adobe", "zapier", "GRUBHUB", "EA", "Calendly"];

const STATS = [
  { value: "95% of users", body: "say Fathom helps them stay fully present in meetings", circle: "#D25000", column: "rgba(210,80,0,0.16)", text: "text-black" },
  { value: "6+ hours saved", body: "per team member every week on follow-up work", circle: "#EFA9B8", column: "rgba(239,169,184,0.22)", text: "text-black" },
  { value: "3X Faster", body: "from meeting insights to actionable next steps", circle: "#73BFFF", column: "rgba(115,191,255,0.20)", text: "text-black" },
];

export const metadata = {
  title: "Fathom — AI notetaking that is out of this world",
  description:
    "Fathom summarizes your meetings so you can focus on the conversation. Now available bot-free.",
};

const CTA =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] text-[15px] font-semibold tracking-wide text-black uppercase transition-opacity hover:opacity-90";

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-black text-fg">
      {/* Announcement bar */}
      <div className="relative flex items-center justify-center gap-3 bg-[#f8f5f5] px-12 py-3.5 text-center text-neutral-900">
        <span className="flex items-center gap-2" aria-hidden="true">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-[11px] font-bold text-white">
            S
          </span>
          <span className="text-[15px]">+</span>
          <FathomMark className="h-4 w-5 text-black" />
        </span>
        <span className="text-[14px] font-semibold tracking-wide">
          FATHOM IS NOW PART OF SUPERHUMAN.
        </span>
        <span className="text-[14px] font-semibold tracking-wide underline underline-offset-4">
          LEARN MORE →
        </span>
        <X className="absolute right-5 h-4 w-4 text-neutral-500" />
      </div>

      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-[1400px] items-center gap-8 px-8 py-6">
        <Link href="/" aria-label="Fathom">
          <FathomWordmark />
        </Link>

        <nav className="hidden items-center gap-8 rounded-full px-8 py-3.5 ring-1 ring-white/20 xl:flex">
          {NAV.map(({ label, caret }) => (
            <span
              key={label}
              className="flex cursor-pointer items-center gap-1.5 text-[16px] text-fg transition-colors hover:text-fg-muted"
            >
              {label}
              {caret && <ChevronDown className="h-4 w-4" />}
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-7">
          <span className="hidden max-w-[70px] cursor-pointer text-[15px] leading-tight text-fg sm:block">
            Book a Demo
          </span>
          <Link href="/calls" className="max-w-[44px] text-[15px] leading-tight text-fg hover:text-brand">
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-brand px-6 py-2.5 text-center text-[14px] leading-tight font-bold tracking-wide text-fg uppercase transition-colors hover:bg-brand/10"
          >
            Sign up
            <br className="hidden sm:block" /> free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-8 pt-16 pb-24">
        <Starfield />
        <div className="relative mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <h1 className="max-w-[720px] text-[clamp(46px,7.2vw,92px)] leading-[1.02] font-light tracking-tight">
              AI notetaking that is out of this world
            </h1>

            <p className="mt-10 max-w-[520px] text-[19px] leading-relaxed text-fg">
              Fathom summarizes your meetings so you can focus on the conversation.{" "}
              <strong className="font-bold">Now available bot-free.</strong>
            </p>

            <Link href="/signup" className={`${CTA} mt-10 px-9 py-4`}>
              Get started - free forever
            </Link>

            <p className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-fg">
              <Lock className="h-4 w-4" />
              SOC 2 Type II <span className="text-fg-dim">|</span> GDPR
              <span className="text-fg-dim">|</span> HIPAA Compliant
              <span className="text-fg-dim">|</span> SSO / SCIM
            </p>
          </div>

          <HeroBubbles />
        </div>
      </section>

      {/* Social proof */}
      <section className="relative overflow-hidden px-8 pb-24">
        <Starfield />
        <div className="relative mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff492c] text-[15px] font-bold text-white">
              G2
            </span>
            <span>
              <span className="block text-[18px] font-semibold">
                <span className="text-amber">★★★★★</span> 5.0/5.0
              </span>
              <span className="block text-[14px] text-fg-muted">
                #1 rated · 6,500+ reviews
              </span>
            </span>
          </div>

          <p className="max-w-[130px] text-[17px] leading-snug text-fg">
            Used at over 300K+ companies
          </p>

          {LOGOS.map((l) => (
            <span
              key={l}
              className="flex h-[80px] w-[150px] items-center justify-center rounded-xl bg-[#262626] text-[17px] font-bold text-fg"
            >
              {l}
            </span>
          ))}
        </div>
      </section>

      <FeatureCarousel />

      {/* Marquee */}
      <section className="overflow-hidden bg-black py-16">
        <div className="flex whitespace-nowrap">
          {[0, 1].map((n) => (
            <span
              key={n}
              aria-hidden={n === 1}
              className="animate-[marquee_26s_linear_infinite] pr-16 text-[clamp(48px,9vw,120px)] leading-none font-light"
            >
              Move{" "}
              <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">
                work
              </span>{" "}
              forward faster ·{" "}
            </span>
          ))}
        </div>
      </section>

      {/* Teams */}
      <section className="relative overflow-hidden px-8 py-24">
        <Starfield />
        <div
          aria-hidden="true"
          className="absolute -top-20 -left-40 h-[520px] w-[520px] rounded-full opacity-90 blur-[2px]"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #e9b8d8 0%, #a855f7 45%, #6d28d9 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1240px]">
          <h2 className="mx-auto max-w-[900px] text-center text-[clamp(32px,4.6vw,58px)] leading-tight font-light">
            Whether you&apos;re a team of 1 or 1,000, Fathom&apos;s got your back
          </h2>
          <div className="mt-16">
            <TeamTabs />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative overflow-hidden px-8 py-24">
        <Starfield />
        <div
          aria-hidden="true"
          className="absolute top-1/2 -right-40 hidden h-[620px] w-[760px] -translate-y-1/2 rounded-[320px] lg:block"
          style={{ background: "linear-gradient(180deg, #f0b6d0 0%, #c084fc 45%, #8b2ff5 100%)" }}
        />
        <div className="relative mx-auto max-w-[1240px]">
          <PillarAccordion />
        </div>
      </section>

      {/* Light stats section */}
      <section className="bg-[#f8f5f5] px-8 py-28 text-neutral-900">
        <h2 className="text-center text-[clamp(34px,5vw,62px)] leading-tight font-light">
          Fathom teams
          <br />
          work smarter
        </h2>

        <div className="mx-auto mt-20 grid max-w-[1000px] gap-8 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.value} className="relative flex flex-col items-center">
              <div
                className="absolute top-20 h-[280px] w-[210px] rounded-b-xl"
                style={{ background: `linear-gradient(180deg, ${s.column} 0%, transparent 100%)` }}
                aria-hidden="true"
              />
              <div
                className={`relative flex h-[230px] w-[230px] flex-col items-center justify-center rounded-full px-8 text-center ${s.text}`}
                style={{ background: s.circle }}
              >
                <p className="text-[24px] font-semibold">{s.value}</p>
                <p className="mt-1 text-[16px] leading-snug">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="relative overflow-hidden px-8 py-32 text-center">
        <Starfield />
        <div className="relative">
          <p className="text-[18px] text-[#73bfff]">
            ✦ Shared understanding. Faster execution. Better results.
          </p>
          <h2 className="mt-5 text-[clamp(34px,5.4vw,66px)] leading-tight font-light">
            Make your team unstoppable
          </h2>
          <Link href="/signup" className={`${CTA} mt-14 px-10 py-4`}>
            Try Fathom for your team
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-8 py-10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-5">
          <FathomWordmark />
          <p className="text-[14px] text-fg-dim">
            Frontend prototype built for an assignment. Not affiliated with Fathom.
          </p>
          <Link href="/calls" className="ml-auto text-[16px] text-brand hover:underline">
            Skip to the app →
          </Link>
        </div>
      </footer>
    </div>
  );
}
