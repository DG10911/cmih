"use client";
import Link from "next/link";
import { FlaskConical, Landmark } from "lucide-react";
import { Card, CardBody, Pill, ConfidenceBadge } from "@/components/ui";
import { orgName, mineralName, technologyName } from "@/lib/data";
import type { RDProject } from "@/lib/types";

/**
 * R&D Explorer grid card. The whole card links to `/rd/[id]` via a
 * stretched overlay link; the organisation name is a separately
 * clickable link to `/organisations/[id]` layered above it.
 */
export function RDProjectCard({ project }: { project: RDProject }) {
  return (
    <Card className="group relative flex flex-col transition-colors hover:border-border-strong">
      <Link
        href={`/rd/${project.id}`}
        className="absolute inset-0 z-0 rounded-card"
        aria-label={project.title}
        tabIndex={-1}
      />
      <CardBody className="relative z-10 flex flex-1 flex-col gap-3 pointer-events-none">
        <div className="flex items-center justify-between gap-2">
          <Pill className="border-data/30 bg-data/10 text-data">
            <FlaskConical className="h-3 w-3" />
            {project.projectType}
          </Pill>
          <span className="font-mono text-2xs tabular-nums text-ink-faint">{project.year}</span>
        </div>

        <h3 className="text-sm font-semibold leading-snug text-ink group-hover:text-mineral">
          {project.title}
        </h3>

        <Link
          href={`/organisations/${project.organisation}`}
          className="pointer-events-auto relative z-20 inline-flex items-center gap-1.5 self-start text-xs font-medium text-ink-soft hover:text-mineral hover:underline"
        >
          <Landmark className="h-3 w-3" />
          {orgName(project.organisation)}
        </Link>

        <div className="flex flex-wrap items-center gap-1.5 text-2xs text-ink-faint">
          <Pill className="border-border-strong bg-surface-2 text-ink-soft">{mineralName(project.mineral)}</Pill>
          <Pill className="border-border-strong bg-surface-2 text-ink-soft">{technologyName(project.technology)}</Pill>
          <Pill className="border-border-strong bg-surface-2 text-ink-soft">{project.stage}</Pill>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="text-2xs text-ink-faint">
            {project.fundingSource ? `Funded by ${project.fundingSource}` : "Funding source unspecified"}
          </span>
          <ConfidenceBadge value={project.provenance.confidence} />
        </div>
      </CardBody>
    </Card>
  );
}
