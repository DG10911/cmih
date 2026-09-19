"use client";
import * as React from "react";
import Link from "next/link";
import { HelpCircle, FileText, FlaskConical, Newspaper, Gem, Cpu, Building2 } from "lucide-react";
import { Card, Pill, ConfidenceBadge, SourceBadge, Button } from "@/components/ui";
import { WhyThisModal } from "@/components/intelligence/why-this-modal";
import { getPatent, getRDProject, getPublication, mineralName, technologyName, type SearchResult } from "@/lib/data";
import type { ClassificationSignal } from "@/lib/types";

const KIND_ICON: Record<SearchResult["kind"], React.ComponentType<{ className?: string }>> = {
  Mineral: Gem,
  Technology: Cpu,
  Patent: FileText,
  "R&D": FlaskConical,
  Publication: Newspaper,
  Organisation: Building2,
};

interface WhyProps {
  confidence: number;
  signals: ClassificationSignal[];
  matchedMineral?: string;
  matchedTechnology?: string;
  method?: string;
  sourceRecords?: number;
}

/**
 * Build the "Why this result?" explanation. Patents and R&D records use their
 * real hybrid-classifier breakdown; other kinds show a transparent
 * keyword/alias-match rationale rather than an invented confidence figure
 * (spec §41,72 — every AI-derived result must be explainable).
 */
function buildWhy(result: SearchResult, query: string): WhyProps {
  if (result.kind === "Patent") {
    const p = getPatent(result.id);
    if (p) {
      return {
        confidence: p.provenance.confidence,
        signals: p.classification,
        matchedMineral: mineralName(p.mineral),
        matchedTechnology: technologyName(p.technology),
        method: p.provenance.classificationMethod,
      };
    }
  }
  if (result.kind === "R&D") {
    const r = getRDProject(result.id);
    if (r) {
      return {
        confidence: r.provenance.confidence,
        signals: r.classification,
        matchedMineral: mineralName(r.mineral),
        matchedTechnology: technologyName(r.technology),
        method: r.provenance.classificationMethod,
      };
    }
  }
  if (result.kind === "Publication") {
    const pub = getPublication(result.id);
    if (pub) {
      return {
        confidence: pub.provenance.confidence,
        signals: [
          {
            label: "Keyword / field match",
            contribution: pub.provenance.confidence,
            detail: `"${query}" matched the publication title, mineral, or technology name.`,
          },
        ],
        matchedMineral: mineralName(pub.mineral),
        matchedTechnology: technologyName(pub.technology),
        method: pub.provenance.classificationMethod,
      };
    }
  }
  // Minerals, technologies, organisations: deterministic keyword/alias match — no ML confidence to report.
  return {
    confidence: 1,
    signals: [
      {
        label: "Keyword / alias match",
        contribution: 1,
        detail: `"${query}" matched the record's name, alias, or category directly — no probabilistic scoring is applied to this entity type.`,
      },
    ],
    matchedMineral: result.mineral ? mineralName(result.mineral) : undefined,
    matchedTechnology: result.technology ? technologyName(result.technology) : undefined,
    method: "keyword",
  };
}

function sourceFor(result: SearchResult): string | undefined {
  if (result.kind === "Patent") return getPatent(result.id)?.provenance.source;
  if (result.kind === "R&D") return getRDProject(result.id)?.provenance.source;
  if (result.kind === "Publication") return getPublication(result.id)?.provenance.source;
  return undefined;
}

export function SearchResultCard({ result, query }: { result: SearchResult; query: string }) {
  const [whyOpen, setWhyOpen] = React.useState(false);
  const Icon = KIND_ICON[result.kind];
  const source = sourceFor(result);
  const why = buildWhy(result, query);

  return (
    <Card className="group relative p-4 transition-colors hover:border-border-strong">
      <Link href={result.href} className="absolute inset-0 z-0 rounded-card" aria-label={`Open ${result.title}`} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="pointer-events-none min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
            <Pill className="border-border-strong bg-surface-2 text-ink-soft">{result.kind}</Pill>
          </div>
          <h3 className="mt-1.5 truncate text-sm font-semibold text-ink group-hover:text-mineral">
            {result.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-ink-soft">{result.subtitle}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {result.confidence != null && <ConfidenceBadge value={result.confidence} />}
            {source && <SourceBadge source={source} />}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="relative z-10 shrink-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWhyOpen(true);
          }}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Why this result?
        </Button>
      </div>

      <WhyThisModal
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        confidence={why.confidence}
        signals={why.signals}
        matchedMineral={why.matchedMineral}
        matchedTechnology={why.matchedTechnology}
        method={why.method}
        sourceRecords={why.sourceRecords}
      />
    </Card>
  );
}
