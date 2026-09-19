import { ChevronRight } from "lucide-react";
import { VALUE_CHAIN_STAGES, STAGE_SHORT } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ValueChainStage } from "@/lib/types";

/**
 * Full value-chain strip (Exploration → Advanced Materials / Applications)
 * with the technology's active stages highlighted (spec §10, §52).
 */
export function ValueChainStrip({ activeStages }: { activeStages: ValueChainStage[] }) {
  const active = new Set(activeStages);
  return (
    <div className="flex flex-wrap items-center gap-1" role="list" aria-label="Value chain stages, active stages highlighted">
      {VALUE_CHAIN_STAGES.map((stage, i) => {
        const isActive = active.has(stage);
        return (
          <div key={stage} className="flex items-center gap-1">
            <span
              role="listitem"
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "rounded-full border px-2.5 py-1 text-2xs font-medium whitespace-nowrap",
                isActive
                  ? "border-mineral/50 bg-mineral/15 text-mineral"
                  : "border-border bg-surface-2 text-ink-faint"
              )}
            >
              {STAGE_SHORT[stage]}
            </span>
            {i < VALUE_CHAIN_STAGES.length - 1 && <ChevronRight className="h-3 w-3 shrink-0 text-ink-faint/50" />}
          </div>
        );
      })}
    </div>
  );
}
