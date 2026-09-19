"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/backend/src/supabase/client";
import { GOOGLE_SCOPES, isSupabaseConfigured } from "@/backend/src/env";
import { pushToast } from "@/lib/toast";
import { BrandSpinner } from "@/components/ui/BrandLoader";

/**
 * Real Google sign-in through Supabase.
 *
 * Calendar scopes are requested here, at sign-up, so connecting the calendar
 * later needs no second consent screen -- the provider token is already on the
 * session.
 *
 * With Supabase unconfigured the buttons still walk the onboarding flow, so
 * the deployed demo is never a dead end.
 */
export function SignInButtons() {
  const [busy, setBusy] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const signIn = async (provider: "google" | "azure") => {
    const supabase = createClient();
    if (!supabase) return;

    setBusy(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/signup/questionnaire`,
        scopes: provider === "google" ? GOOGLE_SCOPES : "openid email profile",
        queryParams:
          provider === "google"
            ? { access_type: "offline", prompt: "consent" }
            : undefined,
      },
    });

    if (error) {
      setBusy(null);
      pushToast({ status: "error", title: "Sign-in failed", description: error.message });
    }
  };

  const buttons = [
    { id: "google" as const, label: "Continue with Google", mark: <GoogleMark /> },
    { id: "azure" as const, label: "Continue with Microsoft", mark: <MicrosoftMark /> },
  ];

  return (
    <div className="mt-10 space-y-4">
      {buttons.map(({ id, label, mark }) =>
        configured ? (
          <button
            key={id}
            type="button"
            onClick={() => signIn(id)}
            disabled={busy !== null}
            className="flex h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-white text-[16px] font-semibold text-neutral-900 transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy === id ? <BrandSpinner size={20} /> : mark}
            {busy === id ? "Redirecting…" : label}
          </button>
        ) : (
          <Link
            key={id}
            href="/signup/questionnaire"
            className="flex h-[58px] items-center justify-center gap-3 rounded-xl bg-white text-[16px] font-semibold text-neutral-900 transition-opacity hover:opacity-90"
          >
            {mark}
            {label}
          </Link>
        ),
      )}

      {!configured && (
        <p className="text-center text-[12px] text-fg-dim">
          Demo mode — set Supabase keys to enable real sign-in.
        </p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.700c2.2-2 3.4-5 3.4-8.6Z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.6 14.7a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z" />
      <path fill="#EA4335" d="M12 4.7c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 7.3l3.8 3c.9-2.7 3.4-4.6 6.4-4.6Z" />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}
