"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, ListChecks, MessageSquareText, Users } from "lucide-react";
import { CallCard } from "./CallCard";
import { AvatarStack } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { LearnSection } from "./LearnSection";
import { useSearchQuery } from "@/components/layout/ListLayout";
import { groupByDate } from "@/lib/grouping";
import { searchMeetings, type SearchHit } from "@/lib/search";
import { formatClock, formatDuration, type Meeting } from "@/lib/types";

const HIT_META: Record<SearchHit["field"], { icon: typeof FileText; label: string }> = {
  title: { icon: FileText, label: "Title" },
  participant: { icon: Users, label: "Participant" },
  transcript: { icon: MessageSquareText, label: "Said in call" },
  summary: { icon: FileText, label: "Summary" },
  action: { icon: ListChecks, label: "Action item" },
};

/** Wraps matches so the reason a result matched is visible at a glance. */
function Marked({ text, term }: { text: string; term: string }) {
  if (!term) return <>{text}</>;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-brand/25 px-0.5 text-fg">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
}

function ResultRow({ meeting, hits, term }: { meeting: Meeting; hits: SearchHit[]; term: string }) {
  return (
    <div className="rounded-lg bg-raised p-4">
      <div className="flex gap-4">
        <Link
          href={`/calls/${meeting.id}`}
          className="relative hidden h-[84px] w-[150px] shrink-0 overflow-hidden rounded-md sm:block"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${meeting.poster[0]}, ${meeting.poster[1]})`,
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center">
            <AvatarStack participants={meeting.participants} max={3} size={30} />
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={`/calls/${meeting.id}`} className="text-[15px] font-semibold text-fg hover:text-brand">
            <Marked text={meeting.title} term={term} />
          </Link>
          <p className="mt-0.5 text-[12px] text-fg-muted">
            {meeting.date} · {meeting.startTime} · {formatDuration(meeting.durationSec)} ·{" "}
            {meeting.participants.length} people
          </p>

          <ul className="mt-3 space-y-1.5">
            {hits.map((hit, i) => {
              const { icon: Icon, label } = HIT_META[hit.field];
              const body = (
                <span className="flex min-w-0 items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-fg-dim" />
                  <span className="min-w-0 text-[13px] leading-snug text-fg-muted">
                    <span className="mr-2 text-[11px] tracking-wide text-fg-dim uppercase">{label}</span>
                    <Marked text={hit.snippet} term={term} />
                    {hit.tSec !== undefined && (
                      <span className="ml-2 font-medium text-brand">@{formatClock(hit.tSec)}</span>
                    )}
                  </span>
                </span>
              );

              return (
                <li key={i}>
                  {hit.tSec !== undefined ? (
                    <Link
                      href={`/calls/${meeting.id}?t=${hit.tSec}`}
                      className="block rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-surface"
                    >
                      {body}
                    </Link>
                  ) : (
                    <span className="block px-2 py-1 -mx-2">{body}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

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

  if (term) {
    const results = searchMeetings(meetings, term);
    const totalHits = results.reduce((n, r) => n + r.hits.length, 0);

    return (
      <div className="mx-auto max-w-[1180px] px-8 pt-8">
        <p className="mb-5 text-[13px] text-fg-muted">
          {results.length === 0
            ? "No matches"
            : `${totalHits} match${totalHits === 1 ? "" : "es"} across ${results.length} meeting${
                results.length === 1 ? "" : "s"
              }`}
        </p>

        {results.length === 0 ? (
          <EmptyState label={`Nothing found for “${term}”`} />
        ) : (
          <div className="flex max-w-[980px] flex-col gap-3">
            {results.map((r) => (
              <ResultRow key={r.meeting.id} meeting={r.meeting} hits={r.hits} term={term} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="mx-auto max-w-[1180px] pb-12">
        <EmptyState label="No call recordings" />
        <LearnSection />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] px-8 pt-8 pb-12">
      {groupByDate(meetings).map((group) => (
        <section key={group.label} className="mb-12">
          <h2 className="mb-5 text-[15px] font-semibold text-fg">{group.label}</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {group.meetings.map((m) => (
              <CallCard
                key={m.id}
                meeting={m}
                onDelete={(id) => setDeleted((d) => [...d, id])}
              />
            ))}
          </div>
        </section>
      ))}

      <LearnSection />
    </div>
  );
}
