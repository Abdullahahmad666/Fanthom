import { ChevronDown, Mic, Pause, Play, Plus, Sparkles, Square, Text } from "lucide-react";

/**
 * The four product shots in the feature filmstrip.
 *
 * Rebuilt in markup rather than shipped as screenshots: they stay sharp at any
 * size, carry no binary asset, and the type inside them is real text rather
 * than resampled pixels. They render at roughly a third of product scale, so
 * the sizes here are deliberately tiny -- they are meant to read as a
 * screenshot, not to be legible word by word.
 *
 * Decorative. Hidden from assistive tech; the captions carry the meaning.
 */

const ACCENT = "#73bfff";

/* ------------------------------------------------------------ 1. live call */

const NOTES = [
  { text: "Lily outlined top Q3 priorities, focusing on growth targets and key initiatives." },
  { text: "Jordan raised concerns around resourcing and timeline feasibility." },
  { text: "@Lily to follow-up with Jordan about additional outside resources.", nested: true },
  { text: "Jordan suggested reallocating budget to support higher-impact projects." },
];

export function LiveCallSlide() {
  return (
    <div aria-hidden className="relative h-[372px] select-none">
      <div className="absolute top-[54px] left-0 w-[268px] space-y-2">
        <CamTile name="Lily" from="#6b4a3a" to="#1a1412" />
        <CamTile name="Jordan" from="#3a4a5e" to="#12161c" />
      </div>

      <div className="absolute top-0 right-0 flex h-[372px] w-[296px] flex-col rounded-xl bg-[#1b1b1f] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        <div className="flex items-center gap-2 px-3 pt-3">
          <p className="flex-1 truncate text-[11px] font-semibold text-fg">Q3 Strategy + Planning</p>
          <Faces n={3} />
        </div>

        <div className="mt-2.5 flex items-center gap-4 border-b border-white/10 px-3">
          <span
            className="flex items-center gap-1 border-b-[1.5px] pb-1.5 text-[8px] font-semibold"
            style={{ color: ACCENT, borderColor: ACCENT }}
          >
            <Sparkles className="h-2 w-2" /> Summary
          </span>
          <span className="flex items-center gap-1 pb-1.5 text-[8px] text-fg-muted">
            <Text className="h-2 w-2" /> Scratchpad
          </span>
        </div>

        <div className="flex-1 space-y-1.5 overflow-hidden px-3 pt-2.5">
          {/* Faded out at the top, as if the panel is scrolled down */}
          <p className="text-[7px] leading-[1.6] text-fg-muted/30">
            Planning aligned on key priorities, setting goals, and outlining next steps to drive
            execution.
          </p>
          {NOTES.map((n) => (
            <p
              key={n.text}
              className={`flex gap-1 text-[7px] leading-[1.6] text-fg ${n.nested ? "pl-2.5" : ""}`}
            >
              <span className="mt-[3px] h-[2px] w-[2px] shrink-0 rounded-full bg-fg-muted" />
              <span>
                {n.text.startsWith("@Lily") ? (
                  <>
                    <span style={{ color: ACCENT }}>@Lily</span>
                    {n.text.slice(5)}
                  </>
                ) : (
                  n.text
                )}
              </span>
            </p>
          ))}
          <p className="pt-1 text-[7px] text-fg-muted">Listening ..</p>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-3 py-2.5">
          <span className="flex items-end gap-[1.5px]">
            {[4, 7, 3, 8, 5, 9, 4, 6].map((h, i) => (
              <span
                key={i}
                style={{ height: h, background: ACCENT }}
                className="w-[1.5px] rounded-full"
              />
            ))}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-[3px] text-[7px] text-fg">
            <Square className="h-1.5 w-1.5 fill-current" strokeWidth={0} /> End
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- 2. app, summary */

const TAKEAWAYS = [
  "The project is progressing as planned, with core work underway and upcoming milestones clearly defined.",
  "Teams aligned on current status, remaining tasks, and overall readiness.",
  "A dependency on an internal security review was identified as an important consideration for final timing.",
];

export function SummarySlide() {
  return (
    <div
      aria-hidden
      className="h-[372px] overflow-hidden rounded-xl bg-[#131316] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10 select-none"
    >
      <div className="flex items-center gap-2 px-3 pt-3">
        <span className="text-[9px] text-fg-muted">←</span>
        <p className="text-[11px] font-semibold text-fg">Project check-in</p>
        <Faces n={2} />
        <span
          className="ml-auto rounded border px-2 py-[3px] text-[8px] font-semibold"
          style={{ color: ACCENT, borderColor: ACCENT }}
        >
          Share
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-3 border-b border-white/10 px-3">
        {[
          ["Summary", null],
          ["Action Items", "5"],
          ["Comments", "2"],
          ["Transcript", null],
          ["Related", null],
        ].map(([label, count], i) => (
          <span
            key={label}
            className={`flex items-center gap-1 pb-1.5 text-[8px] ${
              i === 0 ? "font-semibold" : "text-fg-muted"
            }`}
            style={i === 0 ? { color: ACCENT, borderBottom: `1.5px solid ${ACCENT}` } : undefined}
          >
            {label}
            {count && (
              <span className="rounded bg-white/10 px-1 text-[6px] text-fg-muted">{count}</span>
            )}
          </span>
        ))}
      </div>

      <div className="grid h-[318px] grid-cols-[1.5fr_1fr] gap-2.5 p-3">
        <div className="min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <p className="text-[9px] font-semibold text-fg">Enhanced Summary</p>
            <Pill>✎ Customize</Pill>
            <span className="ml-auto flex items-center gap-1">
              <Pill accent>⟳ Synced</Pill>
            </span>
          </div>

          <p className="mt-2 text-[6.5px] leading-[1.6] text-fg-muted">
            The team reviewed progress, timelines, and upcoming milestones for the Q2 project.
          </p>

          <p className="mt-2 text-[7px] font-semibold text-fg">Key takeaways</p>
          <ul className="mt-1 space-y-1">
            {TAKEAWAYS.map((t) => (
              <li key={t} className="flex gap-1 text-[6.5px] leading-[1.55] text-fg-muted">
                <span className="mt-[3px] h-[2px] w-[2px] shrink-0 rounded-full bg-fg-dim" />
                {t}
              </li>
            ))}
          </ul>

          <p className="mt-2 text-[7px] font-semibold text-fg">Current Challenges</p>
          <p className="mt-1 flex gap-1 text-[6.5px] leading-[1.55] text-fg-muted">
            <span className="mt-[3px] h-[2px] w-[2px] shrink-0 rounded-full bg-fg-dim" />
            The internal security review introduces potential timeline risk if approvals are
            delayed.
          </p>

          <div className="mt-2.5 flex gap-1.5">
            <Pill>Change Template</Pill>
            <Pill>Add Section</Pill>
            <Pill>Update Style</Pill>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <p className="text-[9px] font-semibold text-fg">Action Items</p>
            <Pill accent>◆ Project Neptune</Pill>
          </div>
          <div className="mt-1.5 space-y-1.5">
            {[
              ["Confirm security review timeline approval", "Kadin · @2:41"],
              ["Research historical streamlining of similar security reviews", "Lily · @6:02"],
            ].map(([task, who]) => (
              <p key={task} className="flex gap-1.5 text-[6.5px] leading-tight">
                <span className="mt-[1px] h-[6px] w-[6px] shrink-0 rounded-[1px] border border-fg-dim" />
                <span className="min-w-0">
                  <span className="block text-fg">{task}</span>
                  <span className="block" style={{ color: ACCENT }}>
                    {who}
                  </span>
                </span>
              </p>
            ))}
          </div>
        </div>

        {/* Rail: the recording, then Ask Fathom under it */}
        <div className="flex min-w-0 flex-col gap-2">
          <div className="relative h-[68px] shrink-0 overflow-hidden rounded bg-gradient-to-br from-[#5c4a3e] to-[#15100d]">
            <Play className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 fill-white/80 text-white/80" />
            <span className="absolute bottom-1 left-1 flex items-center gap-1 text-[5px] text-white/80">
              <Pause className="h-1.5 w-1.5" /> 12:04
            </span>
          </div>

          <p className="flex items-center gap-1 text-[7px] font-semibold tracking-wide text-fg">
            <Sparkles className="h-2 w-2" /> ASK FATHOM
          </p>

          <p className="ml-auto max-w-[90%] rounded bg-white/10 px-1.5 py-1 text-[6px] leading-snug text-fg">
            How have other teams sped up SOC 2 compliance approvals?
          </p>

          <p className="flex gap-1 text-[6px] leading-[1.55] text-fg-muted">
            <Sparkles className="mt-[1px] h-2 w-2 shrink-0" style={{ color: ACCENT }} />
            <span>
              Teams sped up SOC 2 approvals by submitting{" "}
              <span style={{ color: ACCENT }}>documentation</span> early and scheduling a review
              with the <span style={{ color: ACCENT }}>security team</span> before final
              submission.
            </span>
          </p>

          <div className="mt-auto space-y-1.5">
            <p className="rounded border border-white/10 px-1.5 py-1.5 text-[6px] text-fg-dim">
              Ask anything...
            </p>
            <Pill>
              All meetings <ChevronDown className="h-1.5 w-1.5" />
            </Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- 3. action items */

const COMMITMENTS = [
  { task: "Send the revised pricing sheet to Elena", who: "Abdullah Ahmad", t: "@12:04", done: true },
  { task: "Confirm the security review window with IT", who: "Kadin Whitaker", t: "@24:18", done: false },
  { task: "Run the migration dry run before Thursday", who: "Lily Ferreira", t: "@31:52", done: false },
  { task: "Share the launch checklist with the wider team", who: "Jordan Bell", t: "@44:07", done: false },
];

export function ActionItemsSlide() {
  return (
    <div
      aria-hidden
      className="h-[372px] overflow-hidden rounded-xl bg-[#131316] p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10 select-none"
    >
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-semibold text-fg">Action Items</p>
        <span className="rounded bg-white/10 px-1.5 py-[2px] text-[7px] text-fg-muted">4</span>
        <span className="ml-auto flex items-center gap-1.5">
          <Pill accent>⟳ Synced to HubSpot</Pill>
          <Pill>✉ Generate Followup</Pill>
        </span>
      </div>

      <p className="mt-3 rounded border border-white/10 px-2 py-1.5 text-[7px] text-fg-dim">
        <Plus className="mr-1 inline h-2 w-2" />
        Type new task and press Enter to add
      </p>

      <div className="mt-3 space-y-2.5">
        {COMMITMENTS.map((c) => (
          <div key={c.task} className="flex gap-2 rounded-lg bg-[#1b1b1f] px-2.5 py-2">
            <span
              className={`mt-[2px] h-[9px] w-[9px] shrink-0 rounded-[2px] ${
                c.done ? "" : "border border-fg-dim"
              }`}
              style={c.done ? { background: ACCENT } : undefined}
            />
            <span className="min-w-0 flex-1">
              <span
                className={`block text-[8px] ${c.done ? "text-fg-dim line-through" : "text-fg"}`}
              >
                {c.task}
              </span>
              <span className="mt-[2px] flex items-center gap-1.5 text-[7px] text-fg-dim">
                <Faces n={1} size={9} />
                {c.who}
                <span style={{ color: ACCENT }}>{c.t}</span>
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3">
        <Pill>Assign owner</Pill>
        <Pill>Set due date</Pill>
        <Pill accent>Push all to CRM</Pill>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- 4. ask */

const THREAD = [
  { q: "What did we promise BrightCode on the migration?" },
  {
    a: "A trial on the October run, with the import fix landing first. Maya owns the confirmation email.",
    cites: ["Q3 Launch Readiness Review @18:20", "BrightCode Discovery @05:56"],
  },
  { q: "Has anyone raised the same concern twice?" },
  {
    a: "Yes — bulk import reliability came up in three separate calls this month, each time from a different account.",
    cites: [],
  },
];

export function AskSlide() {
  return (
    <div
      aria-hidden
      className="flex h-[372px] flex-col overflow-hidden rounded-xl bg-[#131316] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10 select-none"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <Sparkles className="h-3 w-3" style={{ color: ACCENT }} />
        <p className="text-[10px] font-semibold tracking-wide text-fg">
          ASK <span className="font-bold">FATHOM</span>
        </p>
        <span className="ml-auto">
          <Pill>
            All meetings <ChevronDown className="h-1.5 w-1.5" />
          </Pill>
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-hidden px-4 pt-3">
        {THREAD.map((m, i) =>
          m.q ? (
            <p
              key={i}
              className="ml-auto w-fit max-w-[72%] rounded-lg bg-white/10 px-2.5 py-1.5 text-[8px] text-fg"
            >
              {m.q}
            </p>
          ) : (
            <div key={i} className="space-y-1.5">
              <p className="flex gap-1.5 text-[8px] leading-[1.6] text-fg">
                <Sparkles className="mt-[2px] h-2 w-2 shrink-0" style={{ color: ACCENT }} />
                <span>{m.a}</span>
              </p>
              {m.cites?.map((c) => (
                <p
                  key={c}
                  className="ml-4 flex w-fit items-center gap-1 rounded bg-[#1f2a31] px-1.5 py-[3px] text-[6.5px]"
                  style={{ color: ACCENT }}
                >
                  <span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} />
                  {c}
                </p>
              ))}
            </div>
          ),
        )}
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-2">
          <Plus className="h-2.5 w-2.5 text-fg-dim" />
          <span className="flex-1 text-[7.5px] text-fg-dim">Ask anything...</span>
          <Mic className="h-2.5 w-2.5 text-fg-dim" />
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-black"
            style={{ background: ACCENT }}
          >
            ↑
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

function CamTile({ name, from, to }: { name: string; from: string; to: string }) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-lg ring-1 ring-white/10"
      style={{ background: `radial-gradient(120% 90% at 40% 20%, ${from}, ${to})` }}
    >
      {/* Head and shoulders, which is the shape a webcam tile always resolves to */}
      <span className="absolute inset-x-0 bottom-0 h-[28%] bg-black/30" />
      <span className="absolute -bottom-[12%] left-1/2 h-[44%] w-[52%] -translate-x-1/2 rounded-t-[999px] bg-white/10" />
      <span className="absolute bottom-[30%] left-1/2 h-[24%] w-[24%] -translate-x-1/2 rounded-full bg-white/15" />
      <span className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_45%,rgba(0,0,0,0.5)_100%)]" />
      <span className="absolute bottom-1.5 left-2 text-[7px] text-white/90">{name}</span>
    </div>
  );
}

const FACE_COLORS = ["#c2185b", "#2f6f4f", "#5a4bbd"];

function Faces({ n, size = 13 }: { n: number; size?: number }) {
  return (
    <span className="flex shrink-0 items-center">
      {FACE_COLORS.slice(0, n).map((c, i) => (
        <span
          key={c}
          style={{
            background: c,
            width: size,
            height: size,
            marginLeft: i === 0 ? 0 : -size * 0.3,
          }}
          className="rounded-full ring-[1.5px] ring-[#1b1b1f]"
        />
      ))}
    </span>
  );
}

function Pill({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className="flex w-fit items-center gap-1 rounded px-1.5 py-[3px] text-[6.5px] whitespace-nowrap"
      style={
        accent
          ? { background: "#1f2a31", color: ACCENT }
          : { background: "#26262a", color: "#969696" }
      }
    >
      {children}
    </span>
  );
}
