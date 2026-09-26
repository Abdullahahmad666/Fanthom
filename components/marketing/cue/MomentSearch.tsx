"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Cue } from "@/components/ui/Cue";

/**
 * Search, argued by showing the result rather than describing the feature.
 *
 * The distinction this section exists to make: most tools answer "which
 * meeting was that?" with a list of titles, which still leaves you to scrub
 * through an hour. Cue answers "where did someone say that?" with the line
 * itself and the second it happened, because that is the question people
 * actually have.
 *
 * The queries are canned -- there is no database on a marketing page -- but
 * the result shape, the highlighting and the cue chips are exactly what the
 * real /calls search renders.
 */

type Moment = {
  meeting: string;
  date: string;
  speaker: string;
  tSec: number;
  /** Odd indexes are the matched words, which is how the real search returns them. */
  parts: string[];
};

const QUERIES: { q: string; moments: Moment[] }[] = [
  {
    q: "rollback",
    moments: [
      {
        meeting: "Launch readiness",
        date: "Sep 18",
        speaker: "Priya Raman",
        tSec: 431,
        parts: ["The billing migration still has no ", "rollback", ", so if it goes wrong on launch night we are editing rows by hand."],
      },
      {
        meeting: "Launch readiness",
        date: "Sep 18",
        speaker: "Tom Okafor",
        tSec: 470,
        parts: ["I will write the ", "rollback", " script before the first rehearsal."],
      },
    ],
  },
  {
    q: "the date",
    moments: [
      {
        meeting: "Launch readiness",
        date: "Sep 18",
        speaker: "Maya Chen",
        tSec: 184,
        parts: ["I would rather move ", "the date", " than ship blind."],
      },
      {
        meeting: "Launch readiness",
        date: "Sep 18",
        speaker: "Maya Chen",
        tSec: 258,
        parts: ["Then let us call it: the launch moves to the 21st."],
      },
    ],
  },
  {
    q: "headcount",
    moments: [
      {
        meeting: "Launch readiness",
        date: "Sep 18",
        speaker: "Priya Raman",
        tSec: 612,
        parts: ["Support ", "headcount", " is the other one. We are at three people for a launch week that we think doubles ticket volume."],
      },
    ],
  },
];

export function MomentSearch() {
  const [active, setActive] = useState(0);
  const current = QUERIES[active];

  return (
    <section id="search" className="scroll-mt-24 relative px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="reveal-lead max-w-[46ch]">
          <p className="section-label">Search</p>
          <h2 className="font-display mt-3 text-[clamp(30px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text">
            Find the sentence, not the meeting.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted">
            A list of matching titles still leaves you scrubbing through an hour
            of audio. Cue indexes what was said, so a search returns the moment —
            who said it, and when.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12 overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <Search className="h-[16px] w-[16px] shrink-0 text-faint" strokeWidth={2.5} />
            <span className="text-[14px] text-text">{current.q}</span>
            <span className="ml-auto text-[12px] text-faint">
              {current.moments.length} {current.moments.length === 1 ? "moment" : "moments"}
            </span>
          </div>

          <ul className="divide-y divide-line">
            {current.moments.map((m) => (
              <li key={`${current.q}-${m.tSec}`} className="px-5 py-4">
                <p className="flex flex-wrap items-center gap-x-2 text-[12px] text-faint">
                  <span className="font-medium text-muted">{m.speaker}</span>
                  <span>·</span>
                  <span>{m.meeting}</span>
                  <span>·</span>
                  <span>{m.date}</span>
                </p>
                <p className="measure mt-1.5 text-[15px] leading-relaxed text-text">
                  {m.parts.map((part, i) =>
                    i % 2 === 1 ? (
                      <mark key={i} className="rounded bg-mark-soft px-0.5 text-mark">
                        {part}
                      </mark>
                    ) : (
                      <span key={i}>{part}</span>
                    ),
                  )}
                </p>
                <span className="mt-2 inline-flex">
                  <Cue tSec={m.tSec} />
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Try another query. Buttons rather than a text field: a free-text box
            on a page with no database would take input and then fail, which
            teaches the wrong thing about the product. */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-faint">Try:</span>
          {QUERIES.map((q, i) => (
            <button
              key={q.q}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`press rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${
                i === active
                  ? "border-accent bg-accentsoft text-accent"
                  : "border-line text-muted hover:border-line-strong hover:text-text"
              }`}
            >
              {q.q}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
