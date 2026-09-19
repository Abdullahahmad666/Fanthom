"use client";

import { AlertCircle, Check, X } from "lucide-react";
import { dismissToast, useToasts } from "@/lib/toast";
import { BrandSpinner } from "./BrandLoader";

/**
 * Toast stack, mounted once in the root layout.
 *
 * Fixed to the bottom-right and rendered outside any page content, so nothing
 * on a page needs to wrap itself in a provider to raise one.
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
          className="pointer-events-auto overflow-hidden rounded-xl bg-raised shadow-2xl ring-1 ring-line"
          style={{ animation: "toast-in 220ms ease-out both" }}
        >
          <div className="flex items-start gap-3 px-4 py-3.5">
            <span className="mt-0.5 shrink-0">
              {t.status === "loading" && <BrandSpinner size={20} />}
              {t.status === "success" && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
                  <Check className="h-3 w-3 text-black" strokeWidth={3} />
                </span>
              )}
              {t.status === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-fg">{t.title}</span>
              {t.description && (
                <span className="mt-0.5 block text-[12px] leading-snug text-fg-muted">
                  {t.description}
                </span>
              )}
            </span>

            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
              className="shrink-0 rounded p-0.5 text-fg-dim transition-colors hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {t.status === "loading" && (
            <span className="block h-[3px] w-full bg-surface">
              <span
                className="block h-full bg-brand transition-[width] duration-150"
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
