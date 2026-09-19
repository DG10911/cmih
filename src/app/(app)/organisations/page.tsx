"use client";
import * as React from "react";
import { Search, X, ArrowDownWideNarrow } from "lucide-react";
import { SectionHeader, EmptyState, Button } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { OrgCard } from "@/components/organisations/org-card";
import { ORGANISATIONS } from "@/lib/data";
import type { Organisation } from "@/lib/types";

const ALL = "All";

export default function OrganisationsExplorerPage() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<Organisation["type"] | typeof ALL>(ALL);

  const types = React.useMemo(
    () => Array.from(new Set(ORGANISATIONS.map((o) => o.type))).sort(),
    []
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORGANISATIONS.filter((o) => {
      if (type !== ALL && o.type !== type) return false;
      if (q && !o.name.toLowerCase().includes(q) && !o.aliases.some((a) => a.toLowerCase().includes(q))) return false;
      return true;
    }).sort((a, b) => b.metrics.patentFamilies - a.metrics.patentFamilies);
  }, [query, type]);

  const hasActiveFilters = query !== "" || type !== ALL;

  return (
    <div className="space-y-6">
      <FadeIn>
        <SectionHeader
          eyebrow="Organisations Explorer"
          title="Institutions & Innovators"
          subtitle="Academic, government, R&D institute, industry and PSU organisations active across India's critical mineral technology landscape. Sorted by patent-family strength."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-surface p-4">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organisations by name or alias…"
              className="h-9 flex-1 rounded-md border border-border-strong bg-surface-2 px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:border-data"
            />
          </div>
          <label className="flex items-center gap-2 text-2xs text-ink-faint">
            <span className="uppercase tracking-wider">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Organisation["type"] | typeof ALL)}
              className="h-9 rounded-md border border-border-strong bg-surface-2 px-2 text-xs text-ink outline-none focus-visible:border-data"
            >
              <option value={ALL}>All</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <span className="inline-flex items-center gap-1 text-2xs text-ink-faint">
            <ArrowDownWideNarrow className="h-3.5 w-3.5" /> Sorted by patent families
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setType(ALL);
              }}
            >
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </FadeIn>

      <div className="text-2xs text-ink-faint">
        Showing {filtered.length} of {ORGANISATIONS.length} organisations
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No organisations match this search."
          hint="Try a different name, alias or organisation type."
          actions={[{ label: "Clear filters", onClick: () => { setQuery(""); setType(ALL); } }]}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((org) => (
            <StaggerItem key={org.id}>
              <OrgCard organisation={org} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
