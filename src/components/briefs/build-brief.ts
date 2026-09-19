import {
  getMineral,
  technologiesByMineral,
  orgsByMineral,
  gapsByMineral,
  emergingByMineral,
  collaborationByMineral,
  evidenceByMineral,
  INDIA_SHARE,
} from "@/lib/data";
import type {
  Mineral,
  Technology,
  Organisation,
  GapSignal,
  EmergingTechnology,
  CollaborationSignal,
  ValueChainStage,
} from "@/lib/types";

export type Audience = "Policy maker" | "Scientist" | "Industry";
export type Geography = "India" | "Global" | "Both";

export interface BriefParams {
  mineralId: string;
  /** "all" or a specific technology id, scoped to the selected mineral. */
  technologyId: string;
  fromYear: number;
  toYear: number;
  geography: Geography;
  audience: Audience;
}

export interface PolicyBrief {
  generatedAt: string;
  params: BriefParams;
  mineral: Mineral;
  technologyLabel: string;
  executiveSummary: string;
  technologyLandscape: Technology[];
  indiaCapability: { avgByStage: Partial<Record<ValueChainStage, number>>; orgCount: number };
  globalActivity: {
    indiaSharePatents: number;
    indiaShareRd: number;
    indiaSharePublications: number;
    indiaGrowthRelative: number;
    note: string;
  };
  emergingTechnologies: EmergingTechnology[];
  gapSignals: GapSignal[];
  leadingOrganisations: Organisation[];
  collaborationSignals: CollaborationSignal[];
  evidenceSampleIds: string[];
  evidenceCount: number;
  dataLimitations: string[];
}

/**
 * Compose a structured, evidence-linked policy brief entirely from the demo
 * dataset (spec §45). Nothing here is fabricated — every section reads from
 * an existing `@/lib/data` query helper.
 */
export function buildBrief(params: BriefParams): PolicyBrief {
  const mineral = getMineral(params.mineralId);
  if (!mineral) throw new Error(`Unknown mineral: ${params.mineralId}`);

  const scopeToTechnology = params.technologyId !== "all";

  const technologyLandscape = technologiesByMineral(params.mineralId).filter(
    (t) => !scopeToTechnology || t.id === params.technologyId
  );
  const orgs = orgsByMineral(params.mineralId);
  const gapSignals = gapsByMineral(params.mineralId).filter(
    (g) => !scopeToTechnology || g.technology === params.technologyId
  );
  const emergingTechnologies = emergingByMineral(params.mineralId).filter(
    (e) => !scopeToTechnology || e.technology === params.technologyId
  );
  const collaborationSignals = collaborationByMineral(params.mineralId);
  const evidence = evidenceByMineral(params.mineralId).filter(
    (e) => !scopeToTechnology || e.technology === params.technologyId
  );

  // Average domestic capability per value-chain stage across organisations active on this mineral.
  const stageTotals: Partial<Record<ValueChainStage, number>> = {};
  const stageCounts: Partial<Record<ValueChainStage, number>> = {};
  orgs.forEach((o) => {
    (Object.entries(o.capability) as [ValueChainStage, number | undefined][]).forEach(([stage, v]) => {
      if (v == null) return;
      stageTotals[stage] = (stageTotals[stage] ?? 0) + v;
      stageCounts[stage] = (stageCounts[stage] ?? 0) + 1;
    });
  });
  const avgByStage: Partial<Record<ValueChainStage, number>> = {};
  (Object.keys(stageTotals) as ValueChainStage[]).forEach((stage) => {
    avgByStage[stage] = stageTotals[stage]! / (stageCounts[stage] ?? 1);
  });

  const leadingOrganisations = [...orgs]
    .sort(
      (a, b) =>
        b.metrics.patentFamilies + b.metrics.publications - (a.metrics.patentFamilies + a.metrics.publications)
    )
    .slice(0, 6);

  const technologyLabel = scopeToTechnology
    ? technologyLandscape[0]?.name ?? "the selected technology"
    : `${technologyLandscape.length} tracked technologies`;

  const audienceLine: Record<Audience, string> = {
    "Policy maker":
      "Findings below are framed for strategic prioritisation — they are indicative Potential Capability Gap Signals, not confirmed conclusions, and should inform further diligence rather than direct decisions.",
    Scientist:
      "Findings below emphasise technical maturity, research momentum and evidence density for further scientific evaluation.",
    Industry:
      "Findings below emphasise commercialisation readiness, organisational activity and collaboration opportunities relevant to industry planning.",
  };

  const geographyLine: Record<Geography, string> = {
    India: "scoped to Indian activity",
    Global: "scoped to global activity",
    Both: "comparing Indian and global activity",
  };

  const executiveSummary =
    `${mineral.name} (${mineral.symbol}) is classified as a ${mineral.category.toLowerCase()} critical mineral. ${mineral.summary} ` +
    `This brief covers ${technologyLabel} across ${params.fromYear}–${params.toYear}, ${geographyLine[params.geography]}. ` +
    `${audienceLine[params.audience]} All figures are drawn from the indexed demonstration dataset (${evidence.length} linked evidence record${evidence.length === 1 ? "" : "s"}).`;

  const dataLimitations = Array.from(
    new Set([
      "All data in this prototype is synthetic demonstration data — no live source connectivity is active.",
      "Confidence reflects evidence volume and classification consistency, not factual certainty.",
      "Year filters scope the narrative only; underlying demo metrics are not re-aggregated by year.",
      ...gapSignals.map((g) => g.dataLimitations),
    ])
  );

  return {
    generatedAt: new Date().toISOString(),
    params,
    mineral,
    technologyLabel,
    executiveSummary,
    technologyLandscape,
    indiaCapability: { avgByStage, orgCount: orgs.length },
    globalActivity: {
      indiaSharePatents: INDIA_SHARE.patents,
      indiaShareRd: INDIA_SHARE.rd,
      indiaSharePublications: INDIA_SHARE.publications,
      indiaGrowthRelative: INDIA_SHARE.growth,
      note: "India-share figures are indicative demo ratios relative to modelled global activity, not a measured live share.",
    },
    emergingTechnologies,
    gapSignals,
    leadingOrganisations,
    collaborationSignals,
    evidenceSampleIds: evidence.slice(0, 8).map((e) => e.id),
    evidenceCount: evidence.length,
    dataLimitations,
  };
}
