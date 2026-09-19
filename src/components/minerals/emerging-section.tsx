import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Card, Pill, MomentumBadge, MeterBar, EmptyState } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { technologyName } from "@/lib/data";
import { formatPercent } from "@/lib/utils";
import { ProfileSection } from "./section-shell";
import type { EmergingTechnology } from "@/lib/types";

/** Section 8 — Emerging Technologies radar items for this mineral. */
export function EmergingSection({ items }: { items: EmergingTechnology[] }) {
  const sorted = [...items].sort((a, b) => b.emergingScore - a.emergingScore);

  return (
    <ProfileSection
      id="emerging"
      eyebrow="Section 08"
      title="Emerging Technologies"
      subtitle="Radar signal composed of research growth, patent growth, org growth, novelty, recency and maturity evidence."
    >
      {sorted.length === 0 ? (
        <EmptyState icon={Sparkles} title="No emerging-technology signals for this mineral." />
      ) : (
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((e) => (
            <StaggerItem key={e.id}>
              <Link href={`/technologies/${e.technology}`} className="group block h-full focus-visible:outline-none">
                <Card className="flex h-full flex-col p-4 transition-colors group-hover:border-mineral/40 group-focus-visible:border-data">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      {technologyName(e.technology)}
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <MomentumBadge value={e.momentum} />
                  </div>
                  <Pill className="mt-1.5 w-fit border-border-strong bg-surface-2 text-ink-soft">{e.zone}</Pill>
                  <MeterBar
                    className="mt-3"
                    value={e.emergingScore}
                    label="Emerging score"
                    valueLabel={formatPercent(e.emergingScore)}
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
