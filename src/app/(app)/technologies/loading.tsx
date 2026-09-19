import { Skeleton, CardSkeleton } from "@/components/ui";

export default function TechnologiesLoading() {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-2 h-6 w-56" />
          <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="mb-5 space-y-3">
        <Skeleton className="h-9 w-80 rounded-md" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-14 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
