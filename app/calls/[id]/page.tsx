import { notFound } from "next/navigation";
import { DetailLayout } from "@/components/layout/DetailLayout";
import { MeetingDetail } from "@/components/detail/MeetingDetail";
import { ClipView } from "@/components/clip/ClipView";
import { getMeeting, MEETINGS } from "@/lib/fixtures";
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
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) return { title: "Meeting" };

  const clip = getClip(meeting, one((await searchParams).clip));
  if (clip) {
    return {
      title: `${clip.note} · clip`,
      description: `A ${HIGHLIGHT_META[clip.kind].label.toLowerCase()} from ${meeting.title}.`,
    };
  }

  return {
    title: meeting.title,
    description: `Recap, transcript and action items from ${meeting.title}.`,
  };
}

export function generateStaticParams() {
  return MEETINGS.map((m) => ({ id: m.id }));
}

/**
 * Deliberate pause before the meeting renders.
 *
 * There is nothing to fetch -- the meetings are fixtures in memory, so this
 * route would otherwise resolve instantly and the branded loader would flash
 * by unseen. The pause gives the transition a beat and lets the loader do its
 * job. It is presentation, not latency: set to 0 to remove it.
 */
const OPEN_DELAY_MS = 650;

export default async function MeetingDetailPage({
  params,
  searchParams,
}: PageProps<"/calls/[id]">) {
  const { id } = await params;
  const { t, clip: clipId } = await searchParams;

  const meeting = getMeeting(id);
  if (!meeting) notFound();

  if (OPEN_DELAY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, OPEN_DELAY_MS));
  }

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
