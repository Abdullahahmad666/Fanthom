import type { Meeting } from "./types";

/**
 * Date bucketing for the meeting list.
 *
 * This used to live in the fixtures and measure against a pinned TODAY, which
 * was right when every meeting was seed data authored on one day and wrong the
 * moment the rows became real. It measures against the actual current date
 * now, so "Today" means today.
 */

const DAY = 86_400_000;

/** UTC midnight, so a meeting does not change bucket with the user's clock. */
function midnightUTC(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function daysAgo(date: string, now = new Date()): number {
  const then = Date.parse(`${date}T00:00:00Z`);
  return Math.round((midnightUTC(now) - then) / DAY);
}

export function groupLabel(date: string, now = new Date()): string {
  const diff = daysAgo(date, now);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return "Earlier this week";
  if (diff < 30) return "Earlier this month";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export type MeetingGroup = { label: string; meetings: Meeting[] };

/** Meetings bucketed by date label, newest first within each bucket. */
export function groupByDate(meetings: Meeting[], now = new Date()): MeetingGroup[] {
  const order: string[] = [];
  const buckets = new Map<string, Meeting[]>();

  for (const m of [...meetings].sort((a, b) => b.date.localeCompare(a.date))) {
    const label = groupLabel(m.date, now);
    if (!buckets.has(label)) {
      buckets.set(label, []);
      order.push(label);
    }
    buckets.get(label)!.push(m);
  }

  return order.map((label) => ({ label, meetings: buckets.get(label)! }));
}
