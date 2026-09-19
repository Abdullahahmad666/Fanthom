import Link from "next/link";

/**
 * "Ready to explore what's out there?"
 *
 * The astronaut overhangs the panel's top-left corner rather than sitting
 * inside it, which is what stops the gradient reading as a plain banner. The
 * faint grid behind belongs to the section, not the panel, so the overhang
 * has something to sit against.
 */
export function ExploreCta() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-20">
      {/* Graph paper, fading out from the panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4a5a7a 1px, transparent 1px), linear-gradient(to bottom, #4a5a7a 1px, transparent 1px)",
          backgroundSize: "74px 74px",
          maskImage: "radial-gradient(70% 60% at 50% 45%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 45%, #000 40%, transparent 100%)",
        }}
      />

      <Sparkle className="absolute top-[6%] right-[22%] h-16 w-16 text-[#F4E06A]" />
      <Sparkle className="absolute bottom-[26%] right-[8%] h-10 w-10 text-[#E8721E]" />

      <div className="relative mx-auto max-w-[1300px] pt-8">
        <div
          className="relative rounded-[22px] px-10 py-14 sm:px-16"
          style={{
            background: "linear-gradient(135deg,#F3B7C6 0%,#D77BD8 34%,#9B34F0 68%,#7C0FF5 100%)",
          }}
        >
          {/* Overhangs the corner; hidden on small screens where there is no
              room for it to break out. */}
          <Astronaut className="pointer-events-none absolute -top-24 left-2 hidden h-[300px] w-[240px] lg:block" />

          <div className="lg:pl-[300px]">
            <h2 className="text-[clamp(32px,4.2vw,52px)] leading-[1.1] font-light text-black">
              Ready to explore
              <br />
              what&apos;s out there?
            </h2>
            <p className="mt-6 max-w-[620px] text-[17px] leading-snug text-black/80">
              Whether you&apos;d like to learn more about Fathom, how it works for your team, or
              which plan is the best fit – our sales team is here to help.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex rounded-full border border-black/70 px-8 py-3.5 text-[14px] font-semibold tracking-[0.06em] text-black uppercase transition-colors hover:bg-black hover:text-white"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 0c.7 7.1 4.2 10.6 12 12-7.8 1.4-11.3 4.9-12 12-.7-7.1-4.2-10.6-12-12C7.8 10.6 11.3 7.1 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Line-art astronaut with a magnifying glass, as on the product's page. */
function Astronaut({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 300" className={className} aria-hidden fill="none">
      <g stroke="#f2f3f6" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {/* Backpack */}
        <rect x="34" y="52" width="46" height="74" rx="12" fill="#17181d" />
        <path d="M46 70h22M46 84h22" strokeWidth="2" />
        {/* Helmet */}
        <circle cx="128" cy="74" r="54" fill="#101116" />
        <circle cx="128" cy="74" r="40" fill="#1b2430" />
        <path d="M100 58a34 34 0 0 1 34-18" stroke="#8fc7f2" strokeWidth="5" />
        {/* Body */}
        <path d="M84 118c-12 10-18 26-18 44 0 30 18 52 46 52s46-20 46-50c0-18-6-34-18-44Z" fill="#17181d" />
        <path d="M96 150h48M96 168h34" strokeWidth="2" />
        {/* Arm and magnifier */}
        <path d="M156 140c22-4 38-18 42-38" />
        <circle cx="206" cy="86" r="26" fill="rgba(140,200,240,0.25)" />
        <path d="M188 106 170 126" strokeWidth="6" />
        {/* Legs */}
        <path d="M86 210c-10 22-8 48 4 64M154 210c10 22 8 48-4 64" />
        <g stroke="#6fb2e8" strokeWidth="4">
          <path d="M84 258h26M88 272h26M138 258h26M134 272h26" />
        </g>
        {/* Hose */}
        <path d="M60 126c-14 26-6 50 18 58" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
