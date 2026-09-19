import { Skeleton, CardSkeleton } from "@/components/ui";

/** Global Search loading skeleton — mirrors the header + result grid (spec §54). */
export default function SearchLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <Skeleton className="h-12 w-full rounded-card" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-32 rounded-full" />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
