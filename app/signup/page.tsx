import Link from "next/link";
import { FathomWordmark } from "@/components/brand/FathomMark";

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
          <p className="text-center text-[34px]" aria-hidden="true">🚀</p>
          <h1 className="mt-4 text-center text-[34px] font-bold text-fg">
            Sign up for Fathom
          </h1>
          <p className="mt-5 text-center text-[16px] text-fg-muted">
            Connect your work email to get started in minutes
          </p>

          <div className="mt-10 space-y-4">
            {[
              { label: "Continue with Google", mark: <GoogleMark /> },
              { label: "Continue with Microsoft", mark: <MicrosoftMark /> },
            ].map(({ label, mark }) => (
              <Link
                key={label}
                href="/signup/questionnaire"
                className="flex h-[58px] items-center justify-center gap-3 rounded-xl bg-white text-[18px] font-semibold text-neutral-900 transition-opacity hover:opacity-90"
              >
                {mark}
                {label}
              </Link>
            ))}
          </div>

          <p className="mt-9 text-center text-[16px] text-fg">
            Already have a Fathom account?{" "}
            <Link href="/" className="text-brand underline-offset-2 hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-[13px] leading-relaxed text-fg-dim">
            By using Fathom, you agree to the{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>

        <div className="hidden pt-16 lg:block">
          <span className="block text-[90px] leading-none font-bold text-fg-dim/40">&ldquo;</span>
          <blockquote className="-mt-8 max-w-[640px] text-[30px] leading-snug font-medium">
            <span className="text-fg">&lsquo;Work smarter, not harder,&rsquo; they said. </span>
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text font-bold text-transparent">
              Fathom took it personally.
            </span>
          </blockquote>
          <p className="mt-7 text-[15px] font-semibold text-fg">Rosanne K.</p>
          <p className="text-[15px] text-fg-muted">Executive</p>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-6 border-t border-line px-8 py-8">
        <span className="text-[15px] font-semibold text-fg">
          <span className="text-amber">★★★★★</span> 5.0/5.0
        </span>
        <span className="text-[14px] text-fg-muted">Used at over 300K+ companies</span>
        {LOGOS.map((l) => (
          <span
            key={l}
            className="rounded-lg bg-surface px-5 py-2.5 text-[15px] font-semibold text-fg-muted"
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.700c2.2-2 3.4-5 3.4-8.6Z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.6 14.7a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z" />
      <path fill="#EA4335" d="M12 4.7c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 7.3l3.8 3c.9-2.7 3.4-4.6 6.4-4.6Z" />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}
