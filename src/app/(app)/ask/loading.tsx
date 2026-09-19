import { Skeleton, SkeletonText } from "@/components/ui";

export default function AskLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-6 w-64" />
        <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-12 w-full rounded-card" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-56 rounded-full" />
        ))}
      </div>
      <div className="rounded-card border border-border bg-surface p-4">
        <SkeletonText lines={3} />
        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
