import Link from "next/link";
import type { ReactNode } from "react";
import { FathomWordmark } from "@/components/brand/FathomMark";

/**
 * Every signup/onboarding step shares one frame: a thin cyan progress bar
 * pinned to the very top, a centred wordmark, a muted uppercase eyebrow, a
 * headline, the step's content, then the account footer.
 */
export function OnboardingShell({
  progress,
  eyebrow,
  title,
  children,
  footer = true,
  note,
}: {
  /** 0–100. Drawn as the cyan bar across the top of the viewport. */
  progress: number;
  eyebrow: string;
  title?: ReactNode;
  children: ReactNode;
  footer?: boolean;
  note?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="h-[6px] w-full bg-transparent">
        <div
          className="h-full bg-brand transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-center pt-8">
        <Link href="/welcome" aria-label="Fathom">
          <FathomWordmark />
        </Link>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <p className="mb-5 text-center text-[17px] tracking-[0.06em] text-fg-muted uppercase">
          {eyebrow}
        </p>
        {title && (
          <h1 className="mb-12 max-w-[760px] text-center text-[30px] leading-snug font-bold text-fg">
            {title}
          </h1>
        )}
        {children}
      </main>

      {note && (
        <p className="flex items-center justify-center gap-3 px-6 pb-6 text-center text-[16px] text-fg-muted">
          {note}
        </p>
      )}

      {footer && (
        <p className="pb-8 text-center text-[16px] text-fg-muted">
          <span className="mr-1.5 inline-block h-4 w-4 rounded-full bg-fg-dim align-[-2px]" />
          Signing up as{" "}
          <span className="text-fg">abdullahahmad5618@gmail.com</span>. Wrong account?{" "}
          <Link href="/welcome" className="text-fg underline underline-offset-2">
            Sign out
          </Link>
        </p>
      )}
    </div>
  );
}
