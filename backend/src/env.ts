/**
 * Environment access.
 *
 * Supabase is optional on purpose. With no credentials the app falls back to
 * the in-memory fixtures, so the deployed demo keeps working while the backend
 * is being set up, and a reviewer never lands on a crash.
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /* Real Google OAuth is off by default. Google restricts unverified apps to
     added test users, so a reviewer would be blocked -- the demo walks the
     onboarding flow instead. Set to "true" once your account is a test user. */
  enableGoogleAuth: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true",
  zoomClientId: process.env.ZOOM_CLIENT_ID ?? "",
  zoomClientSecret: process.env.ZOOM_CLIENT_SECRET ?? "",
};

/** True when the browser has enough to talk to Supabase. */
export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

/** Whether the sign-in buttons should attempt a real OAuth round trip. */
export function isGoogleAuthEnabled() {
  return env.enableGoogleAuth && isSupabaseConfigured();
}

/** True when the server can act with elevated privileges. */
export function hasServiceRole() {
  return Boolean(env.supabaseUrl && env.supabaseServiceKey);
}

/** Scopes requested at sign-in, so calendar access needs no second consent. */
export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
].join(" ");
