"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Check, Loader2, ThumbsUp, Video } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ContinueButton } from "@/components/ui/MadLibSelect";
import { GOOGLE_SCOPES, isGoogleAuthEnabled } from "@/backend/src/env";
import { createClient } from "@/backend/src/supabase/client";

/* id, not title: a real calendar repeats titles -- every instance of a
   recurring birthday or standup carries the same one. Google's per-instance
   event id is the only unique thing here. */
type Upcoming = { id: string; time: string; title: string; people: number };

/** Seeded calendar, revealed once "connected" so the step has a real payoff. */
const UPCOMING: Upcoming[] = [
  { id: "seed-1", time: "Tomorrow, 10:00", title: "Q3 Launch Readiness Review", people: 8 },
  { id: "seed-2", time: "Tomorrow, 14:15", title: "BrightCode // Follow-up", people: 3 },
  { id: "seed-3", time: "Thursday, 09:30", title: "Weekly 1:1 // Priya", people: 2 },
];

/**
 * Why a real sync did not produce events.
 *
 * "google-refused" is not here on purpose: Google says exactly what is wrong
 * in its error body, and the service passes that through as `detail`, so
 * showing a fixed string instead would throw away the only useful part.
 */
const SYNC_REASONS: Record<string, string> = {
  "not-configured": "Supabase is not configured, so there is nothing to sync against.",
  "signed-out": "No signed-in session — sign in with Google first.",
  "no-google-token":
    "Signed in, but this session carries no Google token. Supabase drops it when a session is refreshed, so sign in again to get a fresh one.",
};

function whenLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

const PLATFORMS = [
  { id: "zoom", label: "Zoom" },
  { id: "meet", label: "Google Meet" },
  { id: "teams", label: "Microsoft Teams" },
];

export default function ConnectPage() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "connecting" | "done">("idle");
  const [platforms, setPlatforms] = useState<string[]>(["meet"]);
  const [events, setEvents] = useState<Upcoming[]>(UPCOMING);
  const [note, setNote] = useState<string | null>(null);
  const [canRetryAuth, setCanRetryAuth] = useState(false);

  /** Fresh consent, which is the only way to get a new provider token. */
  const reconnect = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding/connect`,
        scopes: GOOGLE_SCOPES,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  };

  /**
   * With NEXT_PUBLIC_ENABLE_GOOGLE_AUTH on, this pulls the signed-in user's
   * real Google Calendar through /api/calendar/sync and lists what comes
   * back. With the flag off it keeps the seeded list and the simulated delay,
   * because a reviewer cannot get past Google's unverified-app screen.
   */
  const connect = async () => {
    setState("connecting");
    setNote(null);
    setCanRetryAuth(false);

    if (!isGoogleAuthEnabled()) {
      setTimeout(() => setState("done"), 1100);
      return;
    }

    try {
      const res = await fetch("/api/calendar/sync", { method: "POST" });
      const data = await res.json();

      if (data.ok && Array.isArray(data.events) && data.events.length > 0) {
        setEvents(
          data.events.map(
            (
              e: { externalId: string; title: string; startsAt: string; attendees: number },
              n: number,
            ) => ({
              /* Fall back to the index only if Google somehow omits an id. */
              id: e.externalId || `event-${n}`,
              title: e.title,
              time: whenLabel(e.startsAt),
              people: e.attendees,
            }),
          ),
        );
      } else if (data.ok) {
        setEvents([]);
        setNote("Google returned no upcoming events on this calendar.");
      } else {
        setNote(data.detail ?? SYNC_REASONS[data.reason] ?? `Sync failed: ${data.reason}`);
        /* Only a stale or unscoped token is fixed by signing in again; an
           unenabled API is not, and offering the button would send you round
           a loop that cannot work. */
        setCanRetryAuth(
          data.reason === "no-google-token" ||
            data.googleReason === "insufficientPermissions" ||
            /expired/i.test(data.detail ?? ""),
        );
      }
    } catch (e) {
      setNote(`Sync failed: ${(e as Error).message}`);
    }

    setState("done");
  };

  return (
    <OnboardingShell
      progress={65}
      eyebrow="Connect your calendar"
      title={
        state === "done"
          ? "Your calendar is connected"
          : "Fathom needs your calendar to know which meetings to join"
      }
      note={
        <>
          <ThumbsUp className="h-5 w-5 shrink-0" />
          Don&apos;t worry, Fathom will only join the meetings that you ask it to.
          You&apos;re in control here.
        </>
      }
    >
      {state !== "done" ? (
        <>
          <button
            type="button"
            onClick={connect}
            disabled={state === "connecting"}
            className="flex h-[70px] w-[420px] max-w-full items-center justify-center gap-3 rounded-xl bg-brand text-[19px] font-medium text-black transition-colors hover:bg-[#33cbff] disabled:opacity-70"
          >
            {state === "connecting" ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" /> Connecting…
              </>
            ) : (
              <>
                <Calendar className="h-6 w-6" /> Connect Google Calendar
              </>
            )}
          </button>

          <p className="mt-8 text-[14px] text-fg-muted">
            Use a different calendar?{" "}
            <button type="button" onClick={connect} className="text-fg underline underline-offset-2">
              Connect Outlook
            </button>
          </p>

          <p className="mt-3 text-[14px] text-fg-muted">
            Never join scheduled meetings?{" "}
            <Link href="/onboarding/preferences" className="text-fg underline underline-offset-2">
              Skip this step
            </Link>
          </p>
        </>
      ) : (
        <div className="w-full max-w-[620px]">
          <div className="rounded-xl bg-raised p-5">
            <p className="section-label mb-4">Upcoming — Fathom will join these</p>
            {note && (
              <div className="mb-4 rounded-lg bg-amberbg px-3 py-2.5">
                <p className="text-[13px] leading-snug text-amber">{note}</p>
                {canRetryAuth && (
                  <button
                    type="button"
                    onClick={reconnect}
                    className="mt-2 text-[13px] font-semibold text-brand underline underline-offset-2"
                  >
                    Reconnect Google
                  </button>
                )}
              </div>
            )}
            {events.length === 0 && !note && (
              <p className="text-[13px] text-fg-muted">Nothing scheduled.</p>
            )}
            <ul className="space-y-3">
              {events.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-fg">
                      {m.title}
                    </span>
                    <span className="block text-[13px] text-fg-muted">
                      {m.time}
                      {m.people > 0 && ` · ${m.people} people`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="section-label mt-8 mb-3">Where you meet</p>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map((p) => {
              const on = platforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setPlatforms((v) =>
                      on ? v.filter((x) => x !== p.id) : [...v, p.id],
                    )
                  }
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-lg px-4 py-3 text-[14px] transition-colors ${
                    on
                      ? "bg-accentsoft text-brand ring-1 ring-brand"
                      : "bg-surface text-fg-muted hover:text-fg"
                  }`}
                >
                  {on ? <Check className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <ContinueButton onClick={() => router.push("/onboarding/preferences")} />
          </div>
        </div>
      )}
    </OnboardingShell>
  );
}
