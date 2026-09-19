import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a large integer with grouping, e.g. 12345 -> "12,345". */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

/** Compact number for KPIs, e.g. 12345 -> "12.3K". */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Growth rate with safe zero-denominator handling (spec §82). */
export function growthRate(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return (current - previous) / previous;
}

export function formatPercent(v: number, digits = 0): string {
  return `${(v * 100).toFixed(digits)}%`;
}

export function formatSignedPercent(v: number, digits = 0): string {
  const s = (v * 100).toFixed(digits);
  return `${v >= 0 ? "+" : ""}${s}%`;
}

/** Deterministic slug. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Map a 0..1 confidence to its qualitative band (spec §13). */
export function confidenceBand(c: number): "High" | "Review" | "Validate" {
  if (c >= 0.85) return "High";
  if (c >= 0.6) return "Review";
  return "Validate";
}
