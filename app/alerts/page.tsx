import { ListLayout } from "@/components/layout/ListLayout";
import { ComingSoon } from "@/components/ui/ComingSoon";

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
      <ComingSoon
        title="Alerts"
        detail="Tell Cue a word or a topic and it will flag every meeting where it comes up, with the moment it was said."
      />
    </ListLayout>
  );
}
