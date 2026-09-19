/**
 * KhanijDrishti demo data access layer.
 * Import query helpers from "@/lib/data" everywhere in the UI.
 * All data is deterministic and DEMO / synthetic (spec §52-53).
 */
import type { Evidence, EvidenceType, TimelineEvent } from "@/lib/types";

import { MINERALS } from "./minerals";
import { TECHNOLOGIES } from "./technologies";
import { ORGANISATIONS } from "./organisations";
import { PATENTS } from "./patents";
import { RD_PROJECTS, PUBLICATIONS } from "./rd";
import { GAP_SIGNALS, EMERGING_TECHNOLOGIES, COLLABORATION_SIGNALS } from "./intelligence";
import { DATA_SOURCES } from "./sources";

export * from "./constants";
export * from "./activity";
export * from "./sources";
export { MINERALS, TECHNOLOGIES, ORGANISATIONS, PATENTS, RD_PROJECTS, PUBLICATIONS };
export { GAP_SIGNALS, EMERGING_TECHNOLOGIES, COLLABORATION_SIGNALS };

/* ------------------------------------------------------------------ lookups */
export const getMineral = (id: string) => MINERALS.find((m) => m.id === id);
export const getTechnology = (id: string) => TECHNOLOGIES.find((t) => t.id === id);
export const getOrganisation = (id: string) => ORGANISATIONS.find((o) => o.id === id);
export const getPatent = (id: string) => PATENTS.find((p) => p.id === id);
export const getRDProject = (id: string) => RD_PROJECTS.find((r) => r.id === id);
export const getPublication = (id: string) => PUBLICATIONS.find((p) => p.id === id);
export const getGapSignal = (id: string) => GAP_SIGNALS.find((g) => g.id === id);

/** Resolve an organisation display name from an id or raw name. */
export function orgName(idOrName: string): string {
  return getOrganisation(idOrName)?.name ?? idOrName;
}
export const mineralName = (id: string) => getMineral(id)?.name ?? id;
export const technologyName = (id: string) => getTechnology(id)?.name ?? id;

/* --------------------------------------------------------------- by mineral */
export const patentsByMineral = (id: string) => PATENTS.filter((p) => p.mineral === id);
export const rdByMineral = (id: string) => RD_PROJECTS.filter((r) => r.mineral === id);
export const publicationsByMineral = (id: string) => PUBLICATIONS.filter((p) => p.mineral === id);
export const technologiesByMineral = (id: string) => TECHNOLOGIES.filter((t) => t.minerals.includes(id));
export const orgsByMineral = (id: string) => ORGANISATIONS.filter((o) => o.minerals.includes(id));
export const gapsByMineral = (id: string) => GAP_SIGNALS.filter((g) => g.mineral === id);
export const emergingByMineral = (id: string) => EMERGING_TECHNOLOGIES.filter((e) => e.mineral === id);
export const collaborationByMineral = (id: string) => COLLABORATION_SIGNALS.filter((c) => c.mineral === id);

/* ------------------------------------------------------------ by technology */
export const patentsByTechnology = (id: string) => PATENTS.filter((p) => p.technology === id);
export const rdByTechnology = (id: string) => RD_PROJECTS.filter((r) => r.technology === id);
export const publicationsByTechnology = (id: string) => PUBLICATIONS.filter((p) => p.technology === id);
export const gapsByTechnology = (id: string) => GAP_SIGNALS.filter((g) => g.technology === id);

/* --------------------------------------------------------- by organisation */
export const patentsByOrg = (id: string) => PATENTS.filter((p) => p.applicants.includes(id));
export const rdByOrg = (id: string) => RD_PROJECTS.filter((r) => r.organisation === id);
export const publicationsByOrg = (id: string) => PUBLICATIONS.filter((p) => p.organisation === id);
export const collaborationByOrg = (id: string) =>
  COLLABORATION_SIGNALS.filter((c) => c.orgA === id || c.orgB === id);

/* -------------------------------------------------------------- evidence */
/** Canonical evidence records derived from patents, R&D and publications (spec §40). */
export const EVIDENCE: Evidence[] = [
  ...PATENTS.map<Evidence>((p) => ({
    id: p.id,
    title: p.title,
    type: "patent",
    mineral: p.mineral,
    technology: p.technology,
    organisation: p.applicants[0],
    usedIn: ["Technology map", "Trend", ...(GAP_SIGNALS.some((g) => g.evidenceIds.includes(p.id)) ? ["Gap signal"] : [])],
    provenance: p.provenance,
  })),
  ...RD_PROJECTS.map<Evidence>((r) => ({
    id: r.id,
    title: r.title,
    type: (r.projectType === "Pilot Plant" ? "pilot" : r.projectType === "MoU" ? "mou" : r.projectType === "Technology Transfer" ? "tech_transfer" : "rd_project") as EvidenceType,
    mineral: r.mineral,
    technology: r.technology,
    organisation: r.organisation,
    usedIn: ["R&D timeline", "Trend", ...(GAP_SIGNALS.some((g) => g.evidenceIds.includes(r.id)) ? ["Gap signal"] : [])],
    provenance: r.provenance,
  })),
  ...PUBLICATIONS.map<Evidence>((p) => ({
    id: p.id,
    title: p.title,
    type: "publication",
    mineral: p.mineral,
    technology: p.technology,
    organisation: p.organisation,
    usedIn: ["Trend", ...(GAP_SIGNALS.some((g) => g.evidenceIds.includes(p.id)) ? ["Gap signal"] : [])],
    provenance: p.provenance,
  })),
];

