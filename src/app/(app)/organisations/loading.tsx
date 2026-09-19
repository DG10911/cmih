import { CardSkeleton, Skeleton } from "@/components/ui";

export default function OrganisationsExplorerLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-2 h-6 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-4">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
