import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { CueWordmark } from "@/components/brand/CueMark";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * 404.
 *
 * Offers the two things someone who lands here actually wants -- back to
 * where they came from, or into the product -- rather than a large number and
 * a shrug. The wordmark is a link home because on a 404 it is often the only
 * thing on screen a visitor recognises.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <Link href="/" aria-label="Cue home">
        <CueWordmark size={22} />
      </Link>

      <p className="section-label mt-12">Error 404</p>
      <h1 className="font-display mt-3 text-[clamp(30px,4.4vw,44px)] leading-[1.1] tracking-[-0.02em] text-text">
        That page is not here.
      </h1>
      <p className="measure mt-4 text-[15px] leading-relaxed text-muted">
        The link may be out of date, or the page may be one that only exists
        when you are signed in.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="press inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
          Back to the home page
        </Link>
        <Link
          href="/calls"
          className="press inline-flex items-center gap-2 rounded-lg border border-line px-6 py-3 text-[15px] font-semibold text-text transition-colors hover:border-line-strong"
        >
          <Search className="h-[18px] w-[18px]" />
          Go to my meetings
        </Link>
      </div>
    </div>
  );
}
