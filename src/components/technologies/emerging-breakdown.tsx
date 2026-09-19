import { MeterBar } from "@/components/ui";
import { EMERGING_WEIGHTS } from "@/lib/data";
import { formatPercent } from "@/lib/utils";
import type { Technology } from "@/lib/types";

type ComponentKey = keyof Technology["emergingComponents"];

const LABELS: Record<ComponentKey, string> = {
  researchGrowth: "Research growth",
  patentGrowth: "Patent growth",
  orgGrowth: "Organisation growth",
  novelty: "Novelty",
  recency: "Recency",
  maturityEvidence: "Maturity evidence",
};

const ORDER: ComponentKey[] = ["researchGrowth", "patentGrowth", "orgGrowth", "novelty", "recency", "maturityEvidence"];

/**
 * Emerging-technology lifecycle signal breakdown (spec §28, §84).
 * Weighted composite: 0.25·research + 0.2·patent + 0.15·org + 0.15·novelty
 * + 0.15·recency + 0.1·maturityEvidence. This is a heuristic evidence
 * signal, not an official Technology Readiness Level (TRL).
 */
export function EmergingBreakdown({ components }: { components: Technology["emergingComponents"] }) {
  const score = ORDER.reduce((sum, key) => sum + components[key] * EMERGING_WEIGHTS[key], 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {ORDER.map((key) => (
          <MeterBar
            key={key}
            value={components[key]}
            label={`${LABELS[key]} · weight ${formatPercent(EMERGING_WEIGHTS[key])}`}
            valueLabel={components[key].toFixed(2)}
            tone="data"
          />
        ))}
      </div>
      <div className="flex items-center justify-between rounded-md border border-border-strong bg-surface-2 px-3 py-2.5">
        <span className="text-xs font-medium text-ink">Computed emerging score</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-mineral">{score.toFixed(2)}</span>
      </div>
      <p className="text-2xs leading-relaxed text-ink-faint">
        Evidence-based technology lifecycle signal, not an official TRL. Weights are configurable prototype
        heuristics (research growth 25%, patent growth 20%, organisation growth 15%, novelty 15%, recency 15%,
        maturity evidence 10%) and reflect classification consistency, not factual certainty.
      </p>
    </div>
  );
}
