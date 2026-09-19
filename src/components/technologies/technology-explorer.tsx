"use client";
import * as React from "react";
import Link from "next/link";
import { Search, X, FileText, BookOpen, FlaskConical, Building2, ArrowUpRight } from "lucide-react";
import { Card, CardBody, Chip, Pill, MomentumBadge, EmptyState, DemoBadge, SectionHeader } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { STAGE_SHORT } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import type { Technology, Mineral, Maturity } from "@/lib/types";

const MATURITIES: Maturity[] = ["Emerging", "Developing", "Scaling", "Mature"];

/** Shared maturity → tone mapping (also used on the detail page). */
export const MATURITY_TONE: Record<Maturity, string> = {
  Emerging: "border-data/40 bg-data/10 text-data",
  Developing: "border-warning/40 bg-warning/10 text-warning",
  Scaling: "border-mineral/40 bg-mineral/10 text-mineral",
  Mature: "border-success/40 bg-success/10 text-success",
};

const METRIC_CHIPS: { key: keyof Technology["metrics"]; label: string; icon: typeof FileText }[] = [
  { key: "patentFamilies", label: "patents", icon: FileText },
  { key: "publications", label: "pubs", icon: BookOpen },
  { key: "rdProjects", label: "R&D", icon: FlaskConical },
  { key: "organisations", label: "orgs", icon: Building2 },
];

/**
 * Client-side explorer: search by name/alias + maturity + mineral chip
 * filters over the static TECHNOLOGIES catalogue (spec: Technologies Explorer).
 */
export function TechnologyExplorer({ technologies, minerals }: { technologies: Technology[]; minerals: Mineral[] }) {
  const [query, setQuery] = React.useState("");
  const [maturities, setMaturities] = React.useState<Set<Maturity>>(new Set());
  const [mineralIds, setMineralIds] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return technologies.filter((t) => {
      const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.aliases.some((a) => a.toLowerCase().includes(q));
      const matchesMaturity = maturities.size === 0 || maturities.has(t.maturity);
      const matchesMineral = mineralIds.size === 0 || t.minerals.some((m) => mineralIds.has(m));
      return matchesQuery && matchesMaturity && matchesMineral;
    });
  }, [technologies, query, maturities, mineralIds]);

  const toggleMaturity = (m: Maturity) =>
    setMaturities((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });

  const toggleMineral = (id: string) =>
    setMineralIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const clearFilters = () => {
    setQuery("");
    setMaturities(new Set());
    setMineralIds(new Set());
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Technology Intelligence"
        title="Technologies Explorer"
        subtitle="Extraction, separation, refining and recovery technologies tracked across India's critical mineral value chain."
        action={<DemoBadge />}
      />

      <div className="mb-5 space-y-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or alias…"
            aria-label="Search technologies by name or alias"
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-2xs font-medium uppercase tracking-wider text-ink-faint">Maturity</span>
          {MATURITIES.map((m) => (
            <Chip key={m} active={maturities.has(m)} onClick={() => toggleMaturity(m)}>
              {m}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-2xs font-medium uppercase tracking-wider text-ink-faint">Mineral</span>
          {minerals.map((m) => (
            <Chip key={m.id} active={mineralIds.has(m.id)} onClick={() => toggleMineral(m.id)}>
              {m.symbol}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No technologies match this filter combination."
          hint="Try clearing the search or removing a maturity / mineral filter."
          actions={[{ label: "Clear filters", onClick: clearFilters }]}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <StaggerItem key={t.id} className="h-full">
              <Link href={`/technologies/${t.id}`} className="group block h-full focus-visible:outline-none">
                <Card className="flex h-full flex-col p-4 transition-colors group-hover:border-mineral/40 group-focus-visible:border-data">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-ink">{t.name}</h3>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-soft">{t.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Pill className={MATURITY_TONE[t.maturity]}>{t.maturity}</Pill>
                    <MomentumBadge value={t.momentum} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {t.stages.map((s) => (
                      <Pill key={s} className="border-border-strong bg-surface-2 text-ink-faint">
                        {STAGE_SHORT[s]}
                      </Pill>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                    {METRIC_CHIPS.map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center gap-1.5 text-2xs text-ink-soft">
                        <Icon className="h-3 w-3 shrink-0 text-data" />
                        <span className="font-mono tabular-nums text-ink">{formatNumber(t.metrics[key] ?? 0)}</span>
                        <span className="text-ink-faint">{label}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
