import { TopBar } from "@/components/layout/TopBar";
import { SettingsView } from "@/components/settings/SettingsView";
import { getProfile } from "@/backend/src/services/profile";
import type { SourceId } from "@/lib/sources";

export const metadata = {
  /* Behind the sign-in gate: per-account, and a crawler only ever sees
     the login redirect. */
  robots: { index: false, follow: false },
  title: "Settings",
  description: "Your profile, where your transcripts come from, and your data.",
};

/**
 * Server shell: reads the real profile row and hands it to the view.
 *
 * It used to read connected integrations to drive a page of auto-record and
 * auto-capture switches. Cue records nothing, so there was nothing for those
 * switches to be connected to.
 */
export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TopBar />
      <SettingsView
        profile={
          profile
            ? {
                email: profile.email as string,
                full_name: (profile.full_name as string | null) ?? null,
                transcript_source: (profile.transcript_source as SourceId | null) ?? null,
              }
            : null
        }
      />
    </div>
  );
}
