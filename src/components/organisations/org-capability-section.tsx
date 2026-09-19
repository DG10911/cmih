"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardBody, SectionHeader, ConfidenceBadge, EmptyState } from "@/components/ui";
import { CapabilityFingerprint } from "./capability-fingerprint";
import { getTechnology } from "@/lib/data";
import type { Patent, Publication, RDProject, ValueChainStage } from "@/lib/types";

interface Row {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  confidence: number;
}

function Column({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div>
      <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">{title} ({rows.length})</div>
      {rows.length === 0 ? (
        <EmptyState title="No records for this stage." className="py-6" />
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.id} className="py-2">
              <Link href={r.href} className="group block text-sm font-medium text-ink hover:text-mineral">
                {r.title}
                <ArrowUpRight className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <span className="text-2xs text-ink-faint">{r.subtitle}</span>
                <ConfidenceBadge value={r.confidence} className="shrink-0" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Capability Fingerprint + stage-filtered evidence lists for an
 * organisation profile (spec §33). Owns the `selectedStage` state so a
 * click on a fingerprint bar filters the patent / R&D / publication
 * lists rendered below it.
 */
export function OrgCapabilitySection({
  capability,
  patents,
  rdProjects,
  publications,
}: {
  capability: Partial<Record<ValueChainStage, number>>;
  patents: Patent[];
  rdProjects: RDProject[];
  publications: Publication[];
}) {
  const [selectedStage, setSelectedStage] = React.useState<ValueChainStage | null>(null);

  const filteredPatents = selectedStage ? patents.filter((p) => p.stage === selectedStage) : patents;
  const filteredRD = selectedStage ? rdProjects.filter((r) => r.stage === selectedStage) : rdProjects;
  const filteredPublications = selectedStage
    ? publications.filter((p) => getTechnology(p.technology)?.stages.includes(selectedStage))
    : publications;

  return (
    <Card>
      <CardHeader>
        <SectionHeader eyebrow="Spec §33" title="Capability Fingerprint" subtitle="Relative strength by value-chain stage, derived from patent, R&D and publication activity." className="mb-0" />
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <CapabilityFingerprint capability={capability} selected={selectedStage} onSelect={setSelectedStage} />
        <div className="grid grid-cols-1 gap-6 border-t border-border pt-4 sm:grid-cols-3 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
          <Column
            title="Patents"
            rows={filteredPatents.map((p) => ({ id: p.id, href: `/patents/${p.id}`, title: p.title, subtitle: `${p.jurisdictions.join(", ")} · ${p.legalStatus}`, confidence: p.provenance.confidence }))}
          />
          <Column
            title="R&D projects"
            rows={filteredRD.map((r) => ({ id: r.id, href: `/rd/${r.id}`, title: r.title, subtitle: `${r.projectType} · ${r.year}`, confidence: r.provenance.confidence }))}
          />
          <Column
            title="Publications"
            rows={filteredPublications.map((p) => ({ id: p.id, href: `/rd/${p.id}`, title: p.title, subtitle: `${p.venue} · ${p.year}`, confidence: p.provenance.confidence }))}
          />
        </div>
      </CardBody>
    </Card>
  );
}
