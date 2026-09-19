import { SectionHeader, GraphSkeleton, Skeleton, CardSkeleton } from "@/components/ui";

export default function GraphLoading() {
  return (
    <div className="flex h-full flex-col gap-4">
      <SectionHeader eyebrow="Technology Landscape" title="Knowledge Graph" subtitle="Loading the demo subgraph…" />
      <div className="grid h-[calc(100vh-190px)] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_320px]">
        <div className="space-y-4">
          <CardSkeleton />
          <Skeleton className="h-24 w-full rounded-card" />
        </div>
        <GraphSkeleton className="min-h-[420px]" />
        <CardSkeleton />
      </div>
    </div>
  );
}
