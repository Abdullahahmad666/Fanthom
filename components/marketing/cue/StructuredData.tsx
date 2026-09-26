import { SITE_URL } from "@/lib/siteUrl";
import { FAQ_ITEMS } from "./faqItems";

/**
 * JSON-LD for the landing page.
 *
 * Two graphs: what the product is, and the questions the page answers. Both
 * describe content that is actually on the page -- the FAQ entries below are
 * the same array the visible accordion renders, so they cannot drift apart
 * and the markup cannot end up claiming answers a reader never sees, which is
 * the thing search engines penalise.
 *
 * Deliberately not claiming an aggregateRating or a review count. Marking up
 * a rating a product has never received is the structured-data version of the
 * fabricated G2 badge this site already removed once.
 */
export function StructuredData() {
  const graph = [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Cue",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description:
        "Cue turns a meeting transcript into notes you can check. Every line carries the timestamp it came from, so you can play the proof instead of trusting the summary.",
      featureList: [
        "Import VTT, SRT and plain-text transcripts",
        "Extractive notes: decisions, risks and action items",
        "Every line carries the timestamps it came from",
        "Search across meetings and return the moment, not the meeting",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Cue",
      inLanguage: "en",
    },
  ];

  return (
    <script
      type="application/ld+json"
      /* Angle brackets escaped so a stray "</script>" inside any string cannot
         close this tag early. The content is ours, but the habit is what stops
         this becoming an injection point the day it is not. */
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
