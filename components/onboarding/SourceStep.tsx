"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { SOURCES, type SourceId } from "@/lib/sources";

/**
 * Where this person's transcripts come from.
 *
 * The answer is only worth collecting because it changes what happens next:
 * the final step and the import screen both repeat this source's export path
 * back, so the question doubles as the instruction.
 */
export function SourceStep({ initial }: { initial: SourceId | null }) {
  const router = useRouter();
  const [picked, setPicked] = useState<SourceId | null>(initial);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!picked) return;
    setBusy(true);

    /* Best effort: a preference that fails to save is not worth stopping the
       flow over, and the import screen falls back to showing every path. */
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ transcript_source: picked }),
      });
    } catch {
      /* ignored on purpose -- see above */
    }

    router.push("/onboarding/first");
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {SOURCES.map((s) => {
          const on = picked === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setPicked(s.id)}
              aria-pressed={on}
              className={`press relative rounded-xl border p-5 text-left transition-colors ${
                on
                  ? "border-accent bg-accentsoft"
                  : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <span
                aria-hidden
                className="block h-1.5 w-9 rounded-full"
                style={{ background: s.tint }}
              />
              <span className="mt-3.5 flex items-center gap-2">
                <span className="text-[15.5px] font-semibold text-text">{s.name}</span>
                {on && <Check className="h-4 w-4 text-accent" strokeWidth={3} />}
              </span>
              <span className="mt-1 block text-[12px] tracking-[0.06em] text-mark">
                {s.file}
              </span>
              <span className="mt-3 block text-[13px] leading-relaxed text-muted">
                {s.path}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!picked || busy}
        className="press mt-8 flex h-[46px] items-center justify-center gap-2 rounded-lg bg-accent px-7 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Continue
        {!busy && <ArrowRight className="h-[18px] w-[18px]" />}
      </button>
    </div>
  );
}
