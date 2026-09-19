import {
  MINERALS,
  TECHNOLOGIES,
  GAP_SIGNALS,
  search,
  emergingByMineral,
  gapsByMineral,
  orgsByMineral,
  evidenceByMineral,
  mineralName,
  technologyName,
  getEvidence,
} from "@/lib/data";
import type { Level } from "@/lib/types";

export interface AskAnswer {
  question: string;
  paragraphs: string[];
  bullets?: string[];
  evidenceIds: string[];
  confidence: Level;
  sources: string[];
  limitations: string;
}

export const EXAMPLE_QUESTIONS = [
  "What are the emerging technologies in rare-earth recycling?",
  "Which Indian organisations are active in lithium extraction?",
  "Show potential technology capability gaps in rare-earth processing.",
  "Which technologies have growing research activity but limited Indian patent evidence?",
];

/* ------------------------------------------------------------- helpers */

/** Map average linked-evidence confidence to a qualitative Level (spec §13). */
function confidenceFromEvidence(ids: string[]): Level {
  if (ids.length === 0) return "Low";
  const scores = ids.map((id) => getEvidence(id)?.provenance.confidence ?? 0);
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  if (avg >= 0.85) return "High";
  if (avg >= 0.6) return "Medium";
  return "Low";
}

function sourcesFromEvidence(ids: string[]): string[] {
  const set = new Set<string>();
  ids.forEach((id) => {
    const e = getEvidence(id);
    if (e) set.add(e.provenance.source);
  });
  return Array.from(set);
}

function findMineral(q: string) {
  const ql = q.toLowerCase();
  return MINERALS.find((m) => ql.includes(m.name.toLowerCase()) || m.aliases.some((a) => ql.includes(a.toLowerCase())));
}

function findTechnology(q: string) {
  const ql = q.toLowerCase();
  return TECHNOLOGIES.find(
    (t) => ql.includes(t.name.toLowerCase()) || t.aliases.some((a) => ql.includes(a.toLowerCase()))
  );
}

/* --------------------------------------------- canned example answers */
/**
 * Grounded, deterministic answers for the four example questions (spec
 * §46-47). Every answer is derived from real `@/lib/data` query helpers —
 * nothing here is fabricated.
 */

function answerEmergingRareEarthRecycling(question: string): AskAnswer {
  const emerging = emergingByMineral("ree").filter((e) => technologyName(e.technology).toLowerCase().includes("recycl"));
  const evidenceIds = Array.from(
    new Set(
      emerging.flatMap((e) =>
        evidenceByMineral("ree")
          .filter((ev) => ev.technology === e.technology)
          .slice(0, 2)
          .map((ev) => ev.id)
      )
    )
  );
  return {
    question,
    paragraphs: [
      emerging.length
        ? `${emerging.length} recycling-related emerging-technology signal(s) are tracked for rare earths in the indexed demo dataset.`
        : "No recycling-specific emerging-technology signal is currently tracked for rare earths in the indexed demo dataset.",
    ],
    bullets: emerging.map(
      (e) =>
        `${technologyName(e.technology)} — zone: ${e.zone}, momentum: ${
          e.momentum === "up" ? "rising" : e.momentum === "down" ? "declining" : "stable"
        }, emerging score ${(e.emergingScore * 100).toFixed(0)}%.`
    ),
    evidenceIds,
    confidence: confidenceFromEvidence(evidenceIds),
    sources: sourcesFromEvidence(evidenceIds),
    limitations:
      "Emerging-technology scores are prototype heuristics based on synthetic research/patent growth components, not a live bibliometric signal.",
  };
}

