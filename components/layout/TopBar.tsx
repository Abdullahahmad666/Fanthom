"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen, CircleHelp, Code2, Download, Gift, LifeBuoy, LogOut, Search,
  Settings, Star, Video,
} from "lucide-react";
import { FathomWordmark } from "@/components/brand/FathomMark";
import { MenuItem, Popover } from "@/components/ui/Popover";

type TopBarProps = {
  /** Controlled search text. Omit for an uncontrolled field. */
  query?: string;
  onQueryChange?: (value: string) => void;
};

const ACTIONS: { label: string; Icon: typeof Gift; href?: string }[] = [
  { label: "Refer", Icon: Gift },
  { label: "Settings", Icon: Settings, href: "/settings" },
];

/** Help & Feedback dropdown: four groups, the last one naming the account. */
const HELP_GROUPS: { label: string; Icon?: typeof Gift; href?: string }[][] = [
  [
    { label: "Start Test Call", Icon: Video },
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
    { label: "Download App", Icon: Download },
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
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fg-muted"
          strokeWidth={2.5}
        />
        <input
          type="search"
          value={value}
          onChange={(e) => (onList ? onQueryChange(e.target.value) : setLocal(e.target.value))}
          placeholder="Search Call Recordings"
          aria-label="Search call recordings"
          className="h-[38px] w-[380px] max-w-[30vw] rounded-lg bg-field pr-3 pl-9 text-[14px] text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-search-cancel-button]:hidden"
        />
        {!onList && local.trim() && (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[12px] text-fg-dim">
            {pathname === "/" ? "" : "↵ search"}
          </span>
        )}
      </form>

      <div className="ml-auto flex items-center gap-4 lg:gap-6">
        {ACTIONS.map(({ label, Icon, href }) => {
          const active = href && pathname === href;
          const classes = `hidden items-center gap-2 rounded-lg px-2.5 py-1.5 text-[14px] transition-colors duration-150 lg:flex ${
            active ? "bg-field text-fg" : "text-fg hover:text-brand"
          }`;
          return href ? (
            <Link key={label} href={href} className={classes} aria-current={active ? "page" : undefined}>
              <Icon className="h-5 w-5" strokeWidth={2} />
              {label}
            </Link>
          ) : (
            <button key={label} type="button" className={classes}>
              <Icon className="h-5 w-5" strokeWidth={2} />
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
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[14px] transition-colors duration-150 ${
                  open ? "bg-field text-fg" : "text-fg hover:text-brand"
                }`}
              >
                <LifeBuoy className="h-5 w-5" strokeWidth={2} />
                Help &amp; Feedback
              </button>
            )}
          >
            {(close) => (
              <>
                {HELP_GROUPS.map((group, gi) => (
                  <div
                    key={gi}
                    className={gi > 0 ? "border-t border-white/10 py-2" : "py-2"}
                  >
                    {group.map(({ label, Icon, href }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          close();
                          if (href) router.push(href);
                        }}
                        className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-[16px] text-fg transition-colors hover:bg-white/5"
                      >
                        {Icon ? (
                          <Icon className="h-5 w-5 shrink-0 text-fg-muted" strokeWidth={1.8} />
                        ) : (
                          <span className="w-5 shrink-0" />
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="border-t border-white/10 px-5 py-3">
                  <p className="text-[14px] text-fg-dim">Logged in as</p>
                  <p className="truncate text-[15px] text-fg-muted">
                    abdullahahmad5618@gmail.com
                  </p>
                </div>
              </>
            )}
          </Popover>
        </div>

        {/* Streak counter. Amber star + count, no surrounding pill. */}
        <span className="flex items-center gap-1.5" title="Streak">
          <Star className="h-5 w-5 fill-amber text-amber" />
          <span className="text-[16px] font-semibold text-amber">25</span>
        </span>

        <Popover
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Account"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-avatar text-[15px] font-semibold text-fg"
            >
              A
            </button>
          )}
        >
          {(close) => (
            <>
              <MenuItem
                label="Settings"
                description="Auto-record, calendar and integrations"
                onClick={() => {
                  close();
                  router.push("/settings");
                }}
              />
              <MenuItem
                label="Replay onboarding"
                description="Signup, calendar connect and preferences"
                onClick={() => {
                  close();
                  router.push("/signup");
                }}
              />
              <MenuItem
                label="Sign out"
                onClick={() => {
                  close();
                  router.push("/");
                }}
              />
            </>
          )}
        </Popover>
      </div>
    </header>
  );
}
