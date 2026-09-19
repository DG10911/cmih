import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowUpRight, Users2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  SectionHeader,
  Pill,
  DemoBadge,
  KpiCard,
  MeterBar,
  EmptyState,
} from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { OrgCapabilitySection } from "@/components/organisations/org-capability-section";
import { OrgEvidenceSummaryButton } from "@/components/organisations/org-evidence-summary-button";
import {
  ORGANISATIONS,
  getOrganisation,
  orgName,
  mineralName,
  technologyName,
  patentsByOrg,
  rdByOrg,
  publicationsByOrg,
  collaborationByOrg,
} from "@/lib/data";
import type { Organisation } from "@/lib/types";

export function generateStaticParams() {
  return ORGANISATIONS.map((o) => ({ id: o.id }));
}

const TYPE_TONE: Record<Organisation["type"], string> = {
  Academic: "border-data/30 bg-data/10 text-data",
  Government: "border-info/30 bg-info/10 text-info",
  "R&D Institute": "border-mineral/30 bg-mineral/10 text-mineral",
  Industry: "border-warning/30 bg-warning/10 text-warning",
  PSU: "border-success/30 bg-success/10 text-success",
};

export default function OrganisationProfilePage({ params }: { params: { id: string } }) {
  const organisation = getOrganisation(params.id);
  if (!organisation) notFound();

  const patents = patentsByOrg(organisation.id);
  const rdProjects = rdByOrg(organisation.id);
  const publications = publicationsByOrg(organisation.id);
  const collaborationSignals = collaborationByOrg(organisation.id);

  const evidenceIds = [...patents.map((p) => p.id), ...rdProjects.map((r) => r.id), ...publications.map((p) => p.id)];

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Pill className={TYPE_TONE[organisation.type]}>{organisation.type}</Pill>
              <span className="inline-flex items-center gap-1 text-2xs text-ink-faint">
                <MapPin className="h-3 w-3" /> {organisation.country}
              </span>
              <DemoBadge />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">{organisation.name}</h1>
            {organisation.aliases.length > 0 && (
              <p className="mt-1 text-xs text-ink-faint">also known as {organisation.aliases.join(", ")}</p>
            )}
          </div>
          <OrgEvidenceSummaryButton evidenceIds={evidenceIds} />
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Patent families" value={organisation.metrics.patentFamilies} demo />
          <KpiCard label="R&D projects" value={organisation.metrics.rdProjects} demo />
          <KpiCard label="Publications" value={organisation.metrics.publications} demo />
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Card>
          <CardHeader>
            <SectionHeader eyebrow="Focus areas" title="Minerals & technologies" className="mb-0" />
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">Minerals</div>
              <div className="flex flex-wrap gap-2">
                {organisation.minerals.map((id) => (
                  <Link
                    key={id}
                    href={`/minerals/${id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-mineral/50 hover:bg-mineral/15 hover:text-mineral"
                  >
                    {mineralName(id)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">Technologies</div>
              <div className="flex flex-wrap gap-2">
                {organisation.technologies.map((id) => (
                  <Link
                    key={id}
                    href={`/technologies/${id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-data/50 hover:text-ink"
                  >
                    {technologyName(id)}
                  </Link>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1}>
        <OrgCapabilitySection capability={organisation.capability} patents={patents} rdProjects={rdProjects} publications={publications} />
      </FadeIn>

      <FadeIn delay={0.12}>
        <Card>
          <CardHeader>
            <SectionHeader
              eyebrow="Spec §34"
              title="Collaborators"
              subtitle="Potential complementary-capability signals and listed collaborating institutions."
              className="mb-0"
            />
          </CardHeader>
          <CardBody className="space-y-5">
            {collaborationSignals.length === 0 ? (
              <EmptyState title="No complementary-capability signals recorded." className="py-8" />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {collaborationSignals.map((c) => {
                  const otherId = c.orgA === organisation.id ? c.orgB : c.orgA;
                  const thisStrength = c.orgA === organisation.id ? c.strengthA : c.strengthB;
                  const otherStrength = c.orgA === organisation.id ? c.strengthB : c.strengthA;
                  return (
                    <div key={c.id} className="rounded-card border border-border bg-surface-2 p-3">
                      <Link href={`/organisations/${otherId}`} className="group inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-mineral">
                        <Users2 className="h-3.5 w-3.5" />
                        {orgName(otherId)}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                      <p className="mt-1.5 text-2xs text-ink-soft">
                        Their strength: {otherStrength} · {organisation.name.split(" ")[0]}&apos;s strength: {thisStrength}
                      </p>
                      <MeterBar value={c.complementarity} valueLabel={`${Math.round(c.complementarity * 100)}% complementarity`} tone="data" className="mt-2" />
                      <p className="mt-2 text-2xs leading-relaxed text-ink-faint">{c.rationale}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {organisation.collaborators.length > 0 && (
              <div>
                <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">Listed collaborators</div>
                <div className="flex flex-wrap gap-2">
                  {organisation.collaborators.map((id) => (
                    <Link key={id} href={`/organisations/${id}`} className="text-xs font-medium text-mineral hover:underline">
                      {orgName(id)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </FadeIn>
    </div>
  );
}
