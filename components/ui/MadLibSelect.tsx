"use client";

import { ChevronDown } from "lucide-react";
import { Popover } from "./Popover";

/**
 * Inline dropdown inside a sentence -- the "I work in [Engineering] as [an
 * individual contributor]" pattern the product uses throughout onboarding and
 * settings instead of a form.
 */
export function MadLibSelect({
  value,
  options,
  onChange,
  size = "lg",
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  size?: "lg" | "md";
}) {
  const text = size === "lg" ? "text-[20px]" : "text-[15px]";
  const pad = size === "lg" ? "px-5 py-3" : "px-4 py-2";

  return (
    <Popover
      align="left"
      className="max-h-[320px] min-w-[260px] overflow-y-auto"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className={`inline-flex items-center gap-2 rounded-xl bg-field ${pad} ${text} text-fg transition-colors hover:bg-bubble`}
        >
          {value}
          <ChevronDown className="h-5 w-5 shrink-0 text-fg-muted" />
        </button>
      )}
    >
      {(close) => (
        <div className="py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                close();
              }}
              className={`block w-full px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-surface ${
                opt === value ? "text-brand" : "text-fg"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}

/** Large pill button used for Continue across the flow. */
export function ContinueButton({
  children = "Continue",
  disabled,
  onClick,
  variant = "filled",
}: {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "filled" | "outline";
}) {
  const base =
    "flex h-[60px] w-full max-w-[560px] items-center justify-center rounded-lg text-[15px] font-medium transition-colors";

  if (disabled) {
    return (
      <button type="button" disabled className={`${base} cursor-not-allowed bg-surface text-fg-dim`}>
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        variant === "filled"
          ? `${base} bg-brand text-black hover:bg-[#33cbff]`
          : `${base} border border-brand text-brand hover:bg-brand/10`
      }
    >
      {children}
    </button>
  );
}
