/**
 * Skeletons rather than spinners: grey blocks at the final geometry, so the
 * page does not reflow when content lands (docs/UI-SPEC.md 7.3).
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

export function CallCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-raised">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex h-[70px] items-center gap-3 px-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}
