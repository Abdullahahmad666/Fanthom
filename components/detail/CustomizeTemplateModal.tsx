"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { BrandSpinner } from "@/components/ui/BrandLoader";

const MAX = 1024;

const PLACEHOLDER = `ex: "Increase detail",
"Prefix each bullet point with its topic+colon in bold";"Append a 'Misc' topic with everything not already covered"`;

/**
 * "Customize <template> Template".
 *
 * Portalled, because the summary panel it is opened from scrolls and sits
 * inside a transformed ancestor -- either would trap a position:fixed dialog.
 *
 * The button holds a spinner for a beat before the modal closes, so the click
 * has an acknowledgement of its own; the long progress then runs in the
 * summary tab where the result will land.
 */
export function CustomizeTemplateModal({
  templateLabel,
  onRegenerate,
  onClose,
}: {
  templateLabel: string;
  onRegenerate: (instruction: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
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
  }, [busy, onClose]);

  const submit = () => {
    const instruction = text.trim();
    if (!instruction || busy) return;
    setBusy(true);
    setTimeout(() => {
      onRegenerate(instruction);
      onClose();
    }, 600);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${templateLabel} template`}
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 p-6"
    >
      <div className="w-full max-w-[680px] rounded-xl bg-[#1b1b20] px-9 py-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
        <div className="flex items-start gap-4">
          <h2 className="min-w-0 flex-1 text-[27px] font-bold text-fg">
            Customize {templateLabel} Template
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="mt-1 shrink-0 text-fg-muted transition-colors hover:text-fg disabled:opacity-40"
          >
            <X className="h-6 w-6" strokeWidth={1.8} />
          </button>
        </div>

        <p className="mt-5 text-[16px] leading-snug text-fg-muted">
          Provide feedback to the AI on how you&apos;d like your summary to differ from the
          default output.
        </p>

        <label htmlFor="tpl-instruction" className="mt-7 block text-[16px] text-fg">
          Write your instruction
        </label>

        <textarea
          id="tpl-instruction"
          autoFocus
          rows={4}
          maxLength={MAX}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          className="mt-2.5 w-full resize-none rounded-lg bg-content px-4 py-3 text-[15px] leading-relaxed text-fg ring-1 ring-brand placeholder:text-fg-dim focus:outline-none"
        />

        <p className="mt-2 text-right text-[15px] text-fg-muted tabular-nums">
          {text.length} / {MAX}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim() || busy}
            className="flex items-center gap-2 rounded-lg bg-[#7fc4f5] px-6 py-3 text-[17px] font-semibold text-[#0b1418] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {busy && <BrandSpinner size={18} />}
            {busy ? "Sending…" : "Regenerate Summary"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
