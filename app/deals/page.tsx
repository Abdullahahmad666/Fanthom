import { ListLayout } from "@/components/layout/ListLayout";
import { NotInPrototype } from "@/components/ui/NotInPrototype";

export const metadata = {
  title: "Deals",
  description: "Deal momentum from every conversation.",
};

export default function Page() {
  return (
    <ListLayout>
      <NotInPrototype title="Deals" />
    </ListLayout>
  );
}
