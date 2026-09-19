"use client";
import * as React from "react";
import { ListChecks, RotateCcw } from "lucide-react";
import { SectionHeader, Button, EmptyState, DemoBadge } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { ClassificationFlowHeader } from "@/components/system/classification-flow-header";
import { ReviewCard, type ReviewQueueItem, type ReviewDecision } from "@/components/system/review-card";
import { ReviewedList, type ReviewedItem } from "@/components/system/reviewed-list";
import { PATENTS, RD_PROJECTS } from "@/lib/data";
import { confidenceBand } from "@/lib/utils";

function buildInitialQueue(): ReviewQueueItem[] {
  const candidates: ReviewQueueItem[] = [
    ...PATENTS.map<ReviewQueueItem>((p) => ({
      id: p.id,
      kind: "Patent",
      title: p.title,
      href: `/patents/${p.id}`,
      organisation: p.applicants[0],
      confidence: p.provenance.confidence,
      signals: p.classification,
      originalMineral: p.mineral,
      originalTechnology: p.technology,
      originalStage: p.stage,
      mineral: p.mineral,
      technology: p.technology,
      stage: p.stage,
    })),
    ...RD_PROJECTS.map<ReviewQueueItem>((r) => ({
      id: r.id,
      kind: "R&D Project",
      title: r.title,
      href: `/rd/${r.id}`,
      organisation: r.organisation,
      confidence: r.provenance.confidence,
      signals: r.classification,
      originalMineral: r.mineral,
      originalTechnology: r.technology,
      originalStage: r.stage,
      mineral: r.mineral,
      technology: r.technology,
      stage: r.stage,
    })),
  ];

  // Review-recommended band first (spec §14: confidence 0.6-0.85), then
  // lowest confidence first as a fallback so the queue is never empty.
  const reviewBand = candidates.filter((c) => confidenceBand(c.confidence) === "Review");
  const pool = reviewBand.length > 0 ? reviewBand : candidates;
  return [...pool].sort((a, b) => a.confidence - b.confidence).slice(0, 12);
}

export default function ReviewQueuePage() {
  const initialQueue = React.useMemo(buildInitialQueue, []);
  const [queue, setQueue] = React.useState<ReviewQueueItem[]>(initialQueue);
  const [reviewed, setReviewed] = React.useState<ReviewedItem[]>([]);

  const handleFieldChange = React.useCallback(
    (id: string, field: "mineral" | "technology" | "stage", value: string) => {
      setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    },
    []
  );

  const handleAction = React.useCallback((id: string, decision: ReviewDecision) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      setReviewed((r) => [{ ...item, decision }, ...r]);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const resetQueue = React.useCallback(() => {
    setQueue(initialQueue);
    setReviewed([]);
  }, [initialQueue]);

  return (
    <div className="space-y-6">
      <FadeIn>
        <SectionHeader
          eyebrow="Classification Review Queue"
          title="Human-in-the-Loop Validation"
          subtitle="AI-classified patents and R&D projects with review-recommended confidence, queued for a human check. Accept, correct or flag — nothing here writes back to a live system."
          action={<DemoBadge />}
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <ClassificationFlowHeader />
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-2xs text-ink-faint">
            <ListChecks className="h-3.5 w-3.5" />
            {queue.length} in queue · {reviewed.length} reviewed this session
          </div>
          <Button variant="ghost" size="sm" onClick={resetQueue}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset demo queue
          </Button>
        </div>
      </FadeIn>

      {queue.length === 0 ? (
        <EmptyState
          title="Review queue cleared."
          hint="Every AI classification in this batch has been validated. Each correction is captured as training feedback for the next classification pass."
          actions={[{ label: "Reset demo queue", onClick: resetQueue }]}
          icon={ListChecks}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {queue.map((item) => (
            <StaggerItem key={item.id}>
              <ReviewCard item={item} onFieldChange={handleFieldChange} onAction={handleAction} />
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <FadeIn delay={0.1}>
        <SectionHeader eyebrow="Session Log" title="Reviewed" className="mb-3" />
        <ReviewedList items={reviewed} />
      </FadeIn>
    </div>
  );
}
