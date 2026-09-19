import Link from "next/link";
import type { ReactNode } from "react";
import { FathomWordmark } from "@/components/brand/FathomMark";

/**
 * Shared chrome for sign in and sign up.
 *
 * The two screens are the same screen in the product -- wordmark, card left,
 * testimonial right, social proof along the bottom -- differing only in the
 * heading and the line that swaps you to the other one. Keeping them in one
 * component is the only way they stay that way.
 */

const LOGOS = ["HubSpot", "Adobe", "_zapier", "GRUBHUB", "EA", "Calendly"];

export function AuthShell({
  title,
  swapPrompt,
  swapLabel,
  swapHref,
  children,
}: {
  title: string;
  /** "New to Fathom?" / "Already have a Fathom account?" */
  swapPrompt: string;
  swapLabel: string;
  swapHref: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-content">
      <div className="flex justify-center pt-8 pb-12">
        <FathomWordmark size={27} />
      </div>

      <div className="mx-auto grid w-full max-w-[1340px] flex-1 grid-cols-1 gap-16 px-8 lg:grid-cols-[500px_1fr] lg:items-center">
        <div className="rounded-3xl bg-[#1c1c1c] px-10 pt-14 pb-11 ring-1 ring-white/5 sm:px-20">
          <h1 className="text-center text-[30px] font-bold text-fg">{title}</h1>

          {children}

          <p className="mt-8 text-center text-[15px] text-fg">
            {swapPrompt}{" "}
            <Link href={swapHref} className="text-brand underline underline-offset-2">
              {swapLabel}
            </Link>
          </p>

          <p className="mt-7 text-center text-[12px] leading-relaxed text-fg-dim">
            By using Fathom, you agree to the{" "}
            <span className="underline underline-offset-2">Terms of Service</span> and{" "}
            <span className="underline underline-offset-2">Privacy Policy</span>.
          </p>
        </div>

        <Testimonial />
      </div>

      <SocialProof logos={LOGOS} />
    </div>
  );
}

function Testimonial() {
  return (
    <div className="hidden max-w-[620px] lg:block">
      <span
        aria-hidden
        className="block text-[104px] leading-[0.7] font-bold text-white/10"
      >
        &ldquo;
      </span>

      <blockquote className="mt-3 text-[27px] leading-[1.28] font-medium">
        <span className="text-fg">&lsquo;Work smarter, not harder,&rsquo; they said. </span>
        <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text font-bold text-transparent">
          Fathom took it personally.
        </span>
      </blockquote>

      {/* The closing mark sits out to the right at the attribution's level,
          which is what makes the quote read as a pull quote rather than a
          heading with a stray glyph above it. */}
      <div className="mt-8 flex items-center justify-between gap-8">
        <div>
          <p className="text-[13px] font-semibold text-fg">Rosanne K.</p>
          <p className="text-[13px] text-fg-muted">Executive</p>
        </div>
        <span
          aria-hidden
          className="mr-10 -mb-6 text-[104px] leading-[0.7] font-bold text-white/10"
        >
          &rdquo;
        </span>
      </div>
    </div>
  );
}

function SocialProof({ logos }: { logos: string[] }) {
  return (
    <div className="mt-20 flex flex-wrap items-center justify-center gap-x-7 gap-y-5 px-8 pb-10">
      <div className="flex items-center gap-3">
        <G2Mark />
        <div className="border-l border-line pl-3">
          <p className="flex items-center gap-1.5 text-[15px] font-semibold text-fg">
            <span className="text-[13px] tracking-[0.1em] text-white">★★★★★</span>
            5.0/5.0
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-[9px] text-fg-dim">
            <span>#1 rated</span>
            <span>• 6,500+ reviews</span>
          </p>
        </div>
      </div>

      <p className="text-[13px] leading-tight text-fg-muted">
        Used at over
        <br />
        290K+ companies
      </p>

      {logos.map((l) => (
        <span
          key={l}
          className="flex h-[62px] min-w-[150px] items-center justify-center rounded-lg bg-[#141414] px-6 text-[17px] font-bold text-fg-muted"
        >
          {l}
        </span>
      ))}
    </div>
  );
}

/** G2's ring-and-notch mark, simplified to a single arc plus the wordmark. */
function G2Mark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-label="G2">
      <circle cx="20" cy="20" r="17" fill="none" stroke="#6b6b70" strokeWidth="3" />
      <path d="M20 3a17 17 0 0 1 14.7 8.5L28 15.4A9.3 9.3 0 0 0 20 11Z" fill="#6b6b70" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#6b6b70"
        fontFamily="inherit"
      >
        G2
      </text>
    </svg>
  );
}
