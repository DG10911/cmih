"use client";
import * as React from "react";
import { FlaskConical } from "lucide-react";
import { LevelBadge, SourceBadge } from "@/components/ui";
import type { AskAnswer } from "./answers";

/** Structured answer rendering: Answer / Evidence / Confidence / Sources / Data limitations (spec §46-47). */
export function AnswerCard({ answer, onOpenEvidence }: { answer: AskAnswer; onOpenEvidence: (ids: string[]) => void }) {
  return (
    <div className="space-y-3 rounded-card border border-border bg-surface-2 p-4">
      <div>
        <div className="mb-1 text-2xs font-semibold uppercase tracking-wider text-mineral">Answer</div>
        {answer.paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-ink">
            {p}
          </p>
        ))}
        {answer.bullets && answer.bullets.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {answer.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      {answer.evidenceIds.length > 0 && (
        <div>
          <div className="mb-1 text-2xs font-semibold uppercase tracking-wider text-ink-faint">Evidence</div>
          <div className="flex flex-wrap gap-1.5">
            {answer.evidenceIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onOpenEvidence([id])}
                className="inline-flex items-center gap-1 rounded-full border border-data/30 bg-data/10 px-2 py-0.5 font-mono text-2xs text-data transition-colors hover:bg-data/20"
              >
                <FlaskConical className="h-3 w-3" /> {id}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start gap-6">
        <div>
          <div className="mb-1 text-2xs font-semibold uppercase tracking-wider text-ink-faint">Confidence</div>
          <LevelBadge value={answer.confidence} />
        </div>
        {answer.sources.length > 0 && (
          <div>
            <div className="mb-1 text-2xs font-semibold uppercase tracking-wider text-ink-faint">Sources</div>
            <div className="flex flex-wrap gap-1.5">
              {answer.sources.map((s) => (
                <SourceBadge key={s} source={s} />
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="border-t border-border pt-2 text-2xs leading-relaxed text-ink-faint">
        <span className="font-semibold text-ink-soft">Data limitations: </span>
        {answer.limitations}
      </p>
    </div>
  );
}
