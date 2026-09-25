import { AuthShell } from "@/components/auth/AuthShell";
import { SignInButtons } from "@/components/auth/SignInButtons";

export const metadata = { title: "Sign in to Cue" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to Cue"
      swapPrompt="New to Cue?"
      swapLabel="Sign up"
      swapHref="/signup"
    >
      <SignInButtons mode="signin" />
    </AuthShell>
  );
}
