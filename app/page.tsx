import { ListLayout } from "@/components/layout/ListLayout";
import { CallList } from "@/components/calls/CallList";

export default function MyCallsPage() {
  return (
    <ListLayout>
      <CallList />
    </ListLayout>
  );
}
