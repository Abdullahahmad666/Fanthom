import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/backend/src/supabase/server";

/**
 * Action items on one meeting.
 *
 * Adding one and ticking it off were both React state and nothing else, so an
 * action item written during a call was gone by the next page load and a
 * ticked box untucked itself on reload. Of everything on this page, a checked
 * box is the interaction people most reasonably assume is saved.
 *
 * The meeting is resolved by slug under the caller's own session, so the
 * insert cannot be aimed at somebody else's meeting.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const denied = await requireUser();
  if (denied) return denied;

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "No database configured." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 500) : "";
  if (!text) {
    return NextResponse.json({ ok: false, error: "An action item needs text." }, { status: 400 });
  }

  const tSec = Number.isFinite(Number(body.tSec)) ? Math.round(Number(body.tSec)) : 0;
  const ownerName = typeof body.ownerName === "string" ? body.ownerName.slice(0, 80) : null;

  const { slug } = await params;
  const { data: meeting } = await supabase
    .from("meetings")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!meeting) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("action_items")
    .insert({
      meeting_id: meeting.id,
      text,
      owner_name: ownerName,
      t_sec: tSec,
      done: false,
      manual: true,
    })
    .select("id, text, owner_name, t_sec, done, manual")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({
    ok: true,
    item: {
      id: data.id as string,
      text: data.text as string,
      ownerName: (data.owner_name as string | null) ?? undefined,
      tSec: data.t_sec as number,
      done: data.done as boolean,
      manual: data.manual as boolean,
    },
  });
}
