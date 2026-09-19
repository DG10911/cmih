import { Gem, FileText, FlaskConical, Cpu, Building2, Database } from "lucide-react";
import { KpiCard } from "@/components/ui";
import { StaggerItem } from "@/components/motion";
import { PLATFORM_TOTALS } from "@/lib/data";
import { formatCompact } from "@/lib/utils";

const KPIS = [
  { label: "Critical Minerals", value: PLATFORM_TOTALS.minerals, icon: Gem },
  { label: "Patent Families", value: PLATFORM_TOTALS.patentFamilies, icon: FileText },
  { label: "R&D Records", value: PLATFORM_TOTALS.rdRecords, icon: FlaskConical },
  { label: "Technology Nodes", value: PLATFORM_TOTALS.technologyNodes, icon: Cpu },
  { label: "Organisations", value: PLATFORM_TOTALS.organisations, icon: Building2 },
  { label: "Evidence Records", value: PLATFORM_TOTALS.evidenceRecords, icon: Database, format: formatCompact },
];

/** Platform-wide KPI strip — horizontal scroll on mobile, grid on desktop (spec §21-22). */
export function KpiGrid() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6">
      {KPIS.map((kpi) => (
        <StaggerItem key={kpi.label} className="min-w-[168px] flex-1 sm:min-w-0">
          <KpiCard
            label={kpi.label}
            value={kpi.value}
            format={kpi.format}
            icon={kpi.icon}
            demo
          />
        </StaggerItem>
      ))}
    </div>
  );
}
