"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "My Calls", href: "/calls" },
  { label: "Team Calls", href: "/team" },
  { label: "Playlists", href: "/playlists" },
  { label: "Alerts", href: "/alerts" },
  { label: "Deals", href: "/deals" },
];

/**
 * Primary navigation. Present on list pages only -- the meeting detail page
 * drops this strip entirely (docs/UI-SPEC.md 2).
 *
 * Active tab is brand-colored with a 2px underline flush to the strip's bottom
 * edge, spanning the label width only.
 */
export function TabNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky top-[var(--topbar-h)] z-30 flex h-[var(--tabnav-h)] shrink-0 items-stretch gap-9 overflow-x-auto border-t border-canvas bg-surface px-8"
    >
      {TABS.map(({ label, href }) => {
        const active =
          href === "/calls"
            ? pathname === "/calls" || pathname.startsWith("/calls/")
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="group relative flex items-center whitespace-nowrap text-[14px] font-medium transition-colors duration-150"
          >
            <span className={active ? "text-brand" : "text-fg group-hover:text-brand"}>
              {label}
            </span>
            {active && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t bg-brand" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
