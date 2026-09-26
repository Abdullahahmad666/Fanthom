import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/backend/src/supabase/server";

/** Editing a highlight's note, and removing one. Both scoped by RLS. */
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
  const note = typeof body.note === "string" ? body.note.slice(0, 280) : null;
  if (note === null) {
    return NextResponse.json({ ok: false, error: "Nothing to change." }, { status: 400 });
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from("highlights")
    .update({ note })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const denied = await requireUser();
  if (denied) return denied;

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "No database configured." }, { status: 400 });
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from("highlights")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
