import Link from "next/link";
import { ArrowRight, Lock, Sparkles, Search, Rocket } from "lucide-react";
import { FathomWordmark } from "@/components/brand/FathomMark";

const NAV = ["Overview", "Solutions", "Integrations", "Resources", "Pricing"];
const LOGOS = ["HubSpot", "Adobe", "zapier", "GRUBHUB", "EA", "Calendly"];

const FEATURES = [
  { Icon: Sparkles, title: "Summaries that hold up", body: "Every call comes back as structured notes you can switch between templates on, not a wall of text." },
  { Icon: Rocket, title: "Action items, not homework", body: "Commitments are pulled out with an owner and a timestamp that jumps to the moment." },
  { Icon: Search, title: "Search what was said", body: "Find the sentence across every meeting, then land on it in the recording." },
  { Icon: Lock, title: "You stay in control", body: "Fathom only joins the meetings you ask it to, and annotations stay internal by default." },
];

export const metadata = {
  title: "Fathom — AI notetaking that is out of this world",
};

/** Marketing landing. Entry point to the signup flow. */
export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-content text-fg">
      <div className="flex items-center justify-center gap-2 bg-white px-6 py-3 text-center text-[13px] font-semibold tracking-wide text-neutral-900">
        FATHOM IS NOW PART OF SUPERHUMAN.
        <span className="underline underline-offset-2">LEARN MORE →</span>
      </div>

      <header className="mx-auto flex max-w-[1240px] items-center gap-8 px-6 py-6">
        <FathomWordmark />
        <nav className="hidden items-center gap-7 rounded-full px-6 py-2.5 ring-1 ring-line lg:flex">
          {NAV.map((n) => (
            <span key={n} className="text-[15px] text-fg-muted transition-colors hover:text-fg">
              {n}
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-6">
          <span className="hidden text-[15px] text-fg sm:inline">Book a Demo</span>
          <Link href="/calls" className="text-[15px] text-fg hover:text-brand">
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-brand px-5 py-2.5 text-[14px] font-bold tracking-wide text-brand uppercase transition-colors hover:bg-brand/10"
          >
            Sign up free
          </Link>
        </div>
      </header>

      {/* Hero. The starfield is a radial wash rather than an image, so the page
          ships with no binary assets. */}
      <section
        className="relative overflow-hidden px-6 pt-20 pb-28"
        style={{
          background:
            "radial-gradient(1000px 520px at 20% 0%, #10243a 0%, transparent 60%), radial-gradient(800px 420px at 85% 25%, #1a1035 0%, transparent 60%)",
        }}
      >
        <div className="mx-auto max-w-[1240px]">
          <h1 className="max-w-[780px] text-[clamp(40px,6vw,76px)] leading-[1.05] font-normal tracking-tight">
            AI notetaking that is out of this world
          </h1>
          <p className="mt-8 max-w-[560px] text-[18px] leading-relaxed text-fg-muted">
            Fathom summarizes your meetings so you can focus on the conversation.{" "}
            <strong className="font-bold text-fg">Now available bot-free.</strong>
          </p>

          <Link
            href="/signup"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-[15px] font-bold tracking-wide text-black uppercase transition-colors hover:bg-[#33cbff]"
          >
            Get started - free forever <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-8 flex flex-wrap items-center gap-3 text-[14px] text-fg-muted">
            <Lock className="h-4 w-4" />
            SOC 2 Type II <span className="text-fg-dim">|</span> GDPR
            <span className="text-fg-dim">|</span> HIPAA Compliant
            <span className="text-fg-dim">|</span> SSO / SCIM
          </p>
        </div>
      </section>

      <section className="border-y border-line px-6 py-8">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-6">
          <span className="text-[15px] font-semibold">
            <span className="text-amber">★★★★★</span> 5.0/5.0
          </span>
          <span className="text-[14px] text-fg-muted">
            #1 rated · 6,500+ reviews · Used at 300K+ companies
          </span>
          {LOGOS.map((l) => (
            <span
              key={l}
              className="rounded-lg bg-surface px-5 py-2.5 text-[15px] font-semibold text-fg-muted"
            >
              {l}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-24">
        <h2 className="max-w-[720px] text-[clamp(30px,4vw,46px)] leading-tight font-semibold">
          Whether you&apos;re a team of 1 or 1,000, Fathom&apos;s got your back
        </h2>

        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title}>
              <Icon className="h-7 w-7 text-brand" strokeWidth={1.5} />
              <h3 className="mt-4 text-[19px] font-semibold">{title}</h3>
              <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-fg-muted">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-[1240px] rounded-2xl bg-panel px-8 py-16 text-center">
          <h2 className="text-[clamp(28px,4vw,40px)] font-semibold">Clarity</h2>
          <p className="mt-3 text-[16px] text-brand">
            ✦ Unforgettable meetings…quite literally
          </p>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-relaxed text-fg-muted">
            Shockingly accurate transcripts, instant summaries, and action items with
            consistent quality across every call.
          </p>
          <Link
            href="/signup"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-[15px] font-bold tracking-wide text-black uppercase transition-colors hover:bg-[#33cbff]"
          >
            Get started. It&apos;s free.
          </Link>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-10">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4">
          <FathomWordmark />
          <p className="text-[14px] text-fg-dim">
            Frontend prototype built for an assignment. Not affiliated with Fathom.
          </p>
          <Link href="/calls" className="ml-auto text-[15px] text-brand hover:underline">
            Skip to the app →
          </Link>
        </div>
      </footer>
    </div>
  );
}
