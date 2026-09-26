import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/backend/src/supabase/server";

/**
 * Highlights on one meeting.
 *
 * These were React state and nothing else: marking a moment put it on screen
 * and no further. It disappeared on reload, and a clip link shared from it
 * resolved to nothing for the person who received it, because the highlight
 * had only ever existed in the tab that made it. A share feature built on a
 * value that never left the browser cannot work, and this is the missing half.
 *
 * `meeting_id` is looked up by slug under the caller's own session, so a slug
 * belonging to someone else resolves to nothing and there is no row to attach
 * to -- the insert cannot be pointed at another account's meeting.
 */

const KINDS = new Set(["highlight", "action", "question", "decision", "risk"]);

async function meetingIdFor(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  slug: string,
) {
  const { data } = await supabase.from("meetings").select("id").eq("slug", slug).maybeSingle();
  return data?.id as string | undefined;
}

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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected JSON." }, { status: 400 });
  }

  const tSec = Number(body.tSec);
  if (!Number.isFinite(tSec) || tSec < 0) {
    return NextResponse.json({ ok: false, error: "A highlight needs a timestamp." }, { status: 400 });
  }

  const kind = typeof body.kind === "string" && KINDS.has(body.kind) ? body.kind : "highlight";
  const note = typeof body.note === "string" ? body.note.slice(0, 280) : "";
  const endSec = Number.isFinite(Number(body.endSec)) ? Number(body.endSec) : null;
  const createdBy = typeof body.createdBy === "string" ? body.createdBy.slice(0, 80) : null;

  const { slug } = await params;
  const meetingId = await meetingIdFor(supabase, slug);
  if (!meetingId) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("highlights")
    .insert({
      meeting_id: meetingId,
      kind,
      t_sec: Math.round(tSec),
      end_sec: endSec === null ? null : Math.round(endSec),
      note,
      created_by: createdBy,
    })
    .select("id, kind, t_sec, end_sec, note, created_by")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  /* The real id is returned so the client can replace its optimistic one --
     otherwise a share link built straight after creating a highlight would
     carry a temporary id that resolves to nothing. */
  return NextResponse.json({
    ok: true,
    highlight: {
      id: data.id as string,
      kind: data.kind as string,
      tSec: data.t_sec as number,
      endSec: (data.end_sec as number | null) ?? undefined,
      note: data.note as string,
      createdBy: (data.created_by as string | null) ?? undefined,
    },
  });
}
