import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Sign in to Cue" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to Cue"
      swapPrompt="New to Cue?"
      swapLabel="Sign up"
      swapHref="/signup"
    >
      <AuthForm mode="signin" />
    </AuthShell>
  );
}
