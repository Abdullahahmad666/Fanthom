import { CueSiteHeader } from "@/components/marketing/cue/CueSiteHeader";
import { CueHero } from "@/components/marketing/cue/CueHero";
import { HowItWorks } from "@/components/marketing/cue/HowItWorks";
import { WorksWhereYouMeet } from "@/components/marketing/cue/WorksWhereYouMeet";
import { MomentSearch } from "@/components/marketing/cue/MomentSearch";
import { PlainlyHonest } from "@/components/marketing/cue/PlainlyHonest";
import { Faq } from "@/components/marketing/cue/Faq";
import { CueClosing } from "@/components/marketing/cue/CueClosing";
import { CueSiteFooter } from "@/components/marketing/cue/CueSiteFooter";
import { StructuredData } from "@/components/marketing/cue/StructuredData";

export const metadata = {
  title: "Cue — meeting notes with receipts",
  description:
    "Cue turns a meeting transcript into notes you can check. Every line carries the second it was said, so you can play the proof instead of trusting the summary.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cue — meeting notes with receipts",
    description:
      "Cue quotes your meeting instead of paraphrasing it. Every line it keeps carries the moment it came from.",
    url: "/",
    type: "website",
  },
};

/**
 * The landing page.
 *
 * Every section is server-rendered, and that is a reversal of what step 6 did
 * here. Those sections were behind `ssr: false`, which kept about 31 KB out of
 * the initial load -- and kept the entire page out of the HTML with it.
 * Measured, a crawler saw one heading and no body copy: no "how it works", no
 * sources, no honesty section. A landing page that cannot be read by anything
 * that does not run JavaScript is not a landing page, and 31 KB is not worth
 * that. The scroll animations are unaffected; Reveal works on content that is
 * already in the document.
 *
 * Heading order is h1 once in the hero, then one h2 per section, then h3 for
 * the items inside them -- an outline a screen reader can navigate and a
 * crawler can read as structure rather than styling.
 */
export default function CueHomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <StructuredData />
      <CueSiteHeader />
      <main>
        <CueHero />
        <HowItWorks />
        <WorksWhereYouMeet />
        <MomentSearch />
        <PlainlyHonest />
        <Faq />
        <CueClosing />
      </main>
      <CueSiteFooter />
    </div>
  );
}
