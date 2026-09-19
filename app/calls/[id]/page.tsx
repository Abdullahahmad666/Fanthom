import { DetailLayout } from "@/components/layout/DetailLayout";

export default async function MeetingDetailPage({
  params,
}: PageProps<"/calls/[id]">) {
  const { id } = await params;

  return (
    <DetailLayout>
      {/* Steps 3-7 build the player, tabs and rail here. */}
      <div className="grid grid-cols-1 gap-7 pt-6 lg:grid-cols-[662px_1fr]">
        <div className="min-h-[400px] rounded-xl bg-content p-6 text-fg-muted">
          Meeting content column — {id}
        </div>
        <div className="text-fg-muted">Right rail</div>
      </div>
    </DetailLayout>
  );
}
