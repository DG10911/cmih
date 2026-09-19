"use client";
import * as React from "react";
import { Search, X } from "lucide-react";
import { SectionHeader, Chip, DemoBadge, EmptyState } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { MINERALS } from "@/lib/data";
import { MineralCard } from "./mineral-card";

/**
 * Client-side explorer: category chip filter + name/alias search over the
 * static MINERALS catalogue (spec: Minerals Explorer).
 */
export function MineralExplorer() {
  const categories = React.useMemo(() => {
    const set = new Set(MINERALS.map((m) => m.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const [category, setCategory] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return MINERALS.filter((m) => {
      const matchesCategory = category === "All" || m.category === category;
      const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.aliases.some((a) => a.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const clearFilters = () => {
    setCategory("All");
    setQuery("");
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Mineral Intelligence"
        title="Minerals Explorer"
        subtitle="India's critical mineral taxonomy — patent, R&D and publication intelligence per mineral."
        action={<DemoBadge />}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or alias…"
            aria-label="Search minerals"
            className="h-9 w-full rounded-md border border-border-strong bg-surface-2 pl-9 pr-8 text-xs text-ink placeholder:text-ink-faint focus-visible:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No minerals match this filter."
          hint="Try a different category or search term."
          actions={[{ label: "Clear filters", onClick: clearFilters }]}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mineral) => (
            <StaggerItem key={mineral.id}>
              <MineralCard mineral={mineral} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
