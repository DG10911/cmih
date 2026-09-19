"use client";
import * as React from "react";
import Link from "next/link";
import { Award, Calendar, FileSearch, HelpCircle, Layers, ShieldQuestion } from "lucide-react";
import { Button, Card, CardBody, CardHeader, DemoBadge, Pill, SectionHeader, SourceBadge, Stat } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { WhyThisModal } from "@/components/intelligence/why-this-modal";
import { EvidenceDrawer } from "@/components/intelligence/evidence-drawer";
import {
  PATENTS,
  getOrganisation,
  mineralName,
  orgName,
  rdByTechnology,
  technologyName,
  ORGANISATIONS,
} from "@/lib/data";
import type { Patent } from "@/lib/types";
import { TechnologyFingerprintChain } from "./fingerprint";
import { PatentActivitySignal } from "./activity-signal";
import { TechnologyRelationshipMap } from "./relationship-map";

const LEGAL_STATUS_TONE: Record<Patent["legalStatus"], string> = {
  Granted: "border-success/40 bg-success/10 text-success",
  Pending: "border-warning/40 bg-warning/10 text-warning",
  Lapsed: "border-ink-faint/40 bg-surface-3 text-ink-soft",
  Withdrawn: "border-danger/40 bg-danger/10 text-danger",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "2-digit" });
}

