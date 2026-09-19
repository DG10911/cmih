import { Skeleton, CardSkeleton } from "@/components/ui";

export default function AlertsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-2 h-6 w-64" />
          <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
