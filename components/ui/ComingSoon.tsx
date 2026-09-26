import { Clock } from "lucide-react";

/**
 * How Cue talks about something it does not do yet.
 *
 * One component and one phrase, because the alternative is what was here
 * before: a dozen hand-written variations on "out of scope for this
 * prototype", each of which told the reader they were using a demo. That is
 * true of the build and irrelevant to the person using it -- what they need to
 * know is whether the thing they just clicked will ever work.
 *
 * "Coming soon" answers that. It does not apologise, and it does not pretend
 * the feature is there.
 */
export function ComingSoon({
  title,
  detail,
  className = "",
}: {
  title: string;
  /** One line on what it will do. Optional, but it is what makes this useful. */
  detail?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-24 text-center ${className}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accentsoft">
        <Clock className="h-5 w-5 text-accent" strokeWidth={1.8} />
      </span>
      <p className="text-[19px] font-medium text-text">{title}</p>
      {detail && <p className="measure text-[14px] leading-relaxed text-muted">{detail}</p>}
      <span className="mt-1 rounded-full border border-line px-3 py-1 text-[12px] tracking-[0.06em] text-faint uppercase">
        Coming soon
      </span>
    </div>
  );
}

/** The inline version, for a label beside a control rather than a whole panel. */
export function ComingSoonTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-accentsoft px-2 py-0.5 text-[11px] font-semibold text-accent ${className}`}
    >
      Coming soon
    </span>
  );
}
