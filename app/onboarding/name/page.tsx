import { redirect } from "next/navigation";
import { getProfile } from "@/backend/src/services/profile";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { NameStep } from "@/components/onboarding/NameStep";

export const metadata = {
  title: "Welcome to Cue",
  /* Behind the sign-in gate. */
  robots: { index: false, follow: false },
};

/**
 * Step 1 of the rebuilt flow.
 *
 * It asks one question, and the answer is used: the name shows up on the
 * meetings you import and in the account menu. The step it replaces asked for
 * a department, a job title and a CRM, and used none of the three.
 */
export default async function NameStepPage() {
  const profile = await getProfile();

  /* Already through onboarding: there is nothing to ask again. */
  if (profile?.onboarded_at) redirect("/calls");

  return (
    <OnboardingShell
      step={1}
      eyebrow="Welcome to Cue"
      title="First, what should we call you?"
      lede="This is the name that appears on the meetings you import. Nothing else is collected — Cue does not ask what you do or which tools you buy, because it would not use the answer."
      email={profile?.email ?? null}
    >
      <NameStep initial={profile?.full_name ?? ""} />
    </OnboardingShell>
  );
}
