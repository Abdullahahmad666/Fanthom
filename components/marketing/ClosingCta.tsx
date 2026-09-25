import Link from "next/link";

/** Concentric arcs, alternating vivid purple and soft cream, ~83px apart. */
const RADII = Array.from({ length: 11 }, (_, i) => 240 + i * 83);

/**
 * The closing call to action, and the thing that actually separates the page
 * from the footer.
 *
 * The thin striped band this replaces was a misread: those "diagonal stripes"
 * were the bottom slivers of these arcs, clipped by the page capture.
 *
 * Background runs pink (#E6A5BB) to vivid purple (#820DFB); the arcs are drawn
 * as SVG circles centred on the band so they read as rings rather than stripes.
 */
export function ClosingCta() {
  return (
    <section
      className="relative flex min-h-[620px] items-center justify-center overflow-hidden px-8 py-28"
      style={{ background: "linear-gradient(180deg,#E6A5BB 0%,#C77BD0 42%,#9325EF 78%,#820DFB 100%)" }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1900 760"
        preserveAspectRatio="xMidYMid slice"
      >
        {RADII.map((r, i) => (
          <circle
            key={r}
            cx="950"
            cy="380"
            r={r}
            fill="none"
            strokeWidth="6"
            stroke={i % 2 === 0 ? "#9B32EA" : "rgba(242,214,198,0.62)"}
          />
        ))}
      </svg>

      <div className="relative text-center">
        <p className="text-[17px] font-medium text-neutral-900">
          ✦ Never miss what matters
        </p>
        <h2 className="mt-6 text-[clamp(32px,3.4vw,48px)] leading-[1.18] font-light text-white">
          Stop guessing. Ask Cue.
          <br />
          Start today, for free.
        </h2>
        <Link
          href="/signup"
          className="mt-10 inline-flex rounded-full bg-gradient-to-r from-[#F7EA85] to-[#F1D572] px-9 py-4 text-[15px] font-semibold tracking-wide text-black uppercase transition-opacity hover:opacity-90"
        >
          Get started. It&apos;s free.
        </Link>
      </div>
    </section>
  );
}
