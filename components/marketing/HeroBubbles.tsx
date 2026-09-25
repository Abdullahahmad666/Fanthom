import type { CSSProperties, ReactNode } from "react";
import {
  ArrowUp, Check, Headphones, Mic, MousePointer2, Plus, Sparkles, Text, Video,
  VideoOff,
} from "lucide-react";
import { CueMark } from "@/components/brand/CueMark";

/**
 * The floating product vignettes beside the hero headline.
 *
 * The real page uses soft-edged capsules with gradient borders holding tiny
 * slices of the product. These are rebuilt in markup rather than
 * screenshotted, so they stay sharp and ship no images.
 *
 * Each one drifts on its own timing. Identical floats would read as one block
 * sliding, which is the opposite of the intended effect -- so the travel,
 * duration and delay all differ per capsule.
 */

type Float = { bob: string; dur: string; delay: string };

/** Travel, period and offset per capsule, clockwise from the top left. */
const FLOATS: Record<string, Float> = {
  capture: { bob: "-12px", dur: "6.5s", delay: "0s" },
  ask: { bob: "10px", dur: "7.4s", delay: "-1.8s" },
  prompt: { bob: "-9px", dur: "8.1s", delay: "-3.1s" },
  moon: { bob: "12px", dur: "6.9s", delay: "-0.9s" },
  summary: { bob: "-11px", dur: "7.8s", delay: "-2.4s" },
  astronaut: { bob: "13px", dur: "6.2s", delay: "-4.2s" },
};

function floatStyle({ bob, dur, delay }: Float): CSSProperties {
  return {
    ["--bob" as string]: bob,
    animation: `float-bob ${dur} ease-in-out ${delay} infinite`,
    willChange: "transform",
  };
}

const CAPTURE_MODES = [
  { label: "Audio & video", Icon: Video, botFree: false, active: false },
  { label: "Audio", Icon: Headphones, botFree: true, active: true },
  { label: "Transcript only", Icon: Text, botFree: true, active: false },
  { label: "Capture off", Icon: VideoOff, botFree: false, active: false },
];

const FACES = ["#c2185b", "#2f6f4f", "#5a4bbd", "#b8552a"];

