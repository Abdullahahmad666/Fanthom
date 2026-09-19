import { AuthShell } from "@/components/auth/AuthShell";
import { SignInButtons } from "@/components/auth/SignInButtons";

export const metadata = { title: "Sign up for Fathom" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Sign up for Fathom"
      swapPrompt="Already have a Fathom account?"
      swapLabel="Sign in"
      swapHref="/login"
    >
      <SignInButtons mode="signup" />
    </AuthShell>
  );
}
