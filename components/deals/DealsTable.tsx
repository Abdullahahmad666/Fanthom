import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";

/**
 * The deals pipeline, as it looks to an account that has the tier.
 *
 * Rendered behind the upsell overlay rather than replaced by it: the pitch
 * lands better over the real thing, and the page still shows what the tab is
 * for. Static by design -- the filters, sort and pager are chrome, and nothing
 * here is reachable while the overlay is up.
 */

type Deal = {
  name: string;
  owner: string;
  color: string;
  stage: string;
  amount: string;
  close: string;
};

const DEALS: Deal[] = [
  { name: "ThinkBionics - New Deal", owner: "Tim Kuvalis", color: "#c2185b", stage: "Qualified", amount: "$13.5K", close: "Nov 24, 2024" },
  { name: "BioRev - Team Edition Upsell", owner: "Anya Bridges", color: "#5a4bbd", stage: "Closed Won", amount: "$48.0K", close: "Oct 29, 2024" },
  { name: "Supertokens - 3 seats", owner: "Cooper Dorsey", color: "#2f6f4f", stage: "Commitment", amount: "$2.1K", close: "Oct 22, 2024" },
  { name: "Nostra - new deals", owner: "Anne Lee", color: "#b8552a", stage: "Qualified", amount: "$9.4K", close: "Oct 21, 2024" },
  { name: "isclaims.com - New Deal", owner: "Tim Kuvalis", color: "#c2185b", stage: "Closed Won", amount: "$21.8K", close: "Oct 19, 2024" },
  { name: "Fountain Forward - Marketing Automation", owner: "Anya Bridges", color: "#5a4bbd", stage: "Qualified", amount: "$34.2K", close: "Sep 25, 2024" },
  { name: "HeaneyMoore - New Deal", owner: "Marcus Bell", color: "#2b6f8f", stage: "Closed Lost", amount: "$6.7K", close: "Sep 17, 2024" },
  { name: "Marks & Sons - Team Edition Upsell", owner: "Anne Lee", color: "#b8552a", stage: "Qualified", amount: "$15.0K", close: "Sep 12, 2024" },
  { name: "Mueller - Pfeffer - TE Demo", owner: "Cooper Dorsey", color: "#2f6f4f", stage: "Engagement", amount: "$4.9K", close: "Sep 08, 2024" },
  { name: "PStrosin - 3 seats", owner: "Tim Kuvalis", color: "#c2185b", stage: "Closed Won", amount: "$2.1K", close: "Sep 1, 2024" },
  { name: "Kuphal - new deals", owner: "Marcus Bell", color: "#2b6f8f", stage: "Qualified", amount: "$11.3K", close: "Aug 15, 2024" },
  { name: "Nitzsche  - New Deal", owner: "Anya Bridges", color: "#5a4bbd", stage: "Commitment", amount: "$27.6K", close: "Aug 10, 2024" },
  { name: "Harvest - TE Demo", owner: "Anne Lee", color: "#b8552a", stage: "Closed Won", amount: "$8.2K", close: "Aug 9, 2024" },
  { name: "Kuhic Electronics - Team Edition Upsell", owner: "Cooper Dorsey", color: "#2f6f4f", stage: "Engagement", amount: "$52.5K", close: "Aug 7, 2024" },
  { name: "Kirlin Inc - new deals", owner: "Tim Kuvalis", color: "#c2185b", stage: "Qualified", amount: "$3.8K", close: "Aug 6, 2024" },
];

const FILTERS = ["All Reps", "Open Deals", "Any Close Date"];

/** Won and lost carry color; the working stages stay neutral. */
const STAGE_TONE: Record<string, string> = {
  "Closed Won": "text-success",
  "Closed Lost": "text-fg-dim",
};

export function DealsTable() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-8 py-7">
      <header className="flex items-center gap-3">
        <h1 className="text-[22px] font-semibold text-fg">Deals</h1>
        <span className="rounded-full bg-field px-2.5 py-0.5 text-[12px] font-medium text-fg-muted">
          145
        </span>

        <div className="ml-auto flex items-center gap-2">
          {FILTERS.map((label) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-md border border-line bg-raised px-3 py-1.5 text-[12px] font-medium text-fg-muted"
            >
              {label}
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          ))}
        </div>
      </header>

      <table className="mt-6 w-full table-fixed border-collapse">
        <thead>
          <tr className="text-left text-[11px] tracking-[0.08em] text-fg-dim uppercase">
            <th className="w-[38%] pb-3 font-semibold">Deal</th>
            <th className="w-[18%] pb-3 font-semibold">Owner</th>
            <th className="w-[16%] pb-3 font-semibold">Stage</th>
            <th className="w-[12%] pb-3 text-right font-semibold">Amount</th>
            <th className="w-[16%] pb-3 pr-1 text-right font-semibold">
              <span className="inline-flex items-center gap-1">
                Close Date
                <ChevronsUpDown className="h-3 w-3" strokeWidth={2} />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {DEALS.map((d) => (
            <tr key={d.name} className="border-t border-line">
              <td className="truncate py-3 pr-6 text-[14px] text-fg">{d.name}</td>
              <td className="py-3 pr-6">
                <span className="flex items-center gap-2">
                  <span
                    style={{ background: d.color }}
                    className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white uppercase"
                  >
                    {d.owner.slice(0, 1)}
                  </span>
                  <span className="truncate text-[13px] text-fg-muted">{d.owner}</span>
                </span>
              </td>
              <td className={`py-3 text-[13px] ${STAGE_TONE[d.stage] ?? "text-fg-muted"}`}>
                {d.stage}
              </td>
              <td className="py-3 text-right text-[13px] text-fg-muted tabular-nums">
                {d.amount}
              </td>
              <td className="py-3 pr-1 text-right text-[13px] text-fg-muted tabular-nums">
                {d.close}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 flex items-center border-t border-line pt-4">
        <nav aria-label="Pages" className="mx-auto flex items-center gap-1.5">
          <PagerIcon>
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </PagerIcon>
          <Pager label="1" active />
          <Pager label="2" />
          <Pager label="3" />
          <span className="px-1 text-[13px] text-fg-dim">…</span>
          <Pager label="14" />
          <Pager label="15" />
          <PagerIcon>
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </PagerIcon>
        </nav>

        <span className="flex items-center gap-1.5 rounded-md border border-line bg-raised px-3 py-1.5 text-[12px] font-medium text-fg-muted">
          Show 15 per page
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

function Pager({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[13px] ${
        active ? "bg-field font-medium text-fg" : "text-fg-muted"
      }`}
    >
      {label}
    </span>
  );
}

function PagerIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-md text-fg-dim">
      {children}
    </span>
  );
}
