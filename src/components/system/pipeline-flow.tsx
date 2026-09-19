import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { MeterBar } from "@/components/ui";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

export interface PipelineStageDatum {
  stage: string;
  records: number;
  processed: number;
  errors: number;
  lastRun: string;
}

/**
 * Pipeline stage flow (spec §68): Sources → Ingestion → Normalization →
 * Classification → Entity Resolution → Deduplication → Knowledge Graph →
 * Analytics. Throughput / attrition is shown subtly via a meter bar rather
 * than as an alarming headline figure — this is a prototype pipeline.
 */
export function PipelineFlow({ stages }: { stages: PipelineStageDatum[] }) {
  return (
    <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0">
      {stages.map((s, i) => {
        const throughput = s.records > 0 ? s.processed / s.records : 1;
        const isLast = i === stages.length - 1;
        return (
          <div key={s.stage} className="flex flex-1 flex-col lg:flex-row lg:items-stretch">
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-card border border-border bg-surface p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xs font-semibold uppercase tracking-wider text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.errors > 0 ? (
                  <span className="inline-flex items-center gap-1 text-2xs text-warning">
                    <AlertTriangle className="h-3 w-3" /> {formatNumber(s.errors)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-2xs text-success">
                    <CheckCircle2 className="h-3 w-3" /> 0
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold leading-tight text-ink">{s.stage}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-2xs text-ink-faint">
                <span>In</span>
                <span className="text-right font-mono tabular-nums text-ink-soft">{formatNumber(s.records)}</span>
                <span>Processed</span>
                <span className="text-right font-mono tabular-nums text-ink-soft">{formatNumber(s.processed)}</span>
              </div>
              <MeterBar
                value={throughput}
                tone={throughput > 0.97 ? "success" : throughput > 0.9 ? "data" : "warning"}
                valueLabel={formatPercent(throughput, 1)}
              />
              <div className="mt-auto text-2xs text-ink-faint">Last run {s.lastRun}</div>
            </div>
            {!isLast && (
              <div className={cn("flex shrink-0 items-center justify-center px-1 py-1 lg:px-1.5 lg:py-0")}>
                <ArrowRight className="hidden h-4 w-4 text-ink-faint lg:block" />
                <ArrowRight className="h-4 w-4 rotate-90 text-ink-faint lg:hidden" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
