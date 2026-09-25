"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen, CircleHelp, Code2, Download, Gift, LifeBuoy, LogOut,
  RotateCcw, Search, Settings, Star, Video,
} from "lucide-react";
import { CueWordmark } from "@/components/brand/CueMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Popover } from "@/components/ui/Popover";
import { ReferCard } from "./ReferCard";
import { StreakCard, STREAK_POINTS } from "./StreakCard";
import { SupportWidget } from "./SupportWidget";
import { pushToast } from "@/lib/toast";

type TopBarProps = {
  /** Controlled search text. Omit for an uncontrolled field. */
  query?: string;
  onQueryChange?: (value: string) => void;
};

const ACTIONS: { label: string; Icon: typeof Gift; href?: string }[] = [
  { label: "Settings", Icon: Settings, href: "/settings" },
];

/**
 * Panel surfaces, inline rather than as classes.
 *
 * The popover already sets bg-popover, py-2 and ring-1, and a competing
 * utility in className only wins if the stylesheet happens to order it later
 * -- which is how the amber points card ended up rendering black text on the
 * default near-black panel.
 */
const SHADOW = "0 24px 60px -20px rgb(0 0 0 / 0.45)";

/* Token references rather than hex: these panels have to follow the theme,
   and a hard-coded grey is invisible on paper. */
const PANEL = {
  menu: {
    background: "var(--cue-overlay)",
    paddingTop: 0,
    paddingBottom: 0,
    boxShadow: SHADOW,
    border: "1px solid var(--cue-line)",
  },
  card: {
    background: "var(--cue-overlay)",
    padding: 0,
    borderRadius: "var(--cue-r-lg)",
    boxShadow: SHADOW,
    border: "1px solid var(--cue-line)",
  },
  /** The points card keeps the provenance colour it is named after. */
  amber: {
    background: "var(--cue-mark)",
    padding: 0,
    borderRadius: "var(--cue-r-lg)",
    boxShadow: SHADOW,
  },
} as const;

type MenuRow = { label: string; Icon?: typeof Gift; href?: string; note?: string };

const ACCOUNT_EMAIL = "abdullahahmad5618@gmail.com";

/**
 * The account menu, on the avatar.
 *
 * Three groups and a footer naming the signed-in address -- the product hangs
 * all of this off the avatar, not off Help & Feedback.
 *
 * "Replay onboarding" is ours, not Fathom's. It sits here because it is the
 * only way back into the signup flow once you are past it, which a reviewer
 * walking the build will want.
 */
const ACCOUNT_GROUPS: MenuRow[][] = [
  [
    { label: "Start Test Call", Icon: Video, note: "Starts a recorded test meeting in the real product." },
    { label: "Tutorial", Icon: BookOpen },
    { label: "FAQs", Icon: CircleHelp },
    { label: "Developers", Icon: Code2 },
  ],
  [
    { label: "Privacy Policy" },
    { label: "Terms of Service" },
    { label: "Security & Compliance" },
    { label: "System Status" },
  ],
  [
    { label: "Download App", Icon: Download, note: "Ships the desktop recorder in the real product." },
    { label: "Replay onboarding", Icon: RotateCcw, href: "/signup" },
    { label: "Logout", Icon: LogOut, href: "/" },
  ],
];

/**
 * Global top bar. Measured at 63px tall with a 400x38 search field starting at
 * x=243 (docs/UI-SPEC.md 2.1). Present on both layouts, unlike the tab nav.
 */
