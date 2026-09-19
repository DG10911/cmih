import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MomentumBadge, Pill, MeterBar } from "@/components/ui";
import { EMERGING_TECHNOLOGIES, mineralName, technologyName } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

/**
 * Emerging Technology Panel — top emerging-score technologies (spec §28,84).
 * Scores are composite heuristics over research growth, patent growth,
 * novelty and recency; they are directional signals, not forecasts.
 */
export function EmergingPanel() {
  const top = [...EMERGING_TECHNOLOGIES].sort((a, b) => b.emergingScore - a.emergingScore).slice(0, 5);

  return (
    <div className="space-y-2.5">
      {top.map((item, i) => (
        <Link
          key={item.id}
          href={`/technologies/${item.technology}`}
          className="group block rounded-card border border-border bg-surface-2/40 p-3 transition-colors hover:border-mineral/40 hover:bg-surface-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xs text-ink-faint">#{i + 1}</span>
                <span className="truncate text-sm font-medium text-ink group-hover:text-mineral">
                  {technologyName(item.technology)}
                </span>
                <ArrowUpRight className="h-3 w-3 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-2xs text-ink-faint">
                <span>{mineralName(item.mineral)}</span>
                <span>·</span>
                <Pill className="border-border-strong bg-surface text-ink-soft">{item.zone}</Pill>
              </div>
            </div>
            <MomentumBadge value={item.momentum} className="shrink-0" />
          </div>
          <MeterBar
            className="mt-2.5"
            value={item.emergingScore}
            valueLabel={formatPercent(item.emergingScore)}
            tone="mineral"
          />
        </Link>
      ))}
    </div>
  );
}
