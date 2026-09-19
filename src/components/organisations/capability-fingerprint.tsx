"use client";
import { cn } from "@/lib/utils";
import type { ValueChainStage } from "@/lib/types";

/**
 * Capability Fingerprint (spec §33) — a labelled MeterBar per value-chain
 * stage present in `org.capability`, sorted desc. Clicking a bar selects
 * that stage; the parent owns `selected` state and filters evidence lists
 * below in response.
 */
export function CapabilityFingerprint({
  capability,
  selected,
  onSelect,
  className,
}: {
  capability: Partial<Record<ValueChainStage, number>>;
  selected: ValueChainStage | null;
  onSelect: (stage: ValueChainStage | null) => void;
  className?: string;
}) {
  const entries = (Object.entries(capability) as [ValueChainStage, number][]).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return <p className="text-sm text-ink-soft">No capability signal recorded for this organisation.</p>;
  }

  return (
    <div className={cn("space-y-2.5", className)}>
      {entries.map(([stage, value]) => {
        const isSelected = selected === stage;
        return (
          <button
            key={stage}
            type="button"
            onClick={() => onSelect(isSelected ? null : stage)}
            aria-pressed={isSelected}
            className={cn(
              "block w-full rounded-md p-1.5 text-left transition-colors",
              isSelected ? "bg-mineral/10 ring-1 ring-mineral/40" : "hover:bg-surface-2"
            )}
          >
            <div className="mb-1 flex items-center justify-between text-2xs">
              <span className={cn("font-medium", isSelected ? "text-mineral" : "text-ink-soft")}>{stage}</span>
              <span className="font-mono tabular-nums text-ink-faint">{Math.round(value * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-3">
              <div
                className={cn("h-full rounded-full transition-all", isSelected ? "bg-mineral" : "bg-data")}
                style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }}
              />
            </div>
          </button>
        );
      })}
      <p className="pt-1 text-2xs text-ink-faint">
        Click a stage to filter the evidence lists below. {selected ? `Filtering by "${selected}".` : "Showing all stages."}
      </p>
    </div>
  );
}
