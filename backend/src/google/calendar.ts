/**
 * Google Calendar.
 *
 * The provider token comes from the Supabase Google sign-in, which requests
 * calendar scopes up front -- so connecting the calendar needs no second
 * consent screen. Events are cached into calendar_events so the app has
 * something to render without calling Google on every request.
 */

export type CalendarEvent = {
  externalId: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  platform: string | null;
  joinUrl: string | null;
  attendees: number;
};

type GoogleEvent = {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  hangoutLink?: string;
  location?: string;
  attendees?: unknown[];
  conferenceData?: {
    conferenceSolution?: { name?: string };
    entryPoints?: { entryPointType?: string; uri?: string }[];
  };
};

/** Works out which platform a calendar entry will actually be held on. */
function detectPlatform(e: GoogleEvent): { platform: string | null; joinUrl: string | null } {
  const video = e.conferenceData?.entryPoints?.find((p) => p.entryPointType === "video");
  const url = e.hangoutLink ?? video?.uri ?? e.location ?? null;
  if (!url) return { platform: null, joinUrl: null };

  if (/meet\.google\.com/.test(url)) return { platform: "Google Meet", joinUrl: url };
  if (/zoom\.us/.test(url)) return { platform: "Zoom", joinUrl: url };
  if (/teams\.(microsoft|live)\.com/.test(url)) return { platform: "Microsoft Teams", joinUrl: url };

  const name = e.conferenceData?.conferenceSolution?.name ?? null;
  return { platform: name, joinUrl: /^https?:/.test(url) ? url : null };
}

export class GoogleAuthError extends Error {
  constructor() {
    super("Google access token is missing or expired. Sign in again to reconnect.");
    this.name = "GoogleAuthError";
  }
}

/** Upcoming events from the primary calendar. */
export async function listUpcomingEvents(
  accessToken: string,
  max = 10,
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: new Date().toISOString(),
    maxResults: String(max),
    singleEvents: "true",
    orderBy: "startTime",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" },
  );

  if (res.status === 401 || res.status === 403) throw new GoogleAuthError();
  if (!res.ok) throw new Error(`Google Calendar responded ${res.status}`);

  const data = (await res.json()) as { items?: GoogleEvent[] };

  return (data.items ?? [])
    .filter((e) => e.start?.dateTime || e.start?.date)
    .map((e) => {
      const { platform, joinUrl } = detectPlatform(e);
      return {
        externalId: e.id,
        title: e.summary?.trim() || "(no title)",
        startsAt: (e.start?.dateTime ?? `${e.start?.date}T00:00:00Z`)!,
        endsAt: e.end?.dateTime ?? null,
        platform,
        joinUrl,
        attendees: Array.isArray(e.attendees) ? e.attendees.length : 0,
      };
    });
}
