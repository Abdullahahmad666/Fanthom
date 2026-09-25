import Link from "next/link";
import { ArrowRight, FileUp } from "lucide-react";
import { ReceiptCard } from "./ReceiptCard";

/**
 * The hero.
 *
 * The page it replaces led with "AI notetaking that is out of this world" over
 * a starfield, which is a promise about the category rather than about the
 * product. Cue's claim is narrower and checkable, so the hero states it and
 * then hands over the control that proves it -- the argument and the evidence
 * in the same viewport, rather than a testimonial carousel three screens down.
 *
 * No badge row, no logo wall. Cue has no customers yet, and borrowing the
 * shape of social proof without having any is the one thing a product page
 * cannot do and stay honest.
 */
export function CueHero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:px-10">
      {/* A single warm wash, low and off-centre, so the fold has a horizon
          without the page becoming a gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--cue-accent), transparent 68%)" }}
      />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[12px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-mark" />
            Extractive, not generative
          </p>

          <h1 className="font-display mt-6 text-[clamp(40px,5.4vw,68px)] leading-[1.04] tracking-[-0.02em] text-text">
            Notes you can
            <br />
            check.
          </h1>

          <p className="measure mt-6 text-[17px] leading-relaxed text-muted">
            Every other notetaker asks you to trust a summary you cannot verify.
            Cue quotes your meeting instead of paraphrasing it, and every line it
            keeps carries the second it was said — so you can play the proof.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/import"
              className="press inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
            >
              <FileUp className="h-[18px] w-[18px]" />
              Import a transcript
            </Link>
            <Link
              href="/calls"
              className="press inline-flex items-center gap-2 rounded-lg border border-line px-6 py-3.5 text-[15px] font-semibold text-text transition-colors hover:border-line-strong"
            >
              See a finished meeting
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
          </div>

          <p className="mt-5 text-[13px] text-faint">
            Works with the transcript Zoom, Meet or Teams already made. Nothing
            joins your call.
          </p>
        </div>

        <ReceiptCard />
      </div>
    </section>
  );
}
