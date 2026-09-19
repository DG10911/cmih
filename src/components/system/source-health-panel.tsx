import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DataSource } from "@/lib/types";

/**
 * Source Health panel (spec §42-43): a colour-coded pulse per source.
 * CONNECTED / DEMO sources read as "Healthy" — they are actively serving
 * data (real or synthetic). PLANNED sources are future authorised
 * connectors, not outages, so they read as "Planned" rather than "Down".
 */
function healthFor(status: DataSource["status"]): { label: string; dot: string; text: string } {
  if (status === "PLANNED") {
    return { label: "Planned", dot: "bg-ink-faint", text: "text-ink-faint" };
  }
  if (status === "ERROR" || status === "STALE") {
    return { label: "Attention", dot: "bg-danger animate-pulse-dot", text: "text-danger" };
  }
  return { label: "Healthy", dot: "bg-success animate-pulse-dot", text: "text-success" };
}

export function SourceHealthPanel({ sources }: { sources: DataSource[] }) {
  return (
    <div className="divide-y divide-border">
      {sources.map((s) => {
        const health = healthFor(s.status);
        return (
          <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", health.dot)} aria-hidden />
              <div>
                <div className="text-sm font-medium text-ink">{s.name}</div>
                <div className="text-2xs text-ink-faint">{s.category}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1 text-2xs text-ink-faint sm:inline-flex">
                <Clock className="h-3 w-3" />
                {s.lastSync}
              </span>
              <span className={cn("text-2xs font-medium", health.text)}>{health.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
