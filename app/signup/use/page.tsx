"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircleUserRound, Users } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ContinueButton } from "@/components/ui/MadLibSelect";

const CHOICES = [
  { id: "solo", Icon: CircleUserRound, title: "By Myself", body: "Summaries and action items for your meetings." },
  { id: "team", Icon: Users, title: "With My Team", body: "Share and organize meetings in one place." },
];

export default function IntendedUsePage() {
  const router = useRouter();
  const [picked, setPicked] = useState("solo");

  return (
    <OnboardingShell
      progress={45}
      eyebrow="Personalize your account"
      title="How are you planning to use Cue?"
    >
      <div className="flex flex-wrap justify-center gap-5">
        {CHOICES.map(({ id, Icon, title, body }) => {
          const active = picked === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPicked(id)}
              aria-pressed={active}
              className={`flex h-[210px] w-[250px] flex-col items-center justify-center gap-4 rounded-xl px-6 text-center transition-colors ${
                active ? "bg-canvas ring-2 ring-brand" : "bg-raised ring-1 ring-transparent hover:bg-[#2f2f34]"
              }`}
            >
              <Icon className={`h-11 w-11 ${active ? "text-brand" : "text-fg-muted"}`} strokeWidth={1.5} />
              <span className={`text-[17px] font-bold ${active ? "text-fg" : "text-fg-muted"}`}>{title}</span>
              <span className="text-[13px] leading-snug text-fg-muted">{body}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-16 flex w-full justify-center">
        <ContinueButton onClick={() => router.push("/onboarding/connect")} />
      </div>
    </OnboardingShell>
  );
}
