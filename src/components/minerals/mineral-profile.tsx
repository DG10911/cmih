"use client";
import * as React from "react";
import {
  getMineral,
  technologiesByMineral,
  patentsByMineral,
  rdByMineral,
  orgsByMineral,
  emergingByMineral,
  gapsByMineral,
  collaborationByMineral,
  evidenceByMineral,
  timelineByMineral,
  mineralActivity,
} from "@/lib/data";
import { MineralHero } from "./mineral-hero";
import { ValueChain } from "./value-chain";
import { ProfileSection } from "./section-shell";
import { SectionNav } from "./section-nav";
import { TechnologyLandscapeSection } from "./technology-landscape-section";
import { TrendsSection } from "./trends-section";
import { PatentActivitySection } from "./patent-activity-section";
import { RdActivitySection } from "./rd-activity-section";
import { OrganisationsSection } from "./organisations-section";
import { EmergingSection } from "./emerging-section";
import { GapsSection } from "./gaps-section";
import { CollaborationSection } from "./collaboration-section";
import { EvidenceSection } from "./evidence-section";
import type { ValueChainStage } from "@/lib/types";

/**
 * Mineral Intelligence Profile — flagship demo screen. Orchestrates the
 * value-chain stage filter and composes every intelligence section for a
 * single mineral (spec: /minerals/[id]).
 */
export function MineralProfile({ id }: { id: string }) {
  const mineral = getMineral(id);
  const [selectedStage, setSelectedStage] = React.useState<ValueChainStage | null>(null);

  const technologies = React.useMemo(() => technologiesByMineral(id), [id]);
  const allPatents = React.useMemo(() => patentsByMineral(id), [id]);
  const allRd = React.useMemo(() => rdByMineral(id), [id]);
  const orgs = React.useMemo(() => orgsByMineral(id), [id]);
  const emerging = React.useMemo(() => emergingByMineral(id), [id]);
  const gaps = React.useMemo(() => gapsByMineral(id), [id]);
  const collaborations = React.useMemo(() => collaborationByMineral(id), [id]);
  const evidence = React.useMemo(() => evidenceByMineral(id), [id]);
  const timeline = React.useMemo(() => timelineByMineral(id), [id]);

  const activity = React.useMemo(
    () =>
      mineral
        ? mineralActivity(mineral.metrics.patentFamilies, mineral.metrics.publications, mineral.metrics.rdProjects)
        : [],
    [mineral]
  );

  // Cross-reference patent/R&D record ids to their value-chain stage so the
  // event timeline can respect the same filter as the patent/R&D lists.
  const stageById = React.useMemo(() => {
    const map = new Map<string, ValueChainStage>();
    allPatents.forEach((p) => map.set(p.id, p.stage));
    allRd.forEach((r) => map.set(r.id, r.stage));
    return map;
  }, [allPatents, allRd]);

  const filteredTechnologies = selectedStage ? technologies.filter((t) => t.stages.includes(selectedStage)) : technologies;
  const filteredPatents = selectedStage ? allPatents.filter((p) => p.stage === selectedStage) : allPatents;
  const filteredRd = selectedStage ? allRd.filter((r) => r.stage === selectedStage) : allRd;
  const filteredTimeline = selectedStage
    ? timeline.filter((ev) => !ev.refId || !stageById.has(ev.refId) || stageById.get(ev.refId) === selectedStage)
    : timeline;

  if (!mineral) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_180px]">
      <div className="min-w-0 space-y-8">
        <MineralHero mineral={mineral} />

        <ProfileSection
          id="value-chain"
          eyebrow="Section 02"
          title="Value Chain"
          subtitle="Stages this mineral's evidence base covers. Select a stage to filter technologies, patents and R&D below."
        >
          <ValueChain
            covered={mineral.stages}
            selected={selectedStage}
            onSelect={(stage) => setSelectedStage((cur) => (cur === stage ? null : stage))}
            onClear={() => setSelectedStage(null)}
          />
        </ProfileSection>

        <TechnologyLandscapeSection technologies={filteredTechnologies} stageFilter={selectedStage} />
        <TrendsSection activity={activity} mineralName={mineral.name} />
        <PatentActivitySection patents={filteredPatents} activity={activity} stageFilter={selectedStage} />
        <RdActivitySection timeline={filteredTimeline} rdProjects={filteredRd} stageFilter={selectedStage} />
        <OrganisationsSection organisations={orgs} />
        <EmergingSection items={emerging} />
        <GapsSection gaps={gaps} />
        <CollaborationSection signals={collaborations} />
        <EvidenceSection mineralName={mineral.name} evidence={evidence} />
      </div>

      <SectionNav />
    </div>
  );
}
