"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ContinueButton, MadLibSelect } from "@/components/ui/MadLibSelect";

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Customer Success", "Product", "Finance", "Operations", "Something else"];
const ROLES = ["an individual contributor", "a manager", "a director", "an executive", "the founder"];
const CRMS = ["I don't use a CRM", "Salesforce", "HubSpot", "Pipedrive", "Close", "Something else"];

export default function QuestionnairePage() {
  const router = useRouter();
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [role, setRole] = useState(ROLES[0]);
  const [crm, setCrm] = useState(CRMS[0]);

  return (
    <OnboardingShell progress={25} eyebrow="Tell us about yourself">
      <div className="flex max-w-[1100px] flex-wrap items-center justify-center gap-x-4 gap-y-5 text-[26px] font-medium text-fg">
        <span>I work in</span>
        <MadLibSelect value={dept} options={DEPARTMENTS} onChange={setDept} />
        <span>as</span>
        <MadLibSelect value={role} options={ROLES} onChange={setRole} />
        <span>and use</span>
        <MadLibSelect value={crm} options={CRMS} onChange={setCrm} />
      </div>

      <div className="mt-16 flex w-full justify-center">
        <ContinueButton variant="outline" onClick={() => router.push("/signup/use")} />
      </div>
    </OnboardingShell>
  );
}
