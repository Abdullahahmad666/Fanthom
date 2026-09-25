import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "More ways to get started with Cue".
 *
 * The gradient edge is a bordered wrapper with the panel painted on top,
 * rather than a border-image: it keeps the 24px radius crisp, which
 * border-image does not.
 */

const WAYS = [
  {
    icon: "🚀",
    title: "Qualified Portfolio Program",
    body: "Affiliated startups of select VCs & accelerators get up to 2 years free of Cue Team.",
    cta: "Check eligibility →",
  },
  {
    icon: "💜",
    title: "Get 10 free seats for nonprofits",
    body: "Because we know that doing good is hard enough. Let us help get you started.",
    cta: "Apply here to qualify →",
  },
  {
    icon: "🔀",
    title: "Switching from Gong?",
    body: "Or something similar? Get Cue Business free through your contract plus data migration.",
    cta: "Switch now →",
  },
];

export function MoreWays() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 pb-24">
      <div
        className="rounded-[26px] p-px"
        style={{
          background:
            "linear-gradient(100deg,#E8721E 0%,#C74BD8 28%,#7C4DF0 52%,#4BA3F0 74%,#EFE08A 100%)",
        }}
      >
        <div className="grid gap-8 rounded-[25px] bg-[#070708] px-10 py-10 lg:grid-cols-[minmax(0,0.9fr)_repeat(3,minmax(0,1fr))] lg:gap-0">
          <h2 className="self-center pr-8 text-[26px] leading-tight font-light text-fg">
            More ways to get started with Cue
          </h2>

          {WAYS.map((w, i) => (
            <Reveal
              key={w.title}
              delay={i * 90}
              className={`px-8 text-center ${i > 0 ? "lg:border-l lg:border-white/12" : ""}`}
            >
              <p className="text-[24px]" aria-hidden>
                {w.icon}
              </p>
              <h3 className="mt-2 text-[19px] font-bold text-fg">{w.title}</h3>
              <p className="mt-2 text-[15px] leading-snug text-fg-muted">{w.body}</p>
              <Link
                href="/signup"
                className="mt-4 inline-block text-[14px] font-semibold tracking-[0.04em] text-[#4BA3F0] uppercase hover:underline"
              >
                {w.cta}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
