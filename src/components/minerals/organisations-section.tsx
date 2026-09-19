import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { Card, Pill, MeterBar, EmptyState } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { ProfileSection } from "./section-shell";
import type { Organisation } from "@/lib/types";

/** Section 7 — Leading Organisations active on this mineral. */
export function OrganisationsSection({ organisations }: { organisations: Organisation[] }) {
  const maxPatents = Math.max(1, ...organisations.map((o) => o.metrics.patentFamilies));
  const sorted = [...organisations].sort((a, b) => b.metrics.patentFamilies - a.metrics.patentFamilies);

  return (
    <ProfileSection
      id="organisations"
      eyebrow="Section 07"
      title="Leading Organisations"
      subtitle="Organisations with observed patent, R&D or publication activity on this mineral."
    >
      {sorted.length === 0 ? (
        <EmptyState icon={Building2} title="No organisations observed for this mineral." />
      ) : (
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((o) => (
            <StaggerItem key={o.id}>
              <Link href={`/organisations/${o.id}`} className="group block h-full focus-visible:outline-none">
                <Card className="flex h-full flex-col p-4 transition-colors group-hover:border-mineral/40 group-focus-visible:border-data">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      {o.name}
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Pill className="border-border-strong bg-surface-2 text-ink-soft">{o.type}</Pill>
                    <Pill className="border-border-strong bg-surface-2 text-ink-soft">{o.country}</Pill>
                  </div>
                  <MeterBar
                    className="mt-3"
                    value={o.metrics.patentFamilies / maxPatents}
                    label="Patent families"
                    valueLabel={String(o.metrics.patentFamilies)}
                    tone="mineral"
                  />
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </ProfileSection>
  );
}
