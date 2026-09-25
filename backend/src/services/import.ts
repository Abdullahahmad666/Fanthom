import { createClient } from "../supabase/server";
import { parseTranscript, TranscriptParseError } from "@/lib/transcript/parse";
import { extractNotes } from "@/lib/transcript/extract";

/**
 * Importing a transcript.
 *
 * The whole write is done here rather than in the route so the parse, the
 * extraction and the insert are one operation with one definition of "done".
 *
 * Deliberately not a transaction, because PostgREST has no transaction across
 * requests -- so the order matters instead: the meeting row goes in first and
 * everything else is a child of it, and if a child insert fails the meeting is
 * deleted again. A half-imported meeting is worse than a failed import, since
 * it looks like it worked.
 */

export type ImportResult =
  | {
      ok: true;
      slug: string;
      title: string;
      stats: {
        turns: number;
        speakers: number;
        durationSec: number;
        bullets: number;
        actionItems: number;
        format: string;
      };
    }
  | { ok: false; error: string };

/** Distinct, and stable for a given position in the speaker list. */
const SPEAKER_COLORS = [
  "#c2185b", "#2f6f4f", "#5a4bbd", "#b8552a",
  "#2b6f8f", "#8a6d1f", "#8f2f5f", "#3f6f2f",
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/** A date in the filename beats today's date -- exports are often imported late. */
function dateFrom(filename: string): string {
  const m = filename.match(/(20\d{2})[-_.]?(\d{2})[-_.]?(\d{2})/);
  if (m) {
    const [, y, mo, d] = m;
    const iso = `${y}-${mo}-${d}`;
    if (!Number.isNaN(Date.parse(iso))) return iso;
  }
  return new Date().toISOString().slice(0, 10);
}

/** "GMT20260919-100342_Recording.vtt" -> "Recording" */
function titleFrom(filename: string, fallback: string): string {
  const base = filename.replace(/\.[a-z0-9]+$/i, "");
  const cleaned = base
    .replace(/^GMT\d+[-_]\d+/i, "")
    .replace(/[-_]?transcript$/i, "")
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length >= 3 ? cleaned.replace(/^\w/, (c) => c.toUpperCase()) : fallback;
}

export async function importTranscript({
  raw,
  filename,
  title: providedTitle,
}: {
  raw: string;
  filename: string;
  title?: string;
}): Promise<ImportResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "The database is not configured." };

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "Sign in to import a transcript." };
  const userId = auth.user.id;

  let parsed;
  try {
    parsed = parseTranscript(raw, filename);
  } catch (e) {
    if (e instanceof TranscriptParseError) return { ok: false, error: e.message };
    return { ok: false, error: "That file could not be read as a transcript." };
  }

  if (parsed.turns.length < 2) {
    return { ok: false, error: "That transcript has too few lines to be a meeting." };
  }

  const title = (providedTitle?.trim() || titleFrom(filename, "Imported meeting")).slice(0, 120);
  const notes = extractNotes(parsed.turns, parsed.durationSec);

  /* Slugs are unique per owner, so a second "Weekly sync" gets a suffix
     rather than colliding or silently overwriting the first. */
  const base = slugify(title) || "meeting";
  const { data: taken } = await supabase
    .from("meetings")
    .select("slug")
    .like("slug", `${base}%`);
  const used = new Set((taken ?? []).map((r) => r.slug as string));
  let slug = base;
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;

  const { data: meeting, error: meetingError } = await supabase
    .from("meetings")
    .insert({
      user_id: userId,
      slug,
      title,
      meeting_date: dateFrom(filename),
      start_time: "",
      meeting_code: "",
      platform: "Imported",
      duration_sec: parsed.durationSec,
      source: "import",
      source_filename: filename.slice(0, 200),
    })
    .select("id")
    .single();

  if (meetingError || !meeting) {
    return { ok: false, error: meetingError?.message ?? "Could not create the meeting." };
  }

  /* From here on, any failure removes the meeting again. */
  const abort = async (message: string): Promise<ImportResult> => {
    await supabase.from("meetings").delete().eq("id", meeting.id);
    return { ok: false, error: message };
  };

  const { error: pErr } = await supabase.from("participants").insert(
    parsed.speakers.map((name, i) => ({
      meeting_id: meeting.id,
      name,
      color: SPEAKER_COLORS[i % SPEAKER_COLORS.length],
      is_owner: i === 0,
    })),
  );
  if (pErr) return abort(`Could not save speakers: ${pErr.message}`);

  const { error: tErr } = await supabase.from("transcript_turns").insert(
    parsed.turns.map((t) => ({
      meeting_id: meeting.id,
      speaker_name: t.speaker,
      t_sec: Math.round(t.tSec),
      sentences: t.sentences.map((s) => ({ tSec: Math.round(s.tSec), text: s.text })),
      text_content: t.sentences.map((s) => s.text).join(" "),
    })),
  );
  if (tErr) return abort(`Could not save the transcript: ${tErr.message}`);

  const { error: sErr } = await supabase
    .from("summaries")
    .insert({ meeting_id: meeting.id, template: "general", sections: notes.sections });
  if (sErr) return abort(`Could not save the summary: ${sErr.message}`);

  if (notes.actionItems.length) {
    const { error: aErr } = await supabase.from("action_items").insert(
      notes.actionItems.map((a) => ({
        meeting_id: meeting.id,
        text: a.text,
        owner_name: a.ownerName || null,
        t_sec: Math.round(a.tSec),
        done: false,
        manual: false,
      })),
    );
    if (aErr) return abort(`Could not save action items: ${aErr.message}`);
  }

  return {
    ok: true,
    slug,
    title,
    stats: {
      turns: parsed.turns.length,
      speakers: parsed.speakers.length,
      durationSec: parsed.durationSec,
      bullets: notes.stats.kept,
      actionItems: notes.actionItems.length,
      format: parsed.format,
    },
  };
}
