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

/**
 * Google refused the call.
 *
 * 401 and 403 mean completely different things here -- an expired token, a
 * token without calendar scope, and a project with the Calendar API switched
 * off all land on this path and need different fixes. Google says which in
 * the error body, so that reason is carried through rather than flattened
 * into one message.
 */
export class GoogleAuthError extends Error {
  /** Google's own machine reason, e.g. accessNotConfigured. */
  readonly reason: string;
  /** What the person using it should actually do. */
  readonly fix: string;

  constructor(status: number, reason: string, detail: string) {
    const fix = explain(status, reason, detail);
    super(fix);
    this.name = "GoogleAuthError";
    this.reason = reason;
    this.fix = fix;
  }
}

function explain(status: number, reason: string, detail: string) {
  if (reason === "accessNotConfigured" || /has not been used in project|is disabled/i.test(detail)) {
    return "The Google Calendar API is not enabled on this Google Cloud project. Enable it under APIs & Services -> Library -> Google Calendar API, then try again.";
  }
  if (reason === "insufficientPermissions" || /insufficient authentication scopes/i.test(detail)) {
    return "This sign-in did not grant calendar access. Add the calendar scopes to the OAuth consent screen, then sign out and back in to re-consent.";
  }
  if (status === 401) {
    return "Google's access token has expired. Sign in again to reconnect — tokens last about an hour and are not renewed by a session refresh.";
  }
  if (reason === "rateLimitExceeded" || status === 429) {
    return "Google is rate limiting this project. Wait a moment and try again.";
  }
  return `Google refused the request (${status}${reason ? ` ${reason}` : ""}). ${detail}`.trim();
}

type GoogleError = {
  error?: { message?: string; errors?: { reason?: string; message?: string }[] };
};

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

  if (res.status === 401 || res.status === 403 || res.status === 429) {
    /* Read the body before throwing: it is the only place Google says which
       of the several 403s this is. */
    let reason = "";
    let detail = "";
    try {
      const body = (await res.json()) as GoogleError;
      reason = body.error?.errors?.[0]?.reason ?? "";
      detail = body.error?.message ?? "";
    } catch {
      // Non-JSON error body; the status alone will have to do.
    }
    throw new GoogleAuthError(res.status, reason, detail);
  }
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
