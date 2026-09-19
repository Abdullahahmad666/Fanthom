"use client";

import Link from "next/link";
import { Gift, LifeBuoy, Search, Settings, Star } from "lucide-react";
import { FathomWordmark } from "@/components/brand/FathomMark";

type TopBarProps = {
  /** Controlled search text. Omit for an uncontrolled field. */
  query?: string;
  onQueryChange?: (value: string) => void;
};

const ACTIONS = [
  { label: "Refer", Icon: Gift },
  { label: "Settings", Icon: Settings },
  { label: "Help & Feedback", Icon: LifeBuoy },
];

/**
 * Global top bar. Measured at 63px tall with a 400x38 search field starting at
 * x=243 (docs/UI-SPEC.md 2.1). Present on both layouts, unlike the tab nav.
 */
export function TopBar({ query, onQueryChange }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-[var(--topbar-h)] shrink-0 items-center bg-surface px-6">
      <Link href="/" className="shrink-0" aria-label="Fathom home">
        <FathomWordmark />
      </Link>

      <div className="relative ml-7 hidden sm:block">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fg-muted"
          strokeWidth={2.5}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Search Call Recordings"
          aria-label="Search call recordings"
          className="h-[38px] w-[400px] max-w-[42vw] rounded-lg bg-field pr-3 pl-9 text-[15px] text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      <div className="ml-auto flex items-center gap-6">
        {ACTIONS.map(({ label, Icon }) => (
          <button
            key={label}
            type="button"
            className="hidden items-center gap-2 text-[15px] text-fg transition-colors duration-150 hover:text-brand lg:flex"
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            {label}
          </button>
        ))}

        {/* Streak counter. Amber star + count, no surrounding pill. */}
        <span className="flex items-center gap-1.5" title="Streak">
          <Star className="h-5 w-5 fill-amber text-amber" />
          <span className="text-[17px] font-semibold text-amber">25</span>
        </span>

        <button
          type="button"
          aria-label="Account"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-avatar text-[15px] font-semibold text-fg"
        >
          A
        </button>
      </div>
    </header>
  );
}
