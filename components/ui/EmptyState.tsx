import { CircleSlash } from "lucide-react";

/**
 * Full-page empty state, as shown on My Calls with no recordings: a small
 * circle-slash glyph and muted ~28px copy, centered. No illustration and no
 * call-to-action button -- the product deliberately has neither.
 */
export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-28 text-fg-muted">
      <CircleSlash className="h-7 w-7" strokeWidth={1.5} />
      <p className="text-[24px] font-normal">{label}</p>
    </div>
  );
}

/**
 * The house inline empty state: muted italic copy in a rounded surface box.
 * Used for rail sections such as ACTION ITEMS.
 */
export function EmptyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-4 text-[13px] leading-relaxed text-fg-muted italic">
      {children}
    </div>
  );
}
