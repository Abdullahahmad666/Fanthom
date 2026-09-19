import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env, hasServiceRole } from "../env";

/**
 * Service-role client. Bypasses RLS, so it is only ever used from server code
 * that has already established who the caller is -- seeding and token refresh.
 */
export function createAdminClient() {
  if (!hasServiceRole()) return null;
  return createSupabaseClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
