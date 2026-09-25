"use client";

import { useState } from "react";
import {
  Bot, ChevronsUpDown, ExternalLink, Gift, Globe, Image as ImageIcon,
  Link2, MailCheck, MessageSquare, Pencil, Plug, Plus, Settings2, Sparkles, Trash2,
} from "lucide-react";
import { MadLibSelect } from "@/components/ui/MadLibSelect";
import { pushToast } from "@/lib/toast";
import { ActionButton, Badge, SettingCard, Toggle } from "./parts";

/**
 * Everything on the settings page below the calendar block: premium features,
 * integrations, API access, options, the apps, highlight colours and the
 * delete-account footer.
 *
 * The switches, the template pickers, the highlight editor and the bot name
 * are all real state. What cannot be real here -- connecting a third-party
 * account, issuing an API key, deleting the account -- says so through a
 * toast rather than doing nothing, so no row on this page is dead.
 */

const notWired = (what: string, detail: string) =>
  pushToast({ title: what, description: detail, status: "info", duration: 3500 });

const TEMPLATES = ["Enhanced", "General", "Sales Call", "Interview", "Standup"];
const LINK_ACCESS = [
  "Anyone with the link can view",
  "Only people invited can view",
  "Only my team can view",
];

/* ------------------------------------------------------------ section head */

function SectionLabel({ children, aside }: { children: string; aside?: React.ReactNode }) {
  return (
    <div className="mt-12 mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="section-label">{children}</p>
      {aside}
    </div>
  );
}

/* -------------------------------------------------------- premium features */

