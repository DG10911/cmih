import { Skeleton, ChartSkeleton, CardSkeleton } from "@/components/ui";

export default function EmergingLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-6 w-[30rem] max-w-full" />
        <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
      </div>

      <ChartSkeleton className="h-[420px]" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
