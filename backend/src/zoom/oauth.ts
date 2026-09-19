import { env } from "../env";

/**
 * Zoom OAuth.
 *
 * This is what the real product does, and it is not a mirror of Zoom's signup:
 * we send the user to Zoom's own authorize URL, which renders Zoom's login or
 * sign-up page when they have no session. Once they approve, Zoom redirects
 * back with a code, we exchange it for tokens, and the integration genuinely
 * reads as connected because we can now call the Zoom API as them.
 *
 * A Zoom OAuth app in Development mode works immediately for the developer's
 * own account and any added test users. Review is only needed to let the
 * public connect, which is why this degrades to a link-out when unconfigured.
 */

const AUTHORIZE = "https://zoom.us/oauth/authorize";
const TOKEN = "https://zoom.us/oauth/token";
const API = "https://api.zoom.us/v2";

/** Where Zoom sends the user back. Must match the app's redirect URL exactly. */
export function zoomRedirectUri(origin: string) {
  return `${origin}/api/integrations/zoom/callback`;
}

export function isZoomConfigured() {
  return Boolean(env.zoomClientId && env.zoomClientSecret);
}

export function zoomAuthorizeUrl(origin: string, state: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.zoomClientId,
    redirect_uri: zoomRedirectUri(origin),
    state,
  });
  return `${AUTHORIZE}?${params}`;
}

/** Zoom's public sign-up, for when no OAuth app is configured. */
export const ZOOM_SIGNUP_URL = "https://zoom.us/signup";

export type ZoomTokens = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string;
  scopes: string[];
};

function basicAuth() {
  return Buffer.from(`${env.zoomClientId}:${env.zoomClientSecret}`).toString("base64");
}

async function tokenRequest(body: URLSearchParams): Promise<ZoomTokens> {
  const res = await fetch(TOKEN, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Zoom token exchange failed (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope?: string;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    scopes: data.scope ? data.scope.split(/[\s,]+/).filter(Boolean) : [],
  };
}

export function exchangeCode(code: string, origin: string) {
  return tokenRequest(
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: zoomRedirectUri(origin),
    }),
  );
}

export function refreshTokens(refreshToken: string) {
  return tokenRequest(
    new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  );
}

/** Confirms the token works and gives us an account to display. */
export async function fetchZoomUser(accessToken: string) {
  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  return {
    email: data.email ?? null,
    name: [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
  };
}
