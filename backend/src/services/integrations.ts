import { createClient } from "../supabase/server";
import { listUpcomingEvents, GoogleAuthError } from "../google/calendar";

export type ProviderId = "google_calendar" | "zoom" | "teams" | "google_meet";

export type IntegrationStatus = {
  provider: ProviderId;
  status: "connected" | "partial" | "disconnected";
  accountEmail: string | null;
};

export async function listIntegrations(): Promise<IntegrationStatus[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("integration_status")
    .select("provider, status, account_email");

  return (data ?? []).map((r) => ({
    provider: r.provider as ProviderId,
    status: r.status as IntegrationStatus["status"],
    accountEmail: r.account_email,
  }));
}

export async function upsertIntegration(
  provider: ProviderId,
  patch: Partial<{
    status: string;
    account_email: string | null;
    access_token: string | null;
    refresh_token: string | null;
    scopes: string[];
  }>,
) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const };
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false as const };

  const { error } = await supabase
    .from("integrations")
    .upsert({ user_id: auth.user.id, provider, ...patch }, { onConflict: "user_id,provider" });

  return error ? { ok: false as const, reason: error.message } : { ok: true as const };
}

/**
 * Pulls the calendar and caches it.
 *
 * The provider token lives on the Supabase session rather than in our table,
 * because Google returns a fresh one on each sign-in and storing a stale copy
 * only creates a second source of truth to keep in sync.
 */
export async function syncCalendar() {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, reason: "not-configured" as const };

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session?.user) return { ok: false as const, reason: "signed-out" as const };

  const token = session.provider_token;
  if (!token) return { ok: false as const, reason: "no-google-token" as const };

  try {
    const events = await listUpcomingEvents(token, 12);

    if (events.length) {
      await supabase.from("calendar_events").upsert(
        events.map((e) => ({
          user_id: session.user.id,
          external_id: e.externalId,
          title: e.title,
          starts_at: e.startsAt,
          ends_at: e.endsAt,
          platform: e.platform,
          join_url: e.joinUrl,
          attendees: e.attendees,
          synced_at: new Date().toISOString(),
        })),
        { onConflict: "user_id,external_id" },
      );
    }

    await upsertIntegration("google_calendar", {
      status: "connected",
      account_email: session.user.email ?? null,
    });

    return { ok: true as const, count: events.length, events };
  } catch (e) {
    if (e instanceof GoogleAuthError) {
      return { ok: false as const, reason: "reauth-required" as const };
    }
    return { ok: false as const, reason: (e as Error).message };
  }
}

export async function listCachedEvents(limit = 10) {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}
