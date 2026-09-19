import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Landmark, Calendar, Layers, Wallet, Quote, Users2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  SectionHeader,
  Pill,
  ConfidenceBadge,
  SourceBadge,
  DemoBadge,
  Stat,
  EmptyState,
} from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { RDDetailActions } from "@/components/rd/rd-detail-actions";
import {
  RD_PROJECTS,
  PUBLICATIONS,
  getRDProject,
  getPublication,
  orgName,
  mineralName,
  technologyName,
  rdByTechnology,
  patentsByTechnology,
  publicationsByTechnology,
} from "@/lib/data";
import type { Maturity, Publication, RDProject } from "@/lib/types";

export function generateStaticParams() {
  return [
    ...RD_PROJECTS.map((r) => ({ id: r.id })),
    ...PUBLICATIONS.map((p) => ({ id: p.id })),
  ];
}

const MATURITY_TONE: Record<Maturity, string> = {
  Emerging: "border-info/40 bg-info/10 text-info",
  Developing: "border-warning/40 bg-warning/10 text-warning",
  Scaling: "border-data/40 bg-data/10 text-data",
  Mature: "border-success/40 bg-success/10 text-success",
};

export default function RDOrPublicationDetailPage({ params }: { params: { id: string } }) {
  const project = getRDProject(params.id);
  if (project) return <RDProjectDetail project={project} />;

  const publication = getPublication(params.id);
  if (publication) return <PublicationDetail publication={publication} />;

  notFound();
}

/* ------------------------------------------------------------- R&D project */

