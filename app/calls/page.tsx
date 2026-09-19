import { ListLayout } from "@/components/layout/ListLayout";
import { CallList } from "@/components/calls/CallList";

export const metadata = {
  title: "My Calls",
  description: "Every recorded call, grouped by day, searchable across transcripts.",
};

export default async function MyCallsPage({ searchParams }: PageProps<"/calls">) {
  const { q } = await searchParams;
  const initialQuery = (Array.isArray(q) ? q[0] : q) ?? "";

  return (
    <ListLayout initialQuery={initialQuery}>
      <CallList />
    </ListLayout>
  );
}
