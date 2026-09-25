"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Search as SearchIcon } from "lucide-react";
import type { Moment, SearchResults } from "@/backend/src/repositories/search";
import { formatClock } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Search results.
 *
 * A meeting tool that answers "where did we discuss pricing?" with a list of
 * meetings has told you what you already knew. The unit here is the moment --
 * the sentence, who said it, and the second it happened -- and the meeting is
 * context printed on the result rather than the result itself.
 *
 * Matching meeting titles are kept, because "which call was that?" is a real
 * question, but they are secondary and labelled as such.
 */

export function MomentResults({ query }: { query: string }) {
  /* Results carry the query they answer. Clearing them when the term gets too
     short would mean setting state inside an effect for something the effect
     did not cause -- and stale results are ignored by comparison instead. */
  const [state, setState] = useState<{ q: string; data: SearchResults } | null>(null);
  const request = useRef(0);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;

    /* Debounced, and every response carries the id of the request that asked
       for it: typing fast otherwise lets a slow early query overwrite the
       results of a later one. */
    const id = ++request.current;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data: SearchResults = await res.json();
        if (id === request.current) setState({ q: term, data });
      } catch {
        if (id === request.current) {
          setState({ q: term, data: { moments: [], meetings: [], ok: false } });
        }
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  if (query.trim().length < 2) return null;

  /* "Loading" is not a separate fact: we are loading exactly when the stored
     results do not answer the query on screen. Deriving it removes a piece of
     state that could disagree with reality. */
  const results = state && state.q === query.trim() ? state.data : null;

  if (!results) {
    return (
      <p className="flex items-center gap-2 py-10 text-[14px] text-faint">
        <Loader2 className="h-4 w-4 animate-spin" />
        Searching every transcript…
      </p>
    );
  }

  if (!results.ok) {
    return (
      <p className="max-w-[56ch] py-10 text-[14px] leading-relaxed text-muted">
        {results.reason ?? "Search is unavailable."}
      </p>
    );
  }

  const total = results.moments.length;

  return (
    <div className="pb-14">
      <p className="flex items-center gap-2 pt-6 pb-5 text-[13px] text-faint">
        <SearchIcon className="h-3.5 w-3.5" />
        {total === 0
          ? `Nothing said about “${query.trim()}”`
          : `${total} moment${total === 1 ? "" : "s"} across your meetings`}
      </p>

      {results.meetings.length > 0 && (
        <section className="mb-8">
          <p className="section-label mb-2">Meetings named like this</p>
          <div className="flex flex-wrap gap-2">
            {results.meetings.map((m) => (
              <Link
                key={m.slug}
                href={`/calls/${m.slug}`}
                className="flex items-center gap-2 rounded-md bg-raised px-3 py-2 text-[13px] text-text transition-colors hover:bg-overlay"
              >
                <FileText className="h-3.5 w-3.5 text-faint" />
                {m.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {total > 0 && (
        <section>
          <p className="section-label mb-3">Moments</p>
          <ol className="space-y-2.5">
            {results.moments.map((m, i) => (
              <Reveal key={`${m.meetingSlug}-${m.tSec}-${i}`} delay={Math.min(i, 8) * 40}>
                <MomentRow moment={m} />
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {total === 0 && results.meetings.length === 0 && (
        <p className="max-w-[52ch] text-[14px] leading-relaxed text-muted">
          Cue searches what was actually said, not just titles and summaries.
          Try a phrase you remember hearing.
        </p>
      )}
    </div>
  );
}

function MomentRow({ moment }: { moment: Moment }) {
  return (
    <li>
      <Link
        href={`/calls/${moment.meetingSlug}?t=${moment.tSec}`}
        className="block rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-raised"
      >
        {/* The sentence first. The meeting is the footnote, not the headline. */}
        <p className="measure text-[15px] leading-relaxed text-text">
          {moment.parts.map((part, i) =>
            i % 2 === 1 ? (
              <mark key={i} className="rounded-sm bg-mark-soft px-0.5 text-mark">
                {part}
              </mark>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </p>

        <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-faint">
          <span className="cue-chip">{formatClock(moment.tSec)}</span>
          <span className="font-medium text-muted">{moment.speaker}</span>
          <span aria-hidden>·</span>
          <span>{moment.meetingTitle}</span>
          <span aria-hidden>·</span>
          <span>
            {new Date(`${moment.meetingDate}T00:00:00Z`).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}
          </span>
        </p>
      </Link>
    </li>
  );
}
