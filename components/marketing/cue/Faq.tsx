"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ_ITEMS } from "./faqItems";

/**
 * The FAQ, and the page's structured data.
 *
 * Built on <details>/<summary> rather than divs with click handlers, so it
 * opens with a keyboard, is announced correctly by a screen reader, and is
 * still readable with JavaScript off -- which is also how a crawler reads it.
 * The answers are in the markup whether or not the panel is open, which is
 * what makes the FAQPage structured data below truthful rather than a
 * keyword-stuffing trick.
 *
 * The questions are the ones people actually ask about a tool like this,
 * including the two with awkward answers.
 */


export function Faq() {
  /* Tracked so the icon can rotate. <details> handles the open state itself;
     this only mirrors it for the animation. */
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-24 sm:px-10" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <p className="section-label">Questions</p>
          <h2
            id="faq-heading"
            className="font-display mt-3 text-[clamp(30px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text"
          >
            The things people ask first.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 6) * 55}>
              <details
                open={open === i}
                onToggle={(e) => setOpen(e.currentTarget.open ? i : null)}
                className="group py-1"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="flex-1 text-[16.5px] leading-snug font-medium text-text">
                    {item.q}
                  </h3>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-faint transition-transform duration-300 group-open:rotate-45">
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
