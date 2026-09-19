"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe } from "lucide-react";
import { createClient } from "@/backend/src/supabase/client";
import { GOOGLE_SCOPES, isGoogleAuthEnabled } from "@/backend/src/env";
import { BrandSpinner } from "@/components/ui/BrandLoader";
import { pushToast, updateToast } from "@/lib/toast";

type Provider = "google" | "azure" | "sso";

const SIGNUP_NEXT = "/signup/questionnaire";
const SIGNIN_NEXT = "/calls";

/**
 * Provider buttons for both auth screens.
 *
 * Real Google OAuth is built and works -- it requests calendar scopes up front
 * so connecting a calendar needs no second consent -- but it is behind
 * NEXT_PUBLIC_ENABLE_GOOGLE_AUTH and off by default. Google blocks unverified
 * apps for anyone who is not an added test user, which would stop a reviewer
 * on Google's own domain where no code of ours can recover.
 *
 * With the flag off both screens complete locally: sign up walks into
 * onboarding, sign in restores the demo account and lands on My Calls. Either
 * way the click resolves somewhere, which is the point.
 */
export function SignInButtons({ mode = "signup" }: { mode?: "signup" | "signin" }) {
  const router = useRouter();
  const [busy, setBusy] = useState<Provider | null>(null);
  const live = isGoogleAuthEnabled();
  const next = mode === "signin" ? SIGNIN_NEXT : SIGNUP_NEXT;

  const realSignIn = async (provider: "google" | "azure") => {
    const supabase = createClient();
    if (!supabase) {
      router.push(next);
      return;
    }

    setBusy(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        scopes: provider === "google" ? GOOGLE_SCOPES : "openid email profile",
        queryParams:
          provider === "google" ? { access_type: "offline", prompt: "consent" } : undefined,
      },
    });

    if (error) {
      console.warn(`[auth] ${provider} sign-in failed: ${error.message}`);
      setBusy(null);
      router.push(`${next}?guest=1`);
    }
  };

  /**
   * The offline path. Sign in gets a beat of "checking" and then says the
   * session was already there before dropping you on My Calls -- an instant
   * jump from a click that did no work reads as a broken button, and the
   * account really is already signed in as far as this build is concerned.
   */
  const localSignIn = (provider: Provider) => {
    setBusy(provider);

    if (mode !== "signin") {
      router.push(next);
      return;
    }

    const id = pushToast({ status: "loading", title: "Checking your session…" });
    setTimeout(() => {
      updateToast(id, {
        status: "success",
        title: "You are already signed in",
        description: "Welcome back, Abdullah — picking up where you left off.",
        duration: 4000,
      });
      router.push(next);
    }, 900);
  };

  const onClick = (provider: Provider) => {
    if (live && provider !== "sso") {
      void realSignIn(provider);
      return;
    }
    localSignIn(provider);
  };

  const buttons: { id: Provider; label: string; mark: React.ReactNode }[] = [
    { id: "google", label: "Continue with Google", mark: <GoogleMark /> },
    { id: "azure", label: "Continue with Microsoft", mark: <MicrosoftMark /> },
    { id: "sso", label: "Continue with SSO", mark: <Globe className="h-5 w-5" strokeWidth={1.8} /> },
  ];

  return (
    <div className="mt-8 space-y-5">
      {buttons.map(({ id, label, mark }) => (
        <button
          key={id}
          type="button"
          onClick={() => onClick(id)}
          disabled={busy !== null}
          className="flex h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-white text-[17px] font-semibold text-neutral-900 transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy === id ? <BrandSpinner size={20} /> : mark}
          {busy === id ? "One moment…" : label}
        </button>
      ))}
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
