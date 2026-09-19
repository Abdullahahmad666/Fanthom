import type { Meeting } from "./types";

export type SearchHit = {
  /** Where the match came from, so the UI can explain itself. */
  field: "title" | "participant" | "transcript" | "summary" | "action";
  /** Snippet with the match in context. */
  snippet: string;
  /** Seek target, when the hit came from something on the timeline. */
  tSec?: number;
};

export type MeetingResult = {
  meeting: Meeting;
  hits: SearchHit[];
};

function snippet(text: string, term: string, pad = 46): string {
  const i = text.toLowerCase().indexOf(term);
  if (i === -1) return text.slice(0, pad * 2);
  const start = Math.max(0, i - pad);
  const end = Math.min(text.length, i + term.length + pad);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

/**
 * Search across every meeting, not just titles.
 *
 * The brief calls out "search across meetings" specifically, and the useful
 * version of that searches what was *said* -- so transcript sentences are
 * first-class results and carry a timestamp you can jump straight to.
 */
export function searchMeetings(meetings: Meeting[], query: string): MeetingResult[] {
  const term = query.trim().toLowerCase();
  if (!term) return meetings.map((meeting) => ({ meeting, hits: [] }));

  const results: MeetingResult[] = [];

  for (const meeting of meetings) {
    const hits: SearchHit[] = [];

    if (meeting.title.toLowerCase().includes(term)) {
      hits.push({ field: "title", snippet: meeting.title });
    }

    for (const p of meeting.participants) {
      if (p.name.toLowerCase().includes(term) || p.company.toLowerCase().includes(term)) {
        hits.push({ field: "participant", snippet: `${p.name} · ${p.role}, ${p.company}` });
        break;
      }
    }

    // Transcript matches are capped so one chatty meeting cannot swamp the list.
    let transcriptHits = 0;
    for (const turn of meeting.transcript) {
      for (const s of turn.sentences) {
        if (transcriptHits >= 3) break;
        if (s.text.toLowerCase().includes(term)) {
          hits.push({ field: "transcript", snippet: snippet(s.text, term), tSec: s.tSec });
          transcriptHits++;
        }
      }
      if (transcriptHits >= 3) break;
    }

    for (const sections of Object.values(meeting.summaries)) {
      let matched = false;
      for (const section of sections ?? []) {
        for (const block of section.blocks) {
          const text =
            block.kind === "para"
              ? block.text
              : block.items.map((i) => `${i.label ? `${i.label}: ` : ""}${i.text}`).join(" ");
          if (text.toLowerCase().includes(term)) {
            hits.push({ field: "summary", snippet: snippet(text, term) });
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
      if (matched) break;
    }

    for (const item of meeting.actionItems) {
      if (item.text.toLowerCase().includes(term)) {
        hits.push({ field: "action", snippet: item.text, tSec: item.tSec });
        break;
      }
    }

    if (hits.length) results.push({ meeting, hits });
  }

  return results;
}
