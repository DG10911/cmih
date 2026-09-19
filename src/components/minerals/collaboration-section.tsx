import Link from "next/link";
import { Network, ArrowRight } from "lucide-react";
import { Card, MeterBar, EmptyState } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { orgName } from "@/lib/data";
import { formatPercent } from "@/lib/utils";
import { ProfileSection } from "./section-shell";
import type { CollaborationSignal } from "@/lib/types";

/** Section 10 — Collaboration Opportunities: complementary-capability signals. */
export function CollaborationSection({ signals }: { signals: CollaborationSignal[] }) {
  const sorted = [...signals].sort((a, b) => b.complementarity - a.complementarity);

  return (
    <ProfileSection
      id="collaboration"
      eyebrow="Section 10"
      title="Collaboration Opportunities"
      subtitle="Potential complementary-capability signals between organisations active on this mineral."
    >
      {sorted.length === 0 ? (
        <EmptyState icon={Network} title="No complementary-capability signals for this mineral." />
      ) : (
        <Stagger className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {sorted.map((c) => (
            <StaggerItem key={c.id}>
              <Card className="flex h-full flex-col p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
                  <Link href={`/organisations/${c.orgA}`} className="hover:text-mineral">
                    {orgName(c.orgA)}
                  </Link>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                  <Link href={`/organisations/${c.orgB}`} className="hover:text-mineral">
                    {orgName(c.orgB)}
                  </Link>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-md border border-border bg-surface-2/60 px-2.5 py-1.5">
                    <div className="text-2xs uppercase tracking-wider text-ink-faint">Strength A</div>
                    <div className="mt-0.5 text-xs text-ink">{c.strengthA}</div>
                  </div>
                  <div className="rounded-md border border-border bg-surface-2/60 px-2.5 py-1.5">
                    <div className="text-2xs uppercase tracking-wider text-ink-faint">Strength B</div>
                    <div className="mt-0.5 text-xs text-ink">{c.strengthB}</div>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-xs leading-relaxed text-ink-soft">{c.rationale}</p>
                <MeterBar
                  className="mt-3"
                  value={c.complementarity}
                  label="Potential complementarity"
                  valueLabel={formatPercent(c.complementarity)}
                  tone="success"
                />
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </ProfileSection>
  );
}
