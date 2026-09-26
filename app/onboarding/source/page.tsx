import { redirect } from "next/navigation";
import { getProfile } from "@/backend/src/services/onboarding";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { SourceStep } from "@/components/onboarding/SourceStep";

export const metadata = { title: "Where your meetings happen" };

/**
 * Step 2.
 *
 * The step it replaces was "Connect Google Calendar", which Cue has no use
 * for -- it never reads a calendar and never joins a call. This asks the
 * question Cue actually needs answered: which tool writes your transcripts,
 * so the import screen can give you the right four-word menu path instead of
 * a generic "export your transcript".
 *
 * There is nothing to authorise, which is the point worth making on the way
 * past: no OAuth screen, no scopes, no bot added to your meetings.
 */
export default async function SourceStepPage() {
  const profile = await getProfile();
  if (profile?.onboarded_at) redirect("/calls");

  return (
    <OnboardingShell
      step={2}
      eyebrow="Your meetings"
      title="Where do your meetings happen?"
      lede="Cue reads the transcript your conferencing tool already writes. Telling it which one means the import screen can show you exactly where that file lives."
      email={profile?.email ?? null}
      note="Nothing is connected and no permissions are requested. You can change this later."
    >
      <SourceStep initial={profile?.transcript_source ?? null} />
    </OnboardingShell>
  );
}
