# Emerging technology radar

```
Emerging Signal = 0.25·ResearchGrowth + 0.20·PatentGrowth + 0.15·OrgGrowth
                + 0.15·Novelty + 0.15·Recency + 0.10·MaturityEvidence
```

Weights: `EMERGING_WEIGHTS` in `src/lib/data/constants.ts` (configurable). Each technology stores
`emergingComponents` (the six 0..1 signals); `EMERGING_TECHNOLOGIES` derives `emergingScore` and a zone.

## Zones (evidence-based lifecycle signal — NOT official TRLs)
Emerging → Developing → Scaling → Mature.

## Display
The radar plus per-technology cards show the component breakdown so the score is fully transparent.
Momentum (rising / stable / declining) is shown alongside; causality is never claimed.
