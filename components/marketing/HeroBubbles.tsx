import { Check, Mic, Plus, Sparkles, ArrowUp } from "lucide-react";
import { FathomMark } from "@/components/brand/FathomMark";

/**
 * The floating product vignettes beside the hero headline.
 *
 * The real page uses soft-edged capsules with gradient borders holding tiny
 * slices of the product. These are rebuilt in markup rather than screenshotted,
 * so they stay sharp and ship no images.
 */
export function HeroBubbles() {
  return (
    <div className="pointer-events-none relative hidden h-[520px] w-full lg:block">
      {/* Capture-mode menu */}
      <Capsule className="absolute top-[70px] left-[2%] w-[330px]" gradient="from-[#7c3aed] via-[#2563eb] to-[#f97316]">
        <p className="mb-2 text-[13px] text-fg-muted">Project check-in</p>
        <ul className="space-y-1.5 rounded-xl bg-[#111] p-2.5">
          {[
            ["Audio & video", false],
            ["Audio", true],
            ["Transcript only", true],
            ["Capture off", false],
          ].map(([label, botFree]) => (
            <li key={label as string} className="flex items-center gap-2 text-[12px] text-fg">
              <span className="h-3 w-3 rounded-full border border-fg-dim" />
              {label}
              {botFree && (
                <span className="rounded bg-white/15 px-1.5 py-[1px] text-[8px] font-bold tracking-wide">
                  BOT-FREE
                </span>
              )}
            </li>
          ))}
        </ul>
      </Capsule>

      {/* Ask Fathom */}
      <Capsule className="absolute top-[60px] right-[2%] w-[250px]" gradient="from-white/25 to-white/5">
        <div className="flex items-center justify-center gap-2 py-4">
          <Sparkles className="h-4 w-4 text-fg" />
          <span className="text-[17px] tracking-wide text-fg-muted">
            ASK <span className="font-bold text-fg">FATHOM</span>
          </span>
        </div>
      </Capsule>

      {/* Astronaut stand-in */}
      <Capsule className="absolute top-[250px] left-0 w-[260px]" gradient="from-white/20 to-white/5">
        <div className="flex h-[110px] items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-[26px]">
            👩‍🚀
          </span>
        </div>
      </Capsule>

      {/* Prompt */}
      <Capsule className="absolute top-[240px] right-[6%] w-[340px]" gradient="from-[#7c3aed] via-[#2563eb] to-[#f97316]">
        <p className="text-[13px] leading-snug text-fg">
          Fathom, what follow-ups did I commit to in my meetings this week?
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Plus className="h-3.5 w-3.5 text-fg-muted" />
          <span className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[11px] text-fg">
            <FathomMark className="h-2 w-3 text-brand" /> Fathom
          </span>
          <Mic className="ml-auto h-3.5 w-3.5 text-fg-muted" />
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
            <ArrowUp className="h-3 w-3 text-fg" />
          </span>
        </div>
      </Capsule>

      {/* Summary tabs */}
      <Capsule className="absolute top-[400px] left-[14%] w-[300px]" gradient="from-white/20 to-white/5">
        <p className="text-[13px] text-fg">Project check-in</p>
        <div className="mt-2 flex items-center gap-4 text-[12px]">
          <span className="flex items-center gap-1 border-b-2 border-brand pb-1 text-brand">
            <Sparkles className="h-3 w-3" /> Summary
          </span>
          <span className="pb-1 text-fg-muted">Scratchpad</span>
        </div>
      </Capsule>

      {/* Moon */}
      <div className="absolute top-[390px] right-[3%] h-[110px] w-[110px] rounded-full bg-gradient-to-br from-[#0b3a63] via-[#093056] to-[#020d1a] ring-1 ring-white/15">
        <span className="absolute top-6 left-7 h-3 w-3 rounded-full bg-white/10" />
        <span className="absolute top-14 left-14 h-5 w-5 rounded-full bg-white/10" />
        <span className="absolute top-8 left-16 h-2 w-2 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function Capsule({
  children,
  className = "",
  gradient,
}: {
  children: React.ReactNode;
  className?: string;
  gradient: string;
}) {
  return (
    <div className={`rounded-[42px] bg-gradient-to-br p-px ${gradient} ${className}`}>
      <div className="rounded-[41px] bg-[#0a0a0a]/95 px-5 py-4 backdrop-blur">{children}</div>
    </div>
  );
}

export function CheckRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 text-[13px] text-fg">
      <Check className="h-3.5 w-3.5 text-success" />
      {label}
    </li>
  );
}
