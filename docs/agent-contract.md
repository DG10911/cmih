# KhanijDrishti — Build Contract (read before editing)

Frontend-first prototype. Next.js 14 (App Router, `src/`), TypeScript strict, Tailwind 3,
Framer Motion 13, Recharts 3, React Flow 11, lucide-react. **No backend** — all data is
deterministic demo data from `@/lib/data`.

## Golden rules (from the product spec)
1. **Evidence-first, never absolute.** Say "Potential Capability Gap Signal", not "This is a gap".
   Always surface confidence, evidence sufficiency, provenance, and data limitations.
2. **Label demo data.** Use `<DemoBadge/>` / `StatusBadge status="DEMO"`. Never invent real patent
   numbers, real live API connectivity, or fake accuracy figures.
3. **Every AI-derived result gets a "Why?"** → use `<WhyThisModal/>`.
4. **Every screen has loading / empty / error states.** Use the skeletons + `EmptyState`/`ErrorState`.
5. **Only semantic tokens** — never raw hex. Motion is purposeful and respects reduced-motion.

## Design tokens (Tailwind classes)
- Surfaces: `bg-background` (page), `bg-surface` (panels), `bg-surface-2` (elevated), `bg-surface-3` (hover/active)
- Borders: `border-border`, `border-border-strong`
- Text: `text-ink` (primary), `text-ink-soft` (secondary), `text-ink-faint` (muted)
- Accents: `text-mineral`/`bg-mineral` (amber/copper), `text-data`/`bg-data` (cyan)
- Status: `success`, `warning`, `danger`, `info`
- Radius: `rounded-card`. Shadow: `shadow-panel`, `shadow-elevated`. Mono: `font-mono`.
- Use `text-2xs` for the small institutional labels. Numbers: `font-mono tabular-nums`.

## Shared components — import and REUSE (do not re-invent)
From `@/components/ui`:
`Card, CardHeader, CardBody, SectionHeader, Button, KpiCard, CountUp,
Pill, ConfidenceBadge, LevelBadge, SourceBadge, EvidenceBadge, DemoBadge, StatusBadge, MomentumBadge,
Skeleton, SkeletonText, KpiSkeleton, ChartSkeleton, TableSkeleton, GraphSkeleton, CardSkeleton,
EmptyState, ErrorState, Chip, Tooltip, MeterBar, Stat, Modal, Drawer`

From `@/components/motion`: `FadeIn, Stagger, StaggerItem`
From `@/components/intelligence/why-this-modal`: `WhyThisModal`
From `@/components/intelligence/evidence-drawer`: `EvidenceDrawer` (pass `evidenceIds`)

`SectionHeader` props: `{ eyebrow?, title, subtitle?, action? }`.

## Data API — `@/lib/data`
Entities: `MINERALS, TECHNOLOGIES, ORGANISATIONS, PATENTS, RD_PROJECTS, PUBLICATIONS,
GAP_SIGNALS, EMERGING_TECHNOLOGIES, COLLABORATION_SIGNALS, EVIDENCE, DATA_SOURCES,
PIPELINE_STAGES, DATA_QUALITY, ACTIVITY_TIMELINE`.
Lookups: `getMineral/getTechnology/getOrganisation/getPatent/getRDProject/getPublication/getGapSignal/getEvidence(id)`.
Names: `mineralName/technologyName/orgName(id)`.
By mineral: `patentsByMineral/rdByMineral/publicationsByMineral/technologiesByMineral/orgsByMineral/gapsByMineral/emergingByMineral/collaborationByMineral(id)`.
By technology: `patentsByTechnology/rdByTechnology/publicationsByTechnology/gapsByTechnology(id)`.
By org: `patentsByOrg/rdByOrg/publicationsByOrg/collaborationByOrg(id)`.
Evidence: `evidenceByIds(ids)`, `evidenceByMineral(id)`, `timelineByMineral(id)`.
Search: `search(query): SearchResult[]`.
Series: `mineralActivity(patentFamilies, publications, rdProjects): ActivityPoint[]`, `YEARS`, `INDIA_SHARE`.
Config/constants: `VALUE_CHAIN_STAGES, STAGE_SHORT, GAP_WEIGHTS, EMERGING_WEIGHTS, APP_META, PROTOTYPE_DISCLAIMER, PLATFORM_TOTALS`.
Utils `@/lib/utils`: `cn, formatNumber, formatCompact, formatPercent, formatSignedPercent, growthRate, slugify, confidenceBand`.

Types live in `@/lib/types` (Mineral, Technology, Patent, RDProject, Publication, Organisation,
GapSignal, EmergingTechnology, CollaborationSignal, Evidence, ActivityPoint, ValueChainStage, Level, Momentum, Maturity …).

## Routing (App Router, all under the `(app)` group which renders `AppShell`)
Create pages at `src/app/(app)/<route>/page.tsx`. The shell (sidebar, topbar, ⌘K, demo banner,
page transition, max-width container) is already applied — pages render only their own content.
Co-locate feature components under `src/components/<feature>/`.

Routes: `/command`, `/search`, `/minerals`, `/minerals/[id]`, `/technologies`, `/technologies/[id]`,
`/patents`, `/patents/[id]`, `/rd`, `/rd/[id]`, `/organisations`, `/organisations/[id]`,
`/technology-map`, `/emerging`, `/gaps`, `/gaps/[id]`, `/graph`, `/collaboration`, `/evidence`,
`/policy-briefs`, `/alerts`, `/sources`, `/pipeline`, `/review`, `/taxonomy`, `/settings`.

Recharts / React Flow / any hooks → mark the file `"use client"`. Charts must have an accessible
data fallback (e.g. a visually-hidden table or `aria-label`). Use `ResponsiveContainer`. Recharts
colors via CSS: `rgb(var(--mineral))`, `rgb(var(--data))`, `rgb(var(--success))`, etc.

## Ownership / conflict rules for parallel agents
- Only create files under your assigned route(s) and your own `src/components/<feature>/` folder.
- NEVER edit `tailwind.config.ts`, `globals.css`, `@/lib/*`, `@/components/ui/*`,
  `@/components/shell/*`, `@/components/motion.tsx`, or another feature's folder.
- If you need a new shared primitive, build it locally in your feature folder instead.
- Keep `next build` green: no unused imports left as errors (rule is warn), no console errors.
