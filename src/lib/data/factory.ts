import type { Provenance } from "@/lib/types";

/** Concise deterministic provenance builder for demo records. */
export function prov(
  source: string,
  recordType: Provenance["recordType"],
  confidence: number,
  opts: Partial<Provenance> = {}
): Provenance {
  const sourceType =
    source === "OpenAlex" || source === "Crossref"
      ? "Scholarly"
      : source.includes("Patent") || source === "Lens" || source === "WIPO"
        ? "Patent"
        : "Official / R&D";
  return {
    source,
    sourceType,
    sourceUrl: opts.sourceUrl,
    retrievedAt: opts.retrievedAt ?? "2026-09-18",
    lastVerified: opts.lastVerified ?? "2026-09-19",
    recordType,
    confidence,
    classificationMethod: opts.classificationMethod ?? "hybrid",
    isDemo: opts.isDemo ?? true,
    transformationHistory:
      opts.transformationHistory ?? ["ingested", "normalized", "entity-resolved", "classified"],
  };
}
