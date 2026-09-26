"use client";

import { AlertCircle, Check, Info, X } from "lucide-react";
import { dismissToast, holdToast, releaseToast, useToasts } from "@/lib/toast";
import { BrandSpinner } from "./BrandLoader";

/**
 * Toast stack, mounted once in the root layout.
 *
 * Fixed to the bottom-right and rendered outside any page content, so nothing
 * on a page needs to wrap itself in a provider to raise one.
 *
 * Every colour comes from a token, including the error state, which used to be
 * a hard-coded red-400 -- the one thing on screen that ignored the theme and
 * sat at the same value on paper as it did at midnight.
 *
 * Hovering holds the toast open. A message that vanishes mid-sentence is a
 * message that did not arrive, and the usual reason somebody is still looking
 * at one is that they have not finished it.
 */
export function Toaster() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-5 bottom-5 z-[200] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2.5"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.status === "error" ? "alert" : undefined}
          onMouseEnter={() => holdToast(t.id)}
          onMouseLeave={() => releaseToast(t.id)}
          onFocusCapture={() => holdToast(t.id)}
          onBlurCapture={() => releaseToast(t.id)}
          className="group pointer-events-auto overflow-hidden rounded-xl border border-line bg-overlay shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)]"
          style={{ animation: "toast-in 260ms var(--cue-ease) both" }}
        >
          <div className="flex items-start gap-3 px-4 py-3.5">
            <span className="mt-0.5 shrink-0">
              {t.status === "loading" && <BrandSpinner size={20} />}
              {t.status === "success" && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-positive">
                  <Check className="h-3 w-3 text-[var(--cue-bg)]" strokeWidth={3} />
                </span>
              )}
              {t.status === "info" && <Info className="h-5 w-5 text-accent" strokeWidth={2} />}
              {t.status === "error" && <AlertCircle className="h-5 w-5 text-critical" />}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-text">{t.title}</span>
              {t.description && (
                <span className="mt-0.5 block text-[12px] leading-snug text-muted">
                  {t.description}
                </span>
              )}
            </span>

            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
              className="shrink-0 rounded p-0.5 text-faint transition-colors hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* How long is left. Paused with the toast on hover, for the same
              reason the dismissal is. */}
          {t.status !== "loading" && (
            <span className="block h-[3px] w-full bg-surface">
              <span
                className="block h-full origin-left bg-mark group-hover:[animation-play-state:paused]"
                style={{
                  animation: `toast-life ${t.duration ?? 4000}ms linear both`,
                }}
              />
            </span>
          )}

          {t.status === "loading" && (
            <span className="block h-[3px] w-full bg-surface">
              <span
                className="block h-full bg-accent transition-[width] duration-150"
                style={
                  t.progress === undefined
                    ? { width: "40%", animation: "toast-indeterminate 1.1s ease-in-out infinite" }
                    : { width: `${Math.round(t.progress * 100)}%` }
                }
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
