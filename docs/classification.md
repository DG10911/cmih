# Classification pipeline

Hybrid ensemble (prototype heuristics — **not** official thresholds):

```
Keyword rules + CPC/IPC anchors + Embedding similarity + Metadata signals
   → Ensemble classifier → Confidence (0..1)
```

## Confidence bands
- **≥ 0.85** — High confidence
- **0.60 – 0.85** — Review recommended
- **< 0.60** — Human validation required

`confidenceBand()` in `src/lib/utils.ts` maps a score to a band.

## Explainability
Each classified record carries `classification: ClassificationSignal[]` — additive contributions with a
label and optional detail (e.g. `semantic similarity +0.52`, `CPC anchor C22B26/12 +0.21`,
`keyword match +0.18`). The mandatory **`WhyThisModal`** renders this breakdown with the confidence and
source-record count, plus the caveat: *confidence reflects evidence and classification consistency, not
factual certainty*.

## Human-in-the-loop
`/review` is the classification review queue: accept / reject / edit mineral / edit technology / edit
stage / flag. The intended production loop is `AI classification → human validation → verified
knowledge`, with corrections becoming training feedback.
