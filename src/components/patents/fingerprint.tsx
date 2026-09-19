import * as React from "react";
import { ArrowRight } from "lucide-react";
import { ConfidenceBadge, Pill } from "@/components/ui";
import type { TechnologyFingerprint } from "@/lib/types";

const STEPS: { key: keyof TechnologyFingerprint; label: string }[] = [
  { key: "mineral", label: "Mineral" },
  { key: "feedstock", label: "Feedstock" },
  { key: "stage", label: "Stage" },
  { key: "technology", label: "Technology" },
  { key: "process", label: "Process" },
  { key: "product", label: "Product" },
  { key: "application", label: "Application" },
];

/**
 * Technology Fingerprint chain (spec §12): a visual left-to-right chain
 * mineral -> feedstock -> stage -> technology -> process -> product -> application.
 */
export function TechnologyFingerprintChain({ fingerprint }: { fingerprint: TechnologyFingerprint }) {
  return (
    <div>
      <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.key}>
            <div className="flex min-w-[112px] flex-col items-center gap-1 rounded-card border border-border bg-surface-2 px-3 py-2.5 text-center">
              <span className="text-2xs uppercase tracking-wider text-ink-faint">{step.label}</span>
              <span className="text-xs font-medium leading-snug text-ink">{String(fingerprint[step.key])}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex shrink-0 items-center text-ink-faint" aria-hidden="true">
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill className="border-data/30 bg-data/10 text-data">Maturity: {fingerprint.maturity}</Pill>
        <ConfidenceBadge value={fingerprint.confidence} />
      </div>
      {/* Accessible fallback for the visual chain */}
      <span className="sr-only">
        Technology fingerprint: {STEPS.map((s) => `${s.label}: ${String(fingerprint[s.key])}`).join(", ")}. Maturity{" "}
        {fingerprint.maturity}, confidence {fingerprint.confidence.toFixed(2)}.
      </span>
    </div>
  );
}
