import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-[var(--detail-max)] grid-cols-1 gap-7 pt-6 lg:grid-cols-[662px_minmax(0,1fr)]">
      <div>
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="mt-2 space-y-4 rounded-xl bg-content p-6">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
      <div className="space-y-4 pt-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
