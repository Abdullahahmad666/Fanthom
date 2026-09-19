import { NextResponse } from "next/server";
import { createClient } from "@/backend/src/supabase/server";

const NEXT_STEP = "/signup/questionnaire";

/**
 * OAuth landing point.
 *
 * Every failure falls through to onboarding instead of surfacing an error.
 * The Google app runs in Testing mode, so only added test users can complete
 * sign-in -- an external reviewer would otherwise be stopped by a consent
 * error they can do nothing about. The flow works signed-out on fixtures, so
 * continuing quietly is strictly better than a dead end.
 *
 * Failures are still logged server-side; they are hidden from the visitor,
 * not from us.
 */
function keepGoing(origin: string, why: string) {
  console.warn(`[auth] continuing without a session: ${why}`);
  return NextResponse.redirect(new URL(`${NEXT_STEP}?guest=1`, origin));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const next = url.searchParams.get("next") ?? NEXT_STEP;

  // Google/Supabase report a refused or unverified consent here.
  const providerError =
    url.searchParams.get("error_description") ?? url.searchParams.get("error");
  if (providerError) return keepGoing(origin, providerError);

  const code = url.searchParams.get("code");
  if (!code) return keepGoing(origin, "no code in callback");

  const supabase = await createClient();
  if (!supabase) return keepGoing(origin, "supabase not configured");

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return keepGoing(origin, `exchange failed: ${error.message}`);

  return NextResponse.redirect(new URL(next, origin));
}
