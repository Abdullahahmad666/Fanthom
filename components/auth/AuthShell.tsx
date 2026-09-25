import Link from "next/link";
import type { ReactNode } from "react";
import { Quote } from "lucide-react";
import { CueWordmark } from "@/components/brand/CueMark";
import { Cue } from "@/components/ui/Cue";

/**
 * Shared chrome for sign in and sign up.
 *
 * The two screens are the same screen, differing only in the heading and the
 * line that swaps you to the other one, so they stay in one component.
 *
 * What used to fill the right half was a testimonial from "Rosanne K.,
 * Executive" and a G2 badge reading 5.0/5.0 from 6,500+ reviews. Those are a
 * fabricated endorsement and a fabricated rating for a product that has
 * neither, which is not something a rename can launder. In their place is the
 * thing the account actually gets you, shown rather than claimed: a summary
 * line with the moment it came from.
 *
 * It also follows the theme now instead of pinning itself dark. A sign-in
 * screen is the first surface anyone sees, and it should not be the one place
 * that ignores the preference they arrived with.
 */

export function AuthShell({
  title,
  swapPrompt,
  swapLabel,
  swapHref,
  children,
}: {
  title: string;
  /** "New to Cue?" / "Already have a Cue account?" */
  swapPrompt: string;
  swapLabel: string;
  swapHref: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* Aligned to the content column, not to the page. Centred on a layout
          whose two columns are different widths, the mark lands over the right
          one and reads as a label for it. */}
      <div className="mx-auto w-full max-w-[1180px] px-6 pt-10 pb-12 sm:px-8">
        <Link href="/" aria-label="Cue home" className="inline-block">
          <CueWordmark size={26} />
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-[1180px] flex-1 grid-cols-1 items-start gap-14 px-6 pb-16 sm:px-8 lg:grid-cols-[460px_1fr] lg:gap-20">
        <div className="lifted rounded-xl border border-line bg-surface px-8 pt-12 pb-10 sm:px-12">
          <h1 className="font-display text-center text-[30px] leading-tight text-text">
            {title}
          </h1>

          {children}

          <p className="mt-8 text-center text-[14px] text-muted">
            {swapPrompt}{" "}
            <Link
              href={swapHref}
              className="inline-block py-2 font-medium text-accent underline underline-offset-2"
            >
              {swapLabel}
            </Link>
          </p>

          <p className="mt-6 text-center text-[12px] leading-relaxed text-faint">
            By using Cue you agree to the Terms of Service and Privacy Policy —
            neither of which exists yet, because this is a portfolio build.
          </p>
        </div>

        <WhatYouGet />
      </div>
    </div>
  );
}

/**
 * The right half: the product's one idea, demonstrated at the size it appears
 * in the app. A sample rather than a promise, so the screen makes the same
 * argument the landing page does instead of asking to be believed.
 */
function WhatYouGet() {
  return (
    <div
      style={{ animation: "fade-rise 620ms var(--cue-ease) 220ms both" }}
      className="hidden max-w-[560px] lg:block"
    >
      <p className="section-label">What an account gets you</p>
      <h2 className="font-display mt-3 text-[34px] leading-[1.12] tracking-[-0.02em] text-text">
        Notes that carry
        <br />
        their evidence.
      </h2>
      <p className="measure mt-5 text-[15px] leading-relaxed text-muted">
        Import a transcript and Cue keeps the sentences that decided something,
        committed to something, or flagged a risk — each one tagged with the
        second it was said.
      </p>

      <div className="mt-9 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="px-6 py-5">
          <p className="section-label">Decisions</p>
          <p className="mt-2 text-[15px] leading-relaxed text-text">
            Launch moves from the 14th to the 21st, to get two full rehearsal
            windows.
          </p>
          <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Cue tSec={184} />
            <Cue tSec={212} />
            <Cue tSec={258} />
          </span>
        </div>

        <div className="border-t border-line bg-mark-soft px-6 py-4">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-mark uppercase">
            <Quote className="h-3 w-3" />
            Behind the first cue
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-text">
            <span className="font-medium">Maya Chen:</span> “We are not going to
            make the 14th. The rehearsal has not run once end to end, and I would
            rather move the date than ship blind.”
          </p>
        </div>
      </div>
    </div>
  );
}
