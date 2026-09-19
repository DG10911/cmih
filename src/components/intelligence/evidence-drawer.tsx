"use client";
import * as React from "react";
import Link from "next/link";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { Drawer, SourceBadge, ConfidenceBadge, Pill } from "@/components/ui";
import { evidenceByIds, mineralName, technologyName } from "@/lib/data";
import type { Evidence } from "@/lib/types";

const TYPE_LABEL: Record<Evidence["type"], string> = {
  patent: "Patent",
  publication: "Publication",
  rd_project: "R&D Project",
  pilot: "Pilot",
  tech_transfer: "Tech Transfer",
  mou: "MoU",
};

function hrefFor(e: Evidence): string {
  if (e.type === "patent") return `/patents/${e.id}`;
  if (e.type === "publication") return `/rd/${e.id}`;
  return `/rd/${e.id}`;
}

/**
 * Evidence drawer (spec §40,88). Renders traceable evidence records for a set
 * of evidence ids. Open from any "[Evidence N]" citation.
 */
export function EvidenceDrawer({
  open,
  onClose,
  evidenceIds,
  title = "Supporting Evidence",
}: {
  open: boolean;
  onClose: () => void;
  evidenceIds: string[];
  title?: string;
}) {
  const items = evidenceByIds(evidenceIds);
  return (
    <Drawer open={open} onClose={onClose} eyebrow="Evidence & Provenance" title={title}>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-ink-soft">No linked evidence records.</p>}
        {items.map((e) => (
          <div key={e.id} className="rounded-card border border-border bg-surface-2 p-3">
            <div className="flex items-start justify-between gap-2">
              <Link href={hrefFor(e)} className="group text-sm font-medium text-ink hover:text-mineral">
                {e.title}
                <ArrowUpRight className="ml-0.5 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Pill className="shrink-0 border-border-strong bg-surface text-ink-soft">{TYPE_LABEL[e.type]}</Pill>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <SourceBadge source={e.provenance.source} />
              <ConfidenceBadge value={e.provenance.confidence} />
              <span className="text-2xs text-ink-faint">{mineralName(e.mineral)} · {technologyName(e.technology)}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-ink-faint">
              <span>Retrieved {e.provenance.retrievedAt}</span>
              <span>Verified {e.provenance.lastVerified}</span>
              <span className="capitalize">Method: {e.provenance.classificationMethod}</span>
              {e.usedIn.length > 0 && <span>Used in: {e.usedIn.join(", ")}</span>}
            </div>
          </div>
        ))}
        <p className="pt-1 text-2xs leading-relaxed text-ink-faint">
          <ExternalLink className="mr-1 inline h-3 w-3" />
          Records shown are synthetic demonstration data. Replace with authorised source connectors for
          production deployment.
        </p>
      </div>
    </Drawer>
  );
}
