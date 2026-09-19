"use client";
import * as React from "react";
import { SearchX, AlertOctagon, RefreshCw, Database, Activity } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

/** Empty state with helpful next actions (spec §74). */
export function EmptyState({
  title = "No evidence found for this combination.",
  hint,
  actions,
  icon: Icon = SearchX,
  className,
}: {
  title?: string;
  hint?: string;
  actions?: { label: string; onClick?: () => void }[];
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong bg-surface/50 px-6 py-12 text-center", className)}>
      <Icon className="h-8 w-8 text-ink-faint" />
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-xs text-ink-soft">{hint}</p>}
      {actions && actions.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {actions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" onClick={a.onClick}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Error state — never shows a raw stack trace to normal users (spec §73). */
export function ErrorState({
  title = "We couldn't load this intelligence view.",
  onRetry,
  className,
}: {
  title?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-card border border-danger/30 bg-danger/5 px-6 py-12 text-center", className)}>
      <AlertOctagon className="h-8 w-8 text-danger" />
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        )}
        <Button variant="ghost" size="sm">
          <Database className="h-3.5 w-3.5" /> View cached data
        </Button>
        <Button variant="ghost" size="sm">
          <Activity className="h-3.5 w-3.5" /> Check source health
        </Button>
      </div>
    </div>
  );
}
