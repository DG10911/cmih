import { Skeleton, KpiSkeleton, ChartSkeleton, TableSkeleton, CardSkeleton } from "@/components/ui";

export default function MineralProfileLoading() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_180px]">
      <div className="min-w-0 space-y-8">
        <div className="rounded-card border border-border bg-surface/60 p-5 sm:p-6">
          <Skeleton className="h-3 w-56" />
          <div className="mt-3 flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div>
              <Skeleton className="h-7 w-40" />
              <Skeleton className="mt-2 h-4 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
          <Skeleton className="mt-2 h-4 w-3/4 max-w-xl" />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <KpiSkeleton key={i} />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-4 w-32" />
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-24 shrink-0 rounded-md" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        <ChartSkeleton />
        <TableSkeleton rows={5} />
      </div>
      <div className="hidden lg:block">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