export function PatentDetail({ patent }: { patent: Patent }) {
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [evidenceOpen, setEvidenceOpen] = React.useState(false);

  const relatedPatents = React.useMemo(
    () =>
      PATENTS.filter(
        (p) => p.id !== patent.id && (p.familyId === patent.familyId || p.technology === patent.technology)
      ).slice(0, 6),
    [patent]
  );

  const relatedRD = React.useMemo(() => rdByTechnology(patent.technology).slice(0, 5), [patent.technology]);

  const relatedOrganisations = React.useMemo(
    () =>
      ORGANISATIONS.filter(
        (o) =>
          !patent.applicants.includes(o.id) &&
          (o.technologies.includes(patent.technology) || o.minerals.includes(patent.mineral))
      ).slice(0, 6),
    [patent]
  );

  const evidenceIds = React.useMemo(
    () => [patent.id, ...relatedPatents.map((p) => p.id), ...relatedRD.map((r) => r.id)].slice(0, 8),
    [patent, relatedPatents, relatedRD]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Pill className="border-border-strong bg-surface-2 font-mono text-ink-soft">{patent.familyId}</Pill>
            <Pill className="border-border-strong bg-surface-2 text-ink-soft">
              <Layers className="h-3 w-3" />
              {patent.familySize} family {patent.familySize === 1 ? "member" : "members"}
            </Pill>
            <Pill className={LEGAL_STATUS_TONE[patent.legalStatus]}>{patent.legalStatus}</Pill>
            <DemoBadge />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{patent.title}</h1>
          <p className="text-xs italic text-ink-faint">
            Synthetic demonstration record — illustrative, not a real filing.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Bibliographic block */}
          <Card>
            <CardHeader>
              <SectionHeader eyebrow="Record" title="Bibliographic Details" />
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-2xs uppercase tracking-wider text-ink-faint">Applicants</span>
                <div className="mt-1 flex flex-col gap-1">
                  {patent.applicants.map((a) => {
                    const org = getOrganisation(a);
                    return org ? (
                      <Link key={a} href={`/organisations/${org.id}`} className="text-sm font-medium text-ink hover:text-mineral">
                        {org.name}
                      </Link>
                    ) : (
                      <span key={a} className="text-sm font-medium text-ink">
                        {orgName(a)}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="text-2xs uppercase tracking-wider text-ink-faint">Inventors</span>
                <p className="mt-1 text-sm text-ink">{patent.inventors.join(", ")}</p>
              </div>
              <Stat label="Priority date" value={formatDate(patent.priorityDate)} />
              <Stat label="Filing date" value={formatDate(patent.filingDate)} />
              <Stat label="Publication date" value={formatDate(patent.publicationDate)} />
              <Stat label="Citation count" value={patent.citationCount} />
              <div>
                <span className="text-2xs uppercase tracking-wider text-ink-faint">Jurisdictions</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {patent.jurisdictions.map((j) => (
                    <Pill key={j} className="border-border-strong bg-surface-2 font-mono text-ink-soft">
                      {j}
                    </Pill>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-2xs uppercase tracking-wider text-ink-faint">CPC codes</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {patent.cpc.map((c) => (
                    <Pill key={c} className="border-border-strong bg-surface-2 font-mono text-ink-soft">
                      {c}
                    </Pill>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Technology Fingerprint */}
          <Card>
            <CardHeader>
              <SectionHeader eyebrow="Spec §12" title="Technology Fingerprint" subtitle="Mineral → Feedstock → Stage → Technology → Process → Product → Application" />
            </CardHeader>
            <CardBody>
              <TechnologyFingerprintChain fingerprint={patent.fingerprint} />
            </CardBody>
          </Card>

          {/* Patent Activity Signal */}
          <Card>
            <CardHeader>
              <SectionHeader eyebrow="Prototype signal, not a quality score" title="Patent Activity Signal" />
            </CardHeader>
            <CardBody>
              <PatentActivitySignal signal={patent.activitySignal} />
            </CardBody>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader className="flex-wrap gap-2">
              <SectionHeader eyebrow="Explainability" title="Classification Signals" />
              <Button variant="outline" size="sm" onClick={() => setWhyOpen(true)}>
                <HelpCircle className="h-3.5 w-3.5" /> Why classified this way?
              </Button>
            </CardHeader>
            <CardBody className="space-y-2">
              {patent.classification.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-ink-soft">{s.label}</span>
                  <span className="font-mono text-xs tabular-nums text-data">+{s.contribution.toFixed(2)}</span>
                </div>
              ))}
              <p className="pt-1 text-2xs text-ink-faint">
                Classified via {patent.provenance.classificationMethod} method. Mapped mineral:{" "}
                {mineralName(patent.mineral)}, technology: {technologyName(patent.technology)}.
              </p>
            </CardBody>
          </Card>

          {/* Technology Relationship Map */}
          <Card>
            <CardHeader>
              <SectionHeader eyebrow="Relationship" title="Technology Relationship Map" />
            </CardHeader>
            <CardBody>
              <TechnologyRelationshipMap patent={patent} />
            </CardBody>
          </Card>

          {/* Related */}
          <Card>
            <CardHeader>
              <SectionHeader eyebrow="Related records" title="Related Patents, R&D and Organisations" />
            </CardHeader>
            <CardBody className="space-y-5">
              <div>
                <span className="text-2xs uppercase tracking-wider text-ink-faint">Related patents</span>
                {relatedPatents.length === 0 ? (
                  <p className="mt-1 text-sm text-ink-soft">No related patents found in the demo dataset.</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {relatedPatents.map((p) => (
                      <li key={p.id}>
                        <Link href={`/patents/${p.id}`} className="text-sm text-ink hover:text-mineral">
                          {p.title}
                        </Link>
                        <span className="ml-2 font-mono text-2xs text-ink-faint">{p.familyId}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <span className="text-2xs uppercase tracking-wider text-ink-faint">Related R&D ({technologyName(patent.technology)})</span>
                {relatedRD.length === 0 ? (
                  <p className="mt-1 text-sm text-ink-soft">No related R&D projects found in the demo dataset.</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {relatedRD.map((r) => (
                      <li key={r.id}>
                        <Link href={`/rd/${r.id}`} className="text-sm text-ink hover:text-mineral">
                          {r.title}
                        </Link>
                        <span className="ml-2 text-2xs text-ink-faint">{orgName(r.organisation)} · {r.year}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <span className="text-2xs uppercase tracking-wider text-ink-faint">Related organisations</span>
                {relatedOrganisations.length === 0 ? (
                  <p className="mt-1 text-sm text-ink-soft">No related organisations found in the demo dataset.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {relatedOrganisations.map((o) => (
                      <Link key={o.id} href={`/organisations/${o.id}`}>
                        <Pill className="border-border-strong bg-surface-2 text-ink-soft hover:border-data/50 hover:text-ink">
                          {o.name}
                        </Pill>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <SectionHeader eyebrow="Trust" title="Provenance & Evidence" />
            </CardHeader>
            <CardBody className="space-y-3">
              <SourceBadge source={patent.provenance.source} />
              <div className="space-y-2 text-xs text-ink-soft">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-ink-faint" /> Retrieved {patent.provenance.retrievedAt}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-ink-faint" /> Verified {patent.provenance.lastVerified}
                </div>
                <div className="flex items-center gap-2">
                  <ShieldQuestion className="h-3.5 w-3.5 text-ink-faint" /> Method: {patent.provenance.classificationMethod}
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-ink-faint" /> Confidence {patent.provenance.confidence.toFixed(2)}
                </div>
              </div>
              {patent.provenance.transformationHistory.length > 0 && (
                <div>
                  <span className="text-2xs uppercase tracking-wider text-ink-faint">Transformation history</span>
                  <ul className="mt-1 space-y-0.5 text-2xs text-ink-faint">
                    {patent.provenance.transformationHistory.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button variant="secondary" size="sm" className="w-full" onClick={() => setEvidenceOpen(true)}>
                <FileSearch className="h-3.5 w-3.5" /> View evidence
              </Button>
              <p className="text-2xs leading-relaxed text-ink-faint">
                Demo data is illustrative only and does not represent real patent office connectivity or verified
                accuracy figures.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <WhyThisModal
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        matchedMineral={mineralName(patent.mineral)}
        matchedTechnology={technologyName(patent.technology)}
        confidence={patent.provenance.confidence}
        signals={patent.classification}
        method={patent.provenance.classificationMethod}
      />
      <EvidenceDrawer
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceIds={evidenceIds}
        title="Supporting Evidence"
      />
    </div>
  );
}
