import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "../env";

/**
 * Server client bound to the request's cookies, so RLS sees the signed-in user.
 * Null when unconfigured.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;
  const store = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component; middleware refreshes the session.
        }
      },
    },
  });
}

/** Current user, or null. */
export async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/**
 * Guard for API routes: returns a 401 response when signed out, else null.
 *
 * `if (denied) return denied;` at the top of a handler reads as a guard and
 * cannot be forgotten halfway down, which is the failure mode of checking the
 * user and then remembering to branch on it.
 *
 * Only meaningful where Supabase is configured. Without it nobody can sign in
 * at all, and refusing every request would break the sample-data deployment
 * for no security gain -- there is nothing to protect.
 */
export async function requireUser() {
  if (!isSupabaseConfigured()) return null;

  const user = await getUser();
  if (user) return null;

  return NextResponse.json(
    { ok: false, error: "Sign in to use this." },
    { status: 401 },
  );
}
