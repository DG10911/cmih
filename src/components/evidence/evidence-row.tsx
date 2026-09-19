"use client";
import * as React from "react";
import { ChevronDown, ExternalLink, History } from "lucide-react";
import { Pill, SourceBadge, ConfidenceBadge, Tooltip, Button } from "@/components/ui";
import { mineralName, technologyName } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Evidence } from "@/lib/types";

const TYPE_LABEL: Record<Evidence["type"], string> = {
  patent: "Patent",
  publication: "Publication",
  rd_project: "R&D Project",
  pilot: "Pilot",
  tech_transfer: "Tech Transfer",
  mou: "MoU",
};

/**
 * A single evidence record row (spec §40). Expands inline to reveal full
 * provenance — source type, classification method and transformation
 * history — plus a disabled "Open source (demo)" affordance since no
 * record links to a real live source in this prototype.
 */
export function EvidenceRow({
  evidence,
  expanded,
  onToggle,
}: {
  evidence: Evidence;
  expanded: boolean;
  onToggle: () => void;
}) {
  const e = evidence;
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3 text-left transition-colors hover:bg-surface-2"
      >
        <span className="w-24 shrink-0 font-mono text-2xs text-ink-faint">{e.id}</span>
        <span className="min-w-[220px] flex-1 text-sm font-medium text-ink">{e.title}</span>
        <Pill className="shrink-0 border-border-strong bg-surface-2 text-ink-soft">{TYPE_LABEL[e.type]}</Pill>
        <SourceBadge source={e.provenance.source} />
        <ConfidenceBadge value={e.provenance.confidence} />
        <span className="shrink-0 text-2xs text-ink-faint">
          {mineralName(e.mineral)} · {technologyName(e.technology)}
        </span>
        <span className="hidden shrink-0 text-2xs text-ink-faint sm:inline">
          Retrieved {e.provenance.retrievedAt} · Verified {e.provenance.lastVerified}
        </span>
        <ChevronDown
          className={cn("ml-auto h-4 w-4 shrink-0 text-ink-faint transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border bg-surface-2/50 px-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-2xs uppercase tracking-wider text-ink-faint">Source type</div>
              <div className="mt-0.5 text-sm text-ink">{e.provenance.sourceType}</div>
            </div>
            <div>
              <div className="text-2xs uppercase tracking-wider text-ink-faint">Classification method</div>
              <div className="mt-0.5 text-sm capitalize text-ink">{e.provenance.classificationMethod}</div>
            </div>
            <div>
              <div className="text-2xs uppercase tracking-wider text-ink-faint">Record type</div>
              <div className="mt-0.5 text-sm text-ink">{TYPE_LABEL[e.type]}</div>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-2xs uppercase tracking-wider text-ink-faint">
              <History className="h-3 w-3" /> Transformation history
            </div>
            <ol className="flex flex-wrap gap-1.5">
              {e.provenance.transformationHistory.map((step, i) => (
                <li key={step} className="flex items-center gap-1.5">
                  <Pill className="border-border-strong bg-surface text-ink-soft">
                    {i + 1}. {step}
                  </Pill>
                </li>
              ))}
            </ol>
          </div>

          {e.usedIn.length > 0 && (
            <div>
              <div className="mb-1.5 text-2xs uppercase tracking-wider text-ink-faint">Used in</div>
              <div className="flex flex-wrap gap-1.5">
                {e.usedIn.map((u) => (
                  <Pill key={u} className="border-data/30 bg-data/10 text-data">
                    {u}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-3">
            <p className="max-w-md text-2xs leading-relaxed text-ink-faint">
              This is a synthetic demonstration record. Replace with an authorised source connector for production
              deployment.
            </p>
            <Tooltip label="Demo record — no live external source link in this prototype.">
              <Button variant="outline" size="sm" disabled>
                <ExternalLink className="h-3.5 w-3.5" /> Open source (demo)
              </Button>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}
