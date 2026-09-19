"use client";
import * as React from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { FileText, ArrowUpRight } from "lucide-react";
import { Card, ConfidenceBadge, EmptyState, Button } from "@/components/ui";
import { orgName } from "@/lib/data";
import { ProfileSection } from "./section-shell";
import type { ActivityPoint, Patent, ValueChainStage } from "@/lib/types";

const MAX_ROWS = 8;

/** Section 5 — Patent Activity: mini trend chart + top patents (stage-filtered). */
export function PatentActivitySection({
  patents,
  activity,
  stageFilter,
}: {
  patents: Patent[];
  activity: ActivityPoint[];
  stageFilter: ValueChainStage | null;
}) {
  const [showAll, setShowAll] = React.useState(false);
  const sorted = React.useMemo(
    () => [...patents].sort((a, b) => +new Date(b.priorityDate) - +new Date(a.priorityDate)),
    [patents]
  );
  const rows = showAll ? sorted : sorted.slice(0, MAX_ROWS);

  return (
    <ProfileSection
      id="patents"
      eyebrow="Section 05"
      title="Patent Activity"
      subtitle={stageFilter ? `Filtered to the ${stageFilter} stage.` : "Across all observed value-chain stages."}
    >
      <Card className="mb-4 p-4">
        <div role="img" aria-label="Bar chart of yearly patent family activity." className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activity} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
              <XAxis dataKey="year" stroke="rgb(var(--ink-faint))" fontSize={10} tickLine={false} axisLine={false} />
              <RTooltip
                contentStyle={{ background: "rgb(var(--surface-2))", border: "1px solid rgb(var(--border-strong))", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "rgb(var(--ink))" }}
              />
              <Bar dataKey="patents" name="Patent families" fill="rgb(var(--mineral))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={stageFilter ? `No patents observed at the ${stageFilter} stage.` : "No patents observed."}
          hint="Try clearing the value-chain filter above."
        />
      ) : (
        <div className="divide-y divide-border rounded-card border border-border bg-surface">
          {rows.map((p) => (
            <Link
              key={p.id}
              href={`/patents/${p.id}`}
              className="group flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 truncate text-sm font-medium text-ink">
                  {p.title}
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-0.5 text-2xs text-ink-faint">
                  {p.applicants.map(orgName).join(", ")} · Priority {p.priorityDate}
                </div>
              </div>
              <ConfidenceBadge value={p.provenance.confidence} />
            </Link>
          ))}
        </div>
      )}

      {sorted.length > MAX_ROWS && (
        <div className="mt-3 flex justify-center">
          <Button variant="ghost" size="sm" onClick={() => setShowAll((s) => !s)}>
            {showAll ? "Show fewer" : `Show all ${sorted.length} patents`}
          </Button>
        </div>
      )}
    </ProfileSection>
  );
}
