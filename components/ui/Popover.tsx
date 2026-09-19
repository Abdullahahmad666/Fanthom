"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Coords = { top: number; left?: number; right?: number };

/**
 * Menu popover. One component serves the call-card overflow menu, the
 * transcript row menus and the rail menus.
 *
 * The panel renders through a portal on document.body rather than inline.
 * Inline, it was being clipped by whatever it sat inside -- the card's
 * overflow-hidden, and the transcript's own scroll container -- so menus
 * appeared cut off or invisible.
 *
 * Near-black fill rather than a drop shadow, which is how the product
 * separates floating surfaces from the page (docs/UI-SPEC.md 1.4).
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
  const [coords, setCoords] = useState<Coords | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelH = panelRef.current?.offsetHeight ?? 200;
    const below = window.innerHeight - r.bottom;
    // Flip above the trigger when there is not room beneath it.
    const top = below < panelH + 16 && r.top > panelH + 16 ? r.top - panelH - 8 : r.bottom + 8;

    setCoords(
      align === "right"
        ? { top, right: Math.max(8, window.innerWidth - r.right) }
        : { top, left: Math.max(8, r.left) },
    );
  }, [align]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!anchorRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    // Track the trigger if anything behind the menu scrolls or resizes.
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  const close = () => setOpen(false);

  return (
    <div ref={anchorRef} className="relative">
      {trigger({
        open,
        toggle: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        },
      })}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: coords?.top ?? -9999,
              left: coords?.left,
              right: coords?.right,
              visibility: coords ? "visible" : "hidden",
            }}
            className={`z-[100] min-w-[240px] rounded-lg bg-popover py-2 ring-1 ring-line ${className}`}
          >
            {children(close)}
          </div>,
          document.body,
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
