"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Check, Loader2, ThumbsUp, Video } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ContinueButton } from "@/components/ui/MadLibSelect";

/** Seeded calendar, revealed once "connected" so the step has a real payoff. */
const UPCOMING = [
  { time: "Tomorrow, 10:00", title: "Q3 Launch Readiness Review", people: 8 },
  { time: "Tomorrow, 14:15", title: "BrightCode // Follow-up", people: 3 },
  { time: "Thursday, 09:30", title: "Weekly 1:1 // Priya", people: 2 },
];

const PLATFORMS = [
  { id: "zoom", label: "Zoom" },
  { id: "meet", label: "Google Meet" },
  { id: "teams", label: "Microsoft Teams" },
];

export default function ConnectPage() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "connecting" | "done">("idle");
  const [platforms, setPlatforms] = useState<string[]>(["meet"]);

  const connect = () => {
    setState("connecting");
    // No OAuth here -- capture is stubbed. The delay stands in for the
    // round-trip so the state change reads as a real connection.
    setTimeout(() => setState("done"), 1100);
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
            <ul className="space-y-3">
              {UPCOMING.map((m) => (
                <li key={m.title} className="flex items-center gap-3">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-fg">
                      {m.title}
                    </span>
                    <span className="block text-[13px] text-fg-muted">
                      {m.time} · {m.people} people
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
