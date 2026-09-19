"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Waypoints } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  Pill,
  ConfidenceBadge,
  MomentumBadge,
  MeterBar,
  Stat,
  EmptyState,
} from "@/components/ui";
import {
  getMineral,
  getTechnology,
  getOrganisation,
  getPatent,
  getRDProject,
  getPublication,
  technologiesByMineral,
  orgsByMineral,
  patentsByTechnology,
  rdByTechnology,
  publicationsByTechnology,
  mineralName,
  technologyName,
  orgName,
} from "@/lib/data";
import { NODE_TYPE_META, type KDNode } from "./build-graph";

function RelatedLink({ href, label, tone }: { href: string; label: string; tone?: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-2 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-ink-soft hover:border-data/50 hover:text-ink"
    >
      <span className="truncate">{label}</span>
      <ArrowUpRight className={`h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 ${tone ?? ""}`} />
    </Link>
  );
}

/** Right-side detail panel: resolves a selected node's evidence, relationships and metrics from demo data. */
export function NodeDetailPanel({ node }: { node: KDNode | null }) {
  if (!node) {
    return (
      <Card className="flex h-full items-center">
        <CardBody className="w-full">
          <EmptyState
            title="No node selected"
            hint="Click any node in the graph to see its linked evidence, capability and relationships."
          />
        </CardBody>
      </Card>
    );
  }

  const meta = NODE_TYPE_META[node.data.kind];
  const Icon = meta.icon;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex-col items-start gap-1.5">
        <Pill className={`${meta.bgClass} ${meta.borderClass} ${meta.textClass}`}>
          <Icon className="h-3 w-3" />
          {meta.label}
        </Pill>
        <h3 className="text-sm font-semibold leading-snug text-ink">{node.data.label}</h3>
        {node.data.subtitle && <p className="text-2xs text-ink-faint">{node.data.subtitle}</p>}
      </CardHeader>
      <CardBody className="flex-1 space-y-4 overflow-y-auto">
        {node.data.kind === "mineral" && <MineralDetail id={node.data.refId} />}
        {node.data.kind === "technology" && <TechnologyDetail id={node.data.refId} />}
        {node.data.kind === "organisation" && <OrganisationDetail id={node.data.refId} />}
        {node.data.kind === "patent" && <PatentDetail id={node.data.refId} />}
        {node.data.kind === "rd" && <RDDetail id={node.data.refId} />}
        {node.data.kind === "publication" && <PublicationDetail id={node.data.refId} />}
      </CardBody>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-2xs uppercase tracking-wider text-ink-faint">
        <Waypoints className="h-3 w-3" />
        {title}
      </div>
      {children}
    </div>
  );
}

