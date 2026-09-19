import * as React from "react";
import { MeterBar } from "@/components/ui";
import type { Patent } from "@/lib/types";

type ActivitySignal = Patent["activitySignal"];

const COMPONENTS: {
  key: keyof ActivitySignal;
  label: string;
  explanation: string;
  tone: "mineral" | "data" | "success" | "warning";
}[] = [
  {
    key: "recency",
    label: "Recency",
    explanation: "How recently this filing was published relative to other records in the dataset.",
    tone: "data",
  },
  {
    key: "familySize",
    label: "Family size",
    explanation: "Size of the patent family relative to peers — a proxy for protection breadth, not merit.",
    tone: "mineral",
  },
  {
    key: "citation",
    label: "Citation",
    explanation: "Citation count relative to peers — a rough proxy for downstream reference, not validated impact.",
    tone: "success",
  },
  {
    key: "jurisdiction",
    label: "Jurisdiction spread",
    explanation: "Breadth of jurisdictions filed in, indicating geographic filing strategy.",
    tone: "data",
  },
  {
    key: "applicantDiversity",
    label: "Applicant diversity",
    explanation: "Number and diversity of co-applicants named on the filing.",
    tone: "warning",
  },
  {
    key: "relevance",
    label: "Relevance",
    explanation: "Classification relevance to the matched mineral and technology (see \"Why classified this way?\").",
    tone: "mineral",
  },
];

/**
 * Patent Activity Signal (spec §17). Never call this a "quality score" — it is
 * a prototype heuristic over recency, breadth and classification relevance.
 */
export function PatentActivitySignal({ signal }: { signal: ActivitySignal }) {
  return (
    <div className="space-y-3.5">
      {COMPONENTS.map((c) => (
        <div key={c.key}>
          <MeterBar value={signal[c.key]} label={c.label} valueLabel={signal[c.key].toFixed(2)} tone={c.tone} />
          <p className="mt-1 text-2xs leading-relaxed text-ink-faint">{c.explanation}</p>
        </div>
      ))}
      <p className="rounded-md border border-border bg-surface-2 px-3 py-2 text-2xs leading-relaxed text-ink-faint">
        This is a prototype patent activity signal — a heuristic blend of recency, family breadth, citation,
        jurisdiction, applicant diversity and classification relevance. It is <span className="font-medium text-ink-soft">not</span>{" "}
        a quality judgement of the underlying invention.
      </p>
    </div>
  );
}
