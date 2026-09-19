import Link from "next/link";
import { FileText, FlaskConical, BookOpen, Building2, ArrowUpRight } from "lucide-react";
import { Card, Pill } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { Mineral } from "@/lib/types";

const CHIPS: { key: keyof Mineral["metrics"]; label: string; icon: typeof FileText }[] = [
  { key: "patentFamilies", label: "Patent families", icon: FileText },
  { key: "rdProjects", label: "R&D projects", icon: FlaskConical },
  { key: "publications", label: "Publications", icon: BookOpen },
  { key: "organisations", label: "Organisations", icon: Building2 },
];

/** Compact mineral summary card used in the Minerals Explorer grid. */
export function MineralCard({ mineral }: { mineral: Mineral }) {
  return (
    <Link href={`/minerals/${mineral.id}`} className="group block h-full focus-visible:outline-none">
      <Card className="flex h-full flex-col p-4 transition-colors group-hover:border-mineral/40 group-focus-visible:border-data">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-mineral/30 bg-mineral/10 font-mono text-sm font-semibold text-mineral">
              {mineral.symbol}
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                {mineral.name}
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-0.5 text-2xs text-ink-faint">{mineral.category}</div>
            </div>
          </div>
          <Pill className="shrink-0 border-border-strong bg-surface-2 text-ink-soft">{mineral.category}</Pill>
        </div>

        <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-ink-soft">{mineral.summary}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {CHIPS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2/60 px-2 py-1.5">
              <Icon className="h-3.5 w-3.5 shrink-0 text-data" />
              <div className="leading-tight">
                <div className="font-mono text-xs font-semibold tabular-nums text-ink">{formatNumber(mineral.metrics[key] ?? 0)}</div>
                <div className="text-2xs text-ink-faint">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Link>
  );
}
