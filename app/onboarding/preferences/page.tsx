"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ContinueButton, MadLibSelect } from "@/components/ui/MadLibSelect";

const SCOPE = ["All meetings in my calendar", "Only external meetings", "Only meetings I host", "No meetings — I'll start them manually"];
const SHARE = ["All attendees", "Only my team", "Only me"];

export default function PreferencesPage() {
  const router = useRouter();
  const [scope, setScope] = useState(SCOPE[0]);
  const [share, setShare] = useState(SHARE[0]);
  const [consent, setConsent] = useState(false);

  return (
    <OnboardingShell progress={85} eyebrow="Set up your preferences">
      <div className="flex max-w-[1100px] flex-wrap items-center justify-center gap-x-4 gap-y-5 text-[30px] font-medium text-fg">
        <span>Take notes on</span>
        <MadLibSelect value={scope} options={SCOPE} onChange={setScope} />
        <span>and share with</span>
        <MadLibSelect value={share} options={SHARE} onChange={setShare} />
      </div>

      <label className="mt-14 flex max-w-[700px] cursor-pointer items-start gap-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-[#02beff]"
        />
        <span className="text-[19px] leading-relaxed text-fg">
          I understand I&apos;m responsible for collecting attendee consent for the
          recording and transcription, in accordance with applicable laws.
        </span>
      </label>

      <div className="mt-14 flex w-full justify-center">
        <ContinueButton
          disabled={!consent}
          onClick={() => router.push("/onboarding/done")}
        />
      </div>
    </OnboardingShell>
  );
}
