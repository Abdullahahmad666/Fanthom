import { createClient } from "../supabase/server";
import type {
  ActionItem,
  Highlight,
  HighlightKind,
  Meeting,
  Participant,
  SummarySection,
  TemplateId,
  TranscriptTurn,
} from "@/lib/types";

/**
 * The only place meetings are read from.
 *
 * Every page used to import `lib/fixtures` directly, which meant the domain
 * type and the data source were the same thing and there was no seam to swap.
 * Now the UI keeps speaking the domain type and this module is the single
 * translation from Postgres rows to it -- so fixtures become seed input
 * rather than a runtime dependency.
 *
 * Nothing here invents data. If the database is unreachable or empty the
 * caller gets null or an empty list and renders an empty state, because a
 * silent fall back to demo content is how a prototype starts lying about
 * what it is.
 */

/** Shape of the joined select below, kept honest against the schema. */
type MeetingRow = {
  id: string;
  slug: string;
  title: string;
  meeting_date: string;
  start_time: string | null;
  meeting_code: string | null;
  platform: string;
  duration_sec: number;
  poster_from: string;
  poster_to: string;
  source: string;
  source_filename: string | null;
  participants: {
    id: string;
    name: string;
    email: string | null;
    role_title: string | null;
    company: string | null;
    color: string;
    is_owner: boolean;
  }[];
  transcript_turns: {
    id: string;
    speaker_name: string;
    t_sec: number;
    sentences: unknown;
  }[];
  summaries: { template: string; sections: unknown }[];
  action_items: {
    id: string;
    text: string;
    owner_name: string | null;
    t_sec: number;
    done: boolean;
    manual: boolean;
  }[];
  highlights: {
    id: string;
    kind: string;
    t_sec: number;
    end_sec: number | null;
    note: string;
    created_by: string | null;
  }[];
};

const FULL_SELECT = `
  id, slug, title, meeting_date, start_time, meeting_code, platform,
  duration_sec, poster_from, poster_to, source, source_filename,
  participants ( id, name, email, role_title, company, color, is_owner ),
  transcript_turns ( id, speaker_name, t_sec, sentences ),
  summaries ( template, sections ),
  action_items ( id, text, owner_name, t_sec, done, manual ),
  highlights ( id, kind, t_sec, end_sec, note, created_by )
`;

/** Rows carry a display name; the UI keys speakers by id. */
const speakerKey = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "speaker";

function toParticipant(row: MeetingRow["participants"][number]): Participant {
  return {
    id: speakerKey(row.name),
    name: row.name,
    role: row.role_title ?? "",
    company: row.company ?? "",
    color: row.color,
    isOwner: row.is_owner,
    email: row.email ?? undefined,
  };
}

function toTurn(row: MeetingRow["transcript_turns"][number]): TranscriptTurn {
  const raw = Array.isArray(row.sentences) ? row.sentences : [];
  return {
    id: row.id,
    speakerId: speakerKey(row.speaker_name),
    tSec: row.t_sec,
    sentences: raw.map((s, i) => {
      const o = (s ?? {}) as { id?: string; tSec?: number; t_sec?: number; text?: string };
      return {
        id: o.id ?? `${row.id}-${i}`,
        tSec: o.tSec ?? o.t_sec ?? row.t_sec,
        text: o.text ?? "",
      };
    }),
  };
}

function toMeeting(row: MeetingRow): Meeting {
  const summaries: Partial<Record<TemplateId, SummarySection[]>> = {};
  for (const s of row.summaries ?? []) {
    summaries[s.template as TemplateId] = (s.sections ?? []) as SummarySection[];
  }

  const participants = (row.participants ?? []).map(toParticipant);
  const ownerName = row.participants?.find((p) => p.is_owner)?.name ?? "";

  return {
    id: row.slug,
    title: row.title,
    date: row.meeting_date,
    startTime: row.start_time ?? "",
    meetingCode: row.meeting_code ?? "",
    platform: row.platform as Meeting["platform"],
    durationSec: row.duration_sec,
    poster: [row.poster_from, row.poster_to],
    participants,
    summaries,
    transcript: (row.transcript_turns ?? [])
      .slice()
      .sort((a, b) => a.t_sec - b.t_sec)
      .map(toTurn),
    actionItems: (row.action_items ?? []).map(
      (a): ActionItem => ({
        id: a.id,
        text: a.text,
        ownerId: speakerKey(a.owner_name ?? ownerName),
        tSec: a.t_sec,
        done: a.done,
        manual: a.manual,
      }),
    ),
    highlights: (row.highlights ?? [])
      .slice()
      .sort((a, b) => a.t_sec - b.t_sec)
      .map(
        (h): Highlight => ({
          id: h.id,
          kind: h.kind as HighlightKind,
          tSec: h.t_sec,
          endSec: h.end_sec ?? undefined,
          note: h.note,
          createdBy: speakerKey(h.created_by ?? ownerName),
        }),
      ),
  };
}

/** Enough for a list row, without dragging every transcript turn across. */
export type MeetingSummaryRow = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  platform: string;
  durationSec: number;
  poster: [string, string];
  participants: Participant[];
  actionItemCount: number;
  highlightCount: number;
  source: string;
};

export async function listMeetings(): Promise<MeetingSummaryRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("meetings")
    .select(
      `id, slug, title, meeting_date, start_time, platform, duration_sec,
       poster_from, poster_to, source,
       participants ( id, name, email, role_title, company, color, is_owner ),
       action_items ( id ), highlights ( id )`,
    )
    .order("meeting_date", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.slug,
    title: row.title,
    date: row.meeting_date,
    startTime: row.start_time ?? "",
    platform: row.platform,
    durationSec: row.duration_sec,
    poster: [row.poster_from, row.poster_to] as [string, string],
    participants: (row.participants ?? []).map(toParticipant),
    actionItemCount: row.action_items?.length ?? 0,
    highlightCount: row.highlights?.length ?? 0,
    source: row.source,
  }));
}

/**
 * Every meeting with its transcript.
 *
 * Heavier than the list needs, but the list currently searches transcripts in
 * the browser. Step 5 moves that to a Postgres full-text query against the
 * index added in migration 0002, at which point this collapses back to the
 * light select above.
 */
export async function listMeetingsFull(): Promise<Meeting[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("meetings")
    .select(FULL_SELECT)
    .order("meeting_date", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as MeetingRow[]).map(toMeeting);
}

export async function getMeetingBySlug(slug: string): Promise<Meeting | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("meetings")
    .select(FULL_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return toMeeting(data as unknown as MeetingRow);
}

/** Slugs for static params and sitemap generation. */
export async function listMeetingSlugs(): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("meetings").select("slug");
  return (data ?? []).map((r) => r.slug as string);
}
