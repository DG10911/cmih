import * as React from "react";
import { ShieldCheck, Database, CircleDot, AlertTriangle, FlaskConical, ArrowUpRight, ArrowRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Level, Momentum, SourceStatus } from "@/lib/types";

/** Generic pill. */
export function Pill({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Confidence badge from a 0..1 score or a Level (spec §13,87). */
export function ConfidenceBadge({ value, className }: { value: number | Level; className?: string }) {
  let label: string;
  let tone: "high" | "med" | "low";
  if (typeof value === "number") {
    label = value.toFixed(2);
    tone = value >= 0.85 ? "high" : value >= 0.6 ? "med" : "low";
  } else {
    label = `${value} confidence`;
    tone = value === "High" ? "high" : value === "Medium" ? "med" : "low";
  }
  const tones = {
    high: "border-success/40 bg-success/10 text-success",
    med: "border-warning/40 bg-warning/10 text-warning",
    low: "border-danger/40 bg-danger/10 text-danger",
  };
  return (
    <Pill className={cn(tones[tone], className)} title="Confidence reflects evidence and classification consistency, not factual certainty.">
      <ShieldCheck className="h-3 w-3" />
      {typeof value === "number" ? `Confidence ${label}` : label}
    </Pill>
  );
}

/** Qualitative level badge (High/Medium/Low). */
export function LevelBadge({ value, label, className }: { value: Level; label?: string; className?: string }) {
  const tones = {
    High: "border-success/40 bg-success/10 text-success",
    Medium: "border-warning/40 bg-warning/10 text-warning",
    Low: "border-ink-faint/40 bg-surface-3 text-ink-soft",
  };
  return <Pill className={cn(tones[value], className)}>{label ? `${label}: ${value}` : value}</Pill>;
}

export function SourceBadge({ source, className }: { source: string; className?: string }) {
  return (
    <Pill className={cn("border-border-strong bg-surface-2 text-ink-soft", className)}>
      <Database className="h-3 w-3" />
      {source}
    </Pill>
  );
}

export function EvidenceBadge({ count, className }: { count: number; className?: string }) {
  return (
    <Pill className={cn("border-data/30 bg-data/10 text-data", className)}>
      <FlaskConical className="h-3 w-3" />
      {count} evidence
    </Pill>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <Pill className={cn("border-mineral/40 bg-mineral/10 font-mono uppercase tracking-wider text-mineral", className)}>
      Demo Data
    </Pill>
  );
}

const STATUS_TONES: Record<SourceStatus, string> = {
  CONNECTED: "border-success/40 bg-success/10 text-success",
  DEMO: "border-mineral/40 bg-mineral/10 text-mineral",
  SIMULATED: "border-info/40 bg-info/10 text-info",
  STALE: "border-warning/40 bg-warning/10 text-warning",
  ERROR: "border-danger/40 bg-danger/10 text-danger",
  PLANNED: "border-ink-faint/40 bg-surface-3 text-ink-faint",
};

export function StatusBadge({ status, className }: { status: SourceStatus; className?: string }) {
  const Icon = status === "ERROR" ? AlertTriangle : CircleDot;
  return (
    <Pill className={cn(STATUS_TONES[status], className)}>
      <Icon className="h-3 w-3" />
      {status[0] + status.slice(1).toLowerCase()}
    </Pill>
  );
}

export function MomentumBadge({ value, className }: { value: Momentum; className?: string }) {
  const map = {
    up: { Icon: ArrowUpRight, tone: "text-success", label: "Rising" },
    flat: { Icon: ArrowRight, tone: "text-ink-soft", label: "Stable" },
    down: { Icon: ArrowDownRight, tone: "text-danger", label: "Declining" },
  }[value];
  return (
    <span className={cn("inline-flex items-center gap-1 text-2xs font-medium", map.tone, className)}>
      <map.Icon className="h-3.5 w-3.5" />
      {map.label}
    </span>
  );
}
