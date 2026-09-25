import { CueSiteHeader } from "@/components/marketing/cue/CueSiteHeader";
import { CueHero } from "@/components/marketing/cue/CueHero";
import { CueSiteFooter } from "@/components/marketing/cue/CueSiteFooter";
import { DeferredCueSections } from "@/components/marketing/cue/DeferredCueSections";

export const metadata = {
  title: "Cue — meeting notes with receipts",
  description:
    "Cue quotes your meeting instead of paraphrasing it, and every line it keeps carries the second it was said, so you can play the proof.",
};

/**
 * The landing page.
 *
 * Rebuilt rather than re-skinned. The version this replaces was the reference
 * product's page with the words changed: a starfield, a borrowed 5.0 rating,
 * six customer logos and a headline about the category. None of that survives
 * a rename honestly -- a cloned claim becomes a fabricated one the moment it
 * is attached to a product with no customers.
 *
 * What is here instead argues the one thing Cue can actually demonstrate on a
 * page, and demonstrates it in the hero: a summary line, the moments it came
 * from, and the transcript excerpt behind each one. The rest explains the
 * mechanism, then states in as many words what the product does not do.
 *
 * It follows the theme rather than painting its own black canvas, so `.on-dark`
 * is gone from here: every surface below is built from tokens and reads in
 * both light and dark.
 */
export default function CueHomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <CueSiteHeader />
      <CueHero />
      <DeferredCueSections />
      <CueSiteFooter />
    </div>
  );
}
