import { notFound } from "next/navigation";
import { DetailLayout } from "@/components/layout/DetailLayout";
import { MeetingDetail } from "@/components/detail/MeetingDetail";
import { getMeeting, MEETINGS } from "@/lib/fixtures";

/** Per-meeting title, so a shared link reads as the meeting not the app. */
export async function generateMetadata({ params }: PageProps<"/calls/[id]">) {
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) return { title: "Meeting" };
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
  const { t } = await searchParams;

  const meeting = getMeeting(id);
  if (!meeting) notFound();

  if (OPEN_DELAY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, OPEN_DELAY_MS));
  }

  // ?t=SEC arrives from search results and shared clip links.
  const initialTime = Number(Array.isArray(t) ? t[0] : t);

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