export function TopBar({ query, onQueryChange }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const onList = onQueryChange !== undefined;
  const [local, setLocal] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);

  const value = onList ? (query ?? "") : local;

  /**
   * On the list page the field filters live. Everywhere else -- notably the
   * meeting detail page, which has no list to filter -- submitting navigates
   * to My Calls carrying the query, so the control is never dead.
   */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onList) return;
    const q = local.trim();
    if (q) router.push(`/calls?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-40 flex h-[var(--topbar-h)] shrink-0 items-center bg-surface px-4 sm:px-6">
      <Link href="/calls" className="shrink-0" aria-label="My Calls">
        <CueWordmark size={17} />
      </Link>

      <form onSubmit={submit} className="relative ml-4 hidden sm:block lg:ml-7">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-[15px] w-[15px] -translate-y-1/2 text-fg-muted"
          strokeWidth={2.5}
        />
        <input
          type="search"
          value={value}
          onChange={(e) => (onList ? onQueryChange(e.target.value) : setLocal(e.target.value))}
          placeholder="Search every meeting"
          aria-label="Search every meeting"
          className="h-[34px] w-[320px] max-w-[28vw] rounded-lg bg-field pr-3 pl-8 text-[13px] text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-search-cancel-button]:hidden"
        />
        {!onList && local.trim() && (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] text-fg-dim">
            {pathname === "/" ? "" : "↵ search"}
          </span>
        )}
      </form>

      <div className="ml-auto flex items-center gap-4 lg:gap-6">
        {/* Refer is a hover card rather than a link -- the referral code lives
            in the bar, not on a page of its own. */}
        <div className="hidden lg:block">
          <Popover
            openOnHover
            panelStyle={PANEL.card}
            trigger={({ toggle, open }) => (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150 ${
                  open ? "bg-field text-fg" : "text-fg hover:text-brand"
                }`}
              >
                <Gift className="h-[18px] w-[18px]" strokeWidth={2} />
                Refer
              </button>
            )}
          >
            {() => <ReferCard />}
          </Popover>
        </div>

        {/* Below lg the label is dropped but the control stays: hiding it
            outright left no way to reach Settings on a phone, since the
            account menu does not carry it either. */}
        {ACTIONS.map(({ label, Icon, href }) => {
          const active = href && pathname === href;
          const classes = `flex items-center gap-2 rounded-lg p-2 text-[13px] transition-colors duration-150 lg:px-2.5 lg:py-1.5 ${
            active ? "bg-field text-fg" : "text-fg hover:text-brand"
          }`;
          const body = (
            <>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              <span className="hidden lg:inline">{label}</span>
            </>
          );
          return href ? (
            <Link
              key={label}
              href={href}
              className={classes}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              {body}
            </Link>
          ) : (
            <button key={label} type="button" aria-label={label} className={classes}>
              {body}
            </button>
          );
        })}

        {/* Help & Feedback opens the support widget, not a menu -- in the
            product it is a surface, not a list of links. */}
        <button
          type="button"
          onClick={() => setSupportOpen((v) => !v)}
          aria-expanded={supportOpen}
          className={`hidden items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150 lg:flex ${
            supportOpen ? "bg-field text-brand" : "text-fg hover:text-brand"
          }`}
        >
          <LifeBuoy className="h-[18px] w-[18px]" strokeWidth={2} />
          Help &amp; Feedback
        </button>

        {/* Theme is a first-class control, not a setting three pages deep:
            this product is read in both, so switching has to be one click. */}
        <span className="hidden md:block">
          <ThemeToggle compact />
        </span>

        {/* Streak counter. Amber star + count, opening the points card. */}
        <Popover
          openOnHover
          panelStyle={PANEL.amber}
          trigger={({ toggle, open }) => (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label={`${STREAK_POINTS} points`}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                open ? "bg-[#33290a]" : ""
              }`}
            >
              <Star className="h-[18px] w-[18px] fill-amber text-amber" />
              <span className="text-[14px] font-semibold text-amber">{STREAK_POINTS}</span>
            </button>
          )}
        >
          {() => <StreakCard />}
        </Popover>

        <Popover
          className="min-w-[300px]"
          panelStyle={PANEL.menu}
          trigger={({ toggle, open }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Account"
              aria-expanded={open}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-avatar text-[13px] font-semibold text-fg"
            >
              A
            </button>
          )}
        >
          {(close) => (
            <>
              <MenuGroups groups={ACCOUNT_GROUPS} close={close} />
              <div className="border-t border-white/10 px-5 py-3">
                <p className="text-[13px] text-fg-dim">Logged in as</p>
                <p className="truncate text-[13px] text-fg-muted">{ACCOUNT_EMAIL}</p>
              </div>
            </>
          )}
        </Popover>
      </div>

      {supportOpen && <SupportWidget onClose={() => setSupportOpen(false)} />}
    </header>
  );
}

/**
 * Grouped menu rows, shared by the account and Help menus.
 *
 * Rows without an href say so instead of closing silently -- in the product
 * they leave for Fathom's own site or a native app, neither of which this
 * build has. A dead row that just dismisses reads as a bug.
 */
function MenuGroups({ groups, close }: { groups: MenuRow[][]; close: () => void }) {
  const router = useRouter();

  const run = ({ label, href, note }: MenuRow) => {
    close();
    if (href) {
      router.push(href);
      return;
    }
    pushToast({
      title: label,
      description: note ?? "Leaves for Fathom's own site in the real product.",
      status: "info",
      duration: 3500,
    });
  };

  return (
    <>
      {groups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? "border-t border-white/10 py-2" : "py-2"}>
          {group.map((row) => (
            <button
              key={row.label}
              type="button"
              role="menuitem"
              onClick={() => run(row)}
              className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-[14px] text-fg transition-colors hover:bg-white/5"
            >
              {row.Icon ? (
                <row.Icon className="h-5 w-5 shrink-0 text-fg-muted" strokeWidth={1.8} />
              ) : (
                <span className="w-5 shrink-0" />
              )}
              {row.label}
            </button>
          ))}
        </div>
      ))}
    </>
  );
}
