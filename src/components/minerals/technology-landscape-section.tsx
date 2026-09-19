import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { Card, MomentumBadge, Pill, MeterBar, EmptyState } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { ProfileSection } from "./section-shell";
import type { Technology, ValueChainStage } from "@/lib/types";

/** Section 3 — Technology Landscape: technologies observed for this mineral. */
export function TechnologyLandscapeSection({
  technologies,
  stageFilter,
}: {
  technologies: Technology[];
  stageFilter: ValueChainStage | null;
}) {
  const maxEvidence = Math.max(1, ...technologies.map((t) => t.landscape.evidenceVolume));

  return (
    <ProfileSection
      id="technologies"
      eyebrow="Section 03"
      title="Technology Landscape"
      subtitle="Technologies with observed activity for this mineral, ranked by evidence volume."
    >
      {technologies.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={stageFilter ? `No technologies observed at the ${stageFilter} stage.` : "No technologies observed."}
          hint="Try clearing the value-chain filter above."
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((t) => (
            <StaggerItem key={t.id}>
              <Link href={`/technologies/${t.id}`} className="group block h-full focus-visible:outline-none">
                <Card className="flex h-full flex-col p-4 transition-colors group-hover:border-mineral/40 group-focus-visible:border-data">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      {t.name}
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <MomentumBadge value={t.momentum} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Pill className="border-border-strong bg-surface-2 text-ink-soft">{t.maturity}</Pill>
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-soft">{t.description}</p>
                  <MeterBar
                    className="mt-3"
                    value={t.landscape.evidenceVolume / maxEvidence}
                    label="Evidence volume"
                    valueLabel={`${t.landscape.evidenceVolume} records`}
                    tone="data"
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
