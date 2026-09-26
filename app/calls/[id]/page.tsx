import { notFound } from "next/navigation";
import { DetailLayout } from "@/components/layout/DetailLayout";
import { MeetingDetail } from "@/components/detail/MeetingDetail";
import { ClipView } from "@/components/clip/ClipView";
import { getMeetingBySlug } from "@/backend/src/repositories/meetings";
import { HIGHLIGHT_META, type Meeting } from "@/lib/types";

/** First value of a search param, which Next hands over as string | string[]. */
function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Resolves ?clip=ID against the meeting's saved highlights.
 *
 * Highlights created during a session live in React state, not in the
 * fixtures, so a link to one will not resolve in a fresh tab. That falls back
 * to the full recording rather than 404ing -- the recipient still lands on the
 * call, which is the better failure.
 */
function getClip(meeting: Meeting, id: string | undefined) {
  return id ? meeting.highlights.find((h) => h.id === id) : undefined;
}

/** Per-meeting title, so a shared link reads as the meeting not the app. */
export async function generateMetadata({ params, searchParams }: PageProps<"/calls/[id]">) {
  /* Someone's private meeting record. Every branch below carries this. */
  const hidden = { robots: { index: false, follow: false } } as const;

  const { id } = await params;
  const meeting = await getMeetingBySlug(id);
  if (!meeting) return { title: "Meeting", ...hidden };

  const clip = getClip(meeting, one((await searchParams).clip));
  if (clip) {
    return {
      title: `${clip.note} · clip`,
      description: `A ${HIGHLIGHT_META[clip.kind].label.toLowerCase()} from ${meeting.title}.`,
      ...hidden,
    };
  }

  return {
    title: meeting.title,
    description: `Recap, transcript and action items from ${meeting.title}.`,
    ...hidden,
  };
}

/* No generateStaticParams: meetings are per-user rows behind row level
   security, so there is no build-time list to prerender. */

export default async function MeetingDetailPage({
  params,
  searchParams,
}: PageProps<"/calls/[id]">) {
  const { id } = await params;
  const { t, clip: clipId } = await searchParams;

  /* No artificial delay any more: this is a real query against Postgres, so
     the branded loader has genuine latency to cover. */
  const meeting = await getMeetingBySlug(id);
  if (!meeting) notFound();

  /* A clip link opens the clip on its own -- no transcript, no rail, and a
     player bounded to the highlight. */
  const clip = getClip(meeting, one(clipId));
  if (clip) {
    return (
      <DetailLayout>
        <div className="animate-[fade-rise_420ms_ease-out_both]">
          <ClipView meeting={meeting} clip={clip} />
        </div>
      </DetailLayout>
    );
  }

  // ?t=SEC arrives from search results and shared clip links.
  const initialTime = Number(one(t));

  return (
    <DetailLayout>
      <div className="animate-[fade-rise_420ms_ease-out_both]">
        <MeetingDetail
          meeting={meeting}
          initialTime={Number.isFinite(initialTime) ? initialTime : 0}
        />
      </div>
    </DetailLayout>
  );
}
