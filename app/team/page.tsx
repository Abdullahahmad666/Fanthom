import { ListLayout } from "@/components/layout/ListLayout";
import { TeamEdition } from "@/components/team/TeamEdition";

export const metadata = {
  title: "Team Calls",
  description:
    "Bring the productivity boost of Fathom to your entire team: shared call history, CRM automation and conversational analytics.",
};

export default function Page() {
  return (
    <ListLayout>
      <TeamEdition />
    </ListLayout>
  );
}