export function HeroBubbles() {
  return (
    <div className="pointer-events-none relative hidden h-[540px] w-full lg:block">
      {/* Capture-mode menu, open over a call card */}
      <div
        style={floatStyle(FLOATS.capture)}
        className="absolute top-[10px] left-[24%] w-[43%]"
      >
        <Capsule gradient="from-[#7c3aed] via-[#2563eb] to-[#f97316]">
          <div className="relative">
            <p className="text-[13px] text-fg-muted">Project check-in</p>
            <Faces />

            {/* The menu overlaps the card, which is why the title behind it is
                half-covered in the product. */}
            <div className="absolute -top-1 left-[26%] w-[74%] rounded-xl bg-[#131313] p-2 ring-1 ring-white/10">
              <ul className="space-y-1.5">
                {CAPTURE_MODES.map(({ label, Icon, botFree, active }) => (
                  <li
                    key={label}
                    className={`flex items-center gap-2 text-[12px] ${
                      active ? "font-semibold text-fg" : "text-fg-muted"
                    }`}
                  >
                    <Icon className="h-3 w-3 shrink-0" strokeWidth={2} />
                    {label}
                    {botFree && (
                      <span className="rounded bg-white/15 px-1.5 py-[1px] text-[8px] font-bold tracking-wide text-fg">
                        BOT-FREE
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <MousePointer2 className="absolute top-[38%] right-[18%] h-4 w-4 fill-white text-black" />
            </div>
          </div>
        </Capsule>
      </div>

      {/* Ask Cue */}
      <div style={floatStyle(FLOATS.ask)} className="absolute top-[28px] right-0 w-[31%]">
        <Capsule gradient="from-white/25 to-white/5">
          <div className="flex items-center justify-center gap-2 py-5">
            <Sparkles className="h-4 w-4 text-fg" />
            <span className="text-[17px] tracking-wide text-fg-muted">
              ASK <span className="font-bold text-fg">CUE</span>
            </span>
          </div>
        </Capsule>
      </div>

      {/* Astronaut */}
      <div
        style={floatStyle(FLOATS.astronaut)}
        className="absolute top-[192px] left-0 w-[42%]"
      >
        <Capsule gradient="from-white/20 to-white/5">
          <Astronaut />
        </Capsule>
      </div>

      {/* Prompt */}
      <div style={floatStyle(FLOATS.prompt)} className="absolute top-[186px] right-0 w-[55%]">
        <Capsule gradient="from-[#7c3aed] via-[#2563eb] to-[#f97316]">
          <div className="relative">
            {/* Inside the capsule, so it crops with everything else. */}
            <div className="absolute -top-1 right-0 flex items-center gap-2">
              <ModelBadge>
                <OpenAiMark />
              </ModelBadge>
              <ModelBadge>
                <ClaudeMark />
              </ModelBadge>
            </div>

            <p className="max-w-[72%] pt-1 text-[13px] leading-snug text-fg">
              Cue, what follow-ups did I commit to in my meetings this week?
              <span className="ml-[2px] inline-block h-[1em] w-px translate-y-[0.15em] bg-fg align-baseline" />
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Plus className="h-3.5 w-3.5 text-fg-muted" />
              <span className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[11px] text-fg">
                <CueMark className="h-2 w-3 text-brand" /> Cue
              </span>
              <Mic className="ml-auto h-3.5 w-3.5 text-fg-muted" />
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                <ArrowUp className="h-3 w-3 text-fg" />
              </span>
            </div>
          </div>
        </Capsule>
      </div>

      {/* Summary tabs */}
      <div
        style={floatStyle(FLOATS.summary)}
        className="absolute top-[380px] left-[15%] w-[63%]"
      >
        <Capsule gradient="from-white/20 to-white/5">
          <div className="px-2 pt-1 pb-3">
            <p className="text-[13px] text-fg">Project check-in</p>
            <Faces />
            <div className="mt-3 flex items-center gap-5 text-[12px]">
              <span className="flex items-center gap-1 border-b-2 border-brand pb-1.5 text-brand">
                <Sparkles className="h-3 w-3" /> Summary
              </span>
              <span className="flex items-center gap-1 pb-1.5 text-fg-muted">
                <Text className="h-3 w-3" /> Scratchpad
              </span>
            </div>
          </div>
        </Capsule>
      </div>

      <div
        style={floatStyle(FLOATS.moon)}
        className="absolute top-[382px] right-0 h-[132px] w-[132px]"
      >
        <Moon />
      </div>
    </div>
  );
}

/** Overlapping attendee faces, as they appear on every call card. */
function Faces() {
  return (
    <span className="mt-1.5 flex items-center">
      {FACES.map((c, i) => (
        <span
          key={c}
          style={{ background: c, marginLeft: i === 0 ? 0 : -6 }}
          className="h-5 w-5 rounded-full ring-2 ring-[#0a0a0a]"
        />
      ))}
    </span>
  );
}

/**
 * overflow-hidden is the point of this, not an incidental: everything a
 * capsule holds is cropped to its rounded shape, so an oversized panel reads
 * as a window onto the product rather than a chunk of UI floating loose over
 * the starfield.
 */
function Capsule({ children, gradient }: { children: ReactNode; gradient: string }) {
  return (
    <div className={`overflow-hidden rounded-[42px] bg-gradient-to-br p-px ${gradient}`}>
      <div className="overflow-hidden rounded-[41px] bg-[#0a0a0a]/95 px-6 py-5 backdrop-blur">
        {children}
      </div>
    </div>
  );
}

function ModelBadge({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#141414] ring-1 ring-white/15">
      {children}
    </span>
  );
}

function OpenAiMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#fff"
        d="M21.6 9.8a5.8 5.8 0 0 0-.5-4.8 5.9 5.9 0 0 0-6.4-2.8A5.9 5.9 0 0 0 4.6 3.9 5.8 5.8 0 0 0 .8 6.7a5.9 5.9 0 0 0 .7 6.9 5.8 5.8 0 0 0 .5 4.8 5.9 5.9 0 0 0 6.4 2.8 5.9 5.9 0 0 0 10.1-1.7 5.8 5.8 0 0 0 3.8-2.8 5.9 5.9 0 0 0-.7-6.9Zm-8.8 12.3a4.4 4.4 0 0 1-2.8-1l4.6-2.7a.7.7 0 0 0 .4-.7v-6.5l1.9 1.1v5.4a4.4 4.4 0 0 1-4.1 4.4ZM3.5 17.4a4.4 4.4 0 0 1-.5-3l4.6 2.7a.7.7 0 0 0 .7 0l5.6-3.3v2.2l-4.7 2.7a4.4 4.4 0 0 1-5.7-1.3ZM2.3 7.5a4.4 4.4 0 0 1 2.3-1.9v5.5a.7.7 0 0 0 .4.7l5.6 3.2-1.9 1.1-4.7-2.7a4.4 4.4 0 0 1-1.7-5.9Zm16.1 3.7-5.6-3.3 1.9-1.1 4.7 2.7a4.4 4.4 0 0 1-.7 7.9v-5.5a.7.7 0 0 0-.3-.7ZM20.2 8.5 15.6 5.8a.7.7 0 0 0-.7 0L9.3 9V6.8L14 4.1a4.4 4.4 0 0 1 6.2 4.4ZM8.3 12.3 6.4 11.2V5.8a4.4 4.4 0 0 1 7.2-3.4L9 5.1a.7.7 0 0 0-.4.7ZM9.3 10 11.8 8.5 14.3 10v2.9l-2.5 1.4-2.5-1.4Z"
      />
    </svg>
  );
}

/** Anthropic's burst, simplified to eight tapered spokes. */
function ClaudeMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <g stroke="#d97757" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
      </g>
    </svg>
  );
}

/** Line-art astronaut with a laptop, matching the hero illustration. */
function Astronaut() {
  return (
    <div className="flex h-[118px] items-center justify-center">
      <svg viewBox="0 0 200 120" className="h-full w-auto" aria-hidden>
        <g fill="none" stroke="#e8e8ea" strokeWidth="2.4" strokeLinejoin="round">
          {/* Backpack and torso */}
          <path d="M96 34c-16 2-27 13-29 28-1 10 4 19 13 24 12 6 27 4 36-5" fill="#1a1a1c" />
          {/* Helmet */}
          <circle cx="110" cy="38" r="25" fill="#131316" />
          <path d="M96 30a16 16 0 0 1 22-4" stroke="#8ea6c8" strokeWidth="3" strokeLinecap="round" />
          <path d="M120 22a19 19 0 0 1 6 9" stroke="#c8b46a" strokeWidth="3" strokeLinecap="round" />
          {/* Arms to the laptop */}
          <path d="M84 62c-8 4-14 10-16 18M133 55c8 5 12 12 11 20" />
          {/* Laptop */}
          <path d="M56 84 92 62l52 16-38 24z" fill="#232326" />
          <path d="M56 84v6l50 16v-6M144 78v6l-38 24" />
          {/* Legs */}
          <path d="M92 86c-4 10-4 18 1 24M104 92c-3 9-3 16 1 22" />
          <g stroke="#6ba7e8" strokeWidth="3" strokeLinecap="round">
            <path d="M88 108h12M90 114h12M104 110h10M106 116h10" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** Cratered moon. CSS gradients rather than a texture, so it ships nothing. */
function Moon() {
  return (
    <div
      className="relative h-full w-full rounded-full ring-1 ring-white/15"
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #dfefff 0%, #7fb6e8 26%, #1f5f9b 58%, #0a2340 82%, #04101f 100%)",
        boxShadow: "0 0 48px -10px rgba(110,180,255,0.45)",
      }}
    >
      {[
        [30, 22, 16],
        [58, 46, 24],
        [22, 62, 12],
        [66, 20, 9],
        [44, 76, 14],
        [76, 62, 10],
      ].map(([left, top, size]) => (
        <span
          key={`${left}-${top}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.28), rgba(0,0,0,0.30))",
          }}
          className="absolute rounded-full"
        />
      ))}
      {/* Terminator, so it reads as a lit sphere rather than a disc */}
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_26%,transparent_38%,rgba(0,0,0,0.55)_100%)]" />
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
