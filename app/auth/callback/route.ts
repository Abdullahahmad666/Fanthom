import { NextResponse } from "next/server";
import { createClient } from "@/backend/src/supabase/server";

/**
 * OAuth landing point. Supabase redirects here with a code, which we exchange
 * for a session before sending the user on to onboarding or the app.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/signup/questionnaire";

  if (!code) {
    return NextResponse.redirect(new URL("/signup?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/signup?error=not_configured", url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/signup?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
