import { SectionHeader, Card, CardHeader, CardBody, DemoBadge } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { PipelineFlow } from "@/components/system/pipeline-flow";
import { DataQualityPanel } from "@/components/system/data-quality-panel";
import { PIPELINE_STAGES, DATA_QUALITY } from "@/lib/data";

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <SectionHeader
          eyebrow="Pipeline Monitor"
          title="Ingestion → Analytics Pipeline"
          subtitle="How records move from raw sources to the knowledge graph — with per-stage throughput and error counts. Demo pipeline run."
          action={<DemoBadge />}
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card>
          <CardHeader>
            <div>
              <div className="text-sm font-semibold text-ink">Stage Flow</div>
              <p className="mt-0.5 text-2xs text-ink-soft">
                Sources → Ingestion → Normalization → Classification → Entity Resolution → Deduplication →
                Knowledge Graph → Analytics
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <PipelineFlow stages={PIPELINE_STAGES} />
          </CardBody>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <div>
              <div className="text-sm font-semibold text-ink">Data Quality</div>
              <p className="mt-0.5 text-2xs text-ink-soft">Prototype quality metrics over the current pipeline run</p>
            </div>
          </CardHeader>
          <CardBody>
            <DataQualityPanel metrics={DATA_QUALITY} />
          </CardBody>
        </Card>
      </FadeIn>
    </div>
  );
}
