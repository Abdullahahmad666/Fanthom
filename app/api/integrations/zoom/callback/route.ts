import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCode, fetchZoomUser } from "@/backend/src/zoom/oauth";
import { upsertIntegration } from "@/backend/src/services/integrations";

const STATE_COOKIE = "zoom_oauth_state";

/** Where Zoom returns to. Exchanges the code and records the connection. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const settings = (status: string) =>
    NextResponse.redirect(new URL(`/settings?zoom=${status}`, origin));

  const error = url.searchParams.get("error");
  if (error) return settings(`error:${encodeURIComponent(error)}`);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code) return settings("error:missing_code");

  const store = await cookies();
  const expected = store.get(STATE_COOKIE)?.value;
  store.delete(STATE_COOKIE);
  if (!expected || expected !== state) return settings("error:bad_state");

  try {
    const tokens = await exchangeCode(code, origin);
    const profile = await fetchZoomUser(tokens.accessToken);

    const saved = await upsertIntegration("zoom", {
      status: "connected",
      account_email: profile?.email ?? null,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: tokens.expiresAt,
      scopes: tokens.scopes,
    });

    // Signed out, or Supabase not configured: the exchange worked but there is
    // nowhere to persist it, so say so rather than claiming success.
    return settings(saved.ok ? "connected" : "error:not_saved");
  } catch {
    return settings("error:exchange_failed");
  }
}
