"use client";
import * as React from "react";
import { Users2 } from "lucide-react";
import { SectionHeader, Chip, DemoBadge, EmptyState } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { CollabCard } from "@/components/collaboration/collab-card";
import { COLLABORATION_SIGNALS, mineralName } from "@/lib/data";

export default function CollaborationPage() {
  const minerals = React.useMemo(() => {
    const ids = Array.from(new Set(COLLABORATION_SIGNALS.map((s) => s.mineral)));
    return ids.map((id) => ({ id, name: mineralName(id) }));
  }, []);

  const [mineral, setMineral] = React.useState<string | null>(null);

  const signals = React.useMemo(
    () => (mineral ? COLLABORATION_SIGNALS.filter((s) => s.mineral === mineral) : COLLABORATION_SIGNALS),
    [mineral]
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Complementary Capability"
        title="Collaboration Intelligence"
        subtitle="Exploratory signals of complementary strength across organisations — never a recommendation."
        action={<DemoBadge />}
      />

      <div className="flex items-start gap-2 rounded-card border border-border bg-surface-2 px-4 py-3">
        <Users2 className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
        <p className="text-xs leading-relaxed text-ink-soft">
          These are <strong className="text-ink">Potential complementary capability signals</strong> — pairs of
          organisations whose demonstrated strengths appear to complement each other along a mineral&apos;s value
          chain, based on patent, R&amp;D and publication evidence. They are exploratory signals, never a
          recommendation that any two organisations &ldquo;should collaborate&rdquo;.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip active={mineral === null} onClick={() => setMineral(null)}>
          All minerals
        </Chip>
        {minerals.map((m) => (
          <Chip key={m.id} active={mineral === m.id} onClick={() => setMineral(m.id)}>
            {m.name}
          </Chip>
        ))}
      </div>

      {signals.length === 0 ? (
        <EmptyState
          title="No complementary capability signals for this mineral."
          hint="Try clearing the filter to see signals across all minerals in the demo dataset."
          actions={[{ label: "Clear filter", onClick: () => setMineral(null) }]}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {signals.map((s) => (
            <StaggerItem key={s.id}>
              <CollabCard signal={s} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
