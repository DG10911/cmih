"use client";
import * as React from "react";
import Link from "next/link";
import { TriangleAlert, ArrowUpRight, HelpCircle } from "lucide-react";
import { Card, Pill, LevelBadge, Button, EmptyState } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { WhyThisModal } from "@/components/intelligence/why-this-modal";
import { mineralName, technologyName } from "@/lib/data";
import { ProfileSection } from "./section-shell";
import type { GapSignal, Level } from "@/lib/types";

/** Rough demo mapping from a qualitative Level to a 0..1 confidence for the explainability modal. */
function levelToConfidence(level: Level): number {
  return { High: 0.88, Medium: 0.66, Low: 0.42 }[level];
}

/** Section 9 — Potential Gap Signals (spec §29-31): signals, never conclusions. */
export function GapsSection({ gaps }: { gaps: GapSignal[] }) {
  const [explainId, setExplainId] = React.useState<string | null>(null);
  const active = gaps.find((g) => g.id === explainId) ?? null;

  return (
    <ProfileSection
      id="gaps"
      eyebrow="Section 09"
      title="Potential Gap Signals"
      subtitle="Heuristic signals of possible research, technology or strategic capability gaps — not confirmed conclusions."
    >
      {gaps.length === 0 ? (
        <EmptyState icon={TriangleAlert} title="No gap signals identified for this mineral." />
      ) : (
        <Stagger className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {gaps.map((g) => (
            <StaggerItem key={g.id}>
              <Card className="flex h-full flex-col p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Pill className="border-warning/40 bg-warning/10 text-warning">{g.gapType}</Pill>
                    <div className="mt-1.5 text-sm font-medium text-ink">{technologyName(g.technology)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <LevelBadge value={g.confidence} label="Confidence" />
                    <LevelBadge value={g.evidenceSufficiency} label="Evidence" />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-2xs text-ink-soft sm:grid-cols-4">
                  <Stat label="Patent families" value={g.supportingEvidence.patentFamilies} />
                  <Stat label="Publications" value={g.supportingEvidence.publications} />
                  <Stat label="R&D projects" value={g.supportingEvidence.rdProjects} />
                  <Stat label="Organisations" value={g.supportingEvidence.organisations} />
                </div>

                <p className="mt-3 flex-1 text-2xs italic leading-relaxed text-ink-faint">{g.dataLimitations}</p>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <Button variant="outline" size="sm" onClick={() => setExplainId(g.id)}>
                    <HelpCircle className="h-3.5 w-3.5" /> Explain
                  </Button>
                  <Link href={`/gaps/${g.id}`} className="inline-flex items-center gap-1 text-2xs text-data hover:text-data-soft">
                    View full signal <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {active && (
        <WhyThisModal
          open={!!active}
          onClose={() => setExplainId(null)}
          matchedMineral={mineralName(active.mineral)}
          matchedTechnology={technologyName(active.technology)}
          confidence={levelToConfidence(active.confidence)}
          sourceRecords={
            active.supportingEvidence.patentFamilies +
            active.supportingEvidence.publications +
            active.supportingEvidence.rdProjects
          }
          signals={[
            { label: "Strategic relevance", contribution: active.weights.strategicRelevance, detail: `Strategic need: ${active.strategicNeed}` },
            { label: "Technology momentum", contribution: active.weights.technologyMomentum, detail: `Global momentum: ${active.globalMomentum}` },
            {
              label: "Domestic capability",
              contribution: active.weights.domesticCapability,
              detail: `Indian R&D activity: ${active.indianRdActivity} · Indian patent activity: ${active.indianPatentActivity}`,
            },
            { label: "Evidence sufficiency", contribution: active.weights.evidenceSufficiency, detail: active.dataLimitations },
          ]}
        />
      )}
    </ProfileSection>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-surface-2/60 px-2 py-1.5">
      <div className="font-mono text-xs font-semibold tabular-nums text-ink">{value}</div>
      <div className="text-2xs text-ink-faint">{label}</div>
    </div>
  );
}
