import type { SummaryBlock, SummarySection } from "./types";

/**
 * Builds a new summary from an existing one plus a written instruction.
 *
 * There is no model here, so this does not pretend to be one. It reads the
 * instruction for the transforms it can genuinely carry out over the data the
 * meeting already has -- adding topic prefixes, folding in sections from the
 * other templates, trimming, appending a catch-all -- and applies them. The
 * output is a real rearrangement of real content rather than invented text,
 * which is the honest version of this feature at this layer.
 *
 * Anything it cannot interpret leaves the summary as it was, so an unmatched
 * instruction produces a copy rather than nonsense.
 */

const clone = (sections: SummarySection[]): SummarySection[] =>
  sections.map((s) => ({
    heading: s.heading,
    blocks: s.blocks.map((b) =>
      b.kind === "para" ? { ...b } : { kind: "bullets", items: b.items.map((i) => ({ ...i })) },
    ),
  }));

/** First clause of a sentence, used as the bold topic on a prefixed bullet. */
function topicOf(text: string): { label: string; rest: string } | null {
  const colon = text.indexOf(":");
  if (colon > 0 && colon < 40) {
    return { label: text.slice(0, colon).trim(), rest: text.slice(colon + 1).trim() };
  }

  const comma = text.indexOf(",");
  if (comma > 8 && comma < 42) {
    return { label: text.slice(0, comma).trim(), rest: text.slice(comma + 1).trim() };
  }

  const words = text.split(/\s+/);
  if (words.length < 5) return null;
  return { label: words.slice(0, 3).join(" ").replace(/[.,;:]$/, ""), rest: words.slice(3).join(" ") };
}

function eachBullets(sections: SummarySection[], fn: (block: Extract<SummaryBlock, { kind: "bullets" }>) => void) {
  for (const s of sections) for (const b of s.blocks) if (b.kind === "bullets") fn(b);
}

export type DerivedSummary = { label: string; sections: SummarySection[] };

export function deriveSummary({
  base,
  others,
  instruction,
  index,
}: {
  /** Sections of the template that was selected when the user asked. */
  base: SummarySection[];
  /** The meeting's other templates, to draw extra material from. */
  others: SummarySection[][];
  instruction: string;
  /** How many custom templates already exist, for the label. */
  index: number;
}): DerivedSummary {
  const want = instruction.toLowerCase();
  const sections = clone(base);

  /* "Prefix each bullet point with its topic+colon in bold" */
  if (/prefix|bold|topic|colon/.test(want)) {
    eachBullets(sections, (block) => {
      block.items = block.items.map((item) => {
        if (item.label) return item;
        const split = topicOf(item.text);
        return split ? { label: split.label, text: split.rest } : item;
      });
    });
  }

  /* "Increase detail" -- fold in whatever the other templates say that this
     one does not, which is the only extra detail actually available. */
  if (/detail|expand|longer|more/.test(want)) {
    const seen = new Set(sections.map((s) => s.heading.toLowerCase()));
    for (const other of others) {
      for (const s of other) {
        if (seen.has(s.heading.toLowerCase())) continue;
        seen.add(s.heading.toLowerCase());
        sections.push(clone([s])[0]);
      }
    }
  }

  /* "Shorten" is the opposite request and just as likely. */
  if (/short|brief|concise|trim|tighten/.test(want)) {
    for (const s of sections) {
      s.blocks = s.blocks
        .filter((b) => b.kind === "bullets")
        .map((b) =>
          b.kind === "bullets" ? { kind: "bullets", items: b.items.slice(0, 3) } : b,
        );
    }
  }

  /* "Append a 'Misc' topic with everything not already covered" */
  if (/misc|everything else|not already covered|catch/.test(want)) {
    const covered = new Set<string>();
    eachBullets(sections, (b) => b.items.forEach((i) => covered.add(i.text)));

    const leftovers: { text: string }[] = [];
    for (const other of others) {
      for (const s of other) {
        for (const b of s.blocks) {
          if (b.kind !== "bullets") continue;
          for (const item of b.items) {
            if (!covered.has(item.text) && leftovers.length < 6) {
              covered.add(item.text);
              leftovers.push({ text: item.text });
            }
          }
        }
      }
    }

    if (leftovers.length > 0) {
      sections.push({ heading: "Misc", blocks: [{ kind: "bullets", items: leftovers }] });
    }
  }

  return {
    label: index === 0 ? "Custom" : `Custom ${index + 1}`,
    sections,
  };
}
