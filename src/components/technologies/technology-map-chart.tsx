"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
  Tooltip,
} from "recharts";
import { Chip, ConfidenceBadge } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { Mineral, Technology } from "@/lib/types";

const MOMENTUM_COLOR: Record<Technology["momentum"], string> = {
  up: "rgb(var(--success))",
  flat: "rgb(var(--ink-soft))",
  down: "rgb(var(--danger))",
};

const MOMENTUM_ORDER: Technology["momentum"][] = ["up", "flat", "down"];

interface MapPoint {
  id: string;
  name: string;
  maturity: Technology["maturity"];
  momentum: Technology["momentum"];
  x: number;
  y: number;
  z: number;
  patentFamilies: number;
  rdProjects: number;
  publications: number;
  organisations: number;
  maturityEvidence: number;
}

function toPoint(t: Technology): MapPoint {
  return {
    id: t.id,
    name: t.name,
    maturity: t.maturity,
    momentum: t.momentum,
    x: t.landscape.x,
    y: t.landscape.y,
    z: t.landscape.evidenceVolume,
    patentFamilies: t.metrics.patentFamilies,
    rdProjects: t.metrics.rdProjects,
    publications: t.metrics.publications,
    organisations: t.metrics.organisations,
    maturityEvidence: t.emergingComponents.maturityEvidence,
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: MapPoint }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="max-w-xs rounded-md border border-border-strong bg-surface-2 px-3 py-2.5 shadow-elevated">
      <p className="text-xs font-semibold text-ink">{p.name}</p>
      <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5 text-2xs text-ink-soft">
        <span>Patent families: {formatNumber(p.patentFamilies)}</span>
        <span>R&D: {formatNumber(p.rdProjects)}</span>
        <span>Publications: {formatNumber(p.publications)}</span>
        <span>Organisations: {formatNumber(p.organisations)}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <ConfidenceBadge value={p.maturityEvidence} />
        <span className="text-2xs text-ink-faint">{p.maturity} maturity evidence</span>
      </div>
    </div>
  );
}

/**
 * Technology Landscape 2D map (spec §27): x = maturity/time, y = research
 * momentum, bubble size = evidence volume. Colour encodes momentum.
 */
export function TechnologyMapChart({ technologies, minerals }: { technologies: Technology[]; minerals: Mineral[] }) {
  const router = useRouter();
  const [mineralFilter, setMineralFilter] = React.useState<string | null>(null);

  const filtered = React.useMemo(
    () => (mineralFilter ? technologies.filter((t) => t.minerals.includes(mineralFilter)) : technologies),
    [technologies, mineralFilter]
  );

  const points = React.useMemo(() => filtered.map(toPoint), [filtered]);

  const groups = React.useMemo(() => {
    const g: Record<Technology["momentum"], MapPoint[]> = { up: [], flat: [], down: [] };
    points.forEach((p) => g[p.momentum].push(p));
    return g;
  }, [points]);

  const handlePointClick = (data: MapPoint) => {
    if (data?.id) router.push(`/technologies/${data.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-2xs font-medium uppercase tracking-wider text-ink-faint">Mineral</span>
        <Chip active={mineralFilter === null} onClick={() => setMineralFilter(null)}>
          All
        </Chip>
        {minerals.map((m) => (
          <Chip key={m.id} active={mineralFilter === m.id} onClick={() => setMineralFilter(m.id)}>
            {m.symbol}
          </Chip>
        ))}
      </div>

      <div className="h-[440px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 28, right: 28, bottom: 28, left: 12 }}>
            <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 1]}
              tick={{ fill: "rgb(var(--ink-faint))", fontSize: 11 }}
              stroke="rgb(var(--border-strong))"
              label={{ value: "Maturity → Time", position: "insideBottom", offset: -14, fill: "rgb(var(--ink-soft))", fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 1]}
              tick={{ fill: "rgb(var(--ink-faint))", fontSize: 11 }}
              stroke="rgb(var(--border-strong))"
              label={{ value: "Research momentum", angle: -90, position: "insideLeft", fill: "rgb(var(--ink-soft))", fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="z" range={[120, 700]} name="Evidence volume" />
            <ReferenceLine x={0.5} stroke="rgb(var(--border-strong))" strokeDasharray="4 4" />
            <ReferenceLine y={0.5} stroke="rgb(var(--border-strong))" strokeDasharray="4 4" />
            <ReferenceDot x={0.16} y={0.94} r={0} label={{ value: "Emerging & rising", fill: "rgb(var(--ink-faint))", fontSize: 10 }} />
            <ReferenceDot x={0.84} y={0.94} r={0} label={{ value: "Scaling & rising", fill: "rgb(var(--ink-faint))", fontSize: 10 }} />
            <ReferenceDot x={0.16} y={0.06} r={0} label={{ value: "Emerging & cooling", fill: "rgb(var(--ink-faint))", fontSize: 10 }} />
            <ReferenceDot x={0.84} y={0.06} r={0} label={{ value: "Mature & cooling", fill: "rgb(var(--ink-faint))", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgb(var(--border-strong))", strokeDasharray: "3 3" }} />
            {MOMENTUM_ORDER.map((key) => (
              <Scatter
                key={key}
                name={key === "up" ? "Rising" : key === "flat" ? "Stable" : "Declining"}
                data={groups[key]}
                fill={MOMENTUM_COLOR[key]}
                fillOpacity={0.72}
                stroke={MOMENTUM_COLOR[key]}
                onClick={(data: unknown) => handlePointClick(data as MapPoint)}
                cursor="pointer"
                isAnimationActive={false}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible data fallback for screen-reader / non-visual consumption of the chart. */}
      <table className="sr-only">
        <caption>Technology landscape: maturity/time (x), research momentum (y) and evidence volume for each tracked technology.</caption>
        <thead>
          <tr>
            <th scope="col">Technology</th>
            <th scope="col">Maturity / time (0–1)</th>
            <th scope="col">Research momentum (0–1)</th>
            <th scope="col">Evidence volume</th>
            <th scope="col">Momentum direction</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.x.toFixed(2)}</td>
              <td>{p.y.toFixed(2)}</td>
              <td>{p.z}</td>
              <td>{p.momentum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
