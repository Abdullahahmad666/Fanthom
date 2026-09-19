import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  isZoomConfigured,
  zoomAuthorizeUrl,
  ZOOM_SIGNUP_URL,
} from "@/backend/src/zoom/oauth";

const STATE_COOKIE = "zoom_oauth_state";

/**
 * Sends the user to Zoom to authorise. Zoom shows its own login or sign-up
 * page if they have no session there, which is the flow the real product uses.
 *
 * With no OAuth app configured we send them to Zoom's sign-up instead of
 * pretending to connect.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  if (!isZoomConfigured()) {
    return NextResponse.redirect(ZOOM_SIGNUP_URL);
  }

  // Random state, echoed back by Zoom, to reject forged callbacks.
  const state = crypto.randomUUID();
  const store = await cookies();
  store.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https"),
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(zoomAuthorizeUrl(origin, state));
}
