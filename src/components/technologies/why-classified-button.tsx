"use client";
import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { WhyThisModal } from "@/components/intelligence/why-this-modal";
import type { ClassificationSignal } from "@/lib/types";

/**
 * Mandatory "Why?" trigger (spec golden rule §3) for the technology detail
 * page's classification, seeded from a representative related patent/R&D
 * record's classification signal breakdown.
 */
export function WhyClassifiedButton({
  matchedMineral,
  matchedTechnology,
  confidence,
  signals,
  sourceRecords,
}: {
  matchedMineral: string;
  matchedTechnology: string;
  confidence: number;
  signals: ClassificationSignal[];
  sourceRecords?: number;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <HelpCircle className="h-3.5 w-3.5" />
        Why classified here?
      </Button>
      <WhyThisModal
        open={open}
        onClose={() => setOpen(false)}
        matchedMineral={matchedMineral}
        matchedTechnology={matchedTechnology}
        confidence={confidence}
        signals={signals}
        sourceRecords={sourceRecords}
      />
    </>
  );
}
