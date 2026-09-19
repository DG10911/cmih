"use client";
import * as React from "react";
import { FileText, Layers, Search, X } from "lucide-react";
import { Card, CardBody, CardHeader, Chip, EmptyState, KpiCard, SectionHeader } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { PATENTS, mineralName, orgName, technologyName } from "@/lib/data";
import type { Patent } from "@/lib/types";
import { PatentTable, type SortDir, type SortField } from "./patent-table";

const LEGAL_STATUS_ORDER: Patent["legalStatus"][] = ["Granted", "Pending", "Lapsed", "Withdrawn"];

interface Filters {
  search: string;
  mineral: string;
  technology: string;
  jurisdiction: string;
  applicant: string;
  legalStatus: Set<Patent["legalStatus"]>;
}

const EMPTY_FILTERS: Filters = {
  search: "",
  mineral: "",
  technology: "",
  jurisdiction: "",
  applicant: "",
  legalStatus: new Set(),
};

function useOptions() {
  return React.useMemo(() => {
    const mineralIds = Array.from(new Set(PATENTS.map((p) => p.mineral))).sort((a, b) =>
      mineralName(a).localeCompare(mineralName(b))
    );
    const technologyIds = Array.from(new Set(PATENTS.map((p) => p.technology))).sort((a, b) =>
      technologyName(a).localeCompare(technologyName(b))
    );
    const jurisdictions = Array.from(new Set(PATENTS.flatMap((p) => p.jurisdictions))).sort();
    const applicantIds = Array.from(new Set(PATENTS.flatMap((p) => p.applicants))).sort((a, b) =>
      orgName(a).localeCompare(orgName(b))
    );
    const legalStatuses = LEGAL_STATUS_ORDER.filter((s) => PATENTS.some((p) => p.legalStatus === s));
    return { mineralIds, technologyIds, jurisdictions, applicantIds, legalStatuses };
  }, []);
}

