"use client";
import * as React from "react";
import { Database, ShieldCheck, FlaskConical, SearchX } from "lucide-react";
import { SectionHeader, KpiCard, DemoBadge, EmptyState, Card } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { EVIDENCE } from "@/lib/data";
import { confidenceBand } from "@/lib/utils";
import { EvidenceFilters, DEFAULT_EVIDENCE_FILTERS, type EvidenceFiltersState } from "./evidence-filters";
import { EvidenceRow } from "./evidence-row";

/**
 * The Evidence Center — the platform's trust centre. Every insight rendered
 * elsewhere in KhanijDrishti should be traceable back to a record here
 * (spec §40). All records are synthetic demonstration data.
 */
export function EvidenceExplorer() {
  const [filters, setFilters] = React.useState<EvidenceFiltersState>(DEFAULT_EVIDENCE_FILTERS);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const totalEvidence = EVIDENCE.length;
  const distinctSources = React.useMemo(() => new Set(EVIDENCE.map((e) => e.provenance.source)).size, []);
  const pctHighConfidence = React.useMemo(() => {
    const high = EVIDENCE.filter((e) => confidenceBand(e.provenance.confidence) === "High").length;
    return totalEvidence ? (high / totalEvidence) * 100 : 0;
  }, [totalEvidence]);

  const filtered = React.useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return EVIDENCE.filter((e) => {
      if (q && !e.title.toLowerCase().includes(q)) return false;
      if (filters.source !== "all" && e.provenance.source !== filters.source) return false;
      if (filters.type !== "all" && e.type !== filters.type) return false;
      if (filters.band !== "All" && confidenceBand(e.provenance.confidence) !== filters.band) return false;
      if (filters.mineral !== "all" && e.mineral !== filters.mineral) return false;
      if (filters.technology !== "all" && e.technology !== filters.technology) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Evidence Center"
        title="Evidence Explorer"
        subtitle="Every mineral, technology and gap signal in KhanijDrishti traces back to a record here — source, provenance and confidence included."
        action={<DemoBadge />}
      />

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StaggerItem>
          <KpiCard label="Total evidence records" value={totalEvidence} icon={FlaskConical} hint="across patents, R&D, publications" />
        </StaggerItem>
        <StaggerItem>
          <KpiCard label="Distinct sources" value={distinctSources} icon={Database} hint="registered data sources" />
        </StaggerItem>
        <StaggerItem>
          <KpiCard
            label="High-confidence records"
            value={pctHighConfidence}
            format={(n) => `${n.toFixed(0)}%`}
            icon={ShieldCheck}
            hint="confidence ≥ 0.85"
          />
        </StaggerItem>
      </Stagger>

      <p className="text-2xs text-ink-faint">
        Note: all records shown are synthetic demonstration data generated for this prototype and do not represent
        real filings, publications or live source connectivity.
      </p>

      <Card>
        <div className="border-b border-border p-4">
          <EvidenceFilters value={filters} onChange={setFilters} />
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={SearchX}
              title="No evidence matches these filters."
              hint="Try widening your search, or clearing a filter."
              actions={[{ label: "Clear filters", onClick: () => setFilters(DEFAULT_EVIDENCE_FILTERS) }]}
            />
          </div>
        ) : (
          <FadeIn className="max-h-[720px] overflow-y-auto">
            <div className="hidden items-center gap-3 border-b border-border px-4 py-2 text-2xs uppercase tracking-wider text-ink-faint sm:flex">
              <span className="w-24 shrink-0">Evidence ID</span>
              <span className="flex-1">Title</span>
              <span>Type / Source / Confidence</span>
            </div>
            {filtered.map((e) => (
              <EvidenceRow
                key={e.id}
                evidence={e}
                expanded={expandedId === e.id}
                onToggle={() => setExpandedId((cur) => (cur === e.id ? null : e.id))}
              />
            ))}
          </FadeIn>
        )}
      </Card>

      <p className="text-2xs text-ink-faint">
        Showing {filtered.length} of {totalEvidence} evidence records.
      </p>
    </div>
  );
}
