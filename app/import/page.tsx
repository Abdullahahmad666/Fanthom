import { ListLayout } from "@/components/layout/ListLayout";
import { ImportView } from "@/components/import/ImportView";

export const metadata = {
  title: "Import a transcript",
  description:
    "Bring a transcript from Zoom, Google Meet or Teams and Cue finds the notes inside it.",
};

export default function ImportPage() {
  /* No rail: this page is a task, and Ask has nothing to answer until the
     meeting exists. */
  return (
    <ListLayout rail={false}>
      <ImportView />
    </ListLayout>
  );
}
