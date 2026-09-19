import { Skeleton, SkeletonText, KpiSkeleton, ChartSkeleton, TableSkeleton } from "@/components/ui";

export default function TechnologyDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-2 h-7 w-72" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <SkeletonText lines={2} className="max-w-2xl" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      <ChartSkeleton />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <TableSkeleton key={i} rows={4} />
        ))}
      </div>
    </div>
  );
}
