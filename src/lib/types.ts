/**
 * KhanijDrishti domain model (spec §48-49).
 * All records are DEMO / synthetic unless a real public source is cited.
 */

export type Level = "High" | "Medium" | "Low";
export type Momentum = "up" | "flat" | "down";
export type Maturity = "Emerging" | "Developing" | "Scaling" | "Mature";
export type RecordType = "patent" | "rd" | "publication";
export type SourceStatus = "CONNECTED" | "DEMO" | "SIMULATED" | "STALE" | "ERROR" | "PLANNED";
export type EvidenceType = "patent" | "publication" | "rd_project" | "pilot" | "tech_transfer" | "mou";

/** Value-chain stages (spec §10). */
export type ValueChainStage =
  | "Exploration"
  | "Mining"
  | "Beneficiation"
  | "Extraction"
  | "Separation"
  | "Refining"
  | "Recovery / Recycling"
  | "Advanced Materials / Applications";

/** Data-trust envelope carried by every canonical record (spec §8). */
export interface Provenance {
  source: string;
  sourceType: string;
  sourceUrl?: string;
  retrievedAt: string; // ISO date
  lastVerified: string; // ISO date
  recordType: RecordType | EvidenceType;
  confidence: number; // 0..1
  classificationMethod: "keyword" | "cpc" | "embedding" | "hybrid" | "human";
  isDemo: boolean;
  transformationHistory: string[];
}

/** Technology fingerprint (spec §12). */
export interface TechnologyFingerprint {
  mineral: string;
  feedstock: string;
  stage: ValueChainStage;
  technology: string;
  process: string;
  product: string;
  application: string;
  maturity: Maturity;
  confidence: number;
}

/** Breakdown of a hybrid classification decision (spec §13). */
export interface ClassificationSignal {
  label: string; // e.g. "semantic similarity", "C22B classification match"
  contribution: number; // additive contribution to confidence
  detail?: string;
}

export interface Mineral {
  id: string;
  name: string;
  symbol: string;
  aliases: string[];
  category: string; // e.g. "Battery", "Rare Earth", "Strategic"
  summary: string;
  stages: ValueChainStage[];
  metrics: EntityMetrics;
}

export interface Technology {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  stages: ValueChainStage[];
  minerals: string[]; // mineral ids
  maturity: Maturity;
  momentum: Momentum;
  /** 2D landscape coords (spec §27): x = maturity/time (0..1), y = research momentum (0..1). */
  landscape: { x: number; y: number; evidenceVolume: number };
  /** Emerging radar component scores 0..1 (spec §84). */
  emergingComponents: {
    researchGrowth: number;
    patentGrowth: number;
    orgGrowth: number;
    novelty: number;
    recency: number;
    maturityEvidence: number;
  };
  metrics: EntityMetrics;
}

export interface EntityMetrics {
  patentFamilies: number;
  publications: number;
  rdProjects: number;
  organisations: number;
  emergingTechnologies?: number;
}

export interface Patent {
  id: string;
  title: string;
  familyId: string;
  familySize: number;
  applicants: string[]; // org ids or names
  inventors: string[];
  priorityDate: string;
  filingDate: string;
  publicationDate: string;
  jurisdictions: string[];
  cpc: string[];
  legalStatus: "Granted" | "Pending" | "Lapsed" | "Withdrawn";
  citationCount: number;
  mineral: string; // mineral id
  technology: string; // technology id
  stage: ValueChainStage;
  fingerprint: TechnologyFingerprint;
  /** Patent Activity Signal components (spec §17), 0..1 each. */
  activitySignal: {
    recency: number;
    familySize: number;
    citation: number;
    jurisdiction: number;
    applicantDiversity: number;
    relevance: number;
  };
  classification: ClassificationSignal[];
  provenance: Provenance;
}

export interface RDProject {
  id: string;
  title: string;
  organisation: string; // org id
  mineral: string;
  technology: string;
  stage: ValueChainStage;
  year: number;
  projectType: "Funded Project" | "Research Project" | "Pilot Plant" | "Tech Demonstration" | "MoU" | "Technology Transfer";
  fundingSource?: string;
  maturityEvidence: Maturity;
  summary: string;
  classification: ClassificationSignal[];
  provenance: Provenance;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  organisation: string;
  mineral: string;
  technology: string;
  year: number;
  venue: string;
  citations: number;
  provenance: Provenance;
}

export interface Organisation {
  id: string;
  name: string;
  aliases: string[];
  type: "Academic" | "Government" | "R&D Institute" | "Industry" | "PSU";
  country: string;
  metrics: EntityMetrics;
  /** Capability fingerprint by value-chain stage, 0..1 (spec §33). */
  capability: Partial<Record<ValueChainStage, number>>;
  minerals: string[];
  technologies: string[];
  collaborators: string[];
}

export interface Researcher {
  id: string;
  name: string;
  organisation: string;
  minerals: string[];
  technologies: string[];
  publications: number;
}

/** Timeline event for R&D intelligence (spec §18). */
export interface TimelineEvent {
  year: number;
  type: EvidenceType;
  label: string;
  refId?: string;
}

/** Emerging technology radar item (spec §28,84). */
export interface EmergingTechnology {
  id: string;
  technology: string; // technology id
  mineral: string;
  zone: Maturity; // EMERGING / DEVELOPING / SCALING / MATURE
  emergingScore: number; // 0..1
  momentum: Momentum;
  components: Technology["emergingComponents"];
}

/** Potential capability gap signal (spec §29-31). */
export interface GapSignal {
  id: string;
  technology: string; // technology id
  mineral: string; // mineral id
  gapType: "Research Gap" | "Technology Opportunity" | "Strategic Capability Gap";
  strategicNeed: Level;
  globalMomentum: Level;
  indianRdActivity: Level;
  indianPatentActivity: Level;
  evidenceSufficiency: Level;
  confidence: Level;
  /** Weighted contribution breakdown for "Explain Signal" modal (spec §30). */
  weights: {
    strategicRelevance: number;
    technologyMomentum: number;
    domesticCapability: number;
    evidenceSufficiency: number;
  };
  supportingEvidence: {
    patentFamilies: number;
    publications: number;
    rdProjects: number;
    organisations: number;
  };
  dataLimitations: string;
  evidenceIds: string[];
}

/** Potential complementary capability signal (spec §34). */
export interface CollaborationSignal {
  id: string;
  orgA: string; // org id
  orgB: string; // org id
  strengthA: string;
  strengthB: string;
  mineral: string;
  rationale: string;
  complementarity: number; // 0..1
  evidenceIds: string[];
}

/** Canonical evidence record surfaced in the Evidence Center (spec §40). */
export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  mineral: string;
  technology: string;
  organisation?: string;
  usedIn: string[]; // e.g. ["Gap signal", "Trend", "Technology map"]
  provenance: Provenance;
}

export interface DataSource {
  id: string;
  name: string;
  category: "Official" | "Scholarly" | "Patent";
  records: number;
  lastSync: string;
  status: SourceStatus;
  coverage: Level;
}

/** Time-series point for activity timelines / trends. */
export interface ActivityPoint {
  year: number;
  patents: number;
  rd: number;
  publications: number;
  events?: number;
}
