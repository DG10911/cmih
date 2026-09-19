"use client";
import { Database, Radio, CalendarClock, Info } from "lucide-react";
import { SectionHeader, KpiCard, Card, CardHeader, CardBody } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { DataCoverageTable } from "@/components/system/data-coverage-table";
import { SourceHealthPanel } from "@/components/system/source-health-panel";
import { DATA_SOURCES, PROTOTYPE_DISCLAIMER } from "@/lib/data";
import { formatCompact } from "@/lib/utils";

export default function SourcesPage() {
  const totalRecords = DATA_SOURCES.reduce((sum, s) => sum + s.records, 0);
  const connectedCount = DATA_SOURCES.filter((s) => s.status === "CONNECTED" || s.status === "DEMO").length;
  const plannedCount = DATA_SOURCES.filter((s) => s.status === "PLANNED").length;

  return (
    <div className="space-y-6">
      <FadeIn>
        <SectionHeader
          eyebrow="Data & Sources"
          title="Data Coverage"
          subtitle="Every connector's status, record count and coverage level, read straight from the source registry. Nothing here is inferred connectivity."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Total indexed records" value={totalRecords} format={formatCompact} icon={Database} hint="across all connectors" />
          <KpiCard label="Active connectors" value={connectedCount} icon={Radio} hint="Connected + demo sources" />
          <KpiCard label="Planned connectors" value={plannedCount} icon={CalendarClock} hint="authorised, not yet wired" />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <FadeIn delay={0.1} className="min-w-0">
          <SectionHeader eyebrow="Registry" title="Data Coverage" className="mb-3" />
          <DataCoverageTable sources={DATA_SOURCES} />
        </FadeIn>

        <FadeIn delay={0.15} className="min-w-0">
          <Card>
            <CardHeader>
              <div>
                <div className="text-sm font-semibold text-ink">Source Health</div>
                <p className="mt-0.5 text-2xs text-ink-soft">Live-style pulse per connector</p>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <SourceHealthPanel sources={DATA_SOURCES} />
            </CardBody>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <div className="flex items-start gap-2.5 rounded-card border border-border bg-surface-2/60 px-4 py-3 text-2xs leading-relaxed text-ink-faint">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mineral" />
          <p>
            <span className="font-medium text-ink-soft">Planned</span> connectors (IP India, WIPO PATENTSCOPE, EPO OPS,
            SATYABHAMA / Ministry of Mines) are future authorised source integrations, not outages — they carry zero
            records until wired to a live feed. {PROTOTYPE_DISCLAIMER}
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
