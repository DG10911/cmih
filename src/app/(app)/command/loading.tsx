import { Card, CardHeader, CardBody, KpiSkeleton, ChartSkeleton, Skeleton, SkeletonText } from "@/components/ui";

function PanelSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="w-full">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-5 w-48" />
        </div>
      </CardHeader>
      <CardBody>
        <SkeletonText lines={4} />
      </CardBody>
    </Card>
  );
}

/** Command Center loading skeleton — mirrors the real layout (spec §54). */
export default function CommandCenterLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-3 w-56" />
        <Skeleton className="mt-2 h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      <ChartSkeleton className="w-full" />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <PanelSkeleton />
        </div>
        <div className="lg:col-span-5">
          <PanelSkeleton />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <PanelSkeleton />
        </div>
        <div className="lg:col-span-5">
          <PanelSkeleton />
        </div>
      </div>
    </div>
  );
}
