"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { FathomWordmark } from "@/components/brand/FathomMark";
import { BrandSpinner } from "@/components/ui/BrandLoader";

/**
 * The Book a Demo form.
 *
 * A near-fullscreen typeform: one question at a time, a progress rail across
 * the top, and the chevron pair bottom-right for stepping between them. It
 * ends on a trial offer rather than a calendar, which is what the product
 * does once you have answered.
 *
 * Portalled to the body so nothing on the marketing page can clip it, and the
 * page behind is scroll-locked with the scrollbar width compensated, so
 * opening it does not shift the layout underneath.
 */

const AUDIENCES = ["Just myself", "My team", "I need something else"];

/** Rough enough to catch a typo, loose enough not to argue about valid ones. */
const looksLikeEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** 0 is the short load the product shows before the first question. */
type Step = 0 | 1 | 2 | 3;

const LOAD_MS = 1100;

export function BookDemoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [audience, setAudience] = useState(AUDIENCES[0]);

  const emailOk = looksLikeEmail(email);

  /* Let the shell settle before the first question, the way the product
     does. Nothing is being fetched; it is there so the form does not slam
     into view mid-open. */
  useEffect(() => {
    const t = setTimeout(() => setStep(1), LOAD_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const canGoUp = step > 1 && step < 3;
  const canGoDown = step === 1 ? emailOk : false;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a demo"
      className="fixed inset-0 z-[300] bg-black/90"
    >
      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
        <div className="relative flex h-[min(620px,88vh)] w-full max-w-[860px] flex-col overflow-hidden rounded-xl bg-[#1b1b1b] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
          {/* On the panel rather than the screen corner, now that the panel
              no longer fills the viewport. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-4 z-10 text-white/60 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>

          {/* Progress rail. Gone on the last card, which is an offer rather
            than a question. */}
          {step < 3 && (
            <div className="h-[3px] w-full shrink-0 bg-white/15">
              <div
                style={
                  step === 0
                    ? {
                        /* Width is also set here so the bar does not flash
                           full-width for a frame before the keyframes run. */
                        width: "25%",
                        animation: "toast-indeterminate 1.1s ease-in-out infinite",
                      }
                    : { width: step === 1 ? "20%" : "100%" }
                }
                className="h-full bg-[#5b9bf8] transition-[width] duration-500 ease-out"
              />
            </div>
          )}

          <div className="flex min-h-0 flex-1 flex-col items-center px-8 pt-9 pb-5">
            <FathomWordmark size={23} />

            <div className="mt-10 w-full max-w-[620px] flex-1 overflow-y-auto">
              {step === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-4 pb-10">
                  <BrandSpinner size={30} />
                  <p className="text-[14px] text-fg-muted">
                    Setting up your demo…
                  </p>
                </div>
              )}

              {step === 1 && (
                <Card>
                  <Question n={1}>
                    Thanks for your interest in Fathom! What is your business
                    email?
                    <span className="text-fg-muted">*</span>
                  </Question>
                  <p className="mt-2.5 text-[16px] text-fg-muted">
                    We&apos;ll use this to personalize your demo to your
                    business. We don&apos;t spam.
                  </p>

                  <input
                    autoFocus
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && emailOk && setStep(2)
                    }
                    placeholder="name@company.com"
                    aria-label="Business email"
                    className="mt-10 w-full border-b-2 border-[#5b9bf8] bg-transparent pb-2.5 text-[22px] text-[#5b9bf8] placeholder:text-[#5b9bf8]/40 focus:outline-none"
                  />

                  <button
                    type="button"
                    disabled={!emailOk}
                    onClick={() => setStep(2)}
                    className="mt-10 rounded-md bg-[#7fb0f7] px-7 py-3 text-[15px] font-bold text-[#0b1220] transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    OK
                  </button>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <Question n={2}>
                    Who are you looking to explore Fathom for?
                  </Question>

                  <div className="relative mt-10">
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      aria-label="Who are you exploring Fathom for"
                      className="w-full appearance-none border-b-2 border-[#5b9bf8] bg-transparent pb-2.5 text-[22px] text-[#5b9bf8] focus:outline-none"
                    >
                      {AUDIENCES.map((a) => (
                        <option
                          key={a}
                          value={a}
                          className="bg-[#1b1b1b] text-fg"
                        >
                          {a}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 bottom-4 h-6 w-6 text-[#5b9bf8]" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="mt-10 rounded-md bg-[#7fb0f7] px-7 py-3 text-[17px] font-bold text-[#0b1220] transition-opacity hover:opacity-90"
                  >
                    Submit
                  </button>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <div className="mx-auto max-w-[760px] text-center">
                    <h2 className="text-[30px] font-bold text-fg">
                      Get started even faster!
                    </h2>
                    <p className="mt-4 text-[17px] leading-relaxed text-fg">
                      Based on what you&apos;ve shared, you can get started
                      right away with a Fathom trial. Want to explore more?
                      Check out all of Fathom&apos;s plans and features at{" "}
                      <a
                        href="https://fathom.video/pricing"
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        fathom.ai/pricing
                      </a>
                      .
                    </p>
                    <Link
                      href="/signup"
                      className="mt-8 inline-block rounded-md bg-[#7fb0f7] px-7 py-3.5 text-[18px] font-bold text-[#0b1220] transition-opacity hover:opacity-90"
                    >
                      Start a Premium Trial
                    </Link>
                  </div>
                </Card>
              )}
            </div>

            {step > 0 && step < 3 && (
              <div className="mt-4 ml-auto flex shrink-0 items-center gap-1">
                <NavButton
                  label="Previous question"
                  enabled={canGoUp}
                  onClick={() => setStep(1)}
                >
                  <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
                </NavButton>
                <NavButton
                  label="Next question"
                  enabled={canGoDown}
                  onClick={() => setStep(2)}
                >
                  <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
                </NavButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ animation: "fade-rise 380ms ease-out both" }}>{children}</div>
  );
}

/** The blue index chip the product puts in front of each question. */
function Question({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex gap-3 text-[24px] leading-[1.3] font-bold text-fg">
      <span className="mt-2 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[3px] bg-[#5b9bf8] text-[10px] font-bold text-[#0b1220]">
        {n}
      </span>
      <span>{children}</span>
    </h2>
  );
}

function NavButton({
  label,
  enabled,
  onClick,
  children,
}: {
  label: string;
  enabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!enabled}
      onClick={onClick}
      className={`flex h-[42px] w-[48px] items-center justify-center rounded ${
        enabled
          ? "bg-[#7fb0f7] text-[#0b1220] hover:opacity-90"
          : "bg-[#243246] text-white/35"
      }`}
    >
      {children}
    </button>
  );
}
