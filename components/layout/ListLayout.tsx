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
 * The detail page deliberately does NOT use this -- it has no tab nav and no
 * rail. See docs/UI-SPEC.md 2.
 */
export function ListLayout({
  children,
  initialQuery = "",
}: {
  children: ReactNode;
  /** Seeded from ?q= so searches from other pages land filtered. */
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  return (
    <SearchContext.Provider value={query}>
      <div className="flex min-h-screen flex-col bg-canvas">
        <TopBar query={query} onQueryChange={setQuery} />
        <TabNav />
        <div className="flex flex-1 items-stretch">
          <main className="min-w-0 flex-1 pb-16">{children}</main>
          <AskFathomRail />
        </div>
      </div>
    </SearchContext.Provider>
  );
}
