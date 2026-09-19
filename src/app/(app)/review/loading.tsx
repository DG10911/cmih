import { Skeleton, CardSkeleton } from "@/components/ui";

export default function ReviewQueueLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-52" />
        <Skeleton className="mt-2 h-6 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
