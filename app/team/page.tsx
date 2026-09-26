import { ListLayout } from "@/components/layout/ListLayout";
import { TeamEdition } from "@/components/team/TeamEdition";

export const metadata = {
  /* Behind the sign-in gate: per-account, and a crawler only ever sees
     the login redirect. */
  robots: { index: false, follow: false },
  title: "Team Calls",
  description:
    "Bring the productivity boost of Cue to your entire team: shared call history, CRM automation and conversational analytics.",
};

export default function Page() {
  return (
    <ListLayout rail={false}>
      <TeamEdition />
    </ListLayout>
  );
}
