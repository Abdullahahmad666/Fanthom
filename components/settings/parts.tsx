"use client";

import type { ReactNode } from "react";

/**
 * Shared furniture for the settings page.
 *
 * Every section below the video-conferencing block is the same row: an icon,
 * a title that may carry a badge, a line of explanation, and one control on
 * the right. Keeping that in one place is what stops eight sections drifting
 * apart.
 */

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        on ? "bg-brand" : "bg-bubble"
      }`}
    >
      <span
        className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white transition-all ${
          on ? "left-6" : "left-1"
        }`}
      >
        {on ? (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-brand" aria-hidden>
            <path d="M2.5 6.2 4.8 8.5 9.5 3.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-fg-dim" aria-hidden>
            <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

/** The grey RECOMMENDED / PREVIEW chips beside a setting's name. */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-raised px-2 py-[3px] align-middle text-[11px] font-semibold tracking-wide text-fg-muted uppercase">
      {children}
    </span>
  );
}

/** The blue-on-tinted action button the settings rows use for everything. */
export function ActionButton({
  children,
  onClick,
  href,
  tone = "brand",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  tone?: "brand" | "success" | "danger";
}) {
  const tones = {
    brand: "bg-accentsoft text-brand hover:bg-[#27404d]",
    success: "bg-[#14301f] text-success",
    danger: "bg-[#3a1418] text-red-400 hover:bg-[#4a181d]",
  };
  const className = `flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold transition-colors ${tones[tone]}`;

  return href ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

/**
 * One settings card. `starred` puts the amber star on the corner the product
 * uses to mark the settings it most wants you to turn on.
 */
export function SettingCard({
  icon,
  title,
  badge,
  body,
  control,
  starred = false,
}: {
  icon?: ReactNode;
  title: ReactNode;
  badge?: ReactNode;
  body?: ReactNode;
  control?: ReactNode;
  starred?: boolean;
}) {
  return (
    <section className="relative flex items-center gap-4 rounded-xl bg-surface px-5 py-4">
      {starred && (
        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber text-[12px] text-black">
          ★
        </span>
      )}
      {icon && <span className="shrink-0 text-fg-muted">{icon}</span>}

      <div className="min-w-0 flex-1">
        <h3 className="flex flex-wrap items-center gap-2 text-[16px] font-bold text-fg">
          {title}
          {badge}
        </h3>
        {body && <p className="mt-1 text-[14px] leading-snug text-fg-muted">{body}</p>}
      </div>

      {control}
    </section>
  );
}
