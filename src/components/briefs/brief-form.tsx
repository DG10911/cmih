"use client";
import * as React from "react";
import { Sparkles } from "lucide-react";
import { Button, Card, CardBody } from "@/components/ui";
import { MINERALS, technologiesByMineral, YEARS } from "@/lib/data";
import type { Audience, BriefParams, Geography } from "./build-brief";

const AUDIENCES: Audience[] = ["Policy maker", "Scientist", "Industry"];
const GEOGRAPHIES: Geography[] = ["India", "Global", "Both"];

const selectClass =
  "w-full rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-sm text-ink focus:border-data focus:outline-none";
const labelClass = "mb-1 block text-2xs uppercase tracking-wider text-ink-faint";

/** Brief-configuration form (spec §45). */
export function BriefForm({ onGenerate }: { onGenerate: (params: BriefParams) => void }) {
  const [mineralId, setMineralId] = React.useState(MINERALS[0].id);
  const [technologyId, setTechnologyId] = React.useState("all");
  const [fromYear, setFromYear] = React.useState(YEARS[0]);
  const [toYear, setToYear] = React.useState(YEARS[YEARS.length - 1]);
  const [geography, setGeography] = React.useState<Geography>("Both");
  const [audience, setAudience] = React.useState<Audience>("Policy maker");

  const technologies = React.useMemo(() => technologiesByMineral(mineralId), [mineralId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onGenerate({
      mineralId,
      technologyId,
      fromYear: Math.min(fromYear, toYear),
      toYear: Math.max(fromYear, toYear),
      geography,
      audience,
    });
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <div>
              <label className={labelClass}>Geography</label>
              <select className={selectClass} value={geography} onChange={(e) => setGeography(e.target.value as Geography)}>
                {GEOGRAPHIES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>From year</label>
              <select className={selectClass} value={fromYear} onChange={(e) => setFromYear(Number(e.target.value))}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>To year</label>
              <select className={selectClass} value={toYear} onChange={(e) => setToYear(Number(e.target.value))}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Audience</label>
              <select className={selectClass} value={audience} onChange={(e) => setAudience(e.target.value as Audience)}>
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              <Sparkles className="h-4 w-4" /> Generate Intelligence Brief
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
