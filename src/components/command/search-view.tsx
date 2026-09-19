"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SearchX } from "lucide-react";
import { Chip, EmptyState } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { search, type SearchResult } from "@/lib/data";
import { SearchResultCard } from "@/components/command/search-result-card";

const EXAMPLE_QUERIES = [
  "lithium extraction",
  "rare earth recycling",
  "NdFeB magnet recovery",
  "cobalt refining",
  "hydrometallurgy",
];

const GROUP_ORDER: SearchResult["kind"][] = ["Mineral", "Technology", "Patent", "R&D", "Publication", "Organisation"];

const GROUP_LABEL: Record<SearchResult["kind"], string> = {
  Mineral: "Minerals",
  Technology: "Technologies",
  Patent: "Patents",
  "R&D": "R&D",
  Publication: "Publications",
  Organisation: "Organisations",
};

/**
 * Global Search — client view driven entirely by the `?q=` URL param so
 * results are shareable/bookmarkable (spec §23-24,50).
 */
export function SearchView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(initialQuery);

  // Keep local input in sync if the URL changes externally (e.g. back/forward nav).
  React.useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const setQueryAndUrl = React.useCallback(
    (next: string) => {
      setQuery(next);
      const params = new URLSearchParams();
      if (next.trim()) params.set("q", next);
      router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    },
    [router]
  );

  const results = React.useMemo(() => search(query), [query]);
  const grouped = React.useMemo(() => {
    const map = new Map<SearchResult["kind"], SearchResult[]>();
    for (const r of results) {
      if (!map.has(r.kind)) map.set(r.kind, []);
      map.get(r.kind)!.push(r);
    }
    return GROUP_ORDER.map((kind) => ({ kind, items: map.get(kind) ?? [] })).filter((g) => g.items.length > 0);
  }, [results]);

  const trimmed = query.trim();

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="font-mono text-2xs uppercase tracking-[0.18em] text-mineral">Discover</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Global Search</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Search across minerals, technologies, patents, R&amp;D, publications and organisations in the
          KhanijDrishti demo dataset.
        </p>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQueryAndUrl(e.target.value)}
            placeholder="Search minerals, technologies, patents, organisations, researchers…"
            aria-label="Global search"
            className="h-12 w-full rounded-card border border-border-strong bg-surface pl-11 pr-11 text-sm text-ink placeholder:text-ink-faint focus:border-data focus:outline-none focus:ring-1 focus:ring-data"
          />
          {trimmed && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQueryAndUrl("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-faint hover:bg-surface-2 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-2xs uppercase tracking-wider text-ink-faint">Try:</span>
          {EXAMPLE_QUERIES.map((q) => (
            <Chip key={q} active={query === q} onClick={() => setQueryAndUrl(q)}>
              {q}
            </Chip>
          ))}
        </div>
      </FadeIn>

      {!trimmed && (
        <EmptyState
          icon={Search}
          title="Search the KhanijDrishti knowledge base"
          hint="Enter a mineral, technology, organisation, or try one of the example queries above."
        />
      )}

      {trimmed && results.length === 0 && (
        <EmptyState
          icon={SearchX}
          title={`No results for "${trimmed}"`}
          hint="Try a broader term, check spelling, or pick one of the example queries above."
          actions={EXAMPLE_QUERIES.slice(0, 3).map((q) => ({ label: q, onClick: () => setQueryAndUrl(q) }))}
        />
      )}

      {trimmed && results.length > 0 && (
        <Stagger className="space-y-7">
          {grouped.map(({ kind, items }) => (
            <StaggerItem key={kind}>
              <div className="mb-3 flex items-baseline gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  {GROUP_LABEL[kind]}
                </h2>
                <span className="font-mono text-2xs text-ink-faint">{items.length}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => (
                  <SearchResultCard key={`${r.kind}-${r.id}`} result={r} query={trimmed} />
                ))}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
