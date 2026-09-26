import { ListLayout } from "@/components/layout/ListLayout";
import { NotInPrototype } from "@/components/ui/NotInPrototype";

export const metadata = {
  /* Behind the sign-in gate: per-account, and a crawler only ever sees
     the login redirect. */
  robots: { index: false, follow: false },
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
