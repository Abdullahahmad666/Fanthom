import { ListLayout } from "@/components/layout/ListLayout";
import { NotInPrototype } from "@/components/ui/NotInPrototype";

export const metadata = {
  title: "Alerts",
  description: "Keyword and topic alerts across your calls.",
};

export default function Page() {
  return (
    <ListLayout rail={false}>
      <NotInPrototype title="Alerts" />
    </ListLayout>
  );
}
