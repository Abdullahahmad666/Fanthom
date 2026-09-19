"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

export type PlayerMenuOption<T extends string | number> = {
  value: T;
  label: string;
  hint?: string;
  icon?: ReactNode;
};

/**
 * Small menu for the player controls, opened on hover and on click.
 *
 * Opens upward, since the controls sit at the bottom edge of the video, and
 * stays inside the player rather than portalling -- it is part of the control
 * bar, and there is nothing above it to clip against.
 *
 * Hover alone would be unusable from a keyboard, so the trigger is a real
 * button: click toggles, focus opens, Escape closes.
 */
export function PlayerMenu<T extends string | number>({
  value,
  options,
  onChange,
  label,
  trigger,
}: {
  value: T;
  options: PlayerMenuOption<T>[];
  onChange: (v: T) => void;
  label: string;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  /* Small grace period, so moving the pointer from the button to the menu
     does not dismiss it. */
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onFocus={() => setOpen(true)}
        className="flex items-center text-white"
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className="absolute right-0 bottom-full z-30 mb-2 min-w-[170px] overflow-hidden rounded-lg bg-[#111314]/95 py-1 ring-1 ring-white/15 backdrop-blur"
        >
          <p className="px-3 py-1.5 text-[10px] tracking-[0.08em] text-fg-dim uppercase">
            {label}
          </p>
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={String(o.value)}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/10 ${
                  active ? "text-brand" : "text-fg"
                }`}
              >
                <Check className={`h-3.5 w-3.5 shrink-0 ${active ? "" : "opacity-0"}`} />
                {o.icon}
                <span className="flex-1">{o.label}</span>
                {o.hint && <span className="text-[11px] text-fg-dim">{o.hint}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
