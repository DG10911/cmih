"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Filter / tag chip. */
export function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-mineral/50 bg-mineral/15 text-mineral"
          : "border-border-strong bg-surface-2 text-ink-soft hover:border-data/50 hover:text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Lightweight hover/focus tooltip (no external dependency). */
export function Tooltip({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded-md border border-border-strong bg-surface-2 px-2.5 py-1.5 text-2xs leading-relaxed text-ink-soft shadow-elevated"
        >
          {label}
        </span>
      )}
    </span>
  );
}

/** A labelled horizontal meter bar (0..1) used for capability / component breakdowns. */
export function MeterBar({
  value,
  label,
  valueLabel,
  tone = "mineral",
  className,
}: {
  value: number;
  label?: string;
  valueLabel?: string;
  tone?: "mineral" | "data" | "success" | "warning" | "danger";
  className?: string;
}) {
  const toneClass = {
    mineral: "bg-mineral",
    data: "bg-data",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[tone];
  return (
    <div className={className}>
      {(label || valueLabel) && (
        <div className="mb-1 flex items-center justify-between text-2xs">
          {label && <span className="text-ink-soft">{label}</span>}
          {valueLabel && <span className="font-mono tabular-nums text-ink-faint">{valueLabel}</span>}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-surface-3">
        <div className={cn("h-full rounded-full transition-all", toneClass)} style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }} />
      </div>
    </div>
  );
}

/** Small key/value stat row. */
export function Stat({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-2xs uppercase tracking-wider text-ink-faint">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
