import { Skeleton, KpiSkeleton, TableSkeleton, CardSkeleton } from "@/components/ui";

export default function SourcesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-2 h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <TableSkeleton rows={8} />
        <CardSkeleton />
      </div>
    </div>
  );
}
