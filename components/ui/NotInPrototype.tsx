import { Construction } from "lucide-react";

/**
 * Honest placeholder for tabs that exist in the product but are out of scope
 * for this prototype. Better than a dead tab that silently does nothing.
 */
export function NotInPrototype({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-28 text-center">
      <Construction className="h-7 w-7 text-fg-dim" strokeWidth={1.5} />
      <p className="text-[22px] text-fg-muted">{title}</p>
      <p className="max-w-sm text-[15px] text-fg-dim">
        Out of scope for this prototype. The build focuses on My Calls and the
        meeting detail experience.
      </p>
    </div>
  );
}
