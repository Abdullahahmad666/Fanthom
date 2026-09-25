import Link from "next/link";
import { ArrowRight, FileUp } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The closing ask.
 *
 * One action, and it is the one that produces the product's value in under a
 * minute: import a transcript and read the notes it finds. The page it
 * replaces closed on "Get started - free forever" next to a second CTA and a
 * compliance strip, which is three asks in a row and reads as a checkout.
 */
export function CueClosing() {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.16] blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--cue-mark), transparent 68%)" }}
      />

      <Reveal className="relative mx-auto max-w-[680px] text-center">
        <h2 className="font-display text-[clamp(32px,4.6vw,54px)] leading-[1.08] tracking-[-0.02em] text-text">
          Bring one meeting.
          <br />
          Check every line.
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-[16px] leading-relaxed text-muted">
          Export the transcript your last call already produced and drop it in.
          It parses in your browser, so you see what Cue found before anything
          is stored.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/import"
            className="press inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            <FileUp className="h-[18px] w-[18px]" />
            Import a transcript
          </Link>
          <Link
            href="/calls"
            className="press inline-flex items-center gap-2 rounded-lg border border-line px-7 py-3.5 text-[15px] font-semibold text-text transition-colors hover:border-line-strong"
          >
            Look around first
            <ArrowRight className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
