import { createClient } from "../supabase/server";

/**
 * Search.
 *
 * Two kinds of answer, kept apart because they answer different questions.
 * "Which meeting was that?" wants titles. "Where did someone say X?" wants
 * moments, and that is the one the product is actually for -- so it is the
 * one backed by an index and a ranking function rather than a substring
 * match.
 */

export type Moment = {
  meetingSlug: string;
  meetingTitle: string;
  meetingDate: string;
  speaker: string;
  tSec: number;
  /** Fragments of the matched turn; odd indexes are the matched words. */
  parts: string[];
  rank: number;
};

export type MeetingMatch = {
  slug: string;
  title: string;
  date: string;
};

export type SearchResults = {
  moments: Moment[];
  meetings: MeetingMatch[];
  /** False when search could not run, as opposed to running and finding nothing. */
  ok: boolean;
  /** Why it could not run, in words a person can act on. */
  reason?: string;
};

/**
 * The database marks matches with guillemets rather than HTML, so the client
 * can highlight without ever being handed markup to trust.
 */
function splitHighlights(snippet: string): string[] {
  return snippet.split(/«|»/);
}

export async function search(query: string, limit = 40): Promise<SearchResults> {
  const q = query.trim();
  const empty = { moments: [], meetings: [], ok: true };
  if (q.length < 2) return empty;

  const supabase = await createClient();
  if (!supabase) {
    return { ...empty, ok: false, reason: "The database is not configured." };
  }

  const [momentsResult, titlesResult] = await Promise.all([
    supabase.rpc("search_moments", { q, lim: limit }),
    supabase
      .from("meetings")
      .select("slug, title, meeting_date")
      .ilike("title", `%${q}%`)
      .order("meeting_date", { ascending: false })
      .limit(6),
  ]);

  if (momentsResult.error) {
    /* Distinguish "not migrated yet" from "not working". Telling someone the
       network failed when the function simply does not exist sends them
       looking in the wrong place entirely. */
    const message = momentsResult.error.message ?? "";
    const missing =
      /could not find the function|does not exist|schema cache/i.test(message);

    return {
      ...empty,
      ok: false,
      reason: missing
        ? "Search needs migration 0003_search.sql — run it in the Supabase SQL editor."
        : `Search failed: ${message}`,
    };
  }

  type Row = {
    meeting_slug: string;
    meeting_title: string;
    meeting_date: string;
    speaker_name: string;
    t_sec: number;
    snippet: string;
    rank: number;
  };

  const moments = ((momentsResult.data ?? []) as Row[]).map((r) => ({
    meetingSlug: r.meeting_slug,
    meetingTitle: r.meeting_title,
    meetingDate: r.meeting_date,
    speaker: r.speaker_name,
    tSec: r.t_sec,
    parts: splitHighlights(r.snippet ?? ""),
    rank: r.rank,
  }));

  const meetings = (titlesResult.data ?? []).map((m) => ({
    slug: m.slug as string,
    title: m.title as string,
    date: m.meeting_date as string,
  }));

  return { moments, meetings, ok: true };
}
