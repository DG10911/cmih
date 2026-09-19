"use client";
import * as React from "react";
import { Modal, MeterBar, ConfidenceBadge } from "@/components/ui";
import type { ClassificationSignal } from "@/lib/types";

interface WhyThisModalProps {
  open: boolean;
  onClose: () => void;
  matchedMineral?: string;
  matchedTechnology?: string;
  confidence: number;
  signals: ClassificationSignal[];
  sourceRecords?: number;
  method?: string;
}

/**
 * Mandatory "Why this result?" explainability modal (spec §13,41,72).
 * Shows the additive classification breakdown behind an AI-derived result.
 */
export function WhyThisModal({
  open,
  onClose,
  matchedMineral,
  matchedTechnology,
  confidence,
  signals,
  sourceRecords,
  method = "hybrid",
}: WhyThisModalProps) {
  const max = Math.max(...signals.map((s) => Math.abs(s.contribution)), 0.5);
  return (
    <Modal open={open} onClose={onClose} eyebrow="Explainability" title="Why this result?">
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          {matchedMineral && (
            <div>
              <div className="text-2xs uppercase tracking-wider text-ink-faint">Matched mineral</div>
              <div className="font-medium text-ink">{matchedMineral}</div>
            </div>
          )}
          {matchedTechnology && (
            <div>
              <div className="text-2xs uppercase tracking-wider text-ink-faint">Matched technology</div>
              <div className="font-medium text-ink">{matchedTechnology}</div>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 text-2xs uppercase tracking-wider text-ink-faint">
            Evidence contributions ({method} classifier)
          </div>
          <div className="space-y-2.5">
            {signals.map((s) => (
              <div key={s.label}>
                <MeterBar
                  value={Math.abs(s.contribution) / max}
                  label={s.label}
                  valueLabel={`+${s.contribution.toFixed(2)}`}
                  tone="data"
                />
                {s.detail && <p className="mt-1 text-2xs text-ink-faint">{s.detail}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3">
            <ConfidenceBadge value={confidence} />
            {sourceRecords != null && (
              <span className="text-2xs text-ink-soft">{sourceRecords} source records</span>
            )}
          </div>
        </div>

        <p className="rounded-md border border-border bg-surface-2 px-3 py-2 text-2xs leading-relaxed text-ink-faint">
          Confidence reflects evidence and classification consistency, not factual certainty. These are
          prototype heuristics, not official thresholds.
        </p>
      </div>
    </Modal>
  );
}
