import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { AlreadySignedIn } from "@/components/auth/AlreadySignedIn";
import { getUser } from "@/backend/src/supabase/server";

export const metadata = {
  title: "Create a Cue account",
  description: "Create a Cue account with your email and password. Free while in early access.",
  alternates: { canonical: "/signup" },
};

/** Sign up. A signed-in visitor is told, not silently redirected. */
export default async function SignUpPage({
  searchParams,
}: PageProps<"/signup">) {
  const user = await getUser();
  const next = (await searchParams).next;
  const one = Array.isArray(next) ? next[0] : next;

  return (
    <AuthShell
      title={user ? "You already have an account" : "Create your Cue account"}
      swapPrompt="Already have a Cue account?"
      swapLabel="Sign in"
      swapHref="/login"
      hideSwap={Boolean(user)}
    >
      {user?.email ? (
        <AlreadySignedIn email={user.email} next={one ?? null} />
      ) : (
        <AuthForm mode="signup" />
      )}
    </AuthShell>
  );
}
