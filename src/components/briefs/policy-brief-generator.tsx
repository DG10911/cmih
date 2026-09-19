"use client";
import * as React from "react";
import { FileSearch } from "lucide-react";
import { SectionHeader, EmptyState } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { BriefForm } from "./brief-form";
import { BriefReport } from "./brief-report";
import { buildBrief, type BriefParams, type PolicyBrief } from "./build-brief";

/** Top-level Policy Brief Generator screen (spec §45). */
export function PolicyBriefGenerator() {
  const [brief, setBrief] = React.useState<PolicyBrief | null>(null);

  function handleGenerate(params: BriefParams) {
    setBrief(buildBrief(params));
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Policy Brief Generator"
        title="Intelligence Brief Builder"
        subtitle="Compose a structured, evidence-linked brief from the indexed demo dataset for a mineral, technology and audience of your choice."
      />

      <BriefForm onGenerate={handleGenerate} />

      {brief ? (
        <FadeIn>
          <BriefReport brief={brief} />
        </FadeIn>
      ) : (
        <EmptyState
          icon={FileSearch}
          title="No brief generated yet."
          hint="Choose a mineral and options above, then click “Generate Intelligence Brief” to compose a structured, evidence-linked report from the demo dataset."
        />
      )}
    </div>
  );
}
