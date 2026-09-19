import Link from "next/link";
import { FathomWordmark } from "@/components/brand/FathomMark";
import { SignInButtons } from "@/components/auth/SignInButtons";

const LOGOS = ["HubSpot", "Adobe", "zapier", "GRUBHUB", "EA", "Calendly"];

export const metadata = { title: "Sign up for Fathom" };

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-content">
      <div className="flex justify-center pt-8 pb-14">
        <FathomWordmark />
      </div>

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-start gap-16 px-8 lg:grid-cols-[440px_1fr]">
        <div className="rounded-2xl bg-canvas px-10 py-12 ring-1 ring-line">
          <p className="text-center text-[28px]" aria-hidden="true">🚀</p>
          <h1 className="mt-4 text-center text-[28px] font-bold text-fg">
            Sign up for Fathom
          </h1>
          <p className="mt-5 text-center text-[14px] text-fg-muted">
            Connect your work email to get started in minutes
          </p>

          <SignInButtons />

          <p className="mt-9 text-center text-[14px] text-fg">
            Already have a Fathom account?{" "}
            <Link href="/calls" className="text-brand underline-offset-2 hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-[12px] leading-relaxed text-fg-dim">
            By using Fathom, you agree to the{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>

        <div className="hidden pt-16 lg:block">
          <span className="block text-[90px] leading-none font-bold text-fg-dim/40">&ldquo;</span>
          <blockquote className="-mt-8 max-w-[640px] text-[26px] leading-snug font-medium">
            <span className="text-fg">&lsquo;Work smarter, not harder,&rsquo; they said. </span>
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text font-bold text-transparent">
              Fathom took it personally.
            </span>
          </blockquote>
          <p className="mt-7 text-[13px] font-semibold text-fg">Rosanne K.</p>
          <p className="text-[13px] text-fg-muted">Executive</p>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-6 border-t border-line px-8 py-8">
        <span className="text-[13px] font-semibold text-fg">
          <span className="text-amber">★★★★★</span> 5.0/5.0
        </span>
        <span className="text-[13px] text-fg-muted">Used at over 300K+ companies</span>
        {LOGOS.map((l) => (
          <span
            key={l}
            className="rounded-lg bg-surface px-5 py-2.5 text-[13px] font-semibold text-fg-muted"
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

