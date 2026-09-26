"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowRight, FileUp, Loader2, Sparkles } from "lucide-react";
import { DEMO_TURNS } from "@/components/marketing/cue/demo";

/**
 * The end of onboarding, which is the start of the product.
 *
 * "Load a sample meeting" is not a tour or a screenshot: it builds a VTT from
 * the same transcript the landing page argues over, posts it through the real
 * import endpoint, and opens the meeting that comes back. The row is in the
 * account, scoped by the same RLS policy as anything else, and it can be
 * deleted like anything else. A demo that writes real data is the only kind
 * that proves the thing it is demonstrating.
 */

function clock(t: number) {
  const h = String(Math.floor(t / 3600)).padStart(2, "0");
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(t % 60)).padStart(2, "0");
  return `${h}:${m}:${s}.000`;
}

/** The sample, as a WebVTT file -- the same format Zoom and Teams hand you. */
function sampleVtt() {
  const cues = DEMO_TURNS.map((t, i) => {
    const end = DEMO_TURNS[i + 1]?.tSec ?? t.tSec + 24;
    return `${i + 1}\n${clock(t.tSec)} --> ${clock(Math.min(end, t.tSec + 24))}\n${t.speaker}: ${t.text}`;
  });
  return `WEBVTT\n\n${cues.join("\n\n")}\n`;
}

export function FirstTranscriptStep() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async (path: string) => {
    /* Mark the flow done before leaving, so it is not offered again. Failure
       is silent: worst case someone sees step 1 once more. */
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ onboarded_at: new Date().toISOString() }),
      });
    } catch {
      /* ignored on purpose -- see above */
    }
    router.push(path);
    router.refresh();
  };

  const loadSample = async () => {
    setBusy(true);
    setError(null);

    try {
      const body = new FormData();
      body.set("text", sampleVtt());
      body.set("title", "Launch readiness (sample)");

      const res = await fetch("/api/meetings/import", { method: "POST", body });
      const data = await res.json();

      if (!data.ok) {
        setError(
          data.error ??
            "The sample could not be saved. You can still import a transcript of your own.",
        );
        setBusy(false);
        return;
      }

      await finish(`/calls/${data.slug}`);
    } catch {
      setError("The sample could not be saved — the database may not be reachable.");
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void finish("/import")}
          disabled={busy}
          className="press flex flex-col items-start rounded-xl border border-accent bg-accentsoft p-6 text-left transition-colors disabled:opacity-60"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-on-accent">
            <FileUp className="h-[18px] w-[18px]" />
          </span>
          <span className="mt-4 text-[16px] font-semibold text-text">
            Import my transcript
          </span>
          <span className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
            Drop in the file your conferencing tool made. Nothing is stored until
            you have seen what Cue found.
          </span>
        </button>

        <button
          type="button"
          onClick={loadSample}
          disabled={busy}
          className="press flex flex-col items-start rounded-xl border border-line bg-surface p-6 text-left transition-colors hover:border-line-strong disabled:opacity-60"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-mark-soft text-mark">
            {busy ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
            ) : (
              <Sparkles className="h-[18px] w-[18px]" />
            )}
          </span>
          <span className="mt-4 text-[16px] font-semibold text-text">
            {busy ? "Saving the sample…" : "Load a sample meeting"}
          </span>
          <span className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
            A real 41-minute transcript, imported into your account so you can
            see the notes and the cues straight away.
          </span>
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-md bg-mark-soft px-3.5 py-2.5 text-[13px] leading-snug text-mark"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void finish("/calls")}
        disabled={busy}
        className="press mt-7 inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-text disabled:opacity-60"
      >
        Skip — take me to the app
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
