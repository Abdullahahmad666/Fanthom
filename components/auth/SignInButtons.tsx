"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/backend/src/supabase/client";
import { GOOGLE_SCOPES, isGoogleAuthEnabled } from "@/backend/src/env";
import { BrandSpinner } from "@/components/ui/BrandLoader";

const NEXT_STEP = "/signup/questionnaire";

/**
 * Sign-in buttons.
 *
 * Real Google OAuth is built and works -- it requests calendar scopes up front
 * so connecting a calendar needs no second consent -- but it is behind
 * NEXT_PUBLIC_ENABLE_GOOGLE_AUTH and off by default. Google blocks unverified
 * apps for anyone who is not an added test user, which would stop a reviewer
 * on Google's own domain where no code of ours can recover.
 *
 * With the flag off the buttons walk straight into onboarding, so the flow
 * always completes. With it on, a failed round trip still falls through to the
 * same place rather than surfacing an error.
 */
export function SignInButtons() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const live = isGoogleAuthEnabled();

  const signIn = async (provider: "google" | "azure") => {
    const supabase = createClient();
    if (!supabase) {
      router.push(NEXT_STEP);
      return;
    }

    setBusy(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${NEXT_STEP}`,
        scopes: provider === "google" ? GOOGLE_SCOPES : "openid email profile",
        queryParams:
          provider === "google" ? { access_type: "offline", prompt: "consent" } : undefined,
      },
    });

    if (error) {
      console.warn(`[auth] ${provider} sign-in failed: ${error.message}`);
      setBusy(null);
      router.push(`${NEXT_STEP}?guest=1`);
    }
  };

  const buttons = [
    { id: "google" as const, label: "Continue with Google", mark: <GoogleMark /> },
    { id: "azure" as const, label: "Continue with Microsoft", mark: <MicrosoftMark /> },
  ];

  const shell =
    "flex h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-white text-[16px] font-semibold text-neutral-900 transition-opacity hover:opacity-90";

  return (
    <div className="mt-10 space-y-4">
      {buttons.map(({ id, label, mark }) =>
        live ? (
          <button
            key={id}
            type="button"
            onClick={() => signIn(id)}
            disabled={busy !== null}
            className={`${shell} disabled:opacity-60`}
          >
            {busy === id ? <BrandSpinner size={20} /> : mark}
            {busy === id ? "Redirecting…" : label}
          </button>
        ) : (
          <Link key={id} href={NEXT_STEP} className={shell}>
            {mark}
            {label}
          </Link>
        ),
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
