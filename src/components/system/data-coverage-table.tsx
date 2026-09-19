import { StatusBadge, LevelBadge, Pill } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { DataSource } from "@/lib/types";

/**
 * Data Coverage table for the Sources screen (spec §42-43). Renders
 * connector status straight from `DATA_SOURCES` — never fabricated.
 */
export function DataCoverageTable({ sources }: { sources: DataSource[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2 text-2xs uppercase tracking-wider text-ink-faint">
            <th className="px-4 py-2.5 font-medium">Source</th>
            <th className="px-4 py-2.5 font-medium">Category</th>
            <th className="px-4 py-2.5 font-medium">Records</th>
            <th className="px-4 py-2.5 font-medium">Last Sync</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Coverage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sources.map((s) => (
            <tr key={s.id} className="transition-colors hover:bg-surface-2">
              <td className="px-4 py-3">
                <div className="font-medium text-ink">{s.name}</div>
                <div className="mt-0.5 font-mono text-2xs text-ink-faint">{s.id}</div>
              </td>
              <td className="px-4 py-3">
                <Pill className="border-border-strong bg-surface-2 text-ink-soft">{s.category}</Pill>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="font-mono text-xs tabular-nums text-ink">{formatNumber(s.records)}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="font-mono text-xs tabular-nums text-ink-soft">{s.lastSync}</span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={s.status} />
              </td>
              <td className="px-4 py-3">
                <LevelBadge value={s.coverage} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
