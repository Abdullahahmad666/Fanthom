import { ChevronDown, Eye, Link2, MoreVertical, MoveLeft, Sparkles } from "lucide-react";

const SUMMARY = [
  {
    heading: "Quarterly performance review",
    t: "0:34",
    body: "Alexa talks about Q3 sales performance, revealing a 28% increase in revenue compared to Q2. The Southeast region showed notable growth (35%), while challenges in the Midwest resulted in a 10% decline.",
  },
  {
    heading: "New Feature Launch Impact",
    t: "5:24",
    body: "James discusses the positive impact of the recent AI-driven analytics module release, specifically on client engagement and retention. Client feedback highlighted the module's ease of use and added value.",
  },
  {
    heading: "Customer Feedback Insights",
    t: "11:05",
    body: "Alexa talks about a summary of customer feedback indicated a consistent demand for enhanced mobile compatibility.",
  },
  {
    heading: "Upcoming Q4 Strategies",
    t: "18:16",
    body: "Ali talks about the strategies for expanding the client base in industries benefiting from ThinkBionics' solutions were explored.",
  },
];

const TASKS = [
  { text: "Discuss updates with the Product team", t: "0:34", who: "James Renner", done: true },
  { text: "Conduct market analysis for Midwest region", t: "1:28", who: "Alexa Fox", done: false },
  { text: "Set up marketing-sales alignment meetings", t: "1:28", who: "Alexa Fox", done: false },
];

/**
 * A product screenshot rebuilt in markup rather than shipped as an image, so
 * it stays sharp at any size and carries no binary asset. Decorative: hidden
 * from assistive tech, since the real app is a click away.
 */
export function MockAppWindow() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-[1020px] overflow-hidden rounded-xl bg-[#1c1b20] text-[9px] leading-snug ring-1 ring-white/10 select-none sm:text-[10px]"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <MoveLeft className="h-3 w-3 text-fg-muted" />
        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-fg">BioRev / ThinkBionics Intro</p>
          <p className="truncate text-fg-dim">Add to Folder · May 18, 2023</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Chip><Eye className="h-3 w-3 text-[#73bfff]" /></Chip>
          <span className="rounded bg-[#1f2a31] px-2.5 py-1 font-semibold text-[#73bfff]">Share</span>
          <Chip><Link2 className="h-3 w-3 text-[#73bfff]" /></Chip>
          <Chip><MoreVertical className="h-3 w-3 text-fg-muted" /></Chip>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 px-4 py-2">
        <span className="flex items-center gap-1.5 rounded bg-[#1f2a31] px-2 py-1 font-semibold text-[#73bfff]">
          ▶ Recap
        </span>
        <span className="text-fg-muted">Transcript</span>
        <span className="flex items-center gap-1 text-fg-muted">
          <Sparkles className="h-2.5 w-2.5" /> Ask Fathom
        </span>
        <div className="ml-auto flex gap-1.5">
          {["Copy Recap", "Sync", "Followup"].map((l) => (
            <span key={l} className="flex items-center gap-1 rounded bg-[#26252a] px-2 py-1 text-fg-muted">
              {l} <ChevronDown className="h-2.5 w-2.5" />
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[1.55fr_1fr]">
        {/* Recap */}
        <div>
          <div className="flex gap-2">
            <span className="flex flex-1 items-center justify-between rounded bg-[#26252a] px-2.5 py-1.5 text-fg">
              Copy Recap <ChevronDown className="h-2.5 w-2.5" />
            </span>
            <span className="flex flex-1 items-center justify-between rounded bg-[#26252a] px-2.5 py-1.5 text-fg">
              Sync to HubSpot <ChevronDown className="h-2.5 w-2.5" />
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-[13px] font-bold text-fg">Summary</p>
            <span className="text-fg-muted underline">Change Template</span>
          </div>

          <div className="mt-3 space-y-3">
            {SUMMARY.map((s) => (
              <div key={s.heading}>
                <p className="font-bold text-fg">
                  {s.heading} <span className="font-normal text-fg-dim">{s.t}</span>
                </p>
                <p className="mt-1 text-fg-muted">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-[13px] font-bold text-fg">Action Items</p>
            <span className="rounded bg-[#26252a] px-2 py-1 text-fg-muted">✉ Generate Followup</span>
          </div>
          <p className="mt-2 rounded border border-white/10 px-2.5 py-1.5 text-fg-dim">
            + Type new task and press Enter to add
          </p>
          <div className="mt-2 space-y-2">
            {TASKS.map((t) => (
              <div key={t.text} className="flex gap-2">
                <span
                  className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-[3px] ${
                    t.done ? "bg-[#73bfff]" : "border border-fg-dim"
                  }`}
                />
                <span className="min-w-0">
                  <span className={`block font-semibold ${t.done ? "text-fg-dim line-through" : "text-fg"}`}>
                    {t.text} <span className="font-normal text-fg-dim">{t.t}</span>
                  </span>
                  <span className="block text-fg-dim">{t.who} ⌄</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rail */}
        <div className="space-y-3">
          <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-[#6b5d52] via-[#8d7f72] to-[#3f3a33]" />

          <div className="rounded-lg bg-[#232228] p-2.5">
            <p className="flex items-center justify-between text-[11px] font-bold text-fg">
              Meeting Details <ChevronDown className="h-2.5 w-2.5" />
            </p>
            <p className="mt-2 flex items-center justify-between text-fg-muted">
              <span>👥 Recording visible to your team</span>
              <span className="text-fg-dim">⚙</span>
            </p>

            <p className="mt-3 flex items-center justify-between text-fg-dim">
              ATTENDEES
              <span className="rounded bg-[#2d2c31] px-1.5 py-0.5 text-fg-muted">✉ Send Recording</span>
            </p>

            {[
              { name: "ThinkBionics", pct: "56% (24min)", color: "#3fbf7f", w: "56%" },
              { name: "BioRev", pct: "44% (18min)", color: "#e8b93a", w: "44%" },
            ].map((a) => (
              <div key={a.name} className="mt-2.5">
                <p className="flex items-center justify-between text-fg">
                  <span className="font-semibold">{a.name}</span>
                  <span className="text-fg-muted">{a.pct}</span>
                </p>
                <span className="mt-1 flex h-1 w-full overflow-hidden rounded-full bg-[#2d2c31]">
                  <span style={{ width: a.w, background: a.color }} />
                </span>
                <p className="mt-1 text-fg-dim">View All 3 Attendees ⌄</p>
              </div>
            ))}

            <p className="mt-3 text-fg-dim">RELATED TO</p>
            <p className="mt-1.5 flex items-center justify-between">
              <span className="font-semibold text-fg">ABC Opportunity</span>
              <span className="text-fg-muted">$13.5K</span>
            </p>
            <p className="text-[#3fbf7f]">Closed Won</p>

            <p className="mt-3 text-fg-dim">PREVIOUS CALL</p>
            <p className="mt-1.5 flex items-center justify-between">
              <span className="font-semibold text-fg">Andrew Morton</span>
              <span className="text-fg-muted">Jul 12, 2023</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#26252a]">{children}</span>
  );
}
