# KhanijDrishti — खनिजदृष्टि

**See the Mineral. Map the Technology. Find the Gap.**

India's Critical Mineral Technology Intelligence Platform — a CMiH 2026 (PS2: Smart Technology & Patent Tracker for Critical Minerals) prototype.

**Live demo:** https://DG10911.github.io/cmih/ (auto-deployed from `main` via GitHub Pages).

> **Demonstration environment.** All data shown is deterministic, synthetic demo data for prototype
> evaluation. No live government or patent APIs are connected. Nothing here fabricates real patent
> numbers, live counts, or source integrations — synthetic records are labelled as such throughout.

---

## Product overview

KhanijDrishti turns fragmented critical-mineral information — patents, R&D projects, publications,
organisations, technologies and value-chain data — into an **evidence-backed technology intelligence
system**. Its defining principle: **every important insight is traceable back to evidence**, and
uncertainty is never hidden. The product speaks in *signals*, not verdicts.

### Problem
Critical-mineral technology information in India is scattered across patents, scholarly literature,
government R&D and institutional repositories. Decision-makers lack a single, trustworthy view of
*where technology capability exists, where it is emerging, and where potential gaps are*.

### Solution
An intelligence product (not a search engine) that ingests and normalises records, classifies them
against a mineral → feedstock → process → technology → value-chain → product → application ontology,
builds a knowledge graph, and surfaces trends, emerging-technology signals, capability-gap signals and
collaboration signals — each backed by inspectable evidence and provenance.

---

## The central pipeline

```
Patents + R&D + Publications + Organisations + Technologies + Minerals + Value-chain
        → Ingestion → Normalization → Entity Resolution → Mineral & Technology Classification
        → Knowledge Graph → Analytics → Trend Engine → Gap Signal Engine
        → Emerging Technology Radar → Collaboration Intelligence → Evidence-backed Decision Support
```

## Feature map

| Area | Screens |
| --- | --- |
| Command | Command Center, Global Search, Ask KhanijDrishti |
| Explore | Minerals, Technologies, Patents, R&D, Organisations (+ detail pages) |
| Intelligence | Technology Map, Emerging Radar, Gap Intelligence, Knowledge Graph, Collaboration |
| Evidence | Evidence Explorer, Policy Brief Generator, Alerts |
| System | Data & Sources, Pipeline Monitor, Classification Review, Taxonomy, Settings |

Cross-cutting: **"Why this?"** explainability modal, **Evidence & Provenance** drawer, confidence &
evidence-sufficiency badges, custom skeleton loading, empty/error states, ⌘K command palette,
responsive layout, reduced-motion support.

---

## Technology stack

**Frontend (this repo):** Next.js 14 (App Router), TypeScript (strict), Tailwind CSS 3,
Framer Motion, Recharts, React Flow, lucide-react.

**Backend (roadmap / adapter-ready):** Python · FastAPI · Pydantic · SQLAlchemy · PostgreSQL ·
pgvector · Redis · background workers. The frontend is built against a typed demo data layer
(`src/lib/data`) whose shape mirrors the intended API responses, so a live backend can be added
behind the same contract.

---

## Architecture

```
Next.js (this app)
   │  typed data layer: src/lib/data  ── mirrors intended API responses
   ▼
[ roadmap ] API Gateway → FastAPI service layer
   Search · Patent · R&D · Classification · Analytics · Graph · Gap Engine · Alert Engine · RAG
   ▼
PostgreSQL + pgvector → Redis → Object Storage
```

### Data adapter architecture (roadmap)
Every source is modelled behind a `DataSourceAdapter` interface (`fetch → normalize → validate`).
The prototype ships **demo adapters**; production adds authorised connectors (IP India, WIPO, EPO,
OpenAlex, Crossref, SATYABHAMA / Ministry of Mines) behind feature flags. See `src/lib/data/sources.ts`
for the source registry and status model (`CONNECTED / DEMO / SIMULATED / STALE / ERROR / PLANNED`).

---

## Data model

Core entities (see `src/lib/types.ts`): Mineral, Technology, Feedstock/Process (fingerprint),
ValueChainStage, Patent, PatentFamily (via `familyId`), Organisation (+ aliases), Researcher,
ResearchProject, Publication, Evidence (+ Provenance), GapSignal, EmergingTechnology,
CollaborationSignal, DataSource. Query helpers live in `src/lib/data/index.ts`.

Every canonical record carries a **provenance envelope**: source, source type, retrieved date,
last-verified date, record type, confidence, classification method, demo flag, transformation history.

## Classification pipeline (prototype heuristics)
Hybrid ensemble: keyword rules + CPC/IPC anchors + embedding similarity + metadata signals →
confidence. Bands: **≥ 0.85** high · **0.60–0.85** review recommended · **< 0.60** human validation.
The "Why this?" modal shows the additive contribution breakdown. These are prototype heuristics, not
official thresholds.

## Gap engine (transparent, configurable)
`Gap Signal = Strategic Need + Technology Momentum + Domestic Capability Deficit + Evidence Sufficiency`
with weights in `src/lib/data/constants.ts` (`GAP_WEIGHTS`). Signals are typed as Research Gap /
Technology Opportunity / Strategic Capability Gap and always shown with confidence, evidence
sufficiency and data limitations.

## Emerging radar
`Emerging Signal = 0.25·ResearchGrowth + 0.20·PatentGrowth + 0.15·OrgGrowth + 0.15·Novelty +
0.15·Recency + 0.10·MaturityEvidence` (`EMERGING_WEIGHTS`). Zones: Emerging / Developing / Scaling /
Mature — an evidence-based lifecycle signal, **not** an official technology-readiness level.

---

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000  (landing → "Launch Platform" → /command)
npm run build    # production build
npm run start    # serve production build
```

Requires Node 18+ (developed on Node 22).

### Docker

```bash
docker compose up --build   # app on http://localhost:3000
```

See `Dockerfile`, `docker-compose.yml` and `.env.example`. The compose file also declares (commented)
`postgres` and `redis` services matching the production roadmap.

---

## Demo mode & honesty
Demo mode is on by default. Records are deterministic and labelled **Demo Data**. The app never claims
live connectivity, never invents accuracy figures, and always distinguishes evidence from inference.

## Security (prototype posture)
Input validation on interactive forms, no arbitrary code execution, environment-variable-driven config,
and an authentication-/role-ready structure (Viewer / Researcher / Analyst / Administrator). Production
hardening (rate limiting, authz enforcement, audit logging) is part of the roadmap.

## Limitations
Prototype dataset only; classification/gap/emerging scores are heuristic prototypes; no live sources;
figures are illustrative. Replace demo adapters with authorised source connectors for production.

## Production roadmap
FastAPI service layer · PostgreSQL + pgvector · authorised source adapters · real hybrid search ·
scheduled ingestion workers · human-in-the-loop training feedback loop · government-controlled hosting.

## Documentation
See [`docs/`](./docs): `agent-contract.md` (build conventions), `architecture.md`, `data-model.md`,
`classification.md`, `gap-engine.md`, `emerging-engine.md`, `knowledge-graph.md`, `demo-script.md`.
