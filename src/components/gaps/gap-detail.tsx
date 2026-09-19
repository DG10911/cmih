"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, FlaskConical, Sparkles } from "lucide-react";
import { Card, CardHeader, CardBody, SectionHeader, LevelBadge, Button, Modal } from "@/components/ui";
import { EvidenceDrawer } from "@/components/intelligence/evidence-drawer";
import { FadeIn } from "@/components/motion";
import { getMineral, getTechnology } from "@/lib/data";
import type { GapSignal } from "@/lib/types";
import { GapTypeBadge } from "./gap-type-badge";
import { ExplainSignalContent } from "./explain-signal";

const MATRIX_ROWS: { label: string; key: keyof Pick<GapSignal, "strategicNeed" | "globalMomentum" | "indianRdActivity" | "indianPatentActivity" | "evidenceSufficiency"> }[] = [
  { label: "Strategic Need", key: "strategicNeed" },
  { label: "Global Momentum", key: "globalMomentum" },
  { label: "Indian R&D Activity", key: "indianRdActivity" },
  { label: "Indian Patent Activity", key: "indianPatentActivity" },
  { label: "Evidence Sufficiency", key: "evidenceSufficiency" },
];

/** `Strategic Need + Technology Momentum + Domestic Capability Deficit + Evidence Sufficiency` formula, rendered transparently with the signal's own weight values (spec §30). */
function GapFormula({ signal }: { signal: GapSignal }) {
  const w = signal.weights;
  return (
    <div className="rounded-md border border-border-strong bg-surface-2 px-4 py-3">
      <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">Gap-signal formula</div>
      <div className="overflow-x-auto whitespace-nowrap font-mono text-xs text-ink-soft">
        Gap Score&nbsp;=&nbsp;
        <span className="text-mineral">{w.strategicRelevance.toFixed(2)}</span>&nbsp;×&nbsp;Strategic Need&nbsp;+&nbsp;
        <span className="text-mineral">{w.technologyMomentum.toFixed(2)}</span>&nbsp;×&nbsp;Technology Momentum&nbsp;+&nbsp;
        <span className="text-mineral">{w.domesticCapability.toFixed(2)}</span>&nbsp;×&nbsp;Domestic Capability Deficit&nbsp;+&nbsp;
        <span className="text-data">{w.evidenceSufficiency.toFixed(2)}</span>&nbsp;×&nbsp;Evidence Sufficiency
      </div>
      <p className="mt-2 text-2xs leading-relaxed text-ink-faint">
        These weights are configurable prototype heuristics for this demo, not a validated policy formula.
        &ldquo;Domestic Capability Deficit&rdquo; rewards technologies where global momentum is high but Indian R&D /
        patent activity is comparatively low.
      </p>
    </div>
  );
}

export function GapDetail({ signal }: { signal: GapSignal }) {
  const technology = getTechnology(signal.technology);
  const mineral = getMineral(signal.mineral);
  const [explainModalOpen, setExplainModalOpen] = React.useState(false);
  const [drawerIds, setDrawerIds] = React.useState<string[] | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Gap Intelligence · Potential Signal"
        title={technology?.name ?? signal.technology}
        subtitle="This page presents a potential capability gap signal derived from indexed evidence. It is not a definitive statement about India's technological capability — read alongside the confidence, evidence sufficiency and data-limitations notes below."
      />

      <FadeIn>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <GapTypeBadge gapType={signal.gapType} />
              <LevelBadge value={signal.confidence} label="Confidence" />
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-2xs uppercase tracking-wider text-ink-faint">Technology</div>
                {technology ? (
                  <Link href={`/technologies/${technology.id}`} className="group inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-mineral">
                    {technology.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ) : (
                  <span className="text-sm text-ink">{signal.technology}</span>
                )}
              </div>
              <div>
                <div className="text-2xs uppercase tracking-wider text-ink-faint">Mineral</div>
                {mineral ? (
                  <Link href={`/minerals/${mineral.id}`} className="group inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-mineral">
                    {mineral.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ) : (
                  <span className="text-sm text-ink">{signal.mineral}</span>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">Signal matrix</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {MATRIX_ROWS.map((row) => (
                  <LevelBadge key={row.key} value={signal[row.key]} label={row.label} className="w-full justify-center text-center" />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <Button variant="primary" size="sm" onClick={() => setExplainModalOpen(true)}>
                <Sparkles className="h-3.5 w-3.5" />
                Explain Signal
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDrawerIds(signal.evidenceIds)}>
                <FlaskConical className="h-3.5 w-3.5" />
                View supporting evidence ({signal.evidenceIds.length})
              </Button>
            </div>
          </CardBody>
        </Card>
      </FadeIn>

      <FadeIn delay={0.06}>
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold text-ink">Why this signal? (inline)</h2>
              <p className="mt-1 text-sm text-ink-soft">
                The same breakdown shown in the &ldquo;Explain Signal&rdquo; modal, rendered inline for transparency.
              </p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <ExplainSignalContent signal={signal} />
            <GapFormula signal={signal} />
            <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
              <span className="text-2xs uppercase tracking-wider text-ink-faint">Citations:</span>
              {signal.evidenceIds.map((id, i) => (
                <button
                  key={id}
                  onClick={() => setDrawerIds([id])}
                  className="rounded-md border border-border-strong bg-surface-2 px-1.5 py-0.5 font-mono text-2xs text-data transition-colors hover:bg-surface-3"
                  title={`Open evidence record ${id}`}
                >
                  [Evidence {i + 1}]
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </FadeIn>

      <Modal
        open={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        eyebrow="Explain Signal · Potential capability gap"
        title={technology?.name ?? signal.technology}
      >
        <ExplainSignalContent signal={signal} />
      </Modal>

      <EvidenceDrawer
        open={drawerIds != null}
        onClose={() => setDrawerIds(null)}
        evidenceIds={drawerIds ?? []}
        title="Supporting Evidence"
      />
    </div>
  );
}
