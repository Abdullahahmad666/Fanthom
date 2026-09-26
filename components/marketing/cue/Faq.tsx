import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ_ITEMS } from "./faqItems";

/**
 * The FAQ.
 *
 * Uncontrolled <details>, and that is the fix for a real bug rather than a
 * stylistic preference. It used to drive `open` from React state, which raced
 * with the element's own behaviour: clicking a second question set the state to
 * that index, React then closed the first one, and the first one's onToggle
 * fired with open === false and reset the state to null. The visible result was
 * that opening a question closed the one you were reading and opened nothing.
 *
 * Letting each panel own its state removes the race, and letting several stay
 * open is the kinder behaviour for a list of answers -- nothing you are part
 * way through reading disappears because you got curious about something else.
 *
 * No state means no "use client" either, so this renders as HTML, works with
 * JavaScript off, and is read by a crawler exactly as it is read by a person.
 * That last part is what keeps the FAQPage structured data honest.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 px-6 py-24 sm:px-10"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-[820px]">
        <Reveal className="reveal-lead">
          <p className="section-label">Questions</p>
          <h2
            id="faq-heading"
            className="write-on font-display mt-3 text-[clamp(30px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text"
          >
            The things people ask first.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 6) * 55}>
              <details className="faq-item group py-1">
                <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="flex-1 text-[16.5px] leading-snug font-medium text-text transition-colors group-hover:text-accent">
                    {item.q}
                  </h3>
                  {/* The + becomes an x. Pure CSS, driven by the element's own
                      open state, so it can never disagree with the panel. */}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-faint transition-[transform,color,border-color] duration-300 group-open:rotate-45 group-open:border-accent group-open:text-accent">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="measure pb-6 text-[15px] leading-relaxed text-muted">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
