import { Skeleton, SkeletonText, CardSkeleton } from "@/components/ui";

export default function GapDetailLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-48" />
        <Skeleton className="mt-2 h-6 w-96 max-w-full" />
        <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
      </div>
      <div className="rounded-card border border-border bg-surface p-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-full rounded-full" />
          ))}
        </div>
      </div>
      <CardSkeleton />
      <SkeletonText lines={4} />
    </div>
  );
}
