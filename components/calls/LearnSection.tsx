import Link from "next/link";
import { MonitorPlay, Play, Presentation } from "lucide-react";

const CARDS = [
  {
    kind: "app" as const,
    label: "Self-Guided Tutorial",
    Icon: MonitorPlay,
    href: "/calls/q3-launch-readiness",
    art: "linear-gradient(135deg,#1e3a8a 0%,#7c1d6f 55%,#b91c1c 100%)",
  },
  {
    kind: "call" as const,
    label: "Start Test Call",
    Icon: Play,
    href: "/onboarding/connect",
    art: "linear-gradient(135deg,#d6cfc4 0%,#8d8478 60%,#3f3a33 100%)",
  },
  {
    kind: "webinar" as const,
    label: "Attend Tips & Tricks Webinar",
    Icon: Presentation,
    href: "/onboarding/done",
    art: "linear-gradient(135deg,#0c4a6e 0%,#1e40af 55%,#0f172a 100%)",
  },
];

/**
 * The onboarding block that sits under the meeting list on My Calls: three
 * thumbnail cards over full-width buttons, then the meeting-preferences note.
 *
 * The real cards use video stills. There are none here, so each gets a
 * gradient in the same key rather than a fake screenshot.
 */
export function LearnSection() {
  return (
    <section className="mx-3 mt-4 rounded-xl bg-panel px-9 pt-8 pb-10">
      <h2 className="section-label mb-6">Learn how to use Cue</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ kind, label, Icon, href, art }) => (
          <Link
            key={label}
            href={href}
            className="group max-w-[340px] overflow-hidden rounded-lg transition-transform hover:-translate-y-0.5"
          >
            <span
              className="relative block aspect-video w-full overflow-hidden"
              style={{ background: art }}
            >
              <CardArt kind={kind} />
            </span>
            <span className="flex h-[46px] items-center justify-center gap-2.5 bg-[#35353d] text-[13px] text-fg transition-colors group-hover:bg-[#40404a]">
              <Icon className="h-4 w-4" />
              {label}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="section-label mt-12 mb-4">Meeting preferences</h2>
      <p className="max-w-[720px] text-[13px] leading-relaxed text-fg">
        Cue will auto-record starting with your next external meeting, and the
        summary will be shared with attendees automatically.
      </p>
      <Link
        href="/settings"
        className="mt-3 inline-block text-[13px] text-brand hover:underline"
      >
        Edit Settings
      </Link>
    </section>
  );
}

/**
 * Artwork for each card. The real product uses video stills; there are none
 * here, so each card gets a suggestion of what it opens -- an app window, a
 * call tile, a webinar slide -- rather than an empty gradient.
 */
function CardArt({ kind }: { kind: "app" | "call" | "webinar" }) {
  if (kind === "app") {
    return (
      <span aria-hidden="true" className="absolute inset-[9%] rounded-md bg-[#0d0d10]/90 p-2">
        <span className="flex gap-1">
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span className="h-1 w-1 rounded-full bg-white/25" />
        </span>
        <span className="mt-2 flex gap-1.5">
          <span className="h-[38%] w-[46%] rounded bg-gradient-to-br from-[#6b2140] to-[#1a0c14]" />
          <span className="flex-1 space-y-1 pt-0.5">
            <span className="block h-1 w-3/4 rounded bg-brand/70" />
            <span className="block h-1 w-full rounded bg-white/20" />
            <span className="block h-1 w-5/6 rounded bg-white/15" />
            <span className="block h-1 w-2/3 rounded bg-white/15" />
          </span>
        </span>
        <span className="mt-2 block h-1 w-1/3 rounded bg-white/30" />
        <span className="mt-1.5 block h-1 w-full rounded bg-white/12" />
        <span className="mt-1 block h-1 w-4/5 rounded bg-white/12" />
      </span>
    );
  }

  if (kind === "call") {
    return (
      <span aria-hidden="true" className="absolute inset-0">
        <span className="absolute inset-x-0 bottom-0 h-[30%] bg-black/25" />
        <span className="absolute -bottom-[10%] left-1/2 h-[44%] w-[40%] -translate-x-1/2 rounded-t-[999px] bg-[#2c2822]/80" />
        <span className="absolute bottom-[30%] left-1/2 h-[24%] w-[18%] -translate-x-1/2 rounded-full bg-[#3a352d]/90" />
        <span className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_25%,rgba(255,255,255,0.14),transparent_70%)]" />
        <span className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/55 px-1.5 py-[1px] text-[8px] font-semibold text-white/90">
          <span className="h-1 w-1 rounded-full bg-red-500" /> REC
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="absolute inset-0">
      <span className="absolute inset-[10%] rounded bg-[#0b1220]/80 p-2">
        <span className="block h-1.5 w-1/2 rounded bg-white/50" />
        <span className="mt-2 block h-1 w-5/6 rounded bg-white/20" />
        <span className="mt-1 block h-1 w-3/4 rounded bg-white/15" />
        <span className="mt-2 flex gap-1">
          <span className="h-3 flex-1 rounded-sm bg-brand/40" />
          <span className="h-3 flex-1 rounded-sm bg-white/15" />
          <span className="h-3 flex-1 rounded-sm bg-white/10" />
        </span>
      </span>
      <span className="absolute right-2 bottom-2 h-[34%] w-[24%] overflow-hidden rounded bg-[#1b2436]">
        <span className="absolute -bottom-[12%] left-1/2 h-[52%] w-[54%] -translate-x-1/2 rounded-t-[999px] bg-[#38506e]" />
        <span className="absolute bottom-[34%] left-1/2 h-[28%] w-[28%] -translate-x-1/2 rounded-full bg-[#45608a]" />
      </span>
    </span>
  );
}
