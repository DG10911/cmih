import { Skeleton, CardSkeleton } from "@/components/ui";

export default function PipelineLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-2 h-6 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="rounded-card border border-border bg-surface p-4">
        <Skeleton className="h-3 w-40" />
        <div className="mt-4 flex flex-col gap-3 lg:flex-row">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 flex-1" />
          ))}
        </div>
      </div>
      <CardSkeleton />
    </div>
  );
}
