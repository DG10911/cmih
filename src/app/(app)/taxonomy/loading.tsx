import { Skeleton, CardSkeleton, TableSkeleton } from "@/components/ui";

export default function TaxonomyLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-6 w-80" />
        <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton rows={6} />
    </div>
  );
}
