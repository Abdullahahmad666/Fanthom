import { ListLayout } from "@/components/layout/ListLayout";
import { NotInPrototype } from "@/components/ui/NotInPrototype";

export const metadata = {
  title: "Team Calls",
  description: "Your team's recorded calls.",
};

export default function Page() {
  return (
    <ListLayout>
      <NotInPrototype title="Team Calls" />
    </ListLayout>
  );
}
