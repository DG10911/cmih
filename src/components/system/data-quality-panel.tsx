import { MeterBar } from "@/components/ui";
import { formatPercent } from "@/lib/utils";

export interface DataQualityMetric {
  label: string;
  value: number;
  detail: string;
}

/**
 * Data Quality panel (spec §69). Metrics are prototype heuristics computed
 * over the demo pipeline run — not production accuracy claims.
 */
export function DataQualityPanel({ metrics }: { metrics: DataQualityMetric[] }) {
  const overall = metrics.reduce((sum, m) => sum + m.value, 0) / Math.max(1, metrics.length);
  const isRate = (label: string) => !label.toLowerCase().includes("duplicate");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-card border border-border-strong bg-surface-2 px-3.5 py-3">
        <div>
          <div className="text-sm font-semibold text-ink">Overall Data Quality</div>
          <div className="text-2xs text-ink-faint">Average of the metrics below · prototype figure</div>
        </div>
        <div className="font-mono text-xl font-semibold tabular-nums text-mineral">{formatPercent(overall, 0)}</div>
      </div>

      <div className="space-y-3.5">
        {metrics.map((m) => (
          <div key={m.label}>
            <MeterBar
              value={m.value}
              label={m.label}
              valueLabel={formatPercent(m.value, 0)}
              tone={isRate(m.label) ? "data" : "warning"}
            />
            <p className="mt-1 text-2xs leading-relaxed text-ink-faint">{m.detail}</p>
          </div>
        ))}
      </div>

      <p className="text-2xs leading-relaxed text-ink-faint">
        These are prototype metrics computed on the demo dataset, not audited production accuracy claims.
      </p>
    </div>
  );
}
