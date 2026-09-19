"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, Layers } from "lucide-react";
import { ConfidenceBadge, Pill } from "@/components/ui";
import { mineralName, technologyName, orgName } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Patent } from "@/lib/types";

export type SortField = "priorityDate" | "familySize";
export type SortDir = "asc" | "desc";

const LEGAL_STATUS_TONE: Record<Patent["legalStatus"], string> = {
  Granted: "border-success/40 bg-success/10 text-success",
  Pending: "border-warning/40 bg-warning/10 text-warning",
  Lapsed: "border-ink-faint/40 bg-surface-3 text-ink-soft",
  Withdrawn: "border-danger/40 bg-danger/10 text-danger",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
}

function SortHeader({
  label,
  field,
  active,
  dir,
  onSort,
  className,
}: {
  label: string;
  field: SortField;
  active: boolean;
  dir: SortDir;
  onSort: (field: SortField) => void;
  className?: string;
}) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={cn(
        "inline-flex items-center gap-1 text-2xs font-medium uppercase tracking-wider text-ink-faint transition-colors hover:text-ink",
        active && "text-ink",
        className
      )}
    >
      {label}
      <Icon className="h-3 w-3" />
    </button>
  );
}

interface PatentRow extends Patent {
  familyRowCount: number;
}

export function PatentTable({
  rows,
  deduped,
  sortField,
  sortDir,
  onSort,
}: {
  rows: PatentRow[];
  deduped: boolean;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2 text-2xs uppercase tracking-wider text-ink-faint">
            <th className="px-4 py-2.5 font-medium">Patent</th>
            <th className="px-4 py-2.5 font-medium">Family</th>
            <th className="px-4 py-2.5 font-medium">Mineral</th>
            <th className="px-4 py-2.5 font-medium">Technology</th>
            <th className="px-4 py-2.5 font-medium">Applicant</th>
            <th className="px-4 py-2.5 font-medium">
              <SortHeader label="Priority" field="priorityDate" active={sortField === "priorityDate"} dir={sortDir} onSort={onSort} />
            </th>
            <th className="px-4 py-2.5 font-medium">Jurisdiction</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((p) => (
            <tr
              key={p.id}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/patents/${p.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/patents/${p.id}`);
                }
              }}
              className="cursor-pointer transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none"
            >
              <td className="max-w-[260px] px-4 py-3">
                <div className="truncate font-medium text-ink" title={p.title}>
                  {p.title}
                </div>
                <div className="mt-0.5 font-mono text-2xs text-ink-faint">{p.id}</div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-2xs text-ink-soft">{p.familyId}</span>
                  <Pill className="w-fit border-border-strong bg-surface-2 text-ink-soft">
                    <Layers className="h-3 w-3" />
                    {p.familySize} {p.familySize === 1 ? "member" : "members"}
                    {deduped && p.familyRowCount > 1 && ` · ${p.familyRowCount} shown`}
                  </Pill>
                </div>
              </td>
              <td className="px-4 py-3 text-ink-soft">{mineralName(p.mineral)}</td>
              <td className="px-4 py-3 text-ink-soft">{technologyName(p.technology)}</td>
              <td className="px-4 py-3 text-ink-soft">
                {orgName(p.applicants[0])}
                {p.applicants.length > 1 && <span className="text-ink-faint"> +{p.applicants.length - 1}</span>}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="font-mono text-xs tabular-nums text-ink-soft">{formatDate(p.priorityDate)}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.jurisdictions.slice(0, 3).map((j) => (
                    <Pill key={j} className="border-border-strong bg-surface-2 font-mono text-ink-soft">
                      {j}
                    </Pill>
                  ))}
                  {p.jurisdictions.length > 3 && (
                    <Pill className="border-border-strong bg-surface-2 text-ink-faint">+{p.jurisdictions.length - 3}</Pill>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <Pill className={LEGAL_STATUS_TONE[p.legalStatus]}>{p.legalStatus}</Pill>
              </td>
              <td className="px-4 py-3">
                <ConfidenceBadge value={p.provenance.confidence} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
