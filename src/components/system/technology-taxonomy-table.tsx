import { Pill, MomentumBadge } from "@/components/ui";
import { mineralName } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Technology } from "@/lib/types";

const MATURITY_TONE: Record<Technology["maturity"], string> = {
  Emerging: "border-data/30 bg-data/10 text-data",
  Developing: "border-mineral/40 bg-mineral/10 text-mineral",
  Scaling: "border-warning/40 bg-warning/10 text-warning",
  Mature: "border-success/40 bg-success/10 text-success",
};

/** Technology reference table for the Taxonomy Manager (spec §11). */
export function TechnologyTaxonomyTable({ technologies }: { technologies: Technology[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2 text-2xs uppercase tracking-wider text-ink-faint">
            <th className="px-4 py-2.5 font-medium">Technology</th>
            <th className="px-4 py-2.5 font-medium">Minerals</th>
            <th className="px-4 py-2.5 font-medium">Stages</th>
            <th className="px-4 py-2.5 font-medium">Maturity</th>
            <th className="px-4 py-2.5 font-medium">Momentum</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {technologies.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-surface-2">
              <td className="max-w-[260px] px-4 py-3">
                <div className="font-medium text-ink">{t.name}</div>
                {t.aliases.length > 0 && (
                  <div className="mt-0.5 truncate text-2xs text-ink-faint">{t.aliases.join(", ")}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {t.minerals.map((m) => (
                    <Pill key={m} className="border-border-strong bg-surface-2 text-ink-soft">
                      {mineralName(m)}
                    </Pill>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {t.stages.map((s) => (
                    <Pill key={s} className="border-data/30 bg-data/10 text-data">
                      {s}
                    </Pill>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <Pill className={cn(MATURITY_TONE[t.maturity])}>{t.maturity}</Pill>
              </td>
              <td className="px-4 py-3">
                <MomentumBadge value={t.momentum} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
