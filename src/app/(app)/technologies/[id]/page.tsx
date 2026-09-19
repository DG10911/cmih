import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardBody, Pill, MomentumBadge, DemoBadge } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import {
  TECHNOLOGIES,
  getTechnology,
  patentsByTechnology,
  rdByTechnology,
  publicationsByTechnology,
  gapsByTechnology,
  mineralName,
} from "@/lib/data";
import { ValueChainStrip } from "@/components/technologies/value-chain-strip";
import { EmergingBreakdown } from "@/components/technologies/emerging-breakdown";
import { WhyClassifiedButton } from "@/components/technologies/why-classified-button";
import { PatentList, RDList, PublicationList, GapSignalList } from "@/components/technologies/evidence-lists";
import { TechnologyKpiRow } from "@/components/technologies/technology-kpi-row";
import type { Maturity } from "@/lib/types";

// Defined locally (not imported from the "use client" explorer module — a server
// component cannot read a plain value across a client-module boundary).
const MATURITY_TONE: Record<Maturity, string> = {
  Emerging: "border-data/40 bg-data/10 text-data",
  Developing: "border-warning/40 bg-warning/10 text-warning",
  Scaling: "border-mineral/40 bg-mineral/10 text-mineral",
  Mature: "border-success/40 bg-success/10 text-success",
};

export function generateStaticParams() {
  return TECHNOLOGIES.map((t) => ({ id: t.id }));
}

export default function TechnologyDetailPage({ params }: { params: { id: string } }) {
  const technology = getTechnology(params.id);
  if (!technology) notFound();

  const patents = patentsByTechnology(technology.id);
  const rdProjects = rdByTechnology(technology.id);
  const publications = publicationsByTechnology(technology.id);
  const gaps = gapsByTechnology(technology.id);

  // Seed the mandatory "Why classified here?" modal from the first available
  // patent or R&D record's classification breakdown (spec §13, golden rule §3).
  const representative = patents[0] ?? rdProjects[0];

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 font-mono text-2xs uppercase tracking-[0.18em] text-mineral">Technology Profile</div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink">{technology.name}</h1>
              {technology.aliases.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {technology.aliases.map((a) => (
                    <Pill key={a} className="border-border-strong bg-surface-2 text-ink-faint">
                      {a}
                    </Pill>
                  ))}
                </div>
              )}
            </div>
            <DemoBadge />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Pill className={MATURITY_TONE[technology.maturity]}>{technology.maturity}</Pill>
            <MomentumBadge value={technology.momentum} />
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">{technology.description}</p>
        </div>
      </FadeIn>

      <TechnologyKpiRow metrics={technology.metrics} />

      <Card>
        <CardHeader>
          <div>
            <h2 className="text-sm font-semibold text-ink">Value chain coverage</h2>
            <p className="mt-1 text-xs text-ink-soft">Stages of the mineral value chain where this technology is active, highlighted below.</p>
          </div>
        </CardHeader>
        <CardBody>
          <ValueChainStrip activeStages={technology.stages} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-ink">Related minerals</h2>
        </CardHeader>
        <CardBody>
          {technology.minerals.length === 0 ? (
            <p className="text-xs text-ink-faint">No related minerals indexed.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {technology.minerals.map((mid) => (
                <Link
                  key={mid}
                  href={`/minerals/${mid}`}
                  className="group inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-2 px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-mineral/50 hover:text-mineral"
                >
                  {mineralName(mid)}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <div className="font-mono text-2xs uppercase tracking-[0.18em] text-mineral">Lifecycle Signal</div>
              <h2 className="mt-0.5 text-sm font-semibold text-ink">Emerging component breakdown</h2>
              <p className="mt-1 text-xs text-ink-soft">Weighted composite of research, patent and organisational growth signals.</p>
            </div>
            {representative && (
              <WhyClassifiedButton
                matchedMineral={mineralName(representative.mineral)}
                matchedTechnology={technology.name}
                confidence={representative.provenance.confidence}
                signals={representative.classification}
                sourceRecords={patents.length + rdProjects.length}
              />
            )}
          </div>
        </CardHeader>
        <CardBody>
          <EmergingBreakdown components={technology.emergingComponents} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-sm font-semibold text-ink">Related patents</h2>
              <p className="mt-0.5 text-2xs text-ink-faint">{patents.length} record{patents.length === 1 ? "" : "s"}</p>
            </div>
          </CardHeader>
          <CardBody>
            <PatentList patents={patents} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-sm font-semibold text-ink">Related R&D</h2>
              <p className="mt-0.5 text-2xs text-ink-faint">{rdProjects.length} record{rdProjects.length === 1 ? "" : "s"}</p>
            </div>
          </CardHeader>
          <CardBody>
            <RDList projects={rdProjects} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-sm font-semibold text-ink">Related publications</h2>
              <p className="mt-0.5 text-2xs text-ink-faint">{publications.length} record{publications.length === 1 ? "" : "s"}</p>
            </div>
          </CardHeader>
          <CardBody>
            <PublicationList publications={publications} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h2 className="text-sm font-semibold text-ink">Potential capability gap signals</h2>
            <p className="mt-1 text-xs text-ink-soft">
              Evidence-based signals derived from indexed patent, R&D and publication activity — not confirmed
              capability gaps.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <GapSignalList gaps={gaps} />
        </CardBody>
      </Card>
    </div>
  );
}
