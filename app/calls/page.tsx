import { ListLayout } from "@/components/layout/ListLayout";
import { CallList } from "@/components/calls/CallList";
import { listMeetingsFull } from "@/backend/src/repositories/meetings";

export const metadata = {
  title: "My Calls",
  description: "Every recorded call, grouped by day, searchable across transcripts.",
};

export default async function MyCallsPage({ searchParams }: PageProps<"/calls">) {
  const { q } = await searchParams;
  const initialQuery = (Array.isArray(q) ? q[0] : q) ?? "";

  /* Read once on the server; the list is a client component only because it
     filters as you type. */
  const meetings = await listMeetingsFull();

  return (
    <ListLayout initialQuery={initialQuery}>
      <CallList meetings={meetings} />
    </ListLayout>
  );
}
