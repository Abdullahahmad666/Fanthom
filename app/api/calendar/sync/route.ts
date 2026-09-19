import { NextResponse } from "next/server";
import { syncCalendar } from "@/backend/src/services/integrations";

/** Pulls the signed-in user's upcoming events and caches them. */
export async function POST() {
  const result = await syncCalendar();
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
