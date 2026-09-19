import { SectionHeader, CardSkeleton, Skeleton } from "@/components/ui";

export default function CollaborationLoading() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Complementary Capability"
        title="Collaboration Intelligence"
        subtitle="Loading complementary capability signals…"
      />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
