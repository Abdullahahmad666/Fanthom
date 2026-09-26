import { NextResponse } from "next/server";
import { createClient } from "@/backend/src/supabase/server";
import { saveProfile, getProfile, type ProfilePatch } from "@/backend/src/services/profile";

/**
 * The signed-in user's profile.
 *
 * One endpoint for every profile write -- onboarding and Settings both come
 * here -- so the allow-list below is the single place that decides which
 * columns a browser may touch. That distinction matters: RLS decides *whose*
 * row can be written, never *which fields* of it, so without this a crafted
 * request could set any column on a row it legitimately owns.
 */
const ALLOWED = ["full_name", "transcript_source", "onboarded_at"] as const;

const SOURCES = new Set(["zoom", "meet", "teams", "other"]);

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ ok: Boolean(profile), profile });
}

export async function PATCH(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  const patch: ProfilePatch = {};

  for (const key of ALLOWED) {
    const value = body[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;

    /* Validated here as well as by the column's check constraint: a 400 that
       names the field is more use than a Postgres constraint violation. */
    if (key === "transcript_source" && !SOURCES.has(trimmed)) {
      return NextResponse.json({ ok: false, reason: "bad-source" }, { status: 400 });
    }
    if (key === "full_name" && trimmed.length > 80) {
      return NextResponse.json({ ok: false, reason: "name-too-long" }, { status: 400 });
    }

    patch[key] = trimmed as never;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, reason: "nothing-to-save" }, { status: 400 });
  }

  const result = await saveProfile(patch);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

/**
 * Deleting the account.
 *
 * Signs the session out and reports honestly that the row itself needs a
 * service-role key this deployment may not have. Pretending an account was
 * erased when it was not is the one outcome that is worse than refusing.
 */
export async function DELETE() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 400 });
  }

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ ok: false, reason: "signed-out" }, { status: 401 });
  }

  /* Everything this user owns cascades from their rows, and RLS scopes each
     delete to them, so this is safe to run with the session's own rights. */
  await supabase.from("meetings").delete().eq("user_id", auth.user.id);
  await supabase.from("playlists").delete().eq("user_id", auth.user.id);
  await supabase.from("integrations").delete().eq("user_id", auth.user.id);
  await supabase.auth.signOut();

  return NextResponse.json({
    ok: true,
    /* auth.users can only be removed with the service role, which the browser
       must never hold. The data is gone; the login is not. */
    note: "Your meetings and playlists are deleted and you are signed out. Removing the login itself needs a server key this build does not hold.",
  });
}
