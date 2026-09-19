"use client";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { EMERGING_TECHNOLOGIES, getTechnology } from "@/lib/data";
import type { Maturity } from "@/lib/types";

const AXES: { key: keyof (typeof EMERGING_TECHNOLOGIES)[number]["components"]; label: string }[] = [
  { key: "researchGrowth", label: "Research Growth" },
  { key: "patentGrowth", label: "Patent Growth" },
  { key: "orgGrowth", label: "Org Growth" },
  { key: "novelty", label: "Novelty" },
  { key: "recency", label: "Recency" },
  { key: "maturityEvidence", label: "Maturity Evidence" },
];

const SERIES_COLORS = [
  "rgb(var(--mineral))",
  "rgb(var(--data))",
  "rgb(var(--success))",
  "rgb(var(--warning))",
  "rgb(var(--info))",
];

const ZONE_ORDER: Maturity[] = ["Emerging", "Developing", "Scaling", "Mature"];
const ZONE_TONE: Record<Maturity, string> = {
  Emerging: "text-data border-data/40 bg-data/10",
  Developing: "text-mineral border-mineral/40 bg-mineral/10",
  Scaling: "text-warning border-warning/40 bg-warning/10",
  Mature: "text-success border-success/40 bg-success/10",
};

function RadarTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-xs shadow-elevated">
      <div className="mb-1 font-medium text-ink">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-3 font-mono text-2xs tabular-nums">
          <span className="flex items-center gap-1.5 text-ink-soft">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="text-ink">{Math.round(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Sophisticated emerging-technology lifecycle visualization (spec §28,84):
 * a 6-axis radar comparing the top technologies by emergingScore, plus a
 * zone-lane map placing every tracked technology in its lifecycle zone.
 * This is an evidence-based lifecycle signal, not an official technology
 * readiness level (TRL).
 */
export function EmergingRadar() {
  const top = [...EMERGING_TECHNOLOGIES].sort((a, b) => b.emergingScore - a.emergingScore).slice(0, 5);

  const radarData = AXES.map((axis) => {
    const row: Record<string, string | number> = { axis: axis.label };
    top.forEach((t) => {
      row[t.id] = Math.round(t.components[axis.key] * 100);
    });
    return row;
  });

  const zoned = ZONE_ORDER.map((zone) => ({
    zone,
    items: EMERGING_TECHNOLOGIES.filter((t) => t.zone === zone).sort((a, b) => b.emergingScore - a.emergingScore),
  }));

  return (
    <Card>
      <CardHeader>
        <div>
          <div className="mb-1 font-mono text-2xs uppercase tracking-[0.18em] text-mineral">
            Spec §28,84 · Emerging Technology Radar
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">Technology lifecycle signal</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Evidence-based technology lifecycle signal — not official technology readiness levels (TRL).
            Axes are 0–100 normalised component scores behind the emerging-score formula.
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="rgb(var(--border-strong))" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "rgb(var(--ink-soft))", fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "rgb(var(--ink-faint))", fontSize: 10 }} axisLine={false} />
              {top.map((t, i) => {
                const tech = getTechnology(t.technology);
                return (
                  <Radar
                    key={t.id}
                    name={tech?.name ?? t.technology}
                    dataKey={t.id}
                    stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                    fill={SERIES_COLORS[i % SERIES_COLORS.length]}
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                );
              })}
              <RechartsTooltip content={<RadarTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "rgb(var(--ink-soft))" }}
                iconType="circle"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Accessible data fallback */}
        <table className="sr-only">
          <caption>Emerging technology component scores across the six radar axes.</caption>
          <thead>
            <tr>
              <th>Technology</th>
              {AXES.map((a) => (
                <th key={a.key}>{a.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map((t) => {
              const tech = getTechnology(t.technology);
              return (
                <tr key={t.id}>
                  <td>{tech?.name ?? t.technology}</td>
                  {AXES.map((a) => (
                    <td key={a.key}>{Math.round(t.components[a.key] * 100)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div>
          <div className="mb-3 text-2xs uppercase tracking-wider text-ink-faint">Lifecycle zones</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {zoned.map(({ zone, items }) => (
              <div key={zone} className="rounded-card border border-border bg-surface-2 p-3">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-semibold ${ZONE_TONE[zone]}`}>
                  {zone.toUpperCase()}
                </span>
                <div className="mt-2 space-y-1.5">
                  {items.length === 0 && <p className="text-2xs text-ink-faint">No tracked technologies.</p>}
                  {items.map((t) => {
                    const tech = getTechnology(t.technology);
                    return (
                      <div key={t.id} className="flex items-center justify-between gap-2 text-2xs">
                        <span className="truncate text-ink-soft" title={tech?.name}>
                          {tech?.name ?? t.technology}
                        </span>
                        <span className="font-mono tabular-nums text-ink-faint">{Math.round(t.emergingScore * 100)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