export function PatentExplorer() {
  const options = useOptions();
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [dedupe, setDedupe] = React.useState(false);
  const [sortField, setSortField] = React.useState<SortField>("priorityDate");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const toggleLegalStatus = (status: Patent["legalStatus"]) => {
    setFilters((f) => {
      const next = new Set(f.legalStatus);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return { ...f, legalStatus: next };
    });
  };

  const filtered = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return PATENTS.filter((p) => {
      if (filters.mineral && p.mineral !== filters.mineral) return false;
      if (filters.technology && p.technology !== filters.technology) return false;
      if (filters.jurisdiction && !p.jurisdictions.includes(filters.jurisdiction)) return false;
      if (filters.applicant && !p.applicants.includes(filters.applicant)) return false;
      if (filters.legalStatus.size > 0 && !filters.legalStatus.has(p.legalStatus)) return false;
      if (q) {
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesApplicant = p.applicants.some((a) => orgName(a).toLowerCase().includes(q));
        if (!matchesTitle && !matchesApplicant) return false;
      }
      return true;
    });
  }, [filters]);

  const sorted = React.useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortField === "priorityDate") {
        cmp = new Date(a.priorityDate).getTime() - new Date(b.priorityDate).getTime();
      } else {
        cmp = a.familySize - b.familySize;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortField, sortDir]);

  const familyCount = React.useMemo(() => new Set(filtered.map((p) => p.familyId)).size, [filtered]);

  const rows = React.useMemo(() => {
    if (!dedupe) return sorted.map((p) => ({ ...p, familyRowCount: 1 }));
    const seen = new Map<string, { patent: Patent; count: number }>();
    for (const p of sorted) {
      const entry = seen.get(p.familyId);
      if (entry) entry.count += 1;
      else seen.set(p.familyId, { patent: p, count: 1 });
    }
    return Array.from(seen.values()).map(({ patent, count }) => ({ ...patent, familyRowCount: count }));
  }, [sorted, dedupe]);

  const activeFilterCount =
    (filters.search.trim() ? 1 : 0) +
    (filters.mineral ? 1 : 0) +
    (filters.technology ? 1 : 0) +
    (filters.jurisdiction ? 1 : 0) +
    (filters.applicant ? 1 : 0) +
    filters.legalStatus.size;

  const clearAll = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Patent Intelligence"
        title="Patent Explorer"
        subtitle="Browse synthetic demonstration patent records across minerals, technologies and jurisdictions. Family-aware view available via the deduplication toggle."
      />

      <FadeIn>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <KpiCard label="Publication Count" value={filtered.length} icon={FileText} hint="Total patent records matching filters" demo />
          <KpiCard label="Patent Family Count" value={familyCount} icon={Layers} hint="Distinct invention families (familyId)" demo />
        </div>
      </FadeIn>

      <Card>
        <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-wrap items-end gap-3">
            <label className="flex min-w-[220px] flex-1 flex-col gap-1">
              <span className="text-2xs uppercase tracking-wider text-ink-faint">Search</span>
              <span className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
                <input
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  placeholder="Title or applicant…"
                  className="h-9 w-full rounded-md border border-border-strong bg-surface-2 pl-8 pr-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-data focus-visible:outline-none"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-2xs uppercase tracking-wider text-ink-faint">Mineral</span>
              <select
                value={filters.mineral}
                onChange={(e) => setFilters((f) => ({ ...f, mineral: e.target.value }))}
                className="h-9 rounded-md border border-border-strong bg-surface-2 px-2.5 text-sm text-ink focus-visible:border-data focus-visible:outline-none"
              >
                <option value="">All minerals</option>
                {options.mineralIds.map((id) => (
                  <option key={id} value={id}>
                    {mineralName(id)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-2xs uppercase tracking-wider text-ink-faint">Technology</span>
              <select
                value={filters.technology}
                onChange={(e) => setFilters((f) => ({ ...f, technology: e.target.value }))}
                className="h-9 rounded-md border border-border-strong bg-surface-2 px-2.5 text-sm text-ink focus-visible:border-data focus-visible:outline-none"
              >
                <option value="">All technologies</option>
                {options.technologyIds.map((id) => (
                  <option key={id} value={id}>
                    {technologyName(id)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-2xs uppercase tracking-wider text-ink-faint">Jurisdiction</span>
              <select
                value={filters.jurisdiction}
                onChange={(e) => setFilters((f) => ({ ...f, jurisdiction: e.target.value }))}
                className="h-9 rounded-md border border-border-strong bg-surface-2 px-2.5 text-sm text-ink focus-visible:border-data focus-visible:outline-none"
              >
                <option value="">All jurisdictions</option>
                {options.jurisdictions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-2xs uppercase tracking-wider text-ink-faint">Applicant</span>
              <select
                value={filters.applicant}
                onChange={(e) => setFilters((f) => ({ ...f, applicant: e.target.value }))}
                className="h-9 max-w-[200px] rounded-md border border-border-strong bg-surface-2 px-2.5 text-sm text-ink focus-visible:border-data focus-visible:outline-none"
              >
                <option value="">All applicants</option>
                {options.applicantIds.map((id) => (
                  <option key={id} value={id}>
                    {orgName(id)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-center gap-2 self-start rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-xs font-medium text-ink-soft sm:self-end">
            <input
              type="checkbox"
              checked={dedupe}
              onChange={(e) => setDedupe(e.target.checked)}
              className="h-3.5 w-3.5 accent-mineral"
            />
            Deduplicate by family
          </label>
        </CardHeader>
        <CardBody className="flex flex-wrap items-center gap-2">
          <span className="text-2xs uppercase tracking-wider text-ink-faint">Legal status</span>
          {options.legalStatuses.map((status) => (
            <Chip key={status} active={filters.legalStatus.has(status)} onClick={() => toggleLegalStatus(status)}>
              {status}
            </Chip>
          ))}
          <span className="ml-auto flex items-center gap-3">
            <span className="text-2xs text-ink-faint">
              {activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-2xs font-medium text-data hover:underline"
              >
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </span>
        </CardBody>
      </Card>

      {rows.length === 0 ? (
        <EmptyState
          title="No patents match these filters."
          hint="Try clearing a filter or broadening your search — this is a fixed synthetic demo dataset of 20 illustrative patent records."
          actions={activeFilterCount > 0 ? [{ label: "Clear all filters", onClick: clearAll }] : undefined}
        />
      ) : (
        <PatentTable rows={rows} deduped={dedupe} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
      )}
    </div>
  );
}
