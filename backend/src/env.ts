import { resolveSiteUrl } from "@/lib/siteUrl";

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
  /* Resolved rather than read: an empty-but-present variable must not
     become an empty origin. See lib/siteUrl. */
  siteUrl: resolveSiteUrl(),
  /* Real Google OAuth is off by default. Google restricts unverified apps to
     added test users, so a visitor who is not one would be blocked on Google's
     own domain. Email and password has no such gate and is the primary path. */
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

/**
 * Scopes requested at sign-in.
 *
 * Identity only. It used to ask for calendar.readonly and
 * calendar.events.readonly up front, on the theory that connecting a calendar
 * later would then need no second consent -- but Cue never reads a calendar,
 * so that consent bought nothing and cost a great deal.
 *
 * Calendar scopes are "sensitive" to Google: they turn a one-tap sign-in into
 * a screen warning that this app wants to see your schedule, and they put the
 * app into a verification tier it does not need. Asking for access you have no
 * use for is the fastest way to lose someone at the door, and it is the wrong
 * thing to ask for regardless of whether they say yes.
 */
export const GOOGLE_SCOPES = ["openid", "email", "profile"].join(" ");
