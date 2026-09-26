import { NextResponse } from "next/server";
import { listMeetings } from "@/backend/src/repositories/meetings";
import { requireUser } from "@/backend/src/supabase/server";

/**
 * The signed-in user's meetings, newest first.
 *
 * RLS already makes this safe -- an anonymous request simply matches no rows.
 * The explicit check is about clarity rather than safety: `{"meetings":[]}` is
 * the same answer for "you are signed out" and "you have no meetings yet", and
 * a caller cannot tell those apart. A 401 can be acted on.
 */
export async function GET() {
  const denied = await requireUser();
  if (denied) return denied;

  const meetings = await listMeetings();
  return NextResponse.json({ meetings, count: meetings.length });
}
