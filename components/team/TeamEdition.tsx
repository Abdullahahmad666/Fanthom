import { Check, ChevronDown, Search } from "lucide-react";
import { CrmBadge, HubspotMark, SalesforceMark } from "@/components/ui/CrmMarks";
import { TrialButton } from "@/components/ui/TrialButton";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Team Calls upsell.
 *
 * Team Calls is a paid tier in the real product, so a solo account lands on a
 * pitch rather than a list. Rebuilding that pitch is more honest than an empty
 * state -- the tab leads somewhere real, and the mock on the right shows what
 * the tier actually unlocks.
 *
 * The right-hand mock is decorative: static markup, aria-hidden, no links.
 */

const BULLETS = [
  "Your team's customer calls all in one (searchable) place",
  "Automate post-call CRM data entry for your entire team",
  "Conversational analytics to help you identify coaching opportunities",
];

export function TeamEdition() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-8 py-14">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
        <Pitch />
        <ProductMock />
      </div>
    </div>
  );
}

function Pitch() {
  return (
    <div>
      <p className="text-[12px] font-semibold tracking-[0.14em] text-amber uppercase">
        Cue Team Edition
      </p>

      <h1 className="mt-4 text-[34px] leading-[1.18] font-semibold text-fg">
        Bring the productivity boost of Cue to your entire team
      </h1>

      <ul className="mt-8 space-y-4">
        {BULLETS.map((text, i) => (
          <Reveal key={text} as="li" delay={i * 70} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-amber">
              <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
            </span>
            <span className="text-[15px] leading-[1.5] text-fg-muted">{text}</span>
          </Reveal>
        ))}
      </ul>

      <TrialButton className="press mt-9 rounded-full border border-brand px-7 py-2.5 text-[14px] font-semibold text-brand transition-colors hover:bg-brand hover:text-black" />

      <p className="mt-5 text-[13px] text-fg-dim">
        View features &amp; pricing at{" "}
        <a href="/pricing" className="text-brand hover:underline">
          Cue pricing
        </a>
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- the mock */

const TODAY = [
  { who: "Anne Lee", color: "#c2185b", title: "Acme Corp <> Cue", talk: "48%", dur: "31 min" },
  { who: "Cooper Dorsey", color: "#2f6f4f", title: "Northwind — Discovery", talk: "62%", dur: "44 min" },
];

const YESTERDAY = [
  { who: "Allison Korsgaard", color: "#5a4bbd", title: "Lakeside Partners — Demo", talk: "39%", dur: "52 min" },
  { who: "Marcus Bell", color: "#b8552a", title: "Trailhead — Renewal", talk: "55%", dur: "27 min" },
];

const MEMBERS = [
  { name: "Anne Lee", color: "#c2185b", calls: "12", talk: "38%", mq: "4 / 61" },
  { name: "Allison Kors…", color: "#5a4bbd", calls: "9", talk: "51%", mq: "7 / 44" },
  { name: "Cooper Dor…", color: "#2f6f4f", calls: "14", talk: "44%", mq: "3 / 72" },
];

function ProductMock() {
  return (
    <div aria-hidden className="relative pb-32 pr-4 select-none">
      {/* The team list, sitting behind the floating panels */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-6 border-b border-line">
          <span className="pb-3 text-[12px] font-medium text-fg-dim">My Calls</span>
          <span className="relative pb-3 text-[12px] font-medium text-brand">
            Team Calls
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-t bg-brand" />
          </span>
          <span className="mb-3 ml-auto flex items-center gap-1.5 rounded-md bg-field px-2 py-1 text-[11px] text-fg-dim">
            <Search className="h-3 w-3" strokeWidth={2} />
            Search
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 py-3">
          <Chip label="All Calls" active />
          <Chip label="Role" caret />
          <Chip label="Deal Stage" caret />
          <Chip label="Deal Outcome" caret />
        </div>

        <MockGroup label="Today" rows={TODAY} />
        <MockGroup label="Yesterday" rows={YESTERDAY} />
      </div>

      {/* CRM sync, overlapping the panel's top-right corner */}
      <div className="absolute -top-5 right-0 flex items-center lg:-right-2">
        <CrmBadge>
          <SalesforceMark />
        </CrmBadge>
        <span className="-ml-3">
          <CrmBadge>
            <HubspotMark />
          </CrmBadge>
        </span>
      </div>

      {/* The two numbers the tier is sold on */}
      <div className="absolute top-16 right-0 w-[168px] rounded-xl border border-line bg-panel p-3.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.85)] lg:-right-6">
        <Stat label="Recent Calls" value="68" />
        <div className="my-3 h-px bg-line" />
        <Stat label="Talk Time" value="42%" />
      </div>

      <div className="absolute right-10 bottom-0 left-4 rounded-xl border border-line bg-panel p-4 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.85)] lg:left-10">
        <div className="flex items-baseline gap-2">
          <span className="text-[12px] font-semibold text-fg">Team Members</span>
          <span className="text-[12px] text-fg-dim">14</span>
        </div>

        <table className="mt-3 w-full table-fixed border-collapse">
          <thead>
            <tr className="text-left text-[9px] tracking-[0.08em] text-fg-dim uppercase">
              <th className="w-[34%] pb-2 font-semibold">Name</th>
              <th className="w-[20%] pb-2 font-semibold">Recent Calls</th>
              <th className="w-[18%] pb-2 font-semibold">Talk Time</th>
              <th className="w-[28%] pb-2 font-semibold">Monologues &amp; Questions</th>
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map((m) => (
              <tr key={m.name} className="border-t border-line">
                <td className="py-2">
                  <span className="flex items-center gap-2">
                    <Dot color={m.color} name={m.name} />
                    <span className="truncate text-[11px] text-fg">{m.name}</span>
                  </span>
                </td>
                <td className="py-2 text-[11px] text-fg-muted">{m.calls}</td>
                <td className="py-2 text-[11px] text-fg-muted">{m.talk}</td>
                <td className="py-2 text-[11px] text-fg-muted">{m.mq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MockGroup({
  label,
  rows,
}: {
  label: string;
  rows: { who: string; color: string; title: string; talk: string; dur: string }[];
}) {
  return (
    <div className="pt-2">
      <p className="pb-2 text-[10px] font-semibold tracking-[0.1em] text-fg-dim uppercase">
        {label}
      </p>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.title}
            className="flex items-center gap-3 rounded-lg border border-line bg-raised px-3 py-2.5"
          >
            <span className="h-9 w-14 shrink-0 rounded bg-gradient-to-br from-[#2b3a45] to-[#14181b]" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-medium text-fg">{r.title}</span>
              <span className="mt-0.5 flex items-center gap-1.5">
                <Dot color={r.color} name={r.who} />
                <span className="truncate text-[10px] text-fg-dim">{r.who}</span>
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-accentsoft px-2 py-0.5 text-[10px] font-medium text-brand">
              {r.talk} talk
            </span>
            <span className="shrink-0 rounded-full bg-field px-2 py-0.5 text-[10px] text-fg-muted">
              {r.dur}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({ label, active, caret }: { label: string; active?: boolean; caret?: boolean }) {
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        active ? "bg-brand text-black" : "border border-line bg-raised text-fg-muted"
      }`}
    >
      {label}
      {caret && <ChevronDown className="h-3 w-3" strokeWidth={2} />}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.08em] text-fg-dim uppercase">{label}</p>
      <p className="mt-0.5 text-[20px] leading-none font-semibold text-fg">{value}</p>
    </div>
  );
}

function Dot({ color, name }: { color: string; name: string }) {
  return (
    <span
      style={{ background: color }}
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold text-white uppercase"
    >
      {name.slice(0, 1)}
    </span>
  );
}

