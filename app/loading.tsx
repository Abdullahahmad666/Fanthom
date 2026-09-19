import { CallCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="px-8 pt-6">
      <Skeleton className="mb-4 h-6 w-24" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,500px))] gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <CallCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
