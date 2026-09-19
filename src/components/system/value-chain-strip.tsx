import { ArrowRight } from "lucide-react";
import { VALUE_CHAIN_STAGES } from "@/lib/data";

/**
 * Read-only value-chain stepper for the Taxonomy Manager (spec §11).
 * Stage order is configured from `VALUE_CHAIN_STAGES`, not hardcoded markup.
 */
export function ValueChainStrip() {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="list" aria-label="Value chain stages">
      {VALUE_CHAIN_STAGES.map((stage, i) => (
        <div key={stage} className="flex items-center gap-1.5" role="listitem">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface-2 px-2.5 py-1 text-2xs font-medium text-ink-soft">
            <span className="font-mono text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
            {stage}
          </span>
          {i < VALUE_CHAIN_STAGES.length - 1 && <ArrowRight className="h-3 w-3 text-ink-faint" />}
        </div>
      ))}
    </div>
  );
}
