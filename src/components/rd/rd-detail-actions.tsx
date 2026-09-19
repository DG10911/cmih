"use client";
import * as React from "react";
import { HelpCircle, FileSearch } from "lucide-react";
import { Button } from "@/components/ui";
import { WhyThisModal } from "@/components/intelligence/why-this-modal";
import { EvidenceDrawer } from "@/components/intelligence/evidence-drawer";
import type { ClassificationSignal } from "@/lib/types";

/**
 * Interactive trigger buttons for the R&D project detail page:
 * "Why classified this way?" (WhyThisModal) and an evidence summary
 * button (EvidenceDrawer). Isolated in a client component so the parent
 * detail page can remain a server component with `generateStaticParams`.
 */
export function RDDetailActions({
  matchedMineral,
  matchedTechnology,
  confidence,
  signals,
  evidenceIds,
}: {
  matchedMineral: string;
  matchedTechnology: string;
  confidence: number;
  signals: ClassificationSignal[];
  evidenceIds: string[];
}) {
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [evidenceOpen, setEvidenceOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setWhyOpen(true)}>
          <HelpCircle className="h-3.5 w-3.5" /> Why classified this way?
        </Button>
        <Button variant="outline" size="sm" onClick={() => setEvidenceOpen(true)}>
          <FileSearch className="h-3.5 w-3.5" /> Evidence summary
        </Button>
      </div>

      <WhyThisModal
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        matchedMineral={matchedMineral}
        matchedTechnology={matchedTechnology}
        confidence={confidence}
        signals={signals}
      />
      <EvidenceDrawer
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceIds={evidenceIds}
        title="Evidence Summary"
      />
    </>
  );
}
