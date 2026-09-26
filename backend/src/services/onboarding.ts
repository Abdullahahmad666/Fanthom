import { createClient } from "../supabase/server";

/**
 * What Cue's onboarding actually collects.
 *
 * The fields the old flow wrote -- department, role_title, crm, use_case,
 * record_scope, share_scope -- are gone from this type. The columns still
 * exist (see migration 0004) but nothing reads them, and keeping them here
 * would invite the next person to start filling them in again.
 */
export type OnboardingPatch = {
  /** Shown on imported meetings and in the account menu. */
  full_name?: string;
  /** Decides which export instructions the import screen shows. */
  transcript_source?: "zoom" | "meet" | "teams" | "other";
  /** Set once, at the end, so the flow is not re-offered. */
  onboarded_at?: string | null;
};

/** Persists one onboarding step. No-ops when Supabase is not configured. */
export async function saveOnboarding(patch: OnboardingPatch) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, reason: "not-configured" as const };

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false as const, reason: "signed-out" as const };

  const { error } = await supabase.from("profiles").update(patch).eq("id", auth.user.id);
  return error
    ? { ok: false as const, reason: error.message }
    : { ok: true as const };
}

export async function getProfile() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();
  return data;
}
