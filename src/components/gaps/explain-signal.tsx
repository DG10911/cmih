import * as React from "react";
import { MeterBar, Stat } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { GapSignal } from "@/lib/types";

/**
 * Weighted contribution breakdown behind a Gap Signal (spec §30).
 * Rendered both inline on the detail page and inside the "Explain Signal"
 * modal opened from a card — same component, two contexts.
 */
export function ExplainSignalContent({ signal }: { signal: GapSignal }) {
  const rows: { label: string; key: keyof GapSignal["weights"] }[] = [
    { label: "Strategic relevance", key: "strategicRelevance" },
    { label: "Technology momentum", key: "technologyMomentum" },
    { label: "Domestic capability (deficit-weighted)", key: "domesticCapability" },
    { label: "Evidence sufficiency", key: "evidenceSufficiency" },
  ];

  return (
    <div className="space-y-5 text-sm">
      <div>
        <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">
          Weighted contribution breakdown
        </div>
        <div className="space-y-3">
          {rows.map((r) => (
            <MeterBar
              key={r.key}
              value={signal.weights[r.key]}
              label={r.label}
              valueLabel={`${Math.round(signal.weights[r.key] * 100)}%`}
              tone={r.key === "evidenceSufficiency" ? "data" : "mineral"}
            />
          ))}
        </div>
        <p className="mt-2 text-2xs leading-relaxed text-ink-faint">
          Weights are configurable prototype heuristics, not validated policy coefficients. They sum to
          100% and can be re-tuned as better evidence becomes available.
        </p>
      </div>

      <div>
        <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">Supporting evidence counts</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Patent families" value={formatNumber(signal.supportingEvidence.patentFamilies)} />
          <Stat label="Publications" value={formatNumber(signal.supportingEvidence.publications)} />
          <Stat label="R&D projects" value={formatNumber(signal.supportingEvidence.rdProjects)} />
          <Stat label="Organisations" value={formatNumber(signal.supportingEvidence.organisations)} />
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-2xs uppercase tracking-wider text-ink-faint">Data limitations</div>
        <div className="rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-xs leading-relaxed text-ink-soft">
          {signal.dataLimitations}
        </div>
      </div>

      <p className="rounded-md border border-border bg-surface-2 px-3 py-2 text-2xs leading-relaxed text-ink-faint">
        This is a potential signal derived from indexed evidence, not a definitive conclusion. Low
        evidence does not necessarily mean no activity — it may mean activity is under-indexed.
      </p>
    </div>
  );
}
