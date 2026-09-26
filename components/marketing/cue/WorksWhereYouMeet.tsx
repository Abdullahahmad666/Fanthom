import { Reveal } from "@/components/ui/Reveal";
import { SOURCES } from "@/lib/sources";

/**
 * Where the transcripts come from.
 *
 * The section this replaces animated six app icons wiring themselves into a
 * hub, which implied live integrations with all of them. Cue has no OAuth
 * connection to any of these -- it reads the file they each already produce,
 * which is a weaker claim and the true one. Saying so is also the better
 * pitch: there is nothing to connect, and nothing to approve.
 *
 * Each card names the exact menu path, because "export your transcript" is
 * the step where people actually get stuck. The list is shared with the
 * onboarding step that asks the same question, so the two cannot drift.
 */

export function WorksWhereYouMeet() {
  return (
    <section id="sources" className="scroll-mt-24 px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="max-w-[52ch]">
          <p className="section-label">Sources</p>
          <h2 className="font-display mt-3 text-[clamp(30px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-text">
            Works wherever you already meet.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted">
            There is nothing to connect and no permissions to grant. Cue reads
            the transcript your conferencing tool already wrote, so it works the
            first time you use it — including on meetings that happened before
            you had heard of Cue.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map((s, i) => (
            <Reveal key={s.name} delay={i * 80} className="bg-surface p-6">
              <span
                aria-hidden
                className="block h-1.5 w-9 rounded-full"
                style={{ background: s.tint }}
              />
              <h3 className="mt-4 text-[16px] font-semibold text-text">{s.name}</h3>
              <p className="mt-1 text-[12px] tracking-[0.06em] text-mark">{s.file}</p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{s.path}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
