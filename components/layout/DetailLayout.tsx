import type { ReactNode } from "react";
import { TopBar } from "./TopBar";

/**
 * Layout for the meeting detail page.
 *
 * Structurally different from the list pages, not a variant of them: no
 * primary tab nav, no Ask Fathom rail (there it is a tab), and the content is
 * a ~1120px centered container rather than full-bleed.
 *
 * Measured at 1606px: left column 662px, gap ~28px, right rail 429px
 * (docs/UI-SPEC.md 4).
 */
export function DetailLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <TopBar />
      <main className="mx-auto w-full max-w-[var(--detail-max)] flex-1 px-4 pb-20 xl:px-0">
        {children}
      </main>
    </div>
  );
}
