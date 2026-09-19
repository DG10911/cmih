"use client";
import * as React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Flag, PencilLine, ArrowUpRight } from "lucide-react";
import { Card, CardBody, Pill, ConfidenceBadge, Button, MeterBar } from "@/components/ui";
import { MINERALS, TECHNOLOGIES, VALUE_CHAIN_STAGES, orgName } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ClassificationSignal, ValueChainStage } from "@/lib/types";

export interface ReviewQueueItem {
  id: string;
  kind: "Patent" | "R&D Project";
  title: string;
  href: string;
  organisation?: string;
  confidence: number;
  signals: ClassificationSignal[];
  originalMineral: string;
  originalTechnology: string;
  originalStage: ValueChainStage;
  mineral: string;
  technology: string;
  stage: ValueChainStage;
}

export type ReviewDecision = "accepted" | "rejected" | "flagged";

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-2xs text-ink-faint">
      <span className="uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 rounded-md border border-border-strong bg-surface-2 px-2 text-xs text-ink outline-none focus-visible:border-data"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const MINERAL_OPTIONS = MINERALS.map((m) => ({ value: m.id, label: m.name }));
const TECHNOLOGY_OPTIONS = TECHNOLOGIES.map((t) => ({ value: t.id, label: t.name }));
const STAGE_OPTIONS = VALUE_CHAIN_STAGES.map((s) => ({ value: s, label: s }));

/**
 * Human-in-the-loop review card (spec §14). Shows the AI classification,
 * its confidence + evidence signals, and lets a reviewer accept, reject,
 * edit the classification, or flag it — all local/non-persisting state.
 */
export function ReviewCard({
  item,
  onFieldChange,
  onAction,
}: {
  item: ReviewQueueItem;
  onFieldChange: (id: string, field: "mineral" | "technology" | "stage", value: string) => void;
  onAction: (id: string, decision: ReviewDecision) => void;
}) {
  const isEdited =
    item.mineral !== item.originalMineral ||
    item.technology !== item.originalTechnology ||
    item.stage !== item.originalStage;
  const maxContribution = Math.max(...item.signals.map((s) => Math.abs(s.contribution)), 0.5);

  return (
    <Card className="flex flex-col">
      <CardBody className="flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <Pill className="border-data/30 bg-data/10 text-data">{item.kind}</Pill>
              {isEdited && (
                <Pill className="border-mineral/40 bg-mineral/10 text-mineral">
                  <PencilLine className="h-3 w-3" /> Edited
                </Pill>
              )}
            </div>
            <Link
              href={item.href}
              className="group inline-flex items-start gap-1 text-sm font-semibold leading-snug text-ink hover:text-mineral"
            >
              {item.title}
              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            {item.organisation && (
              <div className="mt-1 text-2xs text-ink-faint">{orgName(item.organisation)}</div>
            )}
          </div>
          <ConfidenceBadge value={item.confidence} className="shrink-0" />
        </div>

        <div>
          <div className="mb-1.5 text-2xs uppercase tracking-wider text-ink-faint">Classification signals</div>
          <div className="space-y-2">
            {item.signals.map((s) => (
              <MeterBar
                key={s.label}
                value={Math.abs(s.contribution) / maxContribution}
                label={s.label}
                valueLabel={`+${s.contribution.toFixed(2)}`}
                tone="data"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="Mineral"
            value={item.mineral}
            onChange={(v) => onFieldChange(item.id, "mineral", v)}
            options={MINERAL_OPTIONS}
          />
          <Select
            label="Technology"
            value={item.technology}
            onChange={(v) => onFieldChange(item.id, "technology", v)}
            options={TECHNOLOGY_OPTIONS}
          />
          <Select
            label="Value-chain stage"
            value={item.stage}
            onChange={(v) => onFieldChange(item.id, "stage", v as ValueChainStage)}
            options={STAGE_OPTIONS}
          />
        </div>

        {isEdited && (
          <p className="rounded-md border border-mineral/30 bg-mineral/5 px-2.5 py-1.5 text-2xs leading-relaxed text-mineral">
            This correction will be captured as training feedback once actioned.
          </p>
        )}

        <div className={cn("mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3")}>
          <Button variant="primary" size="sm" onClick={() => onAction(item.id, "accepted")}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Accept
          </Button>
          <Button variant="danger" size="sm" onClick={() => onAction(item.id, "rejected")}>
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAction(item.id, "flagged")}>
            <Flag className="h-3.5 w-3.5" /> Flag
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
