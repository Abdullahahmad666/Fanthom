import Link from "next/link";
import { Lock, X } from "lucide-react";
import { FathomMark } from "@/components/brand/FathomMark";
import { Starfield } from "@/components/marketing/Starfield";
import { BRAND_LOGOS, G2Badge } from "@/components/marketing/BrandLogos";
import { AnimatedHeadline } from "@/components/marketing/AnimatedHeadline";
import { HeroBubbles } from "@/components/marketing/HeroBubbles";
import { FeatureCarousel } from "@/components/marketing/FeatureCarousel";
import { TeamTabs } from "@/components/marketing/TeamTabs";
import { PillarSection } from "@/components/marketing/PillarSection";
import { StatsSection } from "@/components/marketing/StatsSection";
import { UnstoppableSection } from "@/components/marketing/UnstoppableSection";
import { WorksWhereYouMeet } from "@/components/marketing/WorksWhereYouMeet";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

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

      <MarketingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-10 pt-10 pb-32">
        <Starfield />
        <div className="relative mx-auto grid max-w-[1560px] gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <AnimatedHeadline
              text="AI notetaking that is out of this world"
              className="max-w-[720px] text-[clamp(44px,6.2vw,82px)] leading-[1.02] font-light tracking-tight"
            />

            {/* The rest of the column arrives behind the headline, so the hero
                assembles in reading order instead of all at once. */}
            <p
              style={{ animation: "fade-rise 620ms ease-out 900ms both" }}
              className="mt-10 max-w-[520px] text-[19px] leading-relaxed text-fg"
            >
              Fathom summarizes your meetings so you can focus on the conversation.{" "}
              <strong className="font-bold">Now available bot-free.</strong>
            </p>

            <div style={{ animation: "fade-rise 620ms ease-out 1060ms both" }}>
              <Link href="/signup" className={`${CTA} mt-10 px-9 py-4`}>
                Get started - free forever
              </Link>
            </div>

            <p
              style={{ animation: "fade-rise 620ms ease-out 1200ms both" }}
              className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-fg"
            >
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
      <section className="relative overflow-hidden px-10 pb-28">
        <Starfield />
        <div className="relative mx-auto flex max-w-[1560px] flex-wrap items-center justify-center gap-x-9 gap-y-8">
          <div className="flex items-center gap-4">
            <G2Badge size={46} />
            <span>
              <span className="flex items-center gap-2.5">
                <span className="text-[20px] tracking-[0.06em] text-[#f5a623]">★★★★★</span>
                <span className="text-[21px] font-semibold">5.0/5.0</span>
              </span>
              <span className="mt-1 block text-[15px] text-fg">#1 rated · 6,500+ reviews</span>
            </span>
          </div>

          {/* Wraps to three lines in the product, which is what keeps the row
              from stretching. */}
          <p className="w-[120px] text-[17px] leading-[1.35] text-fg">Used at 300K+ companies</p>

          {BRAND_LOGOS.map(({ key, Logo }) => (
            <Logo key={key} />
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
              className="animate-[marquee_26s_linear_infinite] pr-16 text-[clamp(44px,8vw,104px)] leading-none font-light"
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
      <section className="relative overflow-hidden px-10 py-28">
        <Starfield />
        <div
          aria-hidden="true"
          className="absolute -top-20 -left-40 h-[520px] w-[520px] rounded-full opacity-90 blur-[2px]"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #e9b8d8 0%, #a855f7 45%, #6d28d9 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1560px]">
          <h2 className="mx-auto max-w-[900px] text-center text-[clamp(32px,4.6vw,58px)] leading-tight font-light">
            Whether you&apos;re a team of 1 or 1,000, Fathom&apos;s got your back
          </h2>
          <div className="mt-16">
            <TeamTabs />
          </div>
        </div>
      </section>

      <PillarSection />

      <StatsSection />

      <UnstoppableSection />

      <WorksWhereYouMeet />

      <MarketingFooter />
    </div>
  );
}