function answerLithiumOrgs(question: string): AskAnswer {
  const orgs = orgsByMineral("lithium").filter((o) =>
    o.technologies.some((t) => t.includes("extraction") || t.includes("lithium"))
  );
  const evidenceIds = evidenceByMineral("lithium")
    .filter((e) => e.organisation && orgs.some((o) => o.id === e.organisation))
    .slice(0, 8)
    .map((e) => e.id);
  return {
    question,
    paragraphs: [
      orgs.length
        ? `${orgs.length} organisation(s) in the indexed dataset show activity relevant to lithium extraction technologies.`
        : "No organisation in the indexed dataset is currently classified as active in lithium extraction technologies.",
    ],
    bullets: orgs.map((o) => `${o.name} (${o.type}, ${o.country}) — ${o.metrics.patentFamilies} patent families, ${o.metrics.publications} publications.`),
    evidenceIds,
    confidence: confidenceFromEvidence(evidenceIds),
    sources: sourcesFromEvidence(evidenceIds),
    limitations:
      "Organisation activity is derived from classified patent, R&D and publication records in the demo dataset and may not reflect full real-world activity.",
  };
}

function answerREEGaps(question: string): AskAnswer {
  const gaps = gapsByMineral("ree");
  const evidenceIds = Array.from(new Set(gaps.flatMap((g) => g.evidenceIds)));
  return {
    question,
    paragraphs: [
      gaps.length
        ? `${gaps.length} Potential Capability Gap Signal(s) are identified for rare-earth processing technologies in the indexed dataset. These are signals for further investigation, not confirmed conclusions.`
        : "No Potential Capability Gap Signal is currently identified for rare-earth processing in the indexed dataset.",
    ],
    bullets: gaps.map(
      (g) => `${technologyName(g.technology)} — ${g.gapType}. Confidence: ${g.confidence}; evidence sufficiency: ${g.evidenceSufficiency}.`
    ),
    evidenceIds,
    confidence: confidenceFromEvidence(evidenceIds),
    sources: sourcesFromEvidence(evidenceIds),
    limitations: Array.from(new Set(gaps.map((g) => g.dataLimitations))).join(" ") || "Insufficient linked evidence to assess data limitations.",
  };
}

function answerGrowingResearchLimitedPatents(question: string): AskAnswer {
  const gaps = GAP_SIGNALS.filter(
    (g) => g.indianPatentActivity === "Low" && (g.globalMomentum === "High" || g.indianRdActivity !== "Low")
  );
  const evidenceIds = Array.from(new Set(gaps.flatMap((g) => g.evidenceIds)));
  return {
    question,
    paragraphs: [
      `${gaps.length} technology signal(s) show global momentum or Indian R&D activity outpacing Indian patent filings in the indexed dataset.`,
    ],
    bullets: gaps.map(
      (g) =>
        `${technologyName(g.technology)} (${mineralName(g.mineral)}) — global momentum: ${g.globalMomentum}, Indian R&D activity: ${g.indianRdActivity}, Indian patent activity: ${g.indianPatentActivity}.`
    ),
    evidenceIds,
    confidence: confidenceFromEvidence(evidenceIds),
    sources: sourcesFromEvidence(evidenceIds),
    limitations:
      "Patent filing lag and non-public or unfiled research mean low patent activity does not necessarily indicate low underlying capability.",
  };
}

const CANNED: { match: (ql: string) => boolean; build: (q: string) => AskAnswer }[] = [
  {
    match: (ql) => ql.includes("emerg") && ql.includes("recycl") && (ql.includes("rare") || ql.includes("ree")),
    build: answerEmergingRareEarthRecycling,
  },
  {
    match: (ql) => ql.includes("organis") && ql.includes("lithium"),
    build: answerLithiumOrgs,
  },
  {
    match: (ql) => ql.includes("gap") && (ql.includes("rare") || ql.includes("ree")),
    build: answerREEGaps,
  },
  {
    match: (ql) => ql.includes("growing research") || (ql.includes("limited") && ql.includes("patent")),
    build: answerGrowingResearchLimitedPatents,
  },
];

/* ------------------------------------------------------ keyword fallback */

