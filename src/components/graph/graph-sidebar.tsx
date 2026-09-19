"use client";
import * as React from "react";
import { Search, Route, X } from "lucide-react";
import { Card, CardHeader, CardBody, Button, DemoBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ALL_NODE_TYPES, NODE_TYPE_META, type GraphCounts, type GraphNodeType } from "./build-graph";

interface GraphSidebarProps {
  activeTypes: Set<GraphNodeType>;
  onToggleType: (kind: GraphNodeType) => void;
  query: string;
  onQueryChange: (q: string) => void;
  matchCount: number;
  onExplorePath: () => void;
  onResetExplore: () => void;
  exploreActive: boolean;
  counts: GraphCounts;
}

/** Left panel: node-type visibility toggles, search/filter, legend and the explore-path affordance. */
export function GraphSidebar({
  activeTypes,
  onToggleType,
  query,
  onQueryChange,
  matchCount,
  onExplorePath,
  onResetExplore,
  exploreActive,
  counts,
}: GraphSidebarProps) {
  const countFor = (kind: GraphNodeType): number => {
    switch (kind) {
      case "mineral":
        return counts.minerals;
      case "technology":
        return counts.technologies;
      case "patent":
        return counts.patents;
      case "rd":
        return counts.rd;
      case "organisation":
        return counts.organisations;
      case "publication":
        return counts.publications;
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto pr-1">
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <div className="flex w-full items-center justify-between">
            <span className="font-mono text-2xs uppercase tracking-[0.18em] text-mineral">Knowledge Graph</span>
            <DemoBadge />
          </div>
          <p className="text-xs text-ink-soft">Lithium + REE ecosystem — minerals, technologies and their evidence.</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label htmlFor="kd-graph-search" className="mb-1.5 block text-2xs uppercase tracking-wider text-ink-faint">
              Search / filter nodes
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
              <input
                id="kd-graph-search"
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="e.g. lithium, magnet recycling…"
                className="h-9 w-full rounded-md border border-border-strong bg-surface-2 pl-8 pr-8 text-sm text-ink placeholder:text-ink-faint focus:border-data focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onQueryChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {query && (
              <p className="mt-1.5 text-2xs text-ink-faint">
                {matchCount} matching node{matchCount === 1 ? "" : "s"} highlighted
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 text-2xs uppercase tracking-wider text-ink-faint">Layers</div>
            <div className="space-y-1.5">
              {ALL_NODE_TYPES.map((kind) => {
                const meta = NODE_TYPE_META[kind];
                const checked = activeTypes.has(kind);
                return (
                  <label
                    key={kind}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-1.5 py-1 hover:bg-surface-2"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleType(kind)}
                        className="h-3.5 w-3.5 rounded border-border-strong bg-surface-2 accent-data"
                      />
                      <span className={cn("h-2 w-2 rounded-full", meta.bgClass, meta.borderClass, "border")} />
                      <span className="text-sm text-ink-soft">{meta.plural}</span>
                    </span>
                    <span className="font-mono text-2xs tabular-nums text-ink-faint">{countFor(kind)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Route className="h-4 w-4 text-mineral" />
            Explore path
          </div>
          <p className="text-2xs leading-relaxed text-ink-soft">
            Demo affordance: highlight a connected evidence path — Lithium → Direct Lithium Extraction → a patent →
            its organisation → a publication.
          </p>
          {exploreActive ? (
            <Button variant="outline" size="sm" className="w-full" onClick={onResetExplore}>
              <X className="h-3.5 w-3.5" /> Clear path highlight
            </Button>
          ) : (
            <Button variant="primary" size="sm" className="w-full" onClick={onExplorePath}>
              <Route className="h-3.5 w-3.5" /> Show explore path
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
