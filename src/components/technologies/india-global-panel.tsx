import { MeterBar } from "@/components/ui";
import { INDIA_SHARE } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

const METRICS: { key: keyof typeof INDIA_SHARE; label: string }[] = [
  { key: "patents", label: "Patent activity" },
  { key: "rd", label: "R&D activity" },
  { key: "publications", label: "Publication activity" },
  { key: "technologyDiversity", label: "Technology diversity" },
  { key: "organisations", label: "Organisation participation" },
];

/**
 * "India vs Global" comparison panel (spec §35): paired bars per metric —
 * India's share of publicly indexed evidence vs. the global 100% baseline.
 */
export function IndiaGlobalPanel() {
  return (
    <div className="space-y-5">
      {METRICS.map(({ key, label }) => {
        const share = INDIA_SHARE[key];
        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink">{label}</span>
              <span className="font-mono tabular-nums text-mineral">{formatPercent(share)}</span>
            </div>
            <MeterBar value={share} label="India" valueLabel={formatPercent(share)} tone="mineral" />
            <MeterBar value={1} label="Global" valueLabel="100%" tone="data" />
          </div>
        );
      })}
      <p className="border-t border-border pt-3 text-2xs leading-relaxed text-ink-faint">
        Indian public evidence share (demo). Low domestic evidence does not necessarily mean no activity — it may
        reflect gaps in publicly indexed patent, R&D and publication sources rather than the absence of real-world
        work.
      </p>
    </div>
  );
}
