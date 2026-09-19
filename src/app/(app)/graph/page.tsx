"use client";
import { SectionHeader, DemoBadge } from "@/components/ui";
import { KnowledgeGraph } from "@/components/graph/knowledge-graph";

export default function GraphPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <SectionHeader
        eyebrow="Technology Landscape"
        title="Knowledge Graph"
        subtitle="Explore how minerals, technologies, patents, R&D projects, organisations and publications connect — a demo subgraph focused on the lithium and rare-earth ecosystems."
        action={<DemoBadge />}
      />
      <KnowledgeGraph />
    </div>
  );
}
