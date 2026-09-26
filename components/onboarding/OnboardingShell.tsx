import Link from "next/link";
import type { ReactNode } from "react";
import { CueWordmark } from "@/components/brand/CueMark";

/**
 * The frame every onboarding step shares.
 *
 * Steps are counted rather than shown as a percentage bar. "85%" is a number
 * with no unit -- it does not say how much is left, only that someone chose
 * 85 -- whereas "Step 2 of 3" is a promise the flow can be held to, and this
 * flow is short enough to make that promise.
 *
 * The signed-in address is passed in rather than hard-coded. It used to read
 * one developer's Gmail on everyone's screen, which was harmless while nobody
 * could actually sign in and is not any more.
 */
export function OnboardingShell({
  step,
  total = 3,
  eyebrow,
  title,
  lede,
  children,
  email,
  note,
}: {
  step: number;
  total?: number;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  /** The signed-in address, when there is a session. */
  email?: string | null;
  note?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="mx-auto flex w-full max-w-[760px] items-center gap-4 px-6 pt-8">
        <Link href="/" aria-label="Cue">
          <CueWordmark size={19} />
        </Link>
        <span className="ml-auto text-[12px] tracking-[0.08em] text-faint uppercase">
          Step {step} of {total}
        </span>
      </header>

      {/* Segments rather than a fill: each one is a step you can count, and
          the step you are on is the one that is lit. */}
      <div className="mx-auto mt-4 flex w-full max-w-[760px] gap-1.5 px-6">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i < step ? "bg-accent" : "bg-line"
            }`}
          />
        ))}
      </div>

      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col px-6 pt-16 pb-12">
        <p className="section-label">{eyebrow}</p>
        <h1 className="font-display mt-3 text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.02em] text-text">
          {title}
        </h1>
        {lede && (
          <p className="measure mt-4 text-[15.5px] leading-relaxed text-muted">{lede}</p>
        )}

        <div className="mt-10">{children}</div>
      </main>

      {note && (
        <p className="mx-auto w-full max-w-[760px] px-6 pb-4 text-[13px] text-faint">{note}</p>
      )}

      {/* A div rather than a p: the signed-in branch contains a form, and a
          form inside a paragraph is invalid HTML -- the browser closes the p
          early and the hydrated tree stops matching the server's. */}
      <div className="mx-auto w-full max-w-[760px] px-6 pb-10 text-[13px] text-faint">
        {email ? (
          <>
            Signed in as <span className="text-muted">{email}</span>.{" "}
            {/* A form, not a link: the signout route is POST-only on purpose,
                so that a stray GET -- a prefetch, an <img src>, a crawler --
                cannot end someone's session for them. */}
            <form action="/auth/signout" method="post" className="inline">
              <button
                type="submit"
                className="text-muted underline underline-offset-2 hover:text-text"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            Continuing as a guest — nothing here is saved to an account.{" "}
            <Link href="/signup" className="text-muted underline underline-offset-2">
              Create one
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
