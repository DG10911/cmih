"use client";
import * as React from "react";
import { Bell, X } from "lucide-react";
import { Button, Card, CardBody } from "@/components/ui";
import { MINERALS, technologiesByMineral } from "@/lib/data";
import type { Alert, AlertFrequency, AlertTrigger } from "./types";

const TRIGGERS: AlertTrigger[] = ["New patent family", "R&D activity increase", "Technology momentum change"];
const FREQUENCIES: AlertFrequency[] = ["Daily", "Weekly", "Monthly"];

const selectClass =
  "w-full rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-sm text-ink focus:border-data focus:outline-none";
const labelClass = "mb-1 block text-2xs uppercase tracking-wider text-ink-faint";

export type AlertDraft = Omit<Alert, "id" | "createdAt">;

/** Create / edit alert form (spec §44). */
export function AlertForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Alert;
  onSubmit: (data: AlertDraft) => void;
  onCancel?: () => void;
}) {
  const [mineralId, setMineralId] = React.useState(initial?.mineralId ?? MINERALS[0].id);
  const [technologyId, setTechnologyId] = React.useState(initial?.technologyId ?? "all");
  const [triggers, setTriggers] = React.useState<AlertTrigger[]>(initial?.triggers ?? ["New patent family"]);
  const [frequency, setFrequency] = React.useState<AlertFrequency>(initial?.frequency ?? "Weekly");

  const technologies = React.useMemo(() => technologiesByMineral(mineralId), [mineralId]);

  function toggleTrigger(t: AlertTrigger) {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (triggers.length === 0) return;
    onSubmit({ mineralId, technologyId, triggers, frequency });
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Mineral</label>
              <select
                className={selectClass}
                value={mineralId}
                onChange={(e) => {
                  setMineralId(e.target.value);
                  setTechnologyId("all");
                }}
              >
                {MINERALS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Technology (optional)</label>
              <select className={selectClass} value={technologyId} onChange={(e) => setTechnologyId(e.target.value)}>
                <option value="all">All technologies</option>
                {technologies.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Trigger on</label>
            <div className="flex flex-wrap gap-3">
              {TRIGGERS.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-sm text-ink-soft"
                >
                  <input
                    type="checkbox"
                    checked={triggers.includes(t)}
                    onChange={() => toggleTrigger(t)}
                    className="accent-mineral"
                  />
                  {t}
                </label>
              ))}
            </div>
            {triggers.length === 0 && <p className="mt-1 text-2xs text-danger">Select at least one trigger.</p>}
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Frequency</label>
            <select className={selectClass} value={frequency} onChange={(e) => setFrequency(e.target.value as AlertFrequency)}>
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                <X className="h-4 w-4" /> Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={triggers.length === 0}>
              <Bell className="h-4 w-4" /> {initial ? "Save Alert" : "Create Alert"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
