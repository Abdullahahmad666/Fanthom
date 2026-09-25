import { Construction } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Honest placeholder for tabs that exist in the product but are out of scope
 * for this prototype. Better than a dead tab that silently does nothing.
 */
export function NotInPrototype({ title }: { title: string }) {
  return (
    <Reveal className="flex flex-col items-center justify-center gap-3 py-28 text-center">
      <Construction className="h-7 w-7 text-fg-dim" strokeWidth={1.5} />
      <p className="text-[19px] text-fg-muted">{title}</p>
      <p className="max-w-sm text-[13px] text-fg-dim">
        Out of scope for this prototype. The build focuses on My Calls and the
        meeting detail experience.
      </p>
    </Reveal>
  );
}
