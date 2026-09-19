import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ConfidenceBadge, LevelBadge, EmptyState } from "@/components/ui";
import { orgName, mineralName } from "@/lib/data";
import type { Patent, RDProject, Publication, GapSignal } from "@/lib/types";

const MAX_ITEMS = 6;

function MoreNote({ total, shown }: { total: number; shown: number }) {
  const remaining = total - shown;
  if (remaining <= 0) return null;
  return <li className="px-1 text-2xs text-ink-faint">+{remaining} more record{remaining === 1 ? "" : "s"}</li>;
}

/** Compact linked list of patents related to a technology (spec §52). */
export function PatentList({ patents }: { patents: Patent[] }) {
  if (patents.length === 0) {
    return <EmptyState title="No related patents found." hint="This technology has no indexed patent evidence yet." className="py-8" />;
  }
  const shown = patents.slice(0, MAX_ITEMS);
  return (
    <ul className="space-y-2">
      {shown.map((p) => (
        <li key={p.id}>
          <Link
            href={`/patents/${p.id}`}
            className="group flex items-start justify-between gap-3 rounded-md border border-border bg-surface-2 px-3 py-2 transition-colors hover:border-border-strong"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink group-hover:text-mineral">
                {p.title}
                <ArrowUpRight className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="mt-0.5 truncate text-2xs text-ink-faint">
                {p.applicants.map(orgName).join(", ")} · {p.publicationDate.slice(0, 4)}
              </p>
            </div>
            <ConfidenceBadge value={p.provenance.confidence} className="shrink-0" />
          </Link>
        </li>
      ))}
      <MoreNote total={patents.length} shown={shown.length} />
    </ul>
  );
}

/** Compact linked list of R&D projects related to a technology (spec §52). */
export function RDList({ projects }: { projects: RDProject[] }) {
  if (projects.length === 0) {
    return <EmptyState title="No related R&D projects found." hint="This technology has no indexed R&D evidence yet." className="py-8" />;
  }
  const shown = projects.slice(0, MAX_ITEMS);
  return (
    <ul className="space-y-2">
      {shown.map((r) => (
        <li key={r.id}>
          <Link
            href={`/rd/${r.id}`}
            className="group flex items-start justify-between gap-3 rounded-md border border-border bg-surface-2 px-3 py-2 transition-colors hover:border-border-strong"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink group-hover:text-mineral">
                {r.title}
                <ArrowUpRight className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="mt-0.5 truncate text-2xs text-ink-faint">
                {orgName(r.organisation)} · {r.year} · {r.projectType}
              </p>
            </div>
            <ConfidenceBadge value={r.provenance.confidence} className="shrink-0" />
          </Link>
        </li>
      ))}
      <MoreNote total={projects.length} shown={shown.length} />
    </ul>
  );
}

/** Compact linked list of publications related to a technology (spec §52). */
export function PublicationList({ publications }: { publications: Publication[] }) {
  if (publications.length === 0) {
    return <EmptyState title="No related publications found." hint="This technology has no indexed publication evidence yet." className="py-8" />;
  }
  const shown = publications.slice(0, MAX_ITEMS);
  return (
    <ul className="space-y-2">
      {shown.map((p) => (
        <li key={p.id}>
          <Link
            href={`/rd/${p.id}`}
            className="group flex items-start justify-between gap-3 rounded-md border border-border bg-surface-2 px-3 py-2 transition-colors hover:border-border-strong"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink group-hover:text-mineral">
                {p.title}
                <ArrowUpRight className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="mt-0.5 truncate text-2xs text-ink-faint">
                {p.venue} · {p.year} · {p.citations} citations
              </p>
            </div>
            <ConfidenceBadge value={p.provenance.confidence} className="shrink-0" />
          </Link>
        </li>
      ))}
      <MoreNote total={publications.length} shown={shown.length} />
    </ul>
  );
}

/**
 * Compact linked list of Potential Capability Gap Signals related to a
 * technology. Never phrased as a confirmed gap (spec golden rule §1).
 */
export function GapSignalList({ gaps }: { gaps: GapSignal[] }) {
  if (gaps.length === 0) {
    return <EmptyState title="No potential capability gap signals for this technology." hint="Sparse evidence does not necessarily mean no activity." className="py-8" />;
  }
  return (
    <ul className="space-y-2">
      {gaps.map((g) => (
        <li key={g.id}>
          <Link
            href={`/gaps/${g.id}`}
            className="group flex items-start justify-between gap-3 rounded-md border border-border bg-surface-2 px-3 py-2 transition-colors hover:border-border-strong"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink group-hover:text-mineral">
                Potential {g.gapType} Signal — {mineralName(g.mineral)}
                <ArrowUpRight className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="mt-0.5 truncate text-2xs text-ink-faint">{g.dataLimitations}</p>
            </div>
            <LevelBadge value={g.confidence} label="Confidence" className="shrink-0" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
