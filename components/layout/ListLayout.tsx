"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { TopBar } from "./TopBar";
import { TabNav } from "./TabNav";
import { AskFathomRail } from "./AskFathomRail";

const SearchContext = createContext("");

/** Current global search text, for list pages that filter on it. */
export function useSearchQuery() {
  return useContext(SearchContext);
}

/**
 * Layout for list pages: top bar + primary tab nav + content, with the
 * account-scoped Ask Fathom rail pinned right.
 *
 * The shell is viewport-height and does not scroll. The meeting list and the
 * rail each own their scroll, so a long conversation in the rail never drags
 * the list with it, and vice versa.
 *
 * The detail page deliberately does NOT use this -- it has no tab nav and no
 * rail. See docs/UI-SPEC.md 2.
 */
export function ListLayout({
  children,
  initialQuery = "",
  rail = true,
}: {
  children: ReactNode;
  /** Seeded from ?q= so searches from other pages land filtered. */
  initialQuery?: string;
  /**
   * Ask Fathom answers over your calls, so it is dropped on the tabs that
   * have none to answer over -- Team Calls, Deals and Alerts. An assistant
   * that can only say "no data" is worse than no assistant.
   */
  rail?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);

  return (
    <SearchContext.Provider value={query}>
      <div className="flex h-screen flex-col overflow-hidden bg-canvas">
        <TopBar query={query} onQueryChange={setQuery} />
        <TabNav />
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
          {rail && <AskFathomRail />}
        </div>
      </div>
    </SearchContext.Provider>
  );
}
