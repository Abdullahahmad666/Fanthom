import type { ReactNode } from "react";

/**
 * Salesforce and HubSpot marks, used wherever the product shows CRM sync.
 * Simplified single-path versions -- these are decorative badges at 16-40px,
 * where the official multi-path logos render as mud.
 */

export function SalesforceMark({ className = "h-4 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 17" className={className} aria-hidden>
      <path
        fill="#00A1E0"
        d="M9.9 1.9A4.2 4.2 0 0 1 16.8 3a5 5 0 0 1 2.1-.5 5 5 0 0 1 0 10 5 5 0 0 1-1-.1 3.6 3.6 0 0 1-4.8 1.5 4.2 4.2 0 0 1-7.7-.6 3.9 3.9 0 0 1-.8.1 3.8 3.8 0 0 1-1.9-7.1A4.4 4.4 0 0 1 9.9 1.9Z"
      />
    </svg>
  );
}

export function HubspotMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#FF7A59"
        d="M17.2 8.1V5.8a1.8 1.8 0 1 0-1.8-1.8v.1l-5.6 3.3a4 4 0 0 0-1.5-.6V2.3H6.5v4.5a4 4 0 1 0 2.9 7.3l4.8 3.6a2.4 2.4 0 1 0 1-1.3l-4.7-3.6a4 4 0 0 0 .3-1.3l5.7-3.4Zm2.1 8.8a1.6 1.6 0 1 1-1.6 1.6 1.6 1.6 0 0 1 1.6-1.6ZM8 13.4a2.4 2.4 0 1 1 2.4-2.4A2.4 2.4 0 0 1 8 13.4Z"
      />
    </svg>
  );
}

/** White disc the marks sit on, ringed so it reads against any surface. */
export function CrmBadge({
  children,
  size = 44,
  ring = "ring-canvas",
}: {
  children: ReactNode;
  size?: number;
  ring?: string;
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-white ring-4 ${ring}`}
    >
      {children}
    </span>
  );
}
