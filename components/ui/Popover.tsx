"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Menu popover. One component serves both the call-card overflow menu and the
 * transcript row menu -- they differ only in items and alignment.
 *
 * Near-black fill rather than a drop shadow, which is how the product separates
 * floating surfaces from the page (docs/UI-SPEC.md 1.4).
 */
export function Popover({
  trigger,
  children,
  align = "right",
  className = "",
}: {
  trigger: (props: { open: boolean; toggle: (e: React.MouseEvent) => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {trigger({
        open,
        toggle: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        },
      })}
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-2 min-w-[240px] rounded-lg bg-popover py-2 ring-1 ring-line ${
            align === "right" ? "right-0" : "left-0"
          } ${className}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

/** Menu row. Supports the product's two-line item (label + description). */
export function MenuItem({
  icon,
  label,
  description,
  onClick,
  danger = false,
}: {
  icon?: ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface"
    >
      {icon && <span className={`mt-0.5 ${danger ? "text-red-400" : "text-fg-muted"}`}>{icon}</span>}
      <span className="min-w-0">
        <span className={`block text-[13px] font-semibold ${danger ? "text-red-400" : "text-fg"}`}>
          {label}
        </span>
        {description && <span className="block text-[12px] text-fg-muted">{description}</span>}
      </span>
    </button>
  );
}