function MineralDetail({ id }: { id: string }) {
  const mineral = getMineral(id);
  if (!mineral) return null;
  const techs = technologiesByMineral(id);
  const orgs = orgsByMineral(id);
  return (
    <>
      <p className="text-xs leading-relaxed text-ink-soft">{mineral.summary}</p>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Patent families" value={mineral.metrics.patentFamilies} />
        <Stat label="Publications" value={mineral.metrics.publications} />
        <Stat label="R&D projects" value={mineral.metrics.rdProjects} />
        <Stat label="Organisations" value={mineral.metrics.organisations} />
      </div>
      <Section title={`Linked technologies (${techs.length})`}>
        <div className="flex flex-col gap-1.5">
          {techs.map((t) => (
            <RelatedLink key={t.id} href={`/technologies/${t.id}`} label={`${t.name} · ${t.maturity}`} />
          ))}
        </div>
      </Section>
      {orgs.length > 0 && (
        <Section title={`Active organisations (${orgs.length})`}>
          <div className="flex flex-col gap-1.5">
            {orgs.slice(0, 6).map((o) => (
              <RelatedLink key={o.id} href={`/organisations/${o.id}`} label={o.name} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function TechnologyDetail({ id }: { id: string }) {
  const tech = getTechnology(id);
  if (!tech) return null;
  const patents = patentsByTechnology(id);
  const rd = rdByTechnology(id);
  const pubs = publicationsByTechnology(id);
  return (
    <>
      <div className="flex items-center gap-2">
        <Pill className="border-border-strong bg-surface-2 text-ink-soft">{tech.maturity}</Pill>
        <MomentumBadge value={tech.momentum} />
      </div>
      <p className="text-xs leading-relaxed text-ink-soft">{tech.description}</p>
      <MeterBar value={tech.landscape.y} label="Research momentum" tone="data" />
      <MeterBar value={tech.landscape.x} label="Maturity / time" tone="mineral" />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Patent families" value={tech.metrics.patentFamilies} />
        <Stat label="Publications" value={tech.metrics.publications} />
      </div>
      <Section title={`Minerals (${tech.minerals.length})`}>
        <div className="flex flex-wrap gap-1.5">
          {tech.minerals.map((mid) => (
            <Pill key={mid} className="border-mineral/40 bg-mineral/10 text-mineral">
              {mineralName(mid)}
            </Pill>
          ))}
        </div>
      </Section>
      <Section title={`In this graph: ${patents.length} patents · ${rd.length} R&D · ${pubs.length} publications`}>
        <div className="flex flex-col gap-1.5">
          {patents.slice(0, 3).map((p) => (
            <RelatedLink key={p.id} href={`/patents/${p.id}`} label={p.title} />
          ))}
          {rd.slice(0, 2).map((r) => (
            <RelatedLink key={r.id} href={`/rd/${r.id}`} label={r.title} />
          ))}
        </div>
      </Section>
    </>
  );
}

function OrganisationDetail({ id }: { id: string }) {
  const org = getOrganisation(id);
  if (!org) return null;
  const stages = Object.entries(org.capability) as [string, number][];
  return (
    <>
      <div className="flex items-center gap-2">
        <Pill className="border-border-strong bg-surface-2 text-ink-soft">{org.type}</Pill>
        <Pill className="border-border-strong bg-surface-2 text-ink-soft">{org.country}</Pill>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Patent families" value={org.metrics.patentFamilies} />
        <Stat label="Publications" value={org.metrics.publications} />
        <Stat label="R&D projects" value={org.metrics.rdProjects} />
      </div>
      <Section title="Capability by value-chain stage">
        <div className="space-y-2">
          {stages.map(([stage, value]) => (
            <MeterBar key={stage} value={value} label={stage} tone="data" />
          ))}
        </div>
      </Section>
      <Section title={`Minerals (${org.minerals.length})`}>
        <div className="flex flex-wrap gap-1.5">
          {org.minerals.map((mid) => (
            <Pill key={mid} className="border-mineral/40 bg-mineral/10 text-mineral">
              {mineralName(mid)}
            </Pill>
          ))}
        </div>
      </Section>
      {org.collaborators.length > 0 && (
        <Section title={`Known collaborators (${org.collaborators.length})`}>
          <div className="flex flex-col gap-1.5">
            {org.collaborators.map((cid) => (
              <RelatedLink key={cid} href={`/organisations/${cid}`} label={orgName(cid)} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function PatentDetail({ id }: { id: string }) {
  const p = getPatent(id);
  if (!p) return null;
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Pill className="border-mineral/40 bg-mineral/10 text-mineral">{mineralName(p.mineral)}</Pill>
        <Pill className="border-data/40 bg-data/10 text-data">{technologyName(p.technology)}</Pill>
        <ConfidenceBadge value={p.provenance.confidence} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Legal status" value={p.legalStatus} />
        <Stat label="Family size" value={p.familySize} />
        <Stat label="Citations" value={p.citationCount} />
        <Stat label="Jurisdictions" value={p.jurisdictions.join(", ")} />
      </div>
      <Section title="Applicants">
        <div className="flex flex-col gap-1.5">
          {p.applicants.map((a) => (
            <RelatedLink key={a} href={`/organisations/${a}`} label={orgName(a)} />
          ))}
        </div>
      </Section>
      <Section title="Activity signal">
        <div className="space-y-2">
          <MeterBar value={p.activitySignal.recency} label="Recency" tone="data" />
          <MeterBar value={p.activitySignal.relevance} label="Relevance" tone="data" />
        </div>
      </Section>
      <RelatedLink href={`/patents/${p.id}`} label="Open full patent record" />
    </>
  );
}

function RDDetail({ id }: { id: string }) {
  const r = getRDProject(id);
  if (!r) return null;
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Pill className="border-mineral/40 bg-mineral/10 text-mineral">{mineralName(r.mineral)}</Pill>
        <Pill className="border-data/40 bg-data/10 text-data">{technologyName(r.technology)}</Pill>
        <ConfidenceBadge value={r.provenance.confidence} />
      </div>
      <p className="text-xs leading-relaxed text-ink-soft">{r.summary}</p>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Project type" value={r.projectType} />
        <Stat label="Year" value={r.year} />
        <Stat label="Maturity evidence" value={r.maturityEvidence} />
        <Stat label="Funding source" value={r.fundingSource ?? "—"} />
      </div>
      <Section title="Organisation">
        <RelatedLink href={`/organisations/${r.organisation}`} label={orgName(r.organisation)} />
      </Section>
      <RelatedLink href={`/rd/${r.id}`} label="Open full R&D record" />
    </>
  );
}

function PublicationDetail({ id }: { id: string }) {
  const p = getPublication(id);
  if (!p) return null;
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Pill className="border-mineral/40 bg-mineral/10 text-mineral">{mineralName(p.mineral)}</Pill>
        <Pill className="border-data/40 bg-data/10 text-data">{technologyName(p.technology)}</Pill>
        <ConfidenceBadge value={p.provenance.confidence} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Venue" value={p.venue} />
        <Stat label="Year" value={p.year} />
        <Stat label="Citations" value={p.citations} />
        <Stat label="Authors" value={p.authors.join(", ")} />
      </div>
      <Section title="Organisation">
        <RelatedLink href={`/organisations/${p.organisation}`} label={orgName(p.organisation)} />
      </Section>
      <RelatedLink href={`/rd/${p.id}`} label="Open full publication record" />
    </>
  );
}
