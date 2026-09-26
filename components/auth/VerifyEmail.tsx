"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, MailCheck, RotateCcw } from "lucide-react";
import { createClient } from "@/backend/src/supabase/client";
import { pushToast } from "@/lib/toast";

/**
 * Finishing sign-up by typing the code, rather than by following a link.
 *
 * The link in the email is a round trip through Supabase and back to a
 * redirect URL, and it only works if that exact origin is on the project's
 * allowlist. When it is not, Supabase silently substitutes the dashboard's
 * Site URL and the person lands on some other deployment, signed in to
 * nothing -- which is the failure this screen exists to remove. A code is
 * carried by the person, not by a redirect, so it works on localhost, on a
 * preview build and in production without anything being configured.
 *
 * The link still works for anyone who prefers it; this is the path that cannot
 * be broken by configuration.
 */

const RESEND_SECONDS = 45;

/** Supabase's wording, translated for the person who is stuck. */
function humanise(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("expired")) return "That code has expired. Send a new one.";
  if (m.includes("invalid") || m.includes("token")) {
    return "That code is not right. Check the latest email — codes expire and only the newest one works.";
  }
  /* The project's email quota, not the person's attempts -- see AuthForm. */
  if (m.includes("email rate limit") || m.includes("over_email_send_rate_limit")) {
    return "The mail sender has hit its limit, so no new code went out. Configure SMTP in Supabase, or wait an hour.";
  }
  if (m.includes("rate") || m.includes("too many")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  return message;
}

export function VerifyEmail({
  email,
  next,
  onUseDifferentEmail,
}: {
  email: string;
  /** Where to land once the account is confirmed. */
  next: string;
  onUseDifferentEmail: () => void;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* A resend button that is available immediately invites people to hammer it
     into Supabase's rate limit, after which nothing arrives at all. */
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const verify = async (value: string) => {
    const token = value.replace(/\D/g, "");
    if (token.length < 6) return;

    const supabase = createClient();
    if (!supabase) return;

    setBusy(true);
    setError(null);

    /*
     * A confirmation token from signUp() is type "signup"; one from a magic
     * link or an OTP sign-in is type "email". They are different token types
     * to Supabase, and the wrong one is rejected as invalid -- which would
     * read to the person as "your code is wrong" when it is not.
     *
     * Signup is tried first because that is how everyone arrives here, and
     * "email" is only attempted if the first was refused for being the wrong
     * type rather than for being expired or used.
     */
    let err = (await supabase.auth.verifyOtp({ email, token, type: "signup" })).error;

    if (err && /invalid|token/i.test(err.message) && !/expired/i.test(err.message)) {
      err = (await supabase.auth.verifyOtp({ email, token, type: "email" })).error;
    }

    if (err) {
      setError(humanise(err.message));
      setBusy(false);
      setCode("");
      inputRef.current?.focus();
      return;
    }

    pushToast({
      title: "Email confirmed",
      description: "Your account is ready.",
      status: "success",
    });
    router.push(next);
    router.refresh();
  };

  const resend = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setError(null);
    setCooldown(RESEND_SECONDS);

    const { error: err } = await supabase.auth.resend({ type: "signup", email });
    pushToast(
      err
        ? { title: "Could not send another code", description: humanise(err.message), status: "error" }
        : { title: "New code sent", description: `Check ${email} again.`, status: "success" },
    );
  };

  return (
    <div className="mt-8">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accentsoft">
          <MailCheck className="h-6 w-6 text-accent" />
        </span>
        <h2 className="mt-5 text-[17px] font-semibold text-text">Confirm your email</h2>
        <p className="measure mx-auto mt-2 text-[14px] leading-relaxed text-muted">
          We sent a six-digit code to <span className="text-text">{email}</span>.
          Enter it below, or open the link in the same email.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void verify(code);
        }}
        className="mt-7"
      >
        <label htmlFor="otp" className="text-[13px] font-medium text-text">
          Verification code
        </label>
        <input
          ref={inputRef}
          id="otp"
          /* `inputMode` rather than type=number: a number field allows a minus
             sign and an exponent, and strips leading zeros a code may need. */
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 6);
            setCode(v);
            setError(null);
            /* Submit as soon as it is complete: nobody wants to reach for a
               button after typing the last digit. */
            if (v.length === 6) void verify(v);
          }}
          placeholder="000000"
          className="mt-1.5 h-[52px] w-full rounded-lg border border-line bg-field text-center font-mono text-[22px] tracking-[0.4em] text-text transition-colors placeholder:text-faint placeholder:tracking-[0.4em] hover:border-line-strong focus:border-accent focus:outline-none"
        />

        {error && (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-md bg-mark-soft px-3.5 py-2.5 text-[13px] leading-snug text-mark"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || code.length < 6}
          className="press mt-5 flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-accent text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Confirm and sign in
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-[13px]">
        <button
          type="button"
          onClick={() => void resend()}
          disabled={cooldown > 0}
          className="press inline-flex items-center gap-1.5 text-muted transition-colors hover:text-text disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {cooldown > 0 ? `Send again in ${cooldown}s` : "Send a new code"}
        </button>

        <button
          type="button"
          onClick={onUseDifferentEmail}
          className="press text-muted transition-colors hover:text-text"
        >
          Use a different email
        </button>
      </div>

      <p className="mt-6 text-center text-[12px] leading-relaxed text-faint">
        No email? Check spam, and make sure the project has an SMTP sender
        configured — the built-in one is rate limited to a handful of messages
        an hour.
      </p>
    </div>
  );
}
