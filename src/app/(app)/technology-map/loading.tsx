import { Skeleton, ChartSkeleton } from "@/components/ui";

export default function TechnologyMapLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-2 h-6 w-56" />
          <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-14 rounded-full" />
        ))}
      </div>
      <ChartSkeleton />
      <div className="space-y-4 rounded-card border border-border bg-surface p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
