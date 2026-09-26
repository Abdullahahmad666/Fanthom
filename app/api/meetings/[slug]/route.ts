import { NextResponse } from "next/server";
import { getMeetingBySlug } from "@/backend/src/repositories/meetings";
import { createClient, requireUser } from "@/backend/src/supabase/server";

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

/**
 * Deletes one meeting.
 *
 * Only whole-account deletion existed before this, which meant the way to get
 * rid of a single bad import was to delete everything you had.
 *
 * Scoped by slug and by RLS together. The `.eq("slug", slug)` names which row,
 * and the policy on the table decides whose -- so a slug belonging to somebody
 * else matches nothing rather than deleting their meeting. Participants,
 * turns, summaries, action items and highlights all cascade from the meeting
 * row, so this is one statement rather than six.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const denied = await requireUser();
  if (denied) return denied;

  const { slug } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "No database configured." }, { status: 400 });
  }

  /* Returning the deleted row is how we tell "deleted" from "was not yours":
     both leave the table unchanged from the caller's point of view otherwise. */
  const { data, error } = await supabase
    .from("meetings")
    .delete()
    .eq("slug", slug)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
