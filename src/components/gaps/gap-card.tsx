"use client";
import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, LevelBadge, Button, Modal } from "@/components/ui";
import { getMineral, getTechnology } from "@/lib/data";
import type { GapSignal } from "@/lib/types";
import { GapTypeBadge } from "./gap-type-badge";
import { ExplainSignalContent } from "./explain-signal";

/**
 * A single Potential Capability Gap Signal card (spec §29-31).
 * The card body is a "block link" to /gaps/[id]: a full-bleed absolutely
 * positioned <Link> sits under the content so the whole card is clickable,
 * while the "Explain Signal" button stacks above it (higher z-index) so its
 * own click is captured first and never triggers navigation.
 */
export function GapCard({ signal }: { signal: GapSignal }) {
  const [explainOpen, setExplainOpen] = React.useState(false);
  const technology = getTechnology(signal.technology);
  const mineral = getMineral(signal.mineral);

  const matrix: { label: string; value: GapSignal["strategicNeed"] }[] = [
    { label: "Strategic Need", value: signal.strategicNeed },
    { label: "Global Momentum", value: signal.globalMomentum },
    { label: "Indian R&D", value: signal.indianRdActivity },
    { label: "Indian Patent", value: signal.indianPatentActivity },
    { label: "Evidence Sufficiency", value: signal.evidenceSufficiency },
  ];

  return (
    <Card className="relative flex h-full flex-col gap-3 p-4 transition-colors hover:border-border-strong">
      <Link
        href={`/gaps/${signal.id}`}
        className="absolute inset-0 z-0 rounded-card"
        aria-label={`View potential gap signal for ${technology?.name ?? signal.technology}`}
      />

      <div className="relative z-[1] flex items-start justify-between gap-2">
        <GapTypeBadge gapType={signal.gapType} />
        <LevelBadge value={signal.confidence} label="Confidence" />
      </div>

      <div className="relative z-[1]">
        <h3 className="text-sm font-semibold leading-snug text-ink">{technology?.name ?? signal.technology}</h3>
        <p className="mt-0.5 text-2xs text-ink-faint">{mineral?.name ?? signal.mineral}</p>
      </div>

      <div className="relative z-[1] grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {matrix.map((m) => (
          <LevelBadge key={m.label} value={m.value} label={m.label} className="w-full justify-center text-center" />
        ))}
      </div>

      <div className="relative z-[2] mt-auto pt-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExplainOpen(true);
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Explain Signal
        </Button>
      </div>

      <Modal
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        eyebrow="Explain Signal · Potential capability gap"
        title={technology?.name ?? signal.technology}
      >
        <ExplainSignalContent signal={signal} />
      </Modal>
    </Card>
  );
}
