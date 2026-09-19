import Link from "next/link";
import { CheckCircle2, XCircle, Flag, PencilLine } from "lucide-react";
import { Pill } from "@/components/ui";
import { mineralName, technologyName } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ReviewDecision, ReviewQueueItem } from "./review-card";

export interface ReviewedItem extends ReviewQueueItem {
  decision: ReviewDecision;
}

const DECISION_META: Record<ReviewDecision, { label: string; icon: typeof CheckCircle2; tone: string }> = {
  accepted: { label: "Accepted", icon: CheckCircle2, tone: "border-success/40 bg-success/10 text-success" },
  rejected: { label: "Rejected", icon: XCircle, tone: "border-danger/40 bg-danger/10 text-danger" },
  flagged: { label: "Flagged", icon: Flag, tone: "border-warning/40 bg-warning/10 text-warning" },
};

/** Reviewed list — items actioned out of the review queue (spec §14). */
export function ReviewedList({ items }: { items: ReviewedItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-faint">Nothing reviewed yet this session.</p>;
  }
  return (
    <div className="divide-y divide-border rounded-card border border-border bg-surface">
      {items.map((item) => {
        const meta = DECISION_META[item.decision];
        const wasEdited =
          item.mineral !== item.originalMineral ||
          item.technology !== item.originalTechnology ||
          item.stage !== item.originalStage;
        return (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <Link href={item.href} className="truncate text-sm font-medium text-ink hover:text-mineral">
                {item.title}
              </Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-2xs text-ink-faint">
                <span>{item.kind}</span>
                <span>·</span>
                <span>{mineralName(item.mineral)}</span>
                <span>·</span>
                <span>{technologyName(item.technology)}</span>
                <span>·</span>
                <span>{item.stage}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {wasEdited && (
                <Pill className="border-mineral/40 bg-mineral/10 text-mineral">
                  <PencilLine className="h-3 w-3" /> Corrected
                </Pill>
              )}
              <Pill className={cn(meta.tone)}>
                <meta.icon className="h-3 w-3" /> {meta.label}
              </Pill>
            </div>
          </div>
        );
      })}
    </div>
  );
}
