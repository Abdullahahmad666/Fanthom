import { notFound } from "next/navigation";
import { DetailLayout } from "@/components/layout/DetailLayout";
import { MeetingDetail } from "@/components/detail/MeetingDetail";
import { getMeeting, MEETINGS } from "@/lib/fixtures";

export function generateStaticParams() {
  return MEETINGS.map((m) => ({ id: m.id }));
}

export default async function MeetingDetailPage({
  params,
  searchParams,
}: PageProps<"/calls/[id]">) {
  const { id } = await params;
  const { t } = await searchParams;

  const meeting = getMeeting(id);
  if (!meeting) notFound();

  // ?t=SEC arrives from search results and shared clip links.
  const initialTime = Number(Array.isArray(t) ? t[0] : t);

  return (
    <DetailLayout>
      <MeetingDetail
        meeting={meeting}
        initialTime={Number.isFinite(initialTime) ? initialTime : 0}
      />
    </DetailLayout>
  );
}
