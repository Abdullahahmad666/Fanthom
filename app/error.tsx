"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { CueWordmark } from "@/components/brand/CueMark";

/**
 * The route error boundary.
 *
 * Shows the digest rather than the message. Next replaces server error
 * messages with a digest in production precisely so that a stack trace cannot
 * leak to a visitor, and printing `error.message` here would either be that
 * placeholder or, in development, something a visitor cannot act on. The
 * digest is the one piece that makes a report actionable.
 *
 * `reset()` retries the failed segment without a full reload, which is worth
 * offering first: most of what reaches here is a transient fetch failure.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[cue] route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <Link href="/" aria-label="Cue home">
        <CueWordmark size={22} />
      </Link>

      <p className="section-label mt-12">Something broke</p>
      <h1 className="font-display mt-3 text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.02em] text-text">
        That did not load.
      </h1>
      <p className="measure mt-4 text-[15px] leading-relaxed text-muted">
        The page failed on its way to you. Trying again usually works — if it
        does not, the database may be unreachable.
      </p>

      {error.digest && (
        <p className="mt-4 rounded-md border border-line bg-surface px-3 py-2 font-mono text-[12px] text-faint">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="press inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          <RotateCcw className="h-[18px] w-[18px]" />
          Try again
        </button>
        <Link
          href="/"
          className="press inline-flex items-center gap-2 rounded-lg border border-line px-6 py-3 text-[15px] font-semibold text-text transition-colors hover:border-line-strong"
        >
          Back to the home page
        </Link>
      </div>
    </div>
  );
}
