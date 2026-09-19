import { AuthShell } from "@/components/auth/AuthShell";
import { SignInButtons } from "@/components/auth/SignInButtons";

export const metadata = { title: "Sign in to Fathom" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to Fathom"
      swapPrompt="New to Fathom?"
      swapLabel="Sign up"
      swapHref="/signup"
    >
      <SignInButtons mode="signin" />
    </AuthShell>
  );
}
