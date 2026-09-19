"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VALUE_CHAIN_STAGES, STAGE_SHORT } from "@/lib/data";
import type { ValueChainStage } from "@/lib/types";

/**
 * Interactive horizontal value-chain pipeline. Stages the mineral covers are
 * highlighted and clickable; selecting one filters technologies, patents and
 * R&D activity below to that stage (spec: Value Chain section).
 */
export function ValueChain({
  covered,
  selected,
  onSelect,
  onClear,
}: {
  covered: ValueChainStage[];
  selected: ValueChainStage | null;
  onSelect: (stage: ValueChainStage) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="relative flex items-stretch gap-0.5 overflow-x-auto pb-1" aria-label="Value chain stages">
        <div className="pointer-events-none absolute left-6 right-6 top-[19px] h-px bg-border-strong" aria-hidden />
        {VALUE_CHAIN_STAGES.map((stage, i) => {
          const isCovered = covered.includes(stage);
          const isSelected = selected === stage;
          return (
            <button
              key={stage}
              type="button"
              disabled={!isCovered}
              aria-pressed={isSelected}
              onClick={() => onSelect(stage)}
              title={isCovered ? `Filter by ${stage}` : `${stage} — no coverage for this mineral`}
              className={cn(
                "relative z-10 flex min-w-[104px] flex-1 flex-col items-center gap-1.5 rounded-md px-1.5 py-2 text-center transition-colors focus-visible:outline-none",
                isCovered ? "cursor-pointer hover:bg-surface-2" : "cursor-not-allowed opacity-35"
              )}
            >
              <motion.span
                animate={{ scale: isSelected ? 1.18 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border font-mono text-2xs font-semibold transition-colors",
                  isSelected
                    ? "border-mineral bg-mineral text-background shadow-elevated"
                    : isCovered
                    ? "border-data/40 bg-data/15 text-data"
                    : "border-border-strong bg-surface-3 text-ink-faint"
                )}
              >
                {i + 1}
              </motion.span>
              <span
                className={cn(
                  "text-2xs font-medium leading-tight",
                  isSelected ? "text-mineral" : isCovered ? "text-ink" : "text-ink-faint"
                )}
              >
                {STAGE_SHORT[stage]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex min-h-[26px] items-center gap-2">
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-2xs"
          >
            <span className="text-ink-soft">
              Filtering technologies, patents &amp; R&amp;D by <strong className="font-medium text-mineral">{selected}</strong>
            </span>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-2 px-2 py-0.5 text-ink-soft transition-colors hover:border-data/50 hover:text-ink"
            >
              <X className="h-3 w-3" /> Clear filter
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
