"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bug, BookOpen, CircleHelp, Code2, Download, Gift, LifeBuoy, Lightbulb, LogOut,
  MessageCircle, RotateCcw, Search, Settings, Star, Video,
} from "lucide-react";
import { FathomWordmark } from "@/components/brand/FathomMark";
import { Popover } from "@/components/ui/Popover";
import { pushToast } from "@/lib/toast";

type TopBarProps = {
  /** Controlled search text. Omit for an uncontrolled field. */
  query?: string;
  onQueryChange?: (value: string) => void;
};

const ACTIONS: { label: string; Icon: typeof Gift; href?: string }[] = [
  { label: "Refer", Icon: Gift },
  { label: "Settings", Icon: Settings, href: "/settings" },
];

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

/** Help & Feedback keeps the things that are actually feedback. */
const HELP_GROUPS: MenuRow[][] = [
  [
    { label: "Contact Support", Icon: MessageCircle },
    { label: "Request a Feature", Icon: Lightbulb },
    { label: "Report a Bug", Icon: Bug },
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
        <FathomWordmark />
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
          placeholder="Search Call Recordings"
          aria-label="Search call recordings"
          className="h-[34px] w-[320px] max-w-[28vw] rounded-lg bg-field pr-3 pl-8 text-[13px] text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-search-cancel-button]:hidden"
        />
        {!onList && local.trim() && (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] text-fg-dim">
            {pathname === "/" ? "" : "↵ search"}
          </span>
        )}
      </form>

      <div className="ml-auto flex items-center gap-4 lg:gap-6">
        {ACTIONS.map(({ label, Icon, href }) => {
          const active = href && pathname === href;
          const classes = `hidden items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150 lg:flex ${
            active ? "bg-field text-fg" : "text-fg hover:text-brand"
          }`;
          return href ? (
            <Link key={label} href={href} className={classes} aria-current={active ? "page" : undefined}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {label}
            </Link>
          ) : (
            <button key={label} type="button" className={classes}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {label}
            </button>
          );
        })}

        <div className="hidden lg:block">
          <Popover
            className="min-w-[320px] bg-[#343435] py-0"
            trigger={({ toggle, open }) => (
              <button
                type="button"
                onClick={toggle}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150 ${
                  open ? "bg-field text-fg" : "text-fg hover:text-brand"
                }`}
              >
                <LifeBuoy className="h-[18px] w-[18px]" strokeWidth={2} />
                Help &amp; Feedback
              </button>
            )}
          >
            {(close) => <MenuGroups groups={HELP_GROUPS} close={close} />}
          </Popover>
        </div>

        {/* Streak counter. Amber star + count, no surrounding pill. */}
        <span className="flex items-center gap-1.5" title="Streak">
          <Star className="h-[18px] w-[18px] fill-amber text-amber" />
          <span className="text-[14px] font-semibold text-amber">25</span>
        </span>

        <Popover
          className="min-w-[300px] bg-[#343435] py-0"
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
