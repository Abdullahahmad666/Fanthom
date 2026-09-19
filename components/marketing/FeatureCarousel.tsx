"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

const SLIDES = [
  {
    caption: (
      <>
        Capture notes your way &ndash; <strong className="font-bold">bot or no bot</strong> &ndash;
        <br />
        so you can stay focused on the meeting
      </>
    ),
    kind: "call" as const,
  },
  {
    caption: (
      <>
        AI summaries instantly
        <br />
        available after your call
      </>
    ),
    kind: "summary" as const,
  },
  {
    caption: (
      <>
        Every commitment pulled out
        <br />
        with an owner and a timestamp
      </>
    ),
    kind: "actions" as const,
  },
  {
    caption: (
      <>
        Ask anything across
        <br />
        every meeting you have had
      </>
    ),
    kind: "ask" as const,
  },
];

/**
 * The product carousel. Sits on the blue gradient band measured from the
 * source page (#264055 -> #385D7C), with the yellow circular arrows and dot
 * pager the real page uses.
 */
export function FeatureCarousel() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i];

  return (
    <section
      className="relative overflow-hidden px-10 pt-28 pb-20"
      style={{
        background:
          "linear-gradient(180deg, #000 0%, #1a2c3c 22%, #264055 50%, #385D7C 88%, #0d1620 100%)",
      }}
    >
      <div className="mx-auto max-w-[1560px]">
        <p className="mb-12 text-center text-[24px] leading-snug text-fg">{slide.caption}</p>

        <div className="flex justify-center">
          <SlideArt kind={slide.kind} />
        </div>

        <div className="mt-14 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-amber text-black transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            {SLIDES.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Slide ${n + 1}`}
                aria-current={n === i}
                onClick={() => setI(n)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  n === i ? "bg-amber" : "bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => setI((v) => (v + 1) % SLIDES.length)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-amber text-black transition-transform hover:scale-105"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

/** Small in-markup mocks so the carousel ships without screenshots. */
function SlideArt({ kind }: { kind: "call" | "summary" | "actions" | "ask" }) {
  return (
    <div className="w-full max-w-[1000px] overflow-hidden rounded-2xl bg-[#0b0b0d] ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[12px] text-fg-dim">fathom.video</span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-[#8e1141] to-[#3d0a1e]" />
          <div className="flex gap-2">
            <span className="h-2 w-16 rounded bg-white/20" />
            <span className="h-2 w-10 rounded bg-white/10" />
          </div>
        </div>

        <div className="space-y-2.5">
          {kind === "call" && (
            <>
              <Line w="w-2/3" strong />
              <Line w="w-full" />
              <Line w="w-5/6" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-fg">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Listening…
              </span>
            </>
          )}
          {kind === "summary" && (
            <>
              <span className="flex items-center gap-1.5 text-[12px] text-brand">
                <Sparkles className="h-3 w-3" /> Enhanced Summary
              </span>
              <Line w="w-full" />
              <Line w="w-11/12" />
              <Line w="w-4/5" />
              <Line w="w-3/5" />
            </>
          )}
          {kind === "actions" && (
            <>
              {["Confirm security review timeline", "Send pricing to Elena", "Run migration dry run"].map((t) => (
                <span key={t} className="flex items-start gap-2 text-[12px] text-fg">
                  <span className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border border-fg-dim" />
                  <span className="min-w-0">
                    {t} <span className="text-brand">@2:41</span>
                  </span>
                </span>
              ))}
            </>
          )}
          {kind === "ask" && (
            <>
              <p className="ml-auto w-fit rounded-lg bg-white/10 px-3 py-1.5 text-[12px] text-fg">
                What did we promise BrightCode?
              </p>
              <Line w="w-full" />
              <Line w="w-10/12" />
              <span className="block text-[11px] text-brand">
                &ldquo;Trial on the October run&rdquo; @5:56
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Line({ w, strong = false }: { w: string; strong?: boolean }) {
  return <span className={`block h-2.5 rounded ${w} ${strong ? "bg-white/40" : "bg-white/15"}`} />;
}
