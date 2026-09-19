"use client";
import { SectionHeader, EmptyState } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { EMERGING_TECHNOLOGIES } from "@/lib/data";
import { EmergingRadar } from "@/components/emerging/radar";
import { EmergingCard } from "@/components/emerging/emerging-card";

export default function EmergingPage() {
  const sorted = [...EMERGING_TECHNOLOGIES].sort((a, b) => b.emergingScore - a.emergingScore);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Emerging Radar"
        title="Emerging Critical Mineral Technology Signals"
        subtitle="A lifecycle signal built from indexed research, patent and organisational-growth evidence — not an official technology readiness level. Read scores alongside their component breakdown and treat sparse evidence as inconclusive, not negative."
      />

      <FadeIn>
        <EmergingRadar />
      </FadeIn>

      <FadeIn delay={0.08}>
        {sorted.length === 0 ? (
          <EmptyState title="No emerging technology signals available." />
        ) : (
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((item) => (
              <StaggerItem key={item.id} className="h-full">
                <EmergingCard item={item} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </FadeIn>
    </div>
  );
}
