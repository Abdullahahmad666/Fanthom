import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/backend/src/supabase/server";

/** Ticking an action item off, and back on again. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const denied = await requireUser();
  if (denied) return denied;

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "No database configured." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  if (typeof body.done !== "boolean") {
    return NextResponse.json({ ok: false, error: "Expected done: boolean." }, { status: 400 });
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from("action_items")
    .update({ done: body.done })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
