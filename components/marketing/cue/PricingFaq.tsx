import { Reveal } from "@/components/ui/Reveal";

const FAQ = [
  {
    q: "Is there really no bot?",
    a: "No bot. Cue never joins a call and nobody in your meeting is told a recorder arrived, because Cue only ever reads a transcript your conferencing tool already wrote. That also means Cue cannot capture a meeting you did not record.",
  },
  {
    q: "Where does the summary come from, if there is no model?",
    a: "From your meeting. Cue reads the transcript for the shapes that carry weight — a decision being made, a commitment being given, a risk being named — and keeps those sentences as they were said. It is extraction, not generation, which is why every line can point at a timestamp.",
  },
  {
    q: "What happens to my transcript?",
    a: "It is parsed in your browser first, so you see what Cue found before anything is stored. If you save it, the text and the notes go into a Postgres row scoped to your account.",
  },
  {
    q: "What does Cue cost?",
    a: "Cue is free while it is in early access. The plans show how it will be priced when billing arrives, and every feature is marked available now or coming soon.",
  },
];

/**
 * Four questions, answered including the ones with an inconvenient answer.
 *
 * "Cue cannot capture a meeting you did not record" is a limitation, and it is
 * in the first answer rather than absent, because a page that only lists
 * strengths teaches you to discount everything on it.
 */
export function PricingFaq() {
  return (
    <section className="px-6 pb-24 sm:px-10">
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <h2 className="write-on font-display text-[clamp(26px,3.4vw,40px)] leading-tight tracking-[-0.02em] text-text">
            Questions worth asking.
          </h2>
        </Reveal>

        <dl className="mt-10 divide-y divide-line border-y border-line">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 70} className="py-7">
              <dt className="text-[16px] font-semibold text-text">{f.q}</dt>
              <dd className="measure mt-3 text-[14.5px] leading-relaxed text-muted">{f.a}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
