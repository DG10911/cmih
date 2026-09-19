import { CardSkeleton, Skeleton } from "@/components/ui";

export default function PatentDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-7 w-2/3" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
