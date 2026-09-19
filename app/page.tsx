import { ListLayout } from "@/components/layout/ListLayout";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MyCallsPage() {
  return (
    <ListLayout>
      {/* Step 2 replaces this with the date-grouped card grid. */}
      <EmptyState label="No call recordings" />
    </ListLayout>
  );
}
