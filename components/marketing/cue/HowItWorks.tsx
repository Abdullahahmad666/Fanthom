import { FileUp, Quote, Search } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    Icon: FileUp,
    title: "Bring the transcript you already have",
    body: "Zoom, Google Meet and Teams all write one. Drop the file in, or paste it. Cue parses it in your browser and shows you what it found before anything is saved.",
    aside: "VTT · SRT · TXT",
  },
  {
    Icon: Quote,
    title: "Cue finds the notes inside it",
    body: "It reads for the shapes that matter — a decision being made, a commitment being given, a risk being named — and keeps the sentence that carries each one. Verbatim, not rewritten.",
    aside: "Decisions · Risks · Actions",
  },
  {
    Icon: Search,
    title: "Every line keeps its moment",
    body: "Each bullet carries the timestamps it came from. Hover one to read the excerpt, click it to jump to that second in the recording. Nothing Cue writes is unfalsifiable.",
    aside: "Hover to read · Click to play",
  },
];

/**
 * How it works, as three steps that are each a claim about the mechanism
 * rather than a benefit. "Saves you six hours a week" is unprovable from a
 * landing page; "keeps the sentence, verbatim" is checked by scrolling back up
 * to the hero and pressing a cue.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 relative px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="reveal-lead">
          <p className="section-label">How it works</p>
          <h2 className="font-display mt-3 max-w-[16ch] text-[clamp(30px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text">
            Three steps, and none of them invent anything.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.title}
              as="li"
              delay={i * 110}
              className="flex flex-col bg-surface p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accentsoft text-accent">
                  <s.Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="font-display text-[22px] leading-none text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-[17px] leading-snug font-semibold text-text">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">{s.body}</p>
              <p className="mt-6 text-[12px] tracking-[0.06em] text-faint">{s.aside}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
