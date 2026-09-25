import { Skeleton } from "@/components/ui/Skeleton";

/**
 * The meeting page, in outline.
 *
 * A centred spinner tells you to wait; this tells you what is coming and puts
 * it exactly where it will land, so nothing jumps when the query returns. The
 * two-column split matches the real layout at xl, including the rail.
 */
export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-7 pt-6 xl:grid-cols-[662px_minmax(0,1fr)]">
      <div className="min-w-0">
        {/* Player */}
        <Skeleton className="aspect-video w-full rounded-xl" />

        <div className="mt-2 overflow-hidden rounded-xl bg-content">
          {/* Tab row */}
          <div className="flex gap-7 border-b border-line px-6 pt-4 pb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Template controls, then the summary itself */}
          <div className="px-6 py-4">
            <div className="flex gap-3">
              <Skeleton className="h-9 w-44 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>

            <div className="mt-7 space-y-7">
              {[0, 1, 2].map((section) => (
                <div key={section}>
                  <Skeleton className="h-4 w-36" />
                  <div className="mt-3 space-y-2.5">
                    {[0, 1, 2].map((line) => (
                      <Skeleton
                        key={line}
                        className="h-3.5"
                        // Ragged widths: a stack of identical bars reads as a
                        // table, not as prose about to arrive.
                        style={{ width: `${92 - line * 13 - section * 4}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rail */}
      <div className="hidden min-w-0 space-y-6 pt-1 xl:block">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="space-y-3 pt-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
