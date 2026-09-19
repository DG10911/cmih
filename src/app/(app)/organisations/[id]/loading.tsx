import { Skeleton, KpiSkeleton, TableSkeleton } from "@/components/ui";

export default function OrganisationProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-6 w-80" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <div className="rounded-card border border-border bg-surface p-4">
        <Skeleton className="h-3 w-32" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}
