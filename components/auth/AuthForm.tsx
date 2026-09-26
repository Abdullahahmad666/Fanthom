"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/backend/src/supabase/client";
import { GOOGLE_SCOPES, isGoogleAuthEnabled, isSupabaseConfigured } from "@/backend/src/env";
import { pushToast, updateToast } from "@/lib/toast";
import { VerifyEmail } from "./VerifyEmail";

/**
 * Sign in and sign up.
 *
 * Email and password is the primary path, and it is a real one: unlike Google,
 * it has no verification gate, so anyone who opens this build can create an
 * account that actually exists and get a session that RLS will honour. That
 * matters more than it sounds -- before this, every route into the app fell
 * through to a guest and the whole product ran on fixtures.
 *
 * Google is kept as a second option. It asks for identity only -- no calendar,
 * no offline access -- so the consent screen is the short one. It stays behind
 * NEXT_PUBLIC_ENABLE_GOOGLE_AUTH because Google blocks unverified apps for
 * anyone who is not an added test user, which would strand a visitor on
 * Google's own domain where nothing here can recover.
 *
 * Microsoft and SSO are gone. Neither was ever wired to a provider -- both
 * fell straight through to the offline path -- so they were three buttons
 * where one was real, and the two decorative ones were the more prominent.
 */

const SIGNUP_NEXT = "/onboarding/name";
const SIGNIN_NEXT = "/calls";

/** Supabase's messages are for developers. These are for the person signing in. */
function humanise(message: string, mode: Mode): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "That email and password do not match an account.";
  }
  if (m.includes("email not confirmed")) {
    return "Check your inbox and confirm your email before signing in.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "There is already an account with that email. Try signing in instead.";
  }
  if (m.includes("password should be") || m.includes("password must")) {
    return "Pick a password of at least 8 characters.";
  }
  /*
   * Two different things arrive here as "rate limit", and telling them apart
   * matters because only one of them is the person's fault.
   *
   * `over_email_send_rate_limit` is the project's email quota, not theirs --
   * Supabase's built-in sender allows a handful of messages an hour across
   * every user. Saying "too many attempts" to somebody on their first one
   * sends them off to wait for something that will not change.
   */
  if (m.includes("email rate limit") || m.includes("over_email_send_rate_limit")) {
    return "The mail sender has hit its limit, so no email went out. This is a project setting rather than anything you did — configure SMTP in Supabase, or wait an hour.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  if (m.includes("unable to validate email") || m.includes("invalid email")) {
    return "That does not look like an email address.";
  }
  return mode === "signup"
    ? `Could not create the account: ${message}`
    : `Could not sign in: ${message}`;
}

/**
 * Where the provider should send the browser back to.
 *
 * Built from the live origin rather than from NEXT_PUBLIC_SITE_URL, so it is
 * right on localhost, on a preview deployment and in production without anyone
 * remembering to change a variable.
 *
 * `next` is encoded because it is a path that may carry a query of its own --
 * unencoded, its `?` would terminate this one and the rest would be read as
 * parameters of the callback.
 *
 * Worth knowing when this appears not to work: Supabase only honours a
 * redirect it recognises. If the origin is not in the project's Redirect URLs
 * allowlist it silently substitutes the dashboard's Site URL, and the browser
 * lands on whatever that happens to be -- often an older deployment. Nothing
 * in this file can detect that, because by then the page is somebody else's.
 */