function RDProjectDetail({ project }: { project: RDProject }) {
  const relatedRD = rdByTechnology(project.technology).filter((r) => r.id !== project.id);
  const relatedPatents = patentsByTechnology(project.technology);
  const relatedPublications = publicationsByTechnology(project.technology);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Pill className="border-data/30 bg-data/10 text-data">{project.projectType}</Pill>
              <span className="inline-flex items-center gap-1 font-mono text-2xs tabular-nums text-ink-faint">
                <Calendar className="h-3 w-3" /> {project.year}
              </span>
              <DemoBadge />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">{project.title}</h1>
          </div>
          <ConfidenceBadge value={project.provenance.confidence} />
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card>
          <CardBody className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Stat
              label="Organisation"
              value={
                <Link href={`/organisations/${project.organisation}`} className="inline-flex items-center gap-1 text-mineral hover:underline">
                  <Landmark className="h-3.5 w-3.5" /> {orgName(project.organisation)}
                </Link>
              }
            />
            <Stat
              label="Mineral"
              value={<Link href={`/minerals/${project.mineral}`} className="text-mineral hover:underline">{mineralName(project.mineral)}</Link>}
            />
            <Stat
              label="Technology"
              value={<Link href={`/technologies/${project.technology}`} className="text-mineral hover:underline">{technologyName(project.technology)}</Link>}
            />
            <Stat label="Value-chain stage" value={<span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5 text-ink-faint" />{project.stage}</span>} />
            <Stat
              label="Funding source"
              value={<span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-ink-faint" />{project.fundingSource ?? "Unspecified"}</span>}
            />
          </CardBody>
        </Card>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Card>
          <CardHeader>
            <SectionHeader eyebrow="Maturity" title="Maturity evidence & summary" className="mb-0" />
            <Pill className={MATURITY_TONE[project.maturityEvidence]}>{project.maturityEvidence}</Pill>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm leading-relaxed text-ink-soft">{project.summary}</p>

            <div>
              <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">Classification signals</div>
              <ul className="space-y-1.5 text-xs text-ink-soft">
                {project.classification.map((s) => (
                  <li key={s.label} className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-2 px-3 py-1.5">
                    <span>{s.label}</span>
                    <span className="font-mono tabular-nums text-mineral">+{s.contribution.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <RDDetailActions
              matchedMineral={mineralName(project.mineral)}
              matchedTechnology={technologyName(project.technology)}
              confidence={project.provenance.confidence}
              signals={project.classification}
              evidenceIds={[project.id]}
            />
          </CardBody>
        </Card>
      </FadeIn>

      <RelatedSection
        title="Related R&D in this technology"
        eyebrow="Related"
        items={relatedRD.map((r) => ({ id: r.id, href: `/rd/${r.id}`, title: r.title, subtitle: `${orgName(r.organisation)} · ${r.year}`, confidence: r.provenance.confidence }))}
      />
      <RelatedSection
        title="Related patents in this technology"
        eyebrow="Patents"
        items={relatedPatents.map((p) => ({ id: p.id, href: `/patents/${p.id}`, title: p.title, subtitle: `${p.jurisdictions.join(", ")} · ${p.legalStatus}`, confidence: p.provenance.confidence }))}
      />
      <RelatedSection
        title="Related publications in this technology"
        eyebrow="Publications"
        items={relatedPublications.map((p) => ({ id: p.id, href: `/rd/${p.id}`, title: p.title, subtitle: `${p.venue} · ${p.year}`, confidence: p.provenance.confidence }))}
      />
    </div>
  );
}

/* ----------------------------------------------------------------- publication */

function PublicationDetail({ publication }: { publication: Publication }) {
  const relatedRD = rdByTechnology(publication.technology);
  const relatedPatents = patentsByTechnology(publication.technology);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Pill className="border-mineral/30 bg-mineral/10 text-mineral">
                <Quote className="h-3 w-3" /> Publication
              </Pill>
              <span className="inline-flex items-center gap-1 font-mono text-2xs tabular-nums text-ink-faint">
                <Calendar className="h-3 w-3" /> {publication.year}
              </span>
              <DemoBadge />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">{publication.title}</h1>
            <p className="mt-1 text-sm text-ink-soft">{publication.venue}</p>
          </div>
          <ConfidenceBadge value={publication.provenance.confidence} />
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card>
          <CardBody className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Authors" value={<span className="inline-flex items-center gap-1"><Users2 className="h-3.5 w-3.5 text-ink-faint" />{publication.authors.join(", ")}</span>} />
            <Stat
              label="Organisation"
              value={
                <Link href={`/organisations/${publication.organisation}`} className="inline-flex items-center gap-1 text-mineral hover:underline">
                  <Landmark className="h-3.5 w-3.5" /> {orgName(publication.organisation)}
                </Link>
              }
            />
            <Stat
              label="Mineral"
              value={<Link href={`/minerals/${publication.mineral}`} className="text-mineral hover:underline">{mineralName(publication.mineral)}</Link>}
            />
            <Stat
              label="Technology"
              value={<Link href={`/technologies/${publication.technology}`} className="text-mineral hover:underline">{technologyName(publication.technology)}</Link>}
            />
            <Stat label="Citations" value={<span className="font-mono tabular-nums">{publication.citations}</span>} />
          </CardBody>
        </Card>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Card>
          <CardHeader>
            <SectionHeader eyebrow="Provenance" title="Source & data trust" className="mb-0" />
          </CardHeader>
          <CardBody className="flex flex-wrap items-center gap-2">
            <SourceBadge source={publication.provenance.source} />
            <ConfidenceBadge value={publication.provenance.confidence} />
            <span className="text-2xs text-ink-faint">Retrieved {publication.provenance.retrievedAt} · Verified {publication.provenance.lastVerified}</span>
          </CardBody>
        </Card>
      </FadeIn>

      <RelatedSection
        title="Related R&D in this technology"
        eyebrow="Related"
        items={relatedRD.map((r) => ({ id: r.id, href: `/rd/${r.id}`, title: r.title, subtitle: `${orgName(r.organisation)} · ${r.year}`, confidence: r.provenance.confidence }))}
      />
      <RelatedSection
        title="Related patents in this technology"
        eyebrow="Patents"
        items={relatedPatents.map((p) => ({ id: p.id, href: `/patents/${p.id}`, title: p.title, subtitle: `${p.jurisdictions.join(", ")} · ${p.legalStatus}`, confidence: p.provenance.confidence }))}
      />
    </div>
  );
}

/* ------------------------------------------------------------- shared bits */

interface RelatedItem {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  confidence: number;
}

function RelatedSection({ title, eyebrow, items }: { title: string; eyebrow: string; items: RelatedItem[] }) {
  return (
    <FadeIn delay={0.1}>
      <Card>
        <CardHeader>
          <SectionHeader eyebrow={eyebrow} title={title} className="mb-0" />
        </CardHeader>
        <CardBody>
          {items.length === 0 ? (
            <EmptyState title="No related records found for this technology yet." className="py-8" />
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link href={item.href} className="group flex-1 text-sm font-medium text-ink hover:text-mineral">
                    {item.title}
                    <ArrowUpRight className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="mt-0.5 text-2xs font-normal text-ink-faint">{item.subtitle}</div>
                  </Link>
                  <ConfidenceBadge value={item.confidence} className="shrink-0" />
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </FadeIn>
  );
}
