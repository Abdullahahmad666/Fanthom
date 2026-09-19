import Link from "next/link";
import { MonitorPlay, Play, Presentation } from "lucide-react";

const CARDS = [
  {
    label: "Self-Guided Tutorial",
    Icon: MonitorPlay,
    href: "/calls/q3-launch-readiness",
    art: "linear-gradient(135deg,#1e3a8a 0%,#7c1d6f 55%,#b91c1c 100%)",
  },
  {
    label: "Start Test Call",
    Icon: Play,
    href: "/onboarding/connect",
    art: "linear-gradient(135deg,#d6cfc4 0%,#8d8478 60%,#3f3a33 100%)",
  },
  {
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
      <h2 className="section-label mb-6">Learn how to use Fathom</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ label, Icon, href, art }) => (
          <Link
            key={label}
            href={href}
            className="group max-w-[340px] overflow-hidden rounded-lg transition-transform hover:-translate-y-0.5"
          >
            <span className="block aspect-video w-full" style={{ background: art }} />
            <span className="flex h-[52px] items-center justify-center gap-2.5 bg-[#35353d] text-[15px] text-fg transition-colors group-hover:bg-[#40404a]">
              <Icon className="h-4 w-4" />
              {label}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="section-label mt-12 mb-4">Meeting preferences</h2>
      <p className="max-w-[720px] text-[15px] leading-relaxed text-fg">
        Fathom will auto-record starting with your next external meeting, and the
        summary will be shared with attendees automatically.
      </p>
      <Link
        href="/settings"
        className="mt-3 inline-block text-[15px] text-brand hover:underline"
      >
        Edit Settings
      </Link>
    </section>
  );
}
