import { Skeleton, KpiSkeleton, TableSkeleton } from "@/components/ui";

export default function EvidenceLoading() {
  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-2 h-6 w-56" />
          <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <TableSkeleton rows={10} />
    </div>
  );
}
