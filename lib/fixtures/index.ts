import type { Meeting } from "../types";
import { impromptu } from "./impromptu";
import { launchReadiness } from "./launch-readiness";
import { brightcodeDiscovery, designSync, onboardingCall } from "./others";

/**
 * The demo's reference "today". Pinned rather than using Date.now() so the
 * date grouping stays meaningful however long after the build this is opened --
 * otherwise every seeded meeting drifts into "3 months ago" and the Today /
 * Yesterday grouping stops demonstrating anything.
 */
export const TODAY = "2026-09-19";

export const MEETINGS: Meeting[] = [
  launchReadiness,
  impromptu,
  brightcodeDiscovery,
  designSync,
  onboardingCall,
];

export function getMeeting(id: string): Meeting | undefined {
  return MEETINGS.find((m) => m.id === id);
}

function dayOffset(date: string): number {
  const a = Date.parse(`${date}T00:00:00Z`);
  const b = Date.parse(`${TODAY}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

export function groupLabel(date: string): string {
  const diff = dayOffset(date);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return "Earlier this week";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export type MeetingGroup = { label: string; meetings: Meeting[] };

/** Meetings bucketed by date label, newest first within each bucket. */
export function groupByDate(meetings: Meeting[]): MeetingGroup[] {
  const order: string[] = [];
  const buckets = new Map<string, Meeting[]>();

  for (const m of [...meetings].sort((a, b) => b.date.localeCompare(a.date))) {
    const label = groupLabel(m.date);
    if (!buckets.has(label)) {
      buckets.set(label, []);
      order.push(label);
    }
    buckets.get(label)!.push(m);
  }

  return order.map((label) => ({ label, meetings: buckets.get(label)! }));
}
