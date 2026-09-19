"use client";
import * as React from "react";
import { Chip, EmptyState } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { GAP_SIGNALS, getMineral } from "@/lib/data";
import type { GapSignal } from "@/lib/types";
import { GapCard } from "./gap-card";

const GAP_TYPES: GapSignal["gapType"][] = ["Research Gap", "Technology Opportunity", "Strategic Capability Gap"];

/**
 * Client-side filter + grid for `/gaps`. Filters by gapType and mineral
 * (spec §29). All GAP_SIGNALS are potential signals, not conclusions.
 */
export function GapsExplorer() {
  const [gapType, setGapType] = React.useState<GapSignal["gapType"] | "All">("All");
  const [mineral, setMineral] = React.useState<string | "All">("All");

  const mineralIds = React.useMemo(() => {
    const ids = Array.from(new Set(GAP_SIGNALS.map((g) => g.mineral)));
    return ids.sort((a, b) => (getMineral(a)?.name ?? a).localeCompare(getMineral(b)?.name ?? b));
  }, []);

  const filtered = GAP_SIGNALS.filter(
    (g) => (gapType === "All" || g.gapType === gapType) && (mineral === "All" || g.mineral === mineral)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-2xs font-medium uppercase tracking-wider text-ink-faint">Gap type</span>
        <Chip active={gapType === "All"} onClick={() => setGapType("All")}>
          All
        </Chip>
        {GAP_TYPES.map((t) => (
          <Chip key={t} active={gapType === t} onClick={() => setGapType(t)}>
            {t}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-2xs font-medium uppercase tracking-wider text-ink-faint">Mineral</span>
        <Chip active={mineral === "All"} onClick={() => setMineral("All")}>
          All
        </Chip>
        {mineralIds.map((id) => (
          <Chip key={id} active={mineral === id} onClick={() => setMineral(id)}>
            {getMineral(id)?.name ?? id}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No gap signals match this filter combination."
          hint="Try broadening the gap type or mineral filter — sparse evidence does not mean no activity."
          actions={[{ label: "Reset filters", onClick: () => { setGapType("All"); setMineral("All"); } }]}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <StaggerItem key={g.id} className="h-full">
              <GapCard signal={g} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
