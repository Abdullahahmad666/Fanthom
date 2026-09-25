import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const DOES = [
  "Quotes your meeting verbatim, so a bullet is evidence rather than a paraphrase",
  "Attaches the timestamps every line came from, and plays them on click",
  "Indexes what was said, so search returns the moment instead of the meeting",
  "Parses the file in your browser first, and shows you the result before saving",
  "Reads in light and dark, because notes get read at 2pm as well as at midnight",
];

const DOES_NOT = [
  "Join your call. There is no bot, and no one is told a recorder arrived",
  "Write prose. Cue has no language model, so it cannot invent a sentence nobody said",
  "Infer sentiment, score your talk time, or grade the meeting",
  "Have customers, a rating, or a logo wall — it is a new product, and pretending otherwise would be the first thing it got wrong",
];

/**
 * What the cloned page put here was a wall of borrowed credibility: a 5.0 G2
 * badge, "6,500+ reviews", "300K+ companies", and the logos of six businesses
 * that have never heard of this product. Under a different company's name that
 * was a clone of real claims. Re-labelled, it would be fabricated ones.
 *
 * This replaces it with the only form of proof a new product can honestly
 * offer: a precise account of what it does, and an equally precise account of
 * what it does not. The second column is the more persuasive of the two, which
 * is why it is not hidden in a FAQ.
 */
export function PlainlyHonest() {
  return (
    <section className="relative px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="max-w-[52ch]">
          <p className="section-label">Plainly</p>
          <h2 className="font-display mt-3 text-[clamp(30px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text">
            What it does, and what it will not pretend to do.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
          <Reveal className="bg-surface p-8">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.04em] text-positive uppercase">
              <Check className="h-4 w-4" strokeWidth={3} />
              Cue does
            </p>
            <ul className="mt-6 space-y-4">
              {DOES.map((t) => (
                <li key={t} className="flex gap-3 text-[14px] leading-relaxed text-muted">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-positive" strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={110} className="bg-surface p-8">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.04em] text-faint uppercase">
              <Minus className="h-4 w-4" strokeWidth={3} />
              Cue does not
            </p>
            <ul className="mt-6 space-y-4">
              {DOES_NOT.map((t) => (
                <li key={t} className="flex gap-3 text-[14px] leading-relaxed text-muted">
                  <Minus className="mt-1 h-4 w-4 shrink-0 text-faint" strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
