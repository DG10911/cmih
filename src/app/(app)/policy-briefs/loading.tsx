import { Skeleton, CardSkeleton } from "@/components/ui";

export default function PolicyBriefsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-2 h-6 w-64" />
        <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      </div>
      <div className="rounded-card border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </div>
      <CardSkeleton />
    </div>
  );
}
