"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { Chip } from "@/components/ui";
import { DATA_SOURCES, MINERALS, TECHNOLOGIES } from "@/lib/data";
import type { EvidenceType } from "@/lib/types";

export type ConfidenceBandFilter = "All" | "High" | "Review" | "Validate";

export interface EvidenceFiltersState {
  q: string;
  source: string; // "all" or DataSource.name
  type: EvidenceType | "all";
  band: ConfidenceBandFilter;
  mineral: string; // "all" or mineral id
  technology: string; // "all" or technology id
}

export const DEFAULT_EVIDENCE_FILTERS: EvidenceFiltersState = {
  q: "",
  source: "all",
  type: "all",
  band: "All",
  mineral: "all",
  technology: "all",
};

const TYPE_OPTIONS: { value: EvidenceType | "all"; label: string }[] = [
  { value: "all", label: "All record types" },
  { value: "patent", label: "Patent" },
  { value: "publication", label: "Publication" },
  { value: "rd_project", label: "R&D Project" },
  { value: "pilot", label: "Pilot" },
  { value: "mou", label: "MoU" },
  { value: "tech_transfer", label: "Tech Transfer" },
];

const BAND_OPTIONS: ConfidenceBandFilter[] = ["All", "High", "Review", "Validate"];

const selectClass =
  "rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-sm text-ink focus:border-data focus:outline-none";

/** Filter bar for the Evidence Explorer (spec §40). */
export function EvidenceFilters({
  value,
  onChange,
}: {
  value: EvidenceFiltersState;
  onChange: (next: EvidenceFiltersState) => void;
}) {
  const sourceNames = React.useMemo(() => Array.from(new Set(DATA_SOURCES.map((s) => s.name))).sort(), []);

  function set<K extends keyof EvidenceFiltersState>(key: K, v: EvidenceFiltersState[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="Search evidence by title…"
          className="w-full rounded-md border border-border-strong bg-surface-2 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-data focus:outline-none"
          aria-label="Search evidence by title"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className={selectClass}
          value={value.source}
          onChange={(e) => set("source", e.target.value)}
          aria-label="Filter by source"
        >
          <option value="all">All sources</option>
          {sourceNames.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value.type}
          onChange={(e) => set("type", e.target.value as EvidenceType | "all")}
          aria-label="Filter by record type"
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value.mineral}
          onChange={(e) => set("mineral", e.target.value)}
          aria-label="Filter by mineral"
        >
          <option value="all">All minerals</option>
          {MINERALS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value.technology}
          onChange={(e) => set("technology", e.target.value)}
          aria-label="Filter by technology"
        >
          <option value="all">All technologies</option>
          {TECHNOLOGIES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-2xs uppercase tracking-wider text-ink-faint">Confidence band</span>
        {BAND_OPTIONS.map((b) => (
          <Chip key={b} active={value.band === b} onClick={() => set("band", b)}>
            {b}
          </Chip>
        ))}
      </div>
    </div>
  );
}
