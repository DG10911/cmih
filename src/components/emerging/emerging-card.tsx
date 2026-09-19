import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, MomentumBadge, MeterBar, Pill } from "@/components/ui";
import { EMERGING_WEIGHTS, getMineral, getTechnology } from "@/lib/data";
import type { EmergingTechnology, Maturity } from "@/lib/types";

const ZONE_TONE: Record<Maturity, string> = {
  Emerging: "text-data border-data/40 bg-data/10",
  Developing: "text-mineral border-mineral/40 bg-mineral/10",
  Scaling: "text-warning border-warning/40 bg-warning/10",
  Mature: "text-success border-success/40 bg-success/10",
};

const COMPONENT_ROWS: { key: keyof EmergingTechnology["components"]; label: string }[] = [
  { key: "researchGrowth", label: "Research growth" },
  { key: "patentGrowth", label: "Patent growth" },
  { key: "orgGrowth", label: "Org growth" },
  { key: "novelty", label: "Novelty" },
  { key: "recency", label: "Recency" },
  { key: "maturityEvidence", label: "Maturity evidence" },
];

/**
 * Emerging-technology card (spec §28,84): zone, momentum, emergingScore and
 * the weighted 0.25/0.20/0.15/0.15/0.15/0.10 component breakdown that
 * produces it. Links out to the full technology profile.
 */
export function EmergingCard({ item }: { item: EmergingTechnology }) {
  const technology = getTechnology(item.technology);
  const mineral = getMineral(item.mineral);

  return (
    <Card className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <Pill className={ZONE_TONE[item.zone]}>{item.zone.toUpperCase()}</Pill>
        <MomentumBadge value={item.momentum} />
      </div>

      <div>
        <Link href={`/technologies/${item.technology}`} className="group inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-mineral">
          {technology?.name ?? item.technology}
          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
        <p className="mt-0.5 text-2xs text-ink-faint">{mineral?.name ?? item.mineral}</p>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums text-ink">{Math.round(item.emergingScore * 100)}</span>
        <span className="text-2xs text-ink-faint">/ 100 emerging score</span>
      </div>

      <div className="mt-1 space-y-2 border-t border-border pt-3">
        <div className="mb-1 text-2xs uppercase tracking-wider text-ink-faint">
          Weighted components
        </div>
        {COMPONENT_ROWS.map((row) => (
          <MeterBar
            key={row.key}
            value={item.components[row.key]}
            label={`${row.label} (×${EMERGING_WEIGHTS[row.key].toFixed(2)})`}
            valueLabel={Math.round(item.components[row.key] * 100).toString()}
            tone={row.key === "patentGrowth" ? "data" : "mineral"}
          />
        ))}
      </div>
    </Card>
  );
}
