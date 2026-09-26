import { NextResponse } from "next/server";
import { getMeetingBySlug } from "@/backend/src/repositories/meetings";
import { requireUser } from "@/backend/src/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const denied = await requireUser();
  if (denied) return denied;

  const { slug } = await params;
  const meeting = await getMeetingBySlug(slug);

  if (!meeting) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ meeting });
}
