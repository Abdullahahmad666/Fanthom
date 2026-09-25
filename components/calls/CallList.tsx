"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { CallCard } from "./CallCard";
import { MomentResults } from "@/components/search/MomentResults";
import { Reveal } from "@/components/ui/Reveal";
import { LearnSection } from "./LearnSection";
import { useSearchQuery } from "@/components/layout/ListLayout";
import { groupByDate } from "@/lib/grouping";
import type { Meeting } from "@/lib/types";

/**
 * The meeting list.
 *
 * Rows arrive from Postgres through the server component above; this stays a
 * client component only because it filters as you type. Deleting is local
 * state until the delete endpoint lands, so the row disappears immediately
 * rather than waiting on a round trip.
 */
export function CallList({ meetings: all }: { meetings: Meeting[] }) {
  const query = useSearchQuery();
  const [deleted, setDeleted] = useState<string[]>([]);

  const meetings = useMemo(
    () => all.filter((m) => !deleted.includes(m.id)),
    [all, deleted],
  );

  const term = query.trim();

  /**
   * Searching is a different view, not a filtered list.
   *
   * It used to match in the browser over every transcript, which is why this
   * component was handed whole meetings. Postgres does it now against the
   * index in migration 0002, and returns moments -- so the answer is the
   * sentence rather than the meetings it might be in.
   */
  if (term.length >= 2) {
    return (
      <div className="mx-auto max-w-[1180px] px-8">
        <MomentResults query={term} />
      </div>
    );
  }

  /* An empty account is the first thing most people see, so it is a
     beginning rather than an apology: it names the one action that fills it. */
  if (meetings.length === 0) {
    return (
      <div className="mx-auto max-w-[1180px] px-8 pb-12">
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-raised">
            <Upload className="h-6 w-6 text-faint" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 font-display text-[28px] leading-tight text-text">
            No meetings yet
          </h2>
          <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted">
            Cue reads the transcript your conferencing tool already made and finds
            the notes inside it. Bring one over and you will have a searchable
            meeting in a few seconds.
          </p>
          <Link
            href="/import"
            className="press mt-6 flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            <Upload className="h-4 w-4" />
            Import a transcript
          </Link>
        </div>
        <LearnSection />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] px-8 pt-8 pb-12">
      {groupByDate(meetings).map((group) => (
        <section key={group.label} className="mb-12">
          <Reveal as="h2" className="mb-5 text-[15px] font-semibold text-fg">
            {group.label}
          </Reveal>
          {/* Cards arrive in reading order as the day scrolls into view, so a
              long history feels paged rather than dumped. */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {group.meetings.map((m, i) => (
              <Reveal key={m.id} delay={Math.min(i, 8) * 45}>
                <CallCard
                  meeting={m}
                  onDelete={(id) => setDeleted((d) => [...d, id])}
                />
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <LearnSection />
    </div>
  );
}
