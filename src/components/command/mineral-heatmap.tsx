import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Tooltip } from "@/components/ui";
import { MINERALS, VALUE_CHAIN_STAGES, STAGE_SHORT } from "@/lib/data";
import { cn, formatNumber } from "@/lib/utils";
import type { ValueChainStage } from "@/lib/types";

function levelLabel(intensity: number): string {
  if (intensity <= 0) return "No activity";
  if (intensity >= 0.66) return "High";
  if (intensity >= 0.33) return "Medium";
  return "Low";
}

/**
 * Critical Mineral Heatmap — rows are minerals, columns are value-chain
 * stages. Cell intensity is derived from whether the mineral is active at
 * that stage, scaled by the mineral's patent-family volume normalised
 * across the mineral catalogue (spec §10-11). DEMO derivation, not a
 * measured activity index.
 */
export function MineralHeatmap() {
  const maxPatentFamilies = Math.max(...MINERALS.map((m) => m.metrics.patentFamilies));

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            Critical mineral heatmap: activity intensity of each mineral across value-chain stages, derived
            from stage coverage scaled by patent-family volume.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-surface px-2 py-2 text-2xs font-medium uppercase tracking-wider text-ink-faint">
                Mineral
              </th>
              {VALUE_CHAIN_STAGES.map((stage) => (
                <th
                  key={stage}
                  scope="col"
                  className="px-1.5 py-2 text-center text-2xs font-medium uppercase tracking-wider text-ink-faint"
                  title={stage}
                >
                  {STAGE_SHORT[stage]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MINERALS.map((mineral) => (
              <tr key={mineral.id} className="group">
                <th scope="row" className="sticky left-0 z-10 bg-surface px-1 py-1 font-normal">
                  <Link
                    href={`/minerals/${mineral.id}`}
                    className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-sm text-ink transition-colors hover:bg-surface-3 hover:text-mineral"
                  >
                    <span className="font-mono text-2xs text-ink-faint">{mineral.symbol}</span>
                    <span className="font-medium">{mineral.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </th>
                {VALUE_CHAIN_STAGES.map((stage: ValueChainStage) => {
                  const active = mineral.stages.includes(stage);
                  const intensity = active ? mineral.metrics.patentFamilies / maxPatentFamilies : 0;
                  const level = levelLabel(intensity);
                  return (
                    <td key={stage} className="p-1">
                      <Tooltip
                        label={
                          <span>
                            <span className="font-medium text-ink">{mineral.name}</span> ·{" "}
                            {STAGE_SHORT[stage]}: <span className="font-medium">{level}</span>
                            {active && (
                              <span className="block text-ink-faint">
                                {formatNumber(mineral.metrics.patentFamilies)} patent families (demo)
                              </span>
                            )}
                          </span>
                        }
                      >
                        <div
                          className={cn(
                            "h-7 w-full rounded-sm border border-border/60",
                            !active && "bg-surface-2/40"
                          )}
                          style={active ? { backgroundColor: `rgb(var(--mineral) / ${Math.max(0.12, intensity).toFixed(2)})` } : undefined}
                          aria-label={`${mineral.name}, ${STAGE_SHORT[stage]}: ${level}`}
                        />
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center gap-3 text-2xs text-ink-faint">
        <span>Intensity:</span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-border/60 bg-surface-2/40" /> None
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-border/60" style={{ backgroundColor: "rgb(var(--mineral) / 0.3)" }} /> Low
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-border/60" style={{ backgroundColor: "rgb(var(--mineral) / 0.6)" }} /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-border/60" style={{ backgroundColor: "rgb(var(--mineral) / 0.9)" }} /> High
        </span>
      </div>
    </div>
  );
}
