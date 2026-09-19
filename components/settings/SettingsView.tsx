"use client";

import { useState } from "react";
import { Check, Download, ExternalLink, Link2, Star } from "lucide-react";

import { MadLibSelect } from "@/components/ui/MadLibSelect";
import { Toggle } from "./parts";
import { SettingsExtras } from "./SettingsExtras";

const RECORD = ["All meetings", "Only external meetings", "Only meetings I host", "No meetings"];
const SHARE = ["Summary & recording", "Summary only", "Nothing"];

type Integration = {
  id: string;
  name: string;
  status: "full" | "partial";
  statusLabel: string;
  body: string;
  action?: { label: string; icon: "link" | "download" };
  rows?: { label: string; kind: "toggle" | "button"; buttonLabel?: string }[];
  starred?: boolean;
  mark: string;
  markClass: string;
};

const INTEGRATIONS: Integration[] = [
  {
    id: "zoom",
    name: "Zoom",
    status: "partial",
    statusLabel: "Partially Enabled",
    body: "Connect to Zoom account for more reliable recording.",
    action: { label: "Connect", icon: "link" },
    starred: true,
    mark: "Z",
    markClass: "bg-[#2D8CFF]",
    rows: [
      { label: "Auto-capture unscheduled Zoom meetings", kind: "toggle" },
      {
        label: "Disable “Recording in progress” audio notification",
        kind: "button",
        buttonLabel: "Update in Zoom Settings",
      },
    ],
  },
  {
    id: "meet",
    name: "Google Meet",
    status: "partial",
    statusLabel: "Partially Enabled",
    body: "Usage limited to scheduled calls joined via desktop app. Install Chrome extension to use on any meeting.",
    action: { label: "Install Chrome Extension", icon: "download" },
    mark: "M",
    markClass: "bg-[#00AC47]",
    rows: [{ label: "Auto-capture unscheduled Google Meet meetings", kind: "toggle" }],
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    status: "full",
    statusLabel: "Fully Enabled",
    body: "",
    mark: "T",
    markClass: "bg-[#5059C9]",
  },
];

export function SettingsView({
  connected = [],
}: {
  /** Providers Supabase reports as connected for this user. */
  connected?: { provider: string; accountEmail: string | null }[];
}) {
  const connectedMap = new Map(connected.map((c) => [c.provider, c]));
  const calendar = connectedMap.get("google_calendar");
  const [record, setRecord] = useState(RECORD[0]);
  const [share, setShare] = useState(SHARE[0]);
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  return (
      <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 pb-24">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 py-16 text-[19px] font-medium text-fg">
          <span>Auto-record</span>
          <MadLibSelect value={record} options={RECORD} onChange={setRecord} size="md" />
          <span>and auto-share</span>
          <MadLibSelect value={share} options={SHARE} onChange={setShare} size="md" />
          <span>with attendees</span>
        </div>

        <p className="section-label mb-4">Video conferencing</p>

        <div className="space-y-4">
          {INTEGRATIONS.map((it) => {
            const liveEntry = connectedMap.get(it.id);
            const live = Boolean(liveEntry);
            return (
            <section key={it.id} className="relative rounded-xl bg-surface p-6">
              {it.starred && (
                <Star className="absolute -top-2 -right-2 h-6 w-6 fill-amber text-amber" />
              )}

              <div className="flex flex-wrap items-start gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[17px] font-bold text-white ${it.markClass}`}
                >
                  {it.mark}
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] font-bold text-fg">
                    {it.name}:{" "}
                    <span className={live || it.status === "full" ? "text-success" : "text-amber"}>
                      {live ? "Connected" : it.statusLabel}
                    </span>
                  </h2>
                  {liveEntry?.accountEmail && (
                    <p className="mt-0.5 text-[13px] text-fg-muted">{liveEntry.accountEmail}</p>
                  )}
                  {it.body && (
                    <p className="mt-1 max-w-[560px] text-[13px] leading-snug text-fg-muted">
                      {it.body}
                    </p>
                  )}
                </div>

                {live ? (
                  <span className="flex shrink-0 items-center gap-2 rounded-lg bg-accentsoft px-5 py-3 text-[14px] font-semibold text-success">
                    <Check className="h-4 w-4" /> Connected
                  </span>
                ) : it.action ? (
                  /* Zoom starts the real OAuth handshake; the others are links
                     out until their provider apps exist. */
                  <a
                    href={it.id === "zoom" ? "/api/integrations/zoom/start" : "#"}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-accentsoft px-5 py-3 text-[14px] font-semibold text-brand transition-colors hover:bg-[#27404d]"
                  >
                    {it.action.label}
                    {it.action.icon === "link" ? (
                      <Link2 className="h-4 w-4" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </a>
                ) : null}
              </div>

              {it.rows?.map((row) => (
                <div
                  key={row.label}
                  className="mt-5 flex flex-wrap items-center gap-4 border-t border-line pt-5"
                >
                  <span className="min-w-0 flex-1 text-[14px] font-semibold text-fg">
                    {row.label}
                  </span>
                  {row.kind === "toggle" ? (
                    <Toggle
                      label={row.label}
                      on={!!toggles[row.label]}
                      onChange={() =>
                        setToggles((t) => ({ ...t, [row.label]: !t[row.label] }))
                      }
                    />
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg border border-brand px-4 py-2.5 text-[13px] font-semibold text-brand transition-colors hover:bg-brand/10"
                    >
                      {row.buttonLabel}
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </section>
            );
          })}
        </div>

        <p className="section-label mt-12 mb-4">Calendar</p>
        <section className="rounded-xl bg-surface p-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4285F4] text-[17px] font-bold text-white">
              G
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[17px] font-bold text-fg">
                Google Calendar:{" "}
                <span className={calendar ? "text-success" : "text-amber"}>
                  {calendar ? "Connected" : "Not connected"}
                </span>
              </h2>
              <p className="mt-1 text-[13px] text-fg-muted">
                {calendar?.accountEmail
                  ? `${calendar.accountEmail} · syncing upcoming meetings`
                  : "Sign in with Google to sync your calendar."}
              </p>
            </div>
            {calendar ? (
              <span className="flex items-center gap-2 rounded-lg bg-accentsoft px-5 py-3 text-[14px] font-semibold text-success">
                <Check className="h-4 w-4" /> Connected
              </span>
            ) : (
              <a
                href="/signup"
                className="flex items-center gap-2 rounded-lg bg-accentsoft px-5 py-3 text-[14px] font-semibold text-brand transition-colors hover:bg-[#27404d]"
              >
                Connect <Link2 className="h-4 w-4" />
              </a>
            )}
          </div>
        </section>

        <SettingsExtras />
      </main>
  );
}
