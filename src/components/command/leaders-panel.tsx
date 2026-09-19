import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MeterBar, Pill } from "@/components/ui";
import { ORGANISATIONS } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

/** Leading Organisations panel — ranked by patent-family volume (spec §15,33). */
export function LeadersPanel() {
  const top = [...ORGANISATIONS].sort((a, b) => b.metrics.patentFamilies - a.metrics.patentFamilies).slice(0, 5);
  const max = Math.max(...top.map((o) => o.metrics.patentFamilies), 1);

  return (
    <div className="space-y-3">
      {top.map((org, i) => (
        <Link
          key={org.id}
          href={`/organisations/${org.id}`}
          className="group block rounded-card border border-border bg-surface-2/40 p-3 transition-colors hover:border-data/40 hover:bg-surface-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xs text-ink-faint">#{i + 1}</span>
                <span className="truncate text-sm font-medium text-ink group-hover:text-data">{org.name}</span>
                <ArrowUpRight className="h-3 w-3 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-faint">
                <Pill className="border-border-strong bg-surface text-ink-soft">{org.type}</Pill>
                <span>{org.country}</span>
              </div>
            </div>
            <span className="shrink-0 font-mono text-sm tabular-nums text-ink">
              {formatNumber(org.metrics.patentFamilies)}
            </span>
          </div>
          <MeterBar className="mt-2.5" value={org.metrics.patentFamilies / max} tone="data" />
        </Link>
      ))}
    </div>
  );
}
