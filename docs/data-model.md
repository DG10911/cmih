# Data model

Types: `src/lib/types.ts`. Data + query API: `src/lib/data/`.

## Entities
Mineral, Technology, Patent, PatentFamily (via `familyId`/`familySize`), RDProject, Publication,
Organisation (+ aliases), Researcher, Evidence, DataSource, GapSignal, EmergingTechnology,
CollaborationSignal, plus supporting shapes TechnologyFingerprint, ClassificationSignal, Provenance,
ActivityPoint, TimelineEvent.

## Ontology (per record fingerprint)
`Mineral → Feedstock → Process → Technology → Value-chain Stage → Product → Application` with a
`maturity` and `confidence`. Value-chain stages: Exploration, Mining, Beneficiation, Extraction,
Separation, Refining, Recovery/Recycling, Advanced Materials/Applications.

## Provenance envelope (every canonical record)
`source, sourceType, sourceUrl?, retrievedAt, lastVerified, recordType, confidence,
classificationMethod, isDemo, transformationHistory[]`.

## Relationships (resolved by query helpers)
Mineral ↔ Technology ↔ Patent/PatentFamily ↔ Organisation; Mineral ↔ R&D ↔ Publication ↔ Researcher ↔
Organisation. See `index.ts` for `patentsByMineral`, `technologiesByMineral`, `patentsByOrg`,
`timelineByMineral`, `evidenceByIds`, `search`, etc.

## Demo data honesty
Deterministic and synthetic. Patent numbers use a `KD-` prefix and are illustrative, not real filings.
Every record carries `isDemo: true` and is labelled in the UI.
