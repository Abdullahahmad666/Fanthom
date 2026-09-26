"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

/**
 * One field, and it saves for real.
 *
 * The previous flow's steps wrote to the profile through a server action but
 * never blocked on the result, so a failed save looked exactly like a
 * successful one. This waits, and says so if it did not work -- though it
 * still lets you past, because being unable to record a display name is not a
 * reason to lock someone out of the product.
 */
export function NameStep({ initial }: { initial: string }) {
  const router = useRouter();
  const [name, setName] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) return;

    setBusy(true);
    setWarn(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ full_name: value }),
      });
      const data = await res.json();
      if (!data.ok && data.reason !== "signed-out" && data.reason !== "not-configured") {
        setWarn("That did not save — you can change it later in Settings.");
      }
    } catch {
      setWarn("That did not save — you can change it later in Settings.");
    }

    router.push("/onboarding/source");
  };

  return (
    <form onSubmit={submit} className="max-w-[420px]">
      <label htmlFor="name" className="text-[13px] font-medium text-text">
        Your name
      </label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        autoComplete="name"
        placeholder="Maya Chen"
        className="mt-1.5 h-[48px] w-full rounded-lg border border-line bg-field px-3.5 text-[15px] text-text transition-colors placeholder:text-faint hover:border-line-strong focus:border-accent focus:outline-none"
      />

      {warn && <p className="mt-3 text-[13px] text-mark">{warn}</p>}

      <button
        type="submit"
        disabled={!name.trim() || busy}
        className="press mt-6 flex h-[46px] items-center justify-center gap-2 rounded-lg bg-accent px-7 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Continue
        {!busy && <ArrowRight className="h-[18px] w-[18px]" />}
      </button>
    </form>
  );
}
