import Link from "next/link";
import { ChevronLeft, Play } from "lucide-react";
import { CrmBadge, HubspotMark, SalesforceMark } from "@/components/ui/CrmMarks";
import { TrialButton } from "@/components/ui/TrialButton";

/**
 * Deals upsell, laid over the pipeline table.
 *
 * Positioned with a sticky inner shell rather than `fixed`: the panel stays
 * centred in the scrollport while the table scrolls behind it, without
 * covering the top bar or the tab strip.
 *
 * "View Demo" goes to the flagship meeting, which is the closest thing this
 * prototype has to a real demo.
 */

const DEMO_HREF = "/calls/q3-launch-readiness";

export function DealsUpsell() {
  return (
    <>
      {/* Black, not canvas -- the page is already canvas, so a canvas scrim
          would dim nothing. */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />

      <div className="absolute inset-0">
        <div className="sticky top-0 flex h-[calc(100vh-var(--topbar-h)-var(--tabnav-h))] items-center justify-center px-6">
          <div className="lifted w-full max-w-[600px] rounded-2xl border border-line bg-[#15161a] px-9 pt-9 pb-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]">
            <h2 className="text-center text-[24px] leading-tight font-semibold text-fg">
              See deal momentum instantly
            </h2>
            <p className="mt-2 text-center text-[15px] text-fg-muted">
              Centralize every signal to forecast with confidence
            </p>

            <DemoMock />

            <div className="mt-9 flex flex-col items-center">
              <TrialButton className="w-[330px] rounded-lg border-2 border-brand py-3.5 text-[18px] font-bold text-brand transition-colors hover:bg-brand hover:text-black" />

              <p className="mt-5 text-[14px] text-fg-muted">
                View features &amp; pricing at{" "}
                {/* Internal route: navigates in place. target="_blank" was a
                    leftover from when this pointed at another company's site,
                    and it stranded people in a second tab. */}
                <Link
                  href="/pricing"
                  className="text-fg underline underline-offset-2 hover:text-brand"
                >
                  See plans
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------ the screenshot-in-a-card */

const CALLS = [
  {
    when: "Today",
    title: "Explore Cue's meeting productivity capabilities",
    meta: "Project Kickoff · July 28, 2024",
    who: "Tim Kuvalis",
    pct: "34%",
    len: "21 min",
    body: "Andrew Moyer (BioRev) demoed Cue to Sam Saw (ThinkBionics) to discuss potential use cases. Discussed using Cue for onboarding and knowledge sharing. Sam will sign up for a free trial; Andrew offered a follow-up call for configuration help.",
  },
  {
    when: null,
    title: "Evaluate Cue for internal meeting productivity",
    meta: "Check-in with ThinkBionics · July 28, 2024",
    who: "Anya Bridges",
    pct: "59%",
    len: "23 min",
    body: "ThinkBionics explored Cue's capabilities for automatically detecting action items, integrating with enterprise tools like Okta and JIRA, and influencing the product roadmap. Cue demonstrated relevant features and committed to enabling them for Cruise's trial.",
  },
  {
    when: "Yesterday",
    title: "Finalize ThinkBionic's pilot launch",
    meta: "Launch · July 27, 2024",
    who: "Tim Kuvalis",
    pct: "22%",
    len: "18 min",
    body: "ThinkBionics provided feedback on meeting visibility/sharing options. The initial scope will be private meetings only shared with attendees, with ability to manually share links. Cruise requested disabling certain UI elements for the pilot.",
  },
];

function DemoMock() {
  return (
    <div aria-hidden className="relative mt-7 select-none">
      <div className="relative overflow-hidden rounded-lg border border-line bg-content">
        <div className="flex h-[300px]">
          {/* Deal timeline */}
          <div className="min-w-0 flex-1 border-r border-line p-3">
            <p className="flex items-center gap-0.5 text-[7px] text-fg-dim">
              <ChevronLeft className="h-2 w-2" strokeWidth={2.5} />
              ThinkBionics
            </p>
            <p className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-fg">
              <span className="h-2 w-2 rounded-[2px] bg-brand" />
              ABC Opportunity
            </p>

            <div className="mt-2.5 space-y-2">
              {CALLS.map((c) => (
                <div key={c.title}>
                  {c.when && (
                    <p className="pb-1.5 text-[7px] font-semibold tracking-[0.1em] text-fg-dim uppercase">
                      {c.when}
                    </p>
                  )}
                  <div className="flex gap-2 rounded border border-line bg-surface p-1.5">
                    <span className="relative h-[34px] w-[54px] shrink-0 overflow-hidden rounded-[3px] bg-gradient-to-br from-[#3a4a55] to-[#12161a]">
                      <span className="absolute right-0.5 bottom-0.5 rounded-[2px] bg-black/70 px-1 text-[5px] text-white">
                        {c.len}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[8px] font-semibold text-fg">
                        {c.title}
                      </span>
                      <span className="mt-0.5 flex items-baseline gap-2">
                        <span className="min-w-0 flex-1 truncate text-[6px] text-fg-dim">
                          {c.meta}
                        </span>
                        <span className="shrink-0 text-[6px] text-fg-dim">{c.who}</span>
                        <span className="shrink-0 text-[6px] font-medium text-brand">{c.pct}</span>
                      </span>
                      <span className="mt-1 block text-[6px] leading-[1.55] text-fg-muted">
                        {c.body}
                      </span>
                    </span>
                  </div>
                </div>
              ))}

              {/* Clipped by the card, exactly as a real scroll region would be */}
              <p className="pb-1.5 text-[7px] font-semibold tracking-[0.1em] text-fg-dim uppercase">
                Last Week
              </p>
              <div className="flex gap-2 rounded border border-line bg-surface p-1.5">
                <span className="h-[34px] w-[54px] shrink-0 rounded-[3px] bg-gradient-to-br from-[#4a3a4f] to-[#12161a]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[8px] font-semibold text-fg">
                    Launch Cue for ThinkBionic employees
                  </span>
                  <span className="mt-0.5 block truncate text-[6px] text-fg-dim">
                    Rollout · July 22, 2024
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Deal panel */}
          <div className="w-[38%] shrink-0 p-3">
            <div className="flex items-start justify-between gap-2">
              <Metric label="Amount" value="$13.5K" />
              <Metric label="Status" value="Won" tone="text-success" />
              <Metric label="Calls" value="25" />
              <div>
                <p className="text-[5px] tracking-[0.1em] text-fg-dim uppercase">Activity</p>
                <span className="mt-1 flex items-center gap-[2px]">
                  {[3, 5, 2, 6, 4, 7, 5].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: h + 2 }}
                      className="w-[2px] rounded-full bg-brand/70"
                    />
                  ))}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2.5 border-b border-line">
              <span className="pb-1 text-[7px] text-fg-dim">Recap</span>
              <span className="pb-1 text-[7px] text-fg-dim">Key People</span>
              <span className="relative pb-1 text-[7px] font-semibold text-brand">
                Ask Cue
                <span className="absolute inset-x-0 -bottom-px h-[1.5px] rounded-t bg-brand" />
              </span>
            </div>

            <div className="mt-2.5 space-y-2">
              <Question text="Summarize the meetings with this deal so far" />
              <Answer text="ThinkBionics explored Cue's capabilities for automatically detecting action items, integrating with enterprise tools like Okta and JIRA, and influencing the product roadmap. Cue demonstrated relevant features and committed to enabling them for Cruise's trial." />

              <Question text="What did Andrew discuss in the last meeting?" />
              <Answer text="Andrew Moyer (BioRev) demoed Cue to Sam Saw (ThinkBionics) to discuss potential use cases. Discussed using Cue for onboarding and knowledge sharing. Sam will sign up for a free trial; Andrew offered a follow-up call for configuration help." />

              <Citation text="The recent release of the AI-driven analytics module positively impacted user engagement @13:24" />
              <Citation text="The recent release of the AI-driven analytics module @15:45" />

              <Question text="Did he also discuss about the new ask cue feature?" />
              <Answer text="Yes — Andrew walked through Ask Cue near the end of the call." />
            </div>
          </div>
        </div>

        {/* Fade the timeline out at the card edge instead of a hard cut */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-content to-transparent" />
      </div>

      {/* CRM sync, breaking the card's corners */}
      <span className="absolute -top-3 right-5">
        <CrmBadge size={38} ring="ring-[#15161a]">
          <SalesforceMark className="h-3.5 w-4" />
        </CrmBadge>
      </span>
      <span className="absolute bottom-6 -left-3">
        <CrmBadge size={38} ring="ring-[#15161a]">
          <HubspotMark className="h-3.5 w-3.5" />
        </CrmBadge>
      </span>

      {/* Sits on the card's bottom edge, as in the product */}
      <Link
        href={DEMO_HREF}
        className="absolute -bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-[#9fd4f7] px-4 py-1.5 text-[14px] font-medium text-[#0b1418] transition-colors hover:bg-brand"
      >
        <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
        View Demo
      </Link>
    </div>
  );
}

function Metric({ label, value, tone = "text-fg" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-[5px] tracking-[0.1em] text-fg-dim uppercase">{label}</p>
      <p className={`mt-1 text-[8px] font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function Question({ text }: { text: string }) {
  return <p className="text-[6px] leading-[1.5] text-fg-muted">{text}</p>;
}

function Answer({ text }: { text: string }) {
  return (
    <p className="flex gap-1 text-[6px] leading-[1.55] text-fg">
      <Play className="mt-[1px] h-1.5 w-1.5 shrink-0 fill-brand text-brand" strokeWidth={0} />
      <span>{text}</span>
    </p>
  );
}

function Citation({ text }: { text: string }) {
  return (
    <p className="flex gap-1 rounded bg-accentsoft px-1.5 py-1 text-[5.5px] leading-[1.5] text-brand">
      <span className="mt-[2px] h-1 w-1 shrink-0 rounded-full bg-brand" />
      <span>{text}</span>
    </p>
  );
}
