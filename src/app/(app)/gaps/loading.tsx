import { CardSkeleton, ChartSkeleton, Skeleton } from "@/components/ui";

export default function GapsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-2 h-6 w-[28rem] max-w-full" />
        <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      <ChartSkeleton className="h-[420px]" />
    </div>
  );
}
