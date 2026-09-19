import { Skeleton, SkeletonText, TableSkeleton } from "@/components/ui";

export default function RDDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="rounded-card border border-border bg-surface p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="rounded-card border border-border bg-surface p-4">
        <SkeletonText lines={4} />
      </div>
      <TableSkeleton rows={4} />
      <TableSkeleton rows={4} />
    </div>
  );
}
