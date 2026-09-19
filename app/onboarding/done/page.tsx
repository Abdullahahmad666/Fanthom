import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

const DONE = [
  "Google Calendar connected",
  "Auto-record set for all calendar meetings",
  "Summaries shared with attendees automatically",
];

export default function OnboardingDonePage() {
  return (
    <OnboardingShell
      progress={100}
      eyebrow="You're all set"
      title="Fathom will join your next meeting"
      footer={false}
    >
      <ul className="mb-12 space-y-3">
        {DONE.map((d) => (
          <li key={d} className="flex items-center gap-3 text-[18px] text-fg">
            <Check className="h-5 w-5 shrink-0 text-success" />
            {d}
          </li>
        ))}
      </ul>

      <Link
        href="/"
        className="flex h-[60px] w-[420px] max-w-full items-center justify-center gap-3 rounded-lg bg-brand text-[18px] font-medium text-black transition-colors hover:bg-[#33cbff]"
      >
        Go to My Calls <ArrowRight className="h-5 w-5" />
      </Link>

      <p className="mt-6 max-w-[520px] text-center text-[15px] text-fg-dim">
        Recording capture is stubbed in this prototype — your account is seeded with
        five real-shaped meetings so there is something to explore.
      </p>
    </OnboardingShell>
  );
}
