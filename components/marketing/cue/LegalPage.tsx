import type { ReactNode } from "react";
import { CueSiteHeader } from "./CueSiteHeader";
import { getUser } from "@/backend/src/supabase/server";
import { CueSiteFooter } from "./CueSiteFooter";

/**
 * The frame for the legal pages.
 *
 * Narrower than the rest of the site and set at a longer measure, because
 * these are the only pages here that are genuinely read top to bottom rather
 * than scanned. The heading scale is flatter for the same reason: a legal
 * document with a hero is a document nobody trusts.
 */
export async function LegalPage({
  title,
  updated,
  lede,
  children,
}: {
  title: string;
  /** ISO date; rendered long-form, because "05/09" is ambiguous worldwide. */
  updated: string;
  lede: ReactNode;
  children: ReactNode;
}) {
  const date = new Date(updated).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const user = await getUser();

  return (
    <div className="min-h-screen bg-bg">
      <CueSiteHeader initialAccount={user?.email ? { email: user.email, name: null } : null} />

      <main className="mx-auto w-full max-w-[720px] px-6 pt-16 pb-24 sm:px-8">
        <p className="section-label">Legal</p>
        <h1 className="write-on font-display mt-3 text-[clamp(32px,4.4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text">
          {title}
        </h1>
        <p className="mt-3 text-[13px] text-faint">Last updated {date}</p>

        <div className="measure mt-8 rounded-xl border border-line bg-surface p-6 text-[15px] leading-relaxed text-muted">
          {lede}
        </div>

        {/* Spacing and type are set here rather than on every heading in every
            document, so the two pages cannot drift apart. */}
        <div
          className="mt-12 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-[19px] [&_h2]:font-semibold [&_h2]:text-text [&_li]:mb-2 [&_li]:pl-1 [&_p+p]:mt-4 [&_p]:measure [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-muted [&_strong]:font-semibold [&_strong]:text-text [&_ul]:measure [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:leading-relaxed [&_ul]:text-muted"
        >
          {children}
        </div>
      </main>

      <CueSiteFooter />
    </div>
  );
}
