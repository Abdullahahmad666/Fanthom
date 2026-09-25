import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Starfield } from "@/components/marketing/Starfield";
import { UnstoppableSection } from "@/components/marketing/UnstoppableSection";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { MoreWays } from "@/components/pricing/MoreWays";
import { FeatureMatrix } from "@/components/pricing/FeatureMatrix";
import { ExploreCta } from "@/components/pricing/ExploreCta";

export const metadata = {
  title: "Pricing",
  description:
    "Pricing to supercharge every meeting. Free forever for individuals, with Team, Business and Enterprise plans for teams.",
};

export default function PricingPage() {
  return (
    <div className="on-dark min-h-screen bg-black text-fg">
      <AnnouncementBar />
      <MarketingHeader />

      <section className="relative overflow-hidden px-6 pt-16 pb-24">
        <Starfield />

        <div className="relative mx-auto max-w-[1400px]">
          <h1 className="text-center text-[clamp(34px,5.4vw,66px)] leading-tight font-light">
            Pricing to <span className="font-bold">supercharge every meeting</span>
          </h1>

          <div className="mt-12">
            <PricingPlans />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <Starfield />
        <div className="relative">
          <MoreWays />
          <FeatureMatrix />
        </div>
      </section>

      <ExploreCta />

      <UnstoppableSection />

      <MarketingFooter />
    </div>
  );
}
