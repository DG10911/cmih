import * as React from "react";
import { cn } from "@/lib/utils";

/** Base shimmer block. Compose these to mirror real layout (spec §54). */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("skeleton rounded-md", className)} style={style} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-3 h-2 w-16" />
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-card border border-border bg-surface p-4", className)}>
      <Skeleton className="h-3 w-40" />
      <div className="mt-4 flex h-40 items-end gap-2">
        {[40, 65, 50, 80, 60, 95, 70, 85].map((h, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${h}%` } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-card border border-border bg-surface">
      <Skeleton className="h-10 w-full rounded-b-none" />
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GraphSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-card border border-border bg-surface", className)}>
      <div className="flex h-full min-h-[320px] items-center justify-center">
        <div className="relative h-48 w-48">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="absolute h-10 w-10 rounded-full"
              style={{
                top: `${50 + 40 * Math.sin((i / 5) * Math.PI * 2)}%`,
                left: `${50 + 40 * Math.cos((i / 5) * Math.PI * 2)}%`,
              } as React.CSSProperties}
            />
          ))}
          <Skeleton className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <Skeleton className="h-4 w-3/4" />
      <SkeletonText className="mt-3" lines={2} />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}
