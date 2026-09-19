import { CardSkeleton, Skeleton } from "@/components/ui";

export default function RDExplorerLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-2 h-6 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="rounded-card border border-border bg-surface p-4">
        <Skeleton className="h-9 w-full" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
