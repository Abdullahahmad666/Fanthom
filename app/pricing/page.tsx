import { CueSiteHeader } from "@/components/marketing/cue/CueSiteHeader";
import { CueSiteFooter } from "@/components/marketing/cue/CueSiteFooter";
import { CuePlans } from "@/components/marketing/cue/CuePlans";
import { PricingFaq } from "@/components/marketing/cue/PricingFaq";
import { CueClosing } from "@/components/marketing/cue/CueClosing";

export const metadata = {
  title: "Pricing — Cue",
  description:
    "What Cue would charge for, and which of it exists today. Nothing is billed: this is a portfolio build with a real database behind it.",
};

/**
 * Pricing, rebuilt.
 *
 * The page this replaces priced a different product: bot capture, CRM sync and
 * conversational analytics, none of which Cue does. It also carried a feature
 * matrix whose rows described the reference product's tiers.
 *
 * The replacement prices Cue, and marks every row for whether it is built or
 * planned. That is the whole idea of the page -- a pricing table is where a
 * product is most tempted to write in the future tense, and saying which half
 * is which is the same commitment the rest of the site makes.
 */
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <CueSiteHeader />
      <CuePlans />
      <PricingFaq />
      <CueClosing />
      <CueSiteFooter />
    </div>
  );
}