function PremiumFeatures() {
  const [botName, setBotName] = useState("Abdullah's Cue Notetaker");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(botName);
  const [autoActions, setAutoActions] = useState(true);
  const [banner, setBanner] = useState(true);
  const [template, setTemplate] = useState(TEMPLATES[0]);

  const save = () => {
    setBotName(draft.trim() || botName);
    setEditing(false);
  };

  return (
    <>
      <SectionLabel
        aside={
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold tracking-wide text-amber uppercase">
            <Gift className="h-4 w-4" />
            30 days left in free preview:{" "}
            <button
              type="button"
              onClick={() => notWired("Upgrade", "Billing is out of scope for this prototype.")}
              className="underline underline-offset-2"
            >
              Upgrade now
            </button>
            <span className="text-fg-dim">-</span>
            <button
              type="button"
              onClick={() => notWired("Free preview", "Pricing lives on Cue's own site.")}
              className="text-fg-muted underline underline-offset-2"
            >
              Learn more
            </button>
          </p>
        }
      >
        Premium features
      </SectionLabel>

      <div className="space-y-3">
        <SettingCard
          icon={<Bot className="h-6 w-6" />}
          title={
            editing ? (
              <span className="flex items-center gap-2">
                Bot Name:
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && save()}
                  aria-label="Bot name"
                  className="min-w-0 flex-1 rounded border border-brand bg-transparent px-2 py-1 text-[15px] font-normal text-fg focus:outline-none"
                />
              </span>
            ) : (
              <span>
                Bot Name: <span className="font-normal text-fg">{botName}</span>
              </span>
            )
          }
          body="The name your Cue notetaker will go by when it joins meetings."
          control={
            editing ? (
              <ActionButton onClick={save}>Save</ActionButton>
            ) : (
              <ActionButton
                onClick={() => {
                  setDraft(botName);
                  setEditing(true);
                }}
              >
                Edit <Pencil className="h-4 w-4" />
              </ActionButton>
            )
          }
        />

        <SettingCard
          icon={<Sparkles className="h-6 w-6" />}
          title="Auto-Generate Action Items"
          badge={<Badge>Recommended</Badge>}
          body="Cue AI will automatically extract any action items discussed on your meetings"
          control={
            <Toggle
              label="Auto-generate action items"
              on={autoActions}
              onChange={() => setAutoActions((v) => !v)}
            />
          }
        />

        <SettingCard
          icon={<Sparkles className="h-6 w-6" />}
          title="Default Meeting Summary Template"
          body="External meetings only. Attendees always see the Enhanced template if you share."
          control={
            <MadLibSelect value={template} options={TEMPLATES} onChange={setTemplate} size="md" />
          }
        />

        <SettingCard
          icon={<ImageIcon className="h-6 w-6" />}
          title="Recording Notification Banner"
          badge={
            <Badge>
              <ImageIcon className="h-3 w-3" /> Preview
            </Badge>
          }
          body="WARNING: If you disable this you're required to collect recording consent according to the laws of you and your attendees jurisdictions"
          control={
            <Toggle
              label="Recording notification banner"
              on={banner}
              onChange={() => setBanner((v) => !v)}
            />
          }
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------------ integrations */

const APPS = [
  { name: "Claude", body: "Ask anything about your meetings", mark: "✳", bg: "#1a1512", fg: "#d97757" },
  { name: "ChatGPT", body: "Ask anything about your meetings", mark: "◍", bg: "#ffffff", fg: "#000000" },
  { name: "Zapier", body: "Automate sending Cue content to almost any app", mark: "✳", bg: "#ffffff", fg: "#ff4f00" },
  { name: "Slack", body: "Automatically send highlights to Slack in real-time.", mark: "◉", bg: "#ffffff", fg: "#611f69" },
  {
    name: "Salesforce",
    body: "Sync call summaries & highlights to matching Contacts, Accounts, and open Opportunities.",
    mark: "☁",
    bg: "#ffffff",
    fg: "#00a1e0",
    starred: true,
  },
  {
    name: "HubSpot",
    body: "Sync call summaries & highlights to matching Contacts, Companies and open Deals",
    mark: "⚙",
    bg: "#ffffff",
    fg: "#ff7a59",
  },
  {
    name: "GoHighLevel",
    body: "Sync call summaries & highlights to matching Contacts, Accounts, and open Opportunities.",
    mark: "↑",
    bg: "#ffffff",
    fg: "#18a957",
  },
  {
    name: "Task Manager",
    body: "Connect your preferred Task Manager to send Action Items.",
    mark: "✓",
    bg: "#2a2a2e",
    fg: "#969696",
  },
];

function Integrations() {
  return (
    <>
      <SectionLabel>Integrations</SectionLabel>
      <div className="space-y-3">
        {APPS.map((a) => (
          <SettingCard
            key={a.name}
            starred={a.starred}
            icon={
              <span
                style={{ background: a.bg, color: a.fg }}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[19px]"
              >
                {a.mark}
              </span>
            }
            title={a.name}
            body={a.body}
            control={
              <ActionButton
                onClick={() =>
                  notWired(
                    `${a.name} is not connected`,
                    "This prototype only completes the Zoom and Google handshakes.",
                  )
                }
              >
                Connect <Link2 className="h-4 w-4" />
              </ActionButton>
            }
          />
        ))}
      </div>
    </>
  );
}

/* -------------------------------------------------------------- api access */

function ApiAccess() {
  return (
    <>
      <SectionLabel>API access</SectionLabel>
      <div className="space-y-3">
        <SettingCard
          title="API Access"
          body={
            <>
              Generate an API key or build an OAuth App to securely integrate Cue with your
              tools and systems. <span className="underline underline-offset-2">View Docs</span>
            </>
          }
          control={
            <ActionButton
              onClick={() => notWired("API keys", "Key issuing is out of scope for this prototype.")}
            >
              Add <Plus className="h-4 w-4" />
            </ActionButton>
          }
        />
        <SettingCard
          icon={<Plug className="h-6 w-6" />}
          title="MCP Server"
          body="Connect Cue to external tools using an MCP server for real-time context, actions, and secure integrations."
          control={
            <ActionButton
              onClick={() => notWired("MCP server", "Setup lives on Cue's own site.")}
            >
              Set Up <ExternalLink className="h-4 w-4" />
            </ActionButton>
          }
        />
      </div>
    </>
  );
}

/* ----------------------------------------------------------------- options */

function Options() {
  const [consent, setConsent] = useState(false);
  const [chat, setChat] = useState(true);
  const [anonymized, setAnonymized] = useState(true);
  const [access, setAccess] = useState(LINK_ACCESS[0]);

  return (
    <>
      <SectionLabel>Options</SectionLabel>
      <div className="space-y-3">
        <SettingCard
          starred
          icon={<MailCheck className="h-6 w-6" />}
          title="Auto Request Recording Consent"
          badge={<Badge>Recommended</Badge>}
          body="Cue collects recording consent from attendees of external calls in advance so you don't have to."
          control={
            <Toggle
              label="Auto request recording consent"
              on={consent}
              onChange={() => setConsent((v) => !v)}
            />
          }
        />
        <SettingCard
          icon={<Link2 className="h-6 w-6" />}
          title="Default Share Link Access"
          body="Default setting for new recordings"
          control={
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-fg-muted" />
              <MadLibSelect value={access} options={LINK_ACCESS} onChange={setAccess} size="md" />
            </span>
          }
        />
        <SettingCard
          icon={<MessageSquare className="h-6 w-6" />}
          title="In-meeting Chat Interface"
          body="Allows users to request meeting summaries from within a call and displays your referral link which gets you free premium features as users join."
          control={
            <Toggle
              label="In-meeting chat interface"
              on={chat}
              onChange={() => setChat((v) => !v)}
            />
          }
        />
        <SettingCard
          icon={<Sparkles className="h-6 w-6" />}
          title="Use my anonymized data to improve Cue's AI for everyone"
          body={
            <>
              Help make Cue&apos;s proprietary AI models better for all users.{" "}
              <span className="underline underline-offset-2">Learn More</span>
            </>
          }
          control={
            <Toggle
              label="Use my anonymized data"
              on={anonymized}
              onChange={() => setAnonymized((v) => !v)}
            />
          }
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------------ cue apps */

function CueApps() {
  return (
    <>
      <SectionLabel>Cue apps</SectionLabel>
      <div className="space-y-3">
        <SettingCard
          icon={<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[18px] text-brand">▶</span>}
          title="Desktop App"
          badge={<Badge>Recommended</Badge>}
          body="Use Cue on any platform"
          control={
            <ActionButton
              onClick={() => notWired("Desktop app", "The installer lives on Cue's own site.")}
            >
              Configure <Settings2 className="h-4 w-4" />
            </ActionButton>
          }
        />
        <SettingCard
          icon={<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[18px]">◎</span>}
          title="Chrome Extension"
          body="Companion app for those who use Google Meet"
          control={
            <span className="flex shrink-0 items-center gap-2 rounded-lg bg-[#14301f] px-4 py-2.5 text-[14px] font-semibold text-success">
              Installed ✓
            </span>
          }
        />
        <SettingCard
          icon={<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[18px] text-[#2D8CFF]">▣</span>}
          title="Zoom App"
          body="Only available when you're the meeting host"
          control={
            <ActionButton
              tone="danger"
              onClick={() => notWired("Zoom app", "Disconnecting is out of scope for this prototype.")}
            >
              Disconnect
            </ActionButton>
          }
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------- highlight options */

const DEFAULT_HIGHLIGHTS = [
  { label: "Highlight", color: "#5eb0f5" },
  { label: "Positive Reaction", color: "#5ad18a" },
  { label: "Needs Review", color: "#f5c53d" },
  { label: "Feedback", color: "#f08a3c" },
];

const SPARE_COLORS = ["#b57df0", "#f07ba5", "#4fd1c5", "#e8743b"];

function HighlightOptions() {
  const [rows, setRows] = useState(DEFAULT_HIGHLIGHTS);

  /* The first row is Cue's own and has no handle or bin in the product,
     so it cannot be moved or removed here either. */
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 1 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
  };

  return (
    <>
      <SectionLabel>Highlight options</SectionLabel>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="w-4 shrink-0">
              {i > 0 && (
                <button
                  type="button"
                  aria-label={`Reorder ${r.label}`}
                  onClick={() => move(i, -1)}
                  className="text-fg-dim transition-colors hover:text-fg"
                >
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              )}
            </span>

            <span className="flex flex-1 items-center gap-3 rounded-lg bg-surface px-4 py-3">
              <span
                style={{ background: r.color }}
                className="h-4 w-4 shrink-0 rounded-[3px]"
              />
              <span
                style={{ color: r.color }}
                className="text-[14px] font-bold tracking-[0.06em] uppercase"
              >
                {r.label}
              </span>
            </span>

            <span className="w-5 shrink-0">
              {i > 0 && (
                <button
                  type="button"
                  aria-label={`Delete ${r.label}`}
                  onClick={() => setRows((v) => v.filter((_, n) => n !== i))}
                  className="text-fg-dim transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setRows((v) => [
            ...v,
            {
              label: `Custom ${v.length - DEFAULT_HIGHLIGHTS.length + 1}`,
              color: SPARE_COLORS[(v.length - DEFAULT_HIGHLIGHTS.length) % SPARE_COLORS.length],
            },
          ])
        }
        className="mt-3 ml-6 flex items-center gap-1.5 text-[13px] font-semibold tracking-wide text-fg-muted uppercase transition-colors hover:text-fg"
      >
        <Plus className="h-4 w-4" /> Add more
      </button>
    </>
  );
}

/* ---------------------------------------------------------- delete account */

function DeleteAccount() {
  return (
    <>
      <SectionLabel>Delete account</SectionLabel>
      <section className="flex flex-wrap items-center gap-4 rounded-xl bg-surface px-5 py-4">
        <p className="min-w-0 flex-1 text-[14px] leading-snug text-red-400">
          Deleting your account is permanent.
          <br />
          All recordings and data will be deleted.
        </p>
        <ActionButton
          tone="danger"
          onClick={() =>
            notWired(
              "Account deletion",
              "Not wired up in this prototype — the seed account has to survive the demo.",
            )
          }
        >
          Delete Account <Trash2 className="h-4 w-4" />
        </ActionButton>
      </section>
    </>
  );
}

export function SettingsExtras() {
  return (
    <>
      <PremiumFeatures />
      <Integrations />
      <ApiAccess />
      <Options />
      <CueApps />
      <HighlightOptions />
      <DeleteAccount />
    </>
  );
}
