"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface shadow-panel",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-3 border-b border-border px-4 py-3", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Consistent section heading used across all intelligence panels. */
export function SectionHeader({ title, subtitle, eyebrow, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <div className="mb-1 font-mono text-2xs uppercase tracking-[0.18em] text-mineral">{eyebrow}</div>
        )}
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
