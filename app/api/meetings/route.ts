import { NextResponse } from "next/server";
import { listMeetings } from "@/backend/src/repositories/meetings";

/** The signed-in user's meetings, newest first. RLS scopes the rows. */
export async function GET() {
  const meetings = await listMeetings();
  return NextResponse.json({ meetings, count: meetings.length });
}
