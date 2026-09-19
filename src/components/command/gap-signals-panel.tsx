import Link from "next/link";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import { LevelBadge, Pill } from "@/components/ui";
import { GAP_SIGNALS, GAP_WEIGHTS, mineralName, technologyName } from "@/lib/data";
import type { GapSignal, Level } from "@/lib/types";

const LEVEL_SCORE: Record<Level, number> = { High: 3, Medium: 2, Low: 1 };

/** Heuristic display-priority — NOT the platform's confidence score (spec §30). */
function priority(g: GapSignal): number {
  return (
    GAP_WEIGHTS.strategicRelevance * LEVEL_SCORE[g.strategicNeed] +
    GAP_WEIGHTS.technologyMomentum * LEVEL_SCORE[g.globalMomentum] +
    GAP_WEIGHTS.domesticCapability * (4 - LEVEL_SCORE[g.indianPatentActivity]) +
    GAP_WEIGHTS.evidenceSufficiency * LEVEL_SCORE[g.evidenceSufficiency]
  );
}

/**
 * Potential Gap Signals panel (spec §29-32). These are SIGNALS derived from
 * heuristic scoring over strategic need, global momentum and domestic
 * activity — never presented as confirmed conclusions.
 */
export function GapSignalsPanel() {
  const top = [...GAP_SIGNALS].sort((a, b) => priority(b) - priority(a)).slice(0, 5);

  return (
    <div className="space-y-2.5">
      <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-2xs text-ink-soft">
        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
        <span>
          These are <span className="font-medium text-ink">Potential Capability Gap Signals</span> — heuristic
          indicators for review, not confirmed conclusions.
        </span>
      </div>
      {top.map((gap) => (
        <Link
          key={gap.id}
          href={`/gaps/${gap.id}`}
          className="group block rounded-card border border-border bg-surface-2/40 p-3 transition-colors hover:border-warning/40 hover:bg-surface-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-medium text-ink group-hover:text-warning">
                  {technologyName(gap.technology)}
                </span>
                <ArrowUpRight className="h-3 w-3 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-2xs text-ink-faint">
                <span>{mineralName(gap.mineral)}</span>
                <span>·</span>
                <Pill className="border-border-strong bg-surface text-ink-soft">{gap.gapType}</Pill>
              </div>
            </div>
            <LevelBadge value={gap.confidence} label="Confidence" className="shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
}
