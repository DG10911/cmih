# Architecture

## Current (frontend-first prototype)
- **Next.js 14 App Router** app in `src/`. Routes live under the `(app)` route group, which renders the
  shared `AppShell` (sidebar + topbar + ⌘K palette + demo banner + page transitions). The landing page
  is the root route outside the group.
- **Typed demo data layer** (`src/lib/data`) is the single source of truth. Its exported shapes mirror
  the intended API responses, so screens are written as if against a real API.
- **Design system**: Tailwind tokens in `tailwind.config.ts` + `globals.css` ("Intelligence Dark"),
  shared primitives in `src/components/ui`, cross-cutting intelligence components (`WhyThisModal`,
  `EvidenceDrawer`) in `src/components/intelligence`.

```
Browser
 └─ Next.js (RSC + client components)
     ├─ AppShell (nav, search, palette)
     ├─ Route pages  ──imports──▶ src/lib/data (query API)
     └─ Charts (Recharts) / Graph (React Flow) / Motion (Framer)
```

## Production roadmap
```
Next.js ──▶ API Gateway ──▶ FastAPI service layer
   Search · Patent · R&D · Classification · Analytics · Graph · Gap · Alert · RAG
        ──▶ PostgreSQL + pgvector ──▶ Redis ──▶ Object Storage
        ◀── ingestion workers (source adapters, feature-flagged)
```
The demo data layer is replaced by API calls behind the same typed contract; nothing in the UI needs to
change structurally.

## Data adapter architecture
`DataSourceAdapter { fetch → normalize → validate }`. Prototype ships demo adapters; production adds
authorised connectors (IP India, WIPO, EPO, OpenAlex, Crossref, SATYABHAMA). Source status is modelled
(`CONNECTED / DEMO / SIMULATED / STALE / ERROR / PLANNED`) and surfaced on `/sources` and `/pipeline`.
