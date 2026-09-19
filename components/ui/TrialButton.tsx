"use client";

import { pushToast, updateToast } from "@/lib/toast";

/**
 * "Start 14-Day Trial", shared by the Team Calls and Deals upsells.
 *
 * Billing is out of scope, so the button says so rather than pretending. It
 * still runs the loading -> resolved toast, because a dead button on the one
 * CTA of the page reads as a broken page.
 */
export function TrialButton({ className }: { className?: string }) {
  const start = () => {
    const id = pushToast({
      title: "Starting your 14-day trial…",
      status: "loading",
    });
    setTimeout(() => {
      updateToast(id, {
        title: "Team Edition",
        description: "Billing is out of scope for this prototype — the tier is shown, not sold.",
        status: "success",
        duration: 5000,
      });
    }, 900);
  };

  return (
    <button type="button" onClick={start} className={className}>
      Start 14-Day Trial
    </button>
  );
}