export const getEvidence = (id: string) => EVIDENCE.find((e) => e.id === id);
export const evidenceByIds = (ids: string[]) => ids.map(getEvidence).filter(Boolean) as Evidence[];
export const evidenceByMineral = (id: string) => EVIDENCE.filter((e) => e.mineral === id);

/* -------------------------------------------------------- R&D timeline */
/** Build a chronological R&D event timeline for a mineral (spec §18). */
export function timelineByMineral(id: string): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  rdByMineral(id).forEach((r) =>
    events.push({ year: r.year, type: r.projectType === "Pilot Plant" ? "pilot" : r.projectType === "MoU" ? "mou" : r.projectType === "Technology Transfer" ? "tech_transfer" : "rd_project", label: r.title, refId: r.id })
  );
  patentsByMineral(id).forEach((p) =>
    events.push({ year: new Date(p.publicationDate).getFullYear(), type: "patent", label: p.title, refId: p.id })
  );
  publicationsByMineral(id).forEach((p) =>
    events.push({ year: p.year, type: "publication", label: p.title, refId: p.id })
  );
  return events.sort((a, b) => a.year - b.year);
}

/* --------------------------------------------------------------- search */
export interface SearchResult {
  id: string;
  kind: "Mineral" | "Technology" | "Patent" | "R&D" | "Publication" | "Organisation";
  title: string;
  subtitle: string;
  mineral?: string;
  technology?: string;
  confidence?: number;
  href: string;
}

/** Unified demo search across all entity types (spec §23-24,50). */
export function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hit = (s: string) => s.toLowerCase().includes(q);
  const results: SearchResult[] = [];

  MINERALS.forEach((m) => {
    if (hit(m.name) || m.aliases.some(hit) || hit(m.category)) {
      results.push({ id: m.id, kind: "Mineral", title: m.name, subtitle: `${m.category} · ${m.symbol}`, mineral: m.id, href: `/minerals/${m.id}` });
    }
  });
  TECHNOLOGIES.forEach((t) => {
    if (hit(t.name) || t.aliases.some(hit) || hit(t.description)) {
      results.push({ id: t.id, kind: "Technology", title: t.name, subtitle: `${t.maturity} · ${t.stages[0]}`, technology: t.id, href: `/technologies/${t.id}` });
    }
  });
  ORGANISATIONS.forEach((o) => {
    if (hit(o.name) || o.aliases.some(hit)) {
      results.push({ id: o.id, kind: "Organisation", title: o.name, subtitle: `${o.type} · ${o.country}`, href: `/organisations/${o.id}` });
    }
  });
  PATENTS.forEach((p) => {
    if (hit(p.title) || hit(mineralName(p.mineral)) || hit(technologyName(p.technology)) || p.applicants.some((a) => hit(orgName(a)))) {
      results.push({ id: p.id, kind: "Patent", title: p.title, subtitle: `${mineralName(p.mineral)} · ${technologyName(p.technology)}`, mineral: p.mineral, technology: p.technology, confidence: p.provenance.confidence, href: `/patents/${p.id}` });
    }
  });
  RD_PROJECTS.forEach((r) => {
    if (hit(r.title) || hit(mineralName(r.mineral)) || hit(technologyName(r.technology)) || hit(orgName(r.organisation))) {
      results.push({ id: r.id, kind: "R&D", title: r.title, subtitle: `${orgName(r.organisation)} · ${r.year}`, mineral: r.mineral, technology: r.technology, confidence: r.provenance.confidence, href: `/rd/${r.id}` });
    }
  });
  PUBLICATIONS.forEach((p) => {
    if (hit(p.title) || hit(mineralName(p.mineral)) || hit(technologyName(p.technology))) {
      results.push({ id: p.id, kind: "Publication", title: p.title, subtitle: `${p.venue} · ${p.year}`, mineral: p.mineral, technology: p.technology, confidence: p.provenance.confidence, href: `/rd/${p.id}` });
    }
  });
  return results;
}

/* ------------------------------------------------------ platform totals */
export const PLATFORM_TOTALS = {
  minerals: MINERALS.length,
  patentFamilies: MINERALS.reduce((s, m) => s + m.metrics.patentFamilies, 0),
  rdRecords: MINERALS.reduce((s, m) => s + m.metrics.rdProjects, 0) + PUBLICATIONS.length * 40,
  technologyNodes: TECHNOLOGIES.length * 96,
  organisations: MINERALS.reduce((s, m) => s + m.metrics.organisations, 0),
  evidenceRecords: DATA_SOURCES.reduce((s, d) => s + d.records, 0),
};
