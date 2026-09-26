import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * What a signed-in visitor sees on the sign-in and sign-up screens.
 *
 * They used to be redirected to /calls without a word. That is the behaviour
 * behind "clicking Sign in goes to the calls page": nothing was broken, but
 * nothing explained itself either, and a silent jump to a different page is
 * indistinguishable from a bug -- especially on a list that is empty, where
 * the destination looks blank.
 *
 * So the screen says the thing out loud. It names the account, because the
 * usual reason somebody deliberately opens sign-in while signed in is that
 * they want to be somebody else, and it offers that as the second action
 * rather than making them hunt for it.
 *
 * `next` is honoured here too: arriving at /login?next=/import while already
 * signed in should offer /import, not the generic destination.
 */
export function AlreadySignedIn({
  email,
  next,
}: {
  email: string;
  /** Same-site path the visitor was originally heading for. */
  next?: string | null;
}) {
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const target = safeNext ?? "/calls";
  const label = safeNext ? "Continue where you left off" : "Go to my meetings";

  return (
    <div className="mt-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accentsoft">
        <CheckCircle2 className="h-6 w-6 text-accent" />
      </span>

      <h2 className="mt-5 text-[17px] font-semibold text-text">You are already signed in</h2>
      <p className="measure mx-auto mt-2 text-[14px] leading-relaxed text-muted">
        This browser is signed in as <span className="text-text">{email}</span>.
      </p>

      <Link
        href={target}
        className="press mt-7 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-accent text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        {label}
        <ArrowRight className="h-[18px] w-[18px]" />
      </Link>

      {/* The reason somebody opens sign-in while signed in. */}
      <form action="/auth/signout" method="post" className="mt-4">
        <button
          type="submit"
          className="press h-[44px] w-full rounded-lg border border-line text-[14px] font-medium text-text transition-colors hover:border-line-strong"
        >
          Sign out and use a different account
        </button>
      </form>
    </div>
  );
}
