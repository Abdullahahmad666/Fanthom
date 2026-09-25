import { AuthShell } from "@/components/auth/AuthShell";
import { SignInButtons } from "@/components/auth/SignInButtons";

export const metadata = { title: "Sign up for Cue" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Sign up for Cue"
      swapPrompt="Already have a Cue account?"
      swapLabel="Sign in"
      swapHref="/login"
    >
      <SignInButtons mode="signup" />
    </AuthShell>
  );
}
