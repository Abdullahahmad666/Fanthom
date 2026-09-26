import { NextResponse } from "next/server";
import { search } from "@/backend/src/repositories/search";
import { requireUser } from "@/backend/src/supabase/server";

/** Search across the signed-in user's own meetings. */
export async function GET(request: Request) {
  const denied = await requireUser();
  if (denied) return denied;

  const q = new URL(request.url).searchParams.get("q") ?? "";
  const results = await search(q);
  return NextResponse.json(results);
}
