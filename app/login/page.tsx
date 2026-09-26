import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { AlreadySignedIn } from "@/components/auth/AlreadySignedIn";
import { getUser } from "@/backend/src/supabase/server";

export const metadata = {
  title: "Sign in to Cue",
  description: "Sign in to Cue with your email and password.",
  alternates: { canonical: "/login" },
};

/**
 * Sign in.
 *
 * A signed-in visitor gets told so rather than being bounced. The middleware
 * used to redirect them to /calls without a word, which is what made clicking
 * "Sign in" look like it went somewhere random -- the page it landed on is
 * empty for a new account, so there was nothing to explain the jump either.
 */
export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const user = await getUser();
  const next = (await searchParams).next;
  const one = Array.isArray(next) ? next[0] : next;

  return (
    <AuthShell
      title={user ? "Welcome back" : "Sign in to Cue"}
      swapPrompt="New to Cue?"
      swapLabel="Create an account"
      swapHref="/signup"
      hideSwap={Boolean(user)}
    >
      {user?.email ? (
        <AlreadySignedIn email={user.email} next={one ?? null} />
      ) : (
        <AuthForm mode="signin" />
      )}
    </AuthShell>
  );
}