function genericFallback(query: string): AskAnswer | null {
  const mineral = findMineral(query);
  const technology = findTechnology(query);
  const ql = query.toLowerCase();

  if (mineral && /(gap|capability|opportunity)/.test(ql)) {
    const gaps = gapsByMineral(mineral.id).filter((g) => !technology || g.technology === technology.id);
    if (gaps.length === 0) return null;
    const evidenceIds = Array.from(new Set(gaps.flatMap((g) => g.evidenceIds)));
    return {
      question: query,
      paragraphs: [
        `${gaps.length} Potential Capability Gap Signal(s) found for ${mineral.name}${technology ? ` / ${technology.name}` : ""} in the indexed dataset.`,
      ],
      bullets: gaps.map((g) => `${technologyName(g.technology)} — ${g.gapType}. Confidence: ${g.confidence}.`),
      evidenceIds,
      confidence: confidenceFromEvidence(evidenceIds),
      sources: sourcesFromEvidence(evidenceIds),
      limitations: Array.from(new Set(gaps.map((g) => g.dataLimitations))).join(" "),
    };
  }

  if (mineral && /(emerg|growing|momentum|trend)/.test(ql)) {
    const emerging = emergingByMineral(mineral.id).filter((e) => !technology || e.technology === technology.id);
    if (emerging.length === 0) return null;
    const evidenceIds = evidenceByMineral(mineral.id)
      .filter((e) => emerging.some((em) => em.technology === e.technology))
      .slice(0, 6)
      .map((e) => e.id);
    return {
      question: query,
      paragraphs: [`${emerging.length} emerging-technology signal(s) found for ${mineral.name}${technology ? ` / ${technology.name}` : ""}.`],
      bullets: emerging.map((e) => `${technologyName(e.technology)} — zone ${e.zone}, momentum ${e.momentum}.`),
      evidenceIds,
      confidence: confidenceFromEvidence(evidenceIds),
      sources: sourcesFromEvidence(evidenceIds),
      limitations: "Emerging-technology scores are prototype heuristics, not a live bibliometric signal.",
    };
  }

  if (mineral && /(organis|companies|active|institut)/.test(ql)) {
    const orgs = orgsByMineral(mineral.id).filter((o) => !technology || o.technologies.includes(technology.id));
    if (orgs.length === 0) return null;
    const evidenceIds = evidenceByMineral(mineral.id)
      .filter((e) => e.organisation && orgs.some((o) => o.id === e.organisation))
      .slice(0, 6)
      .map((e) => e.id);
    return {
      question: query,
      paragraphs: [`${orgs.length} organisation(s) active in ${mineral.name}${technology ? ` / ${technology.name}` : ""} in the indexed dataset.`],
      bullets: orgs.map((o) => `${o.name} (${o.type}, ${o.country}).`),
      evidenceIds,
      confidence: confidenceFromEvidence(evidenceIds),
      sources: sourcesFromEvidence(evidenceIds),
      limitations: "Organisation activity is derived from classified patent, R&D and publication records in the demo dataset.",
    };
  }

  // Last resort: generic full-text search across the demo dataset.
  const results = search(query).slice(0, 6);
  const evidenceIds = results.map((r) => r.id).filter((id) => !!getEvidence(id));
  if (evidenceIds.length === 0) return null;
  return {
    question: query,
    paragraphs: [`${evidenceIds.length} related record(s) found in the indexed dataset for "${query}".`],
    bullets: results.filter((r) => evidenceIds.includes(r.id)).map((r) => `${r.title} — ${r.subtitle}`),
    evidenceIds,
    confidence: confidenceFromEvidence(evidenceIds),
    sources: sourcesFromEvidence(evidenceIds),
    limitations: "Matched via keyword search across the demo dataset; results may be incomplete.",
  };
}

/**
 * Deterministic, canned-but-grounded answer matcher (spec §46-47). Never
 * calls an external LLM and never fabricates evidence — every answer is
 * traceable to real records in `@/lib/data`. Returns `null` when there is
 * no confident match, which the UI renders as an "insufficient evidence"
 * message.
 */
export function answerQuestion(query: string): AskAnswer | null {
  const q = query.trim();
  if (!q) return null;
  const ql = q.toLowerCase();
  const canned = CANNED.find((c) => c.match(ql));
  if (canned) return canned.build(q);
  return genericFallback(q);
}