function callbackUrl(next: string) {
  const origin = window.location.origin;
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

type Mode = "signup" | "signin";

/**
 * Reading ?next= makes this component depend on the request, which would stop
 * the page prerendering as static HTML. The boundary keeps the shell static
 * and lets only the form wait -- which is why the fallback is the same height
 * as the real thing, so the card does not resize as it arrives.
 */
export function AuthForm({ mode = "signup" }: { mode?: Mode }) {
  return (
    <Suspense fallback={<div className="mt-8 h-[286px]" />}>
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}

function AuthFormInner({ mode = "signup" }: { mode?: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const signup = mode === "signup";

  /*
   * The middleware sends people here with ?next=<where they were going>, so
   * signing in finishes the journey they started. Only same-site paths are
   * honoured: taking an absolute URL from the query string and redirecting to
   * it after authenticating is an open redirect, which is exactly the shape
   * phishing wants -- a real login page on the real domain that lands you
   * somewhere else.
   */
  const requested = params.get("next");
  const safeNext =
    requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : null;
  const next = safeNext ?? (signup ? SIGNUP_NEXT : SIGNIN_NEXT);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkInbox, setCheckInbox] = useState(false);

  const configured = isSupabaseConfigured();
  const googleLive = isGoogleAuthEnabled();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError("Enter your email address.");
    if (password.length < 8) return setError("Pick a password of at least 8 characters.");

    const supabase = createClient();

    /* No Supabase in this deployment: the flow still has to end somewhere, so
       it continues as a guest rather than dead-ending on a config problem the
       visitor cannot fix. */
    if (!supabase) {
      setBusy("email");
      router.push(`${next}?guest=1`);
      return;
    }

    setBusy("email");

    const result = signup
      ? await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: callbackUrl(next) },
        })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (result.error) {
      setError(humanise(result.error.message, mode));
      setBusy(null);
      return;
    }

    /* Sign-up with email confirmation on returns a user but no session. Saying
       "welcome" and pushing into the app would be a lie -- nothing is signed
       in yet -- so the screen hands over to the code entry instead, which
       finishes the job without depending on a redirect URL being allowlisted. */
    if (signup && !result.data.session) {
      setCheckInbox(true);
      setBusy(null);
      return;
    }

    router.push(next);
    router.refresh();
  };

  const withGoogle = async () => {
    setError(null);
    const supabase = createClient();

    if (!googleLive || !supabase) {
      /* Google is switched off in this build. Rather than a button that does
         nothing, the click explains itself and the email form stays. */
      setBusy("google");
      const id = pushToast({ status: "loading", title: "Checking Google sign-in…" });
      setTimeout(() => {
        updateToast(id, {
          status: "info",
          title: "Google sign-in is switched off here",
          description:
            "Google blocks unverified apps for anyone who is not an added test user. Use email and password — it is the same account.",
          duration: 6000,
        });
        setBusy(null);
      }, 700);
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[auth] asking the provider to return to ${callbackUrl(next)} — this exact origin must be listed under Supabase → Authentication → URL Configuration → Redirect URLs, or Supabase will substitute the dashboard's Site URL instead.`,
      );
    }

    setBusy("google");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl(next),
        /* Identity only -- see GOOGLE_SCOPES. No access_type or prompt either:
           offline access exists to get a refresh token for calling an API in
           the background, and there is no API to call. `prompt: "consent"`
           forced the consent screen on every single sign-in, which turns a
           returning user's one tap into a form. */
        scopes: GOOGLE_SCOPES,
      },
    });

    if (err) {
      setError(humanise(err.message, mode));
      setBusy(null);
    }
  };

  if (checkInbox) {
    return (
      <VerifyEmail
        email={email.trim()}
        next={next}
        onUseDifferentEmail={() => {
          setCheckInbox(false);
          setPassword("");
        }}
      />
    );
  }

  return (
    <div className="mt-8">
      <form onSubmit={submit} className="space-y-4">
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
        />

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="text-[13px] font-medium text-text">
              Password
            </label>
            {signup && <span className="text-[12px] text-faint">8 characters or more</span>}
          </div>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={reveal ? "text" : "password"}
              autoComplete={signup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={signup ? "Pick a password" : "Your password"}
              className="h-[46px] w-full rounded-lg border border-line bg-field pr-11 pl-3.5 text-[14px] text-text transition-colors placeholder:text-faint hover:border-line-strong focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-2 text-faint transition-colors hover:text-text"
            >
              {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-md bg-mark-soft px-3.5 py-2.5 text-[13px] leading-snug text-mark"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy !== null}
          className="press flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-accent text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {busy === "email" && <Loader2 className="h-4 w-4 animate-spin" />}
          {signup ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[12px] text-faint">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={withGoogle}
        disabled={busy !== null}
        className="press flex h-[46px] w-full items-center justify-center gap-3 rounded-lg border border-line text-[14px] font-medium text-text transition-colors hover:border-line-strong disabled:opacity-60"
      >
        {busy === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleMark />}
        Continue with Google
      </button>

      {!configured && (
        <p className="mt-5 text-center text-[12px] leading-relaxed text-faint">
          No database is configured in this deployment, so this continues as a
          guest on sample data.
        </p>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 h-[46px] w-full rounded-lg border border-line bg-field px-3.5 text-[14px] text-text transition-colors placeholder:text-faint hover:border-line-strong focus:border-accent focus:outline-none"
      />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.700c2.2-2 3.4-5 3.4-8.6Z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.6 14.7a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z" />
      <path fill="#EA4335" d="M12 4.7c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 7.3l3.8 3c.9-2.7 3.4-4.6 6.4-4.6Z" />
    </svg>
  );
}
