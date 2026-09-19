import { createClient } from "../supabase/server";

export type OnboardingPatch = {
  department?: string;
  role_title?: string;
  crm?: string;
  use_case?: "solo" | "team";
  record_scope?: string;
  share_scope?: string;
  consented_at?: string | null;
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
