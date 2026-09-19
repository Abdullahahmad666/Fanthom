import { TopBar } from "@/components/layout/TopBar";
import { SettingsView } from "@/components/settings/SettingsView";
import { listIntegrations } from "@/backend/src/services/integrations";

export const metadata = {
  title: "Settings",
  description: "Auto-record, calendar and integrations.",
};

/**
 * Server shell: reads which providers this user has actually connected, then
 * hands them to the interactive view. Returns an empty list when Supabase is
 * unconfigured, so the page still renders in demo mode.
 */
export default async function SettingsPage() {
  const integrations = await listIntegrations();

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <TopBar />
      <SettingsView
        connected={integrations
          .filter((i) => i.status === "connected")
          .map((i) => ({ provider: i.provider, accountEmail: i.accountEmail }))}
      />
    </div>
  );
}
