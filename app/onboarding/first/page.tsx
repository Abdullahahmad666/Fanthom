import { redirect } from "next/navigation";
import { getProfile } from "@/backend/src/services/profile";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { FirstTranscriptStep } from "@/components/onboarding/FirstTranscriptStep";
import { findSource } from "@/lib/sources";

export const metadata = {
  title: "Your first transcript",
  /* Behind the sign-in gate. */
  robots: { index: false, follow: false },
};

/**
 * Step 3, and the last one.
 *
 * The step it replaces was a congratulations screen listing three things that
 * had supposedly been set up -- a connected calendar, auto-recording, and
 * automatic sharing -- none of which Cue does. Ending onboarding by telling
 * someone about features that do not exist is the worst possible last
 * impression, because it is the first claim they will go and check.
 *
 * This ends in the product instead: import a transcript, or load a sample
 * meeting into the account and open it. Either way the next thing on screen
 * is a real summary with real cues, which is the thing worth having.
 */
export default async function FirstTranscriptPage() {
  const profile = await getProfile();
  const source = findSource(profile?.transcript_source);

  if (profile?.onboarded_at) redirect("/calls");

  return (
    <OnboardingShell
      step={3}
      eyebrow="Last step"
      title="Bring one meeting."
      lede={
        source
          ? `In ${source.name}: ${source.path}. Drop that file into Cue and you will have your notes in a few seconds.`
          : "Export the transcript from your last call and drop it in. Cue parses it in your browser first, so you see what it found before anything is stored."
      }
      email={profile?.email ?? null}
    >
      <FirstTranscriptStep />
    </OnboardingShell>
  );
}
