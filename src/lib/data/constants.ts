import type { ValueChainStage } from "@/lib/types";

/** Ordered value-chain stages (spec §10). */
export const VALUE_CHAIN_STAGES: ValueChainStage[] = [
  "Exploration",
  "Mining",
  "Beneficiation",
  "Extraction",
  "Separation",
  "Refining",
  "Recovery / Recycling",
  "Advanced Materials / Applications",
];

export const STAGE_SHORT: Record<ValueChainStage, string> = {
  Exploration: "Explore",
  Mining: "Mining",
  Beneficiation: "Benefic.",
  Extraction: "Extract",
  Separation: "Separate",
  Refining: "Refine",
  "Recovery / Recycling": "Recycle",
  "Advanced Materials / Applications": "Materials",
};

/** Configurable Gap Signal weights (spec §30,85). */
export const GAP_WEIGHTS = {
  strategicRelevance: 0.38,
  technologyMomentum: 0.27,
  domesticCapability: 0.19,
  evidenceSufficiency: 0.16,
};

/** Configurable Emerging Signal weights (spec §84). */
export const EMERGING_WEIGHTS = {
  researchGrowth: 0.25,
  patentGrowth: 0.2,
  orgGrowth: 0.15,
  novelty: 0.15,
  recency: 0.15,
  maturityEvidence: 0.1,
};

/** Classification confidence thresholds — prototype heuristics (spec §13). */
export const CONFIDENCE_THRESHOLDS = {
  high: 0.85,
  review: 0.6,
};

export const APP_META = {
  name: "KhanijDrishti",
  hindi: "खनिजदृष्टि",
  tagline: "See the Mineral. Map the Technology. Find the Gap.",
  description: "India's Critical Mineral Technology Intelligence Platform",
  version: "v0.1 Prototype",
  updated: "19 Sep 2026",
  environment: "Demonstration Environment",
};

export const PROTOTYPE_DISCLAIMER =
  "Prototype dataset — replace with authorised source connectors for production deployment.";
