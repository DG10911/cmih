"use client";
import { FileText, BookOpen, FlaskConical, Building2 } from "lucide-react";
import { KpiCard } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { formatNumber } from "@/lib/utils";
import type { EntityMetrics } from "@/lib/types";

/**
 * Client-owned KPI row. Icons are imported here (not passed across the RSC
 * boundary from the server page, which would be non-serializable).
 */
export function TechnologyKpiRow({ metrics }: { metrics: EntityMetrics }) {
  return (
    <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StaggerItem>
        <KpiCard label="Patent families" value={metrics.patentFamilies} icon={FileText} format={formatNumber} demo />
      </StaggerItem>
      <StaggerItem>
        <KpiCard label="Publications" value={metrics.publications} icon={BookOpen} format={formatNumber} demo />
      </StaggerItem>
      <StaggerItem>
        <KpiCard label="R&D projects" value={metrics.rdProjects} icon={FlaskConical} format={formatNumber} demo />
      </StaggerItem>
      <StaggerItem>
        <KpiCard label="Organisations" value={metrics.organisations} icon={Building2} format={formatNumber} demo />
      </StaggerItem>
    </Stagger>
  );
}
