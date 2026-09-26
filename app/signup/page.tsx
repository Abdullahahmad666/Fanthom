import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Sign up for Cue" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Sign up for Cue"
      swapPrompt="Already have a Cue account?"
      swapLabel="Sign in"
      swapHref="/login"
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
