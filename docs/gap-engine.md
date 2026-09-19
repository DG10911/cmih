# Gap signal engine

Signals are **potential** capability signals, never definitive conclusions.

```
Gap Signal = Strategic Need + Technology Momentum + Domestic Capability Deficit + Evidence Sufficiency
```

Weights are configurable — `GAP_WEIGHTS` in `src/lib/data/constants.ts` (default: strategic relevance
0.38, technology momentum 0.27, domestic capability 0.19, evidence sufficiency 0.16). Each `GapSignal`
also stores its own `weights` for the **Explain Signal** breakdown.

## Signal types
- **Research Gap** — limited research evidence.
- **Technology Opportunity** — high growth + limited domestic evidence.
- **Strategic Capability Gap** — high strategic relevance + limited domestic capability evidence.

## Always shown
Confidence, **evidence sufficiency** (High/Medium/Low with reason), supporting-evidence counts
(patent families, publications, R&D projects, organisations), and **data limitations**. Evidence is
inspectable via the Evidence drawer.

## Technology white space (`/gaps`)
2×2 by patent activity (X) vs R&D activity (Y): Established / Commercially active / Research-heavy /
Potential white space. Caveat: *low evidence does not necessarily mean no activity*.
