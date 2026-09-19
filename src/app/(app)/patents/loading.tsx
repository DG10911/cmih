import { KpiSkeleton, TableSkeleton } from "@/components/ui";

export default function PatentsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="skeleton mb-2 h-3 w-32 rounded-md" />
        <div className="skeleton h-6 w-56 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <TableSkeleton rows={8} />
    </div>
  );
}
