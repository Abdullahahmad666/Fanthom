"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { pushToast } from "@/lib/toast";

/**
 * Deletes this meeting and nothing else.
 *
 * Until now the only delete in the product removed every meeting on the
 * account, which made "I imported the wrong file" an unrecoverable mistake --
 * the fix was to throw away everything else too.
 *
 * Confirmation is inline rather than a modal. The action is destructive but it
 * is also small and local, and a dialog that takes over the screen to ask
 * about one row trains people to dismiss dialogs. The consequence is stated
 * before the button that causes it, and the safe option is the one that reads
 * first.
 */
export function DeleteMeeting({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/meetings/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({ ok: false }));

      if (!data.ok) {
        pushToast({
          title: "Could not delete this meeting",
          description: data.error === "Not found" ? "It may already be gone." : "Try again in a moment.",
          status: "error",
        });
        setBusy(false);
        setConfirming(false);
        return;
      }

      pushToast({
        title: "Meeting deleted",
        description: `"${title}" and its transcript are gone.`,
        status: "success",
        duration: 5000,
      });
      router.push("/calls");
      router.refresh();
    } catch {
      pushToast({
        title: "Could not delete this meeting",
        description: "The database may be unreachable.",
        status: "error",
      });
      setBusy(false);
      setConfirming(false);
    }
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="press flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-faint transition-colors hover:bg-critical/10 hover:text-critical"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    );
  }

  return (
    <span className="flex shrink-0 items-center gap-2">
      <span className="text-[13px] text-muted">Delete this meeting and its transcript?</span>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="press rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-text"
      >
        Keep
      </button>
      <button
        type="button"
        onClick={() => void remove()}
        disabled={busy}
        className="press flex items-center gap-1.5 rounded-lg bg-critical px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-60"
      >
        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Delete
      </button>
    </span>
  );
}
