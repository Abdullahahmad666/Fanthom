"use client";

import { pushToast, updateToast } from "@/lib/toast";

/**
 * "Start 14-Day Trial", shared by the Team Calls and Deals upsells.
 *
 * Billing is not built yet, so the button says when it will be rather than
 * pretending. It still runs the loading -> resolved toast, because a dead
 * button on the one CTA of a page reads as a broken page.
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
        description: "Paid plans are coming soon. Everything on the Free tier works today.",
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
