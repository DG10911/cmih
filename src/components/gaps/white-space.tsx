"use client";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { TECHNOLOGIES, mineralName } from "@/lib/data";

interface QuadrantPoint {
  id: string;
  name: string;
  mineral: string;
  x: number; // patent families
  y: number; // R&D projects
}

const QUADRANT_LABELS = {
  hh: "Established",
  hl: "Commercially active",
  lh: "Research-heavy",
  ll: "Potential white space",
} as const;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function CustomDot({ cx, cy, fill }: { cx?: number; cy?: number; fill?: string }) {
  if (cx == null || cy == null) return null;
  return <circle cx={cx} cy={cy} r={6} fill={fill} stroke="rgb(var(--background))" strokeWidth={1.5} />;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: QuadrantPoint }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-xs shadow-elevated">
      <div className="font-medium text-ink">{p.name}</div>
      <div className="mt-0.5 text-2xs text-ink-faint">{mineralName(p.mineral)}</div>
      <div className="mt-1.5 flex gap-3 font-mono text-2xs tabular-nums text-ink-soft">
        <span>{p.x} patent families</span>
        <span>{p.y} R&D projects</span>
      </div>
    </div>
  );
}

/**
 * Technology White Space quadrant scatter (spec §32).
 * X = patent activity (metrics.patentFamilies), Y = R&D activity (metrics.rdProjects).
 * Quadrants split at the dataset median so the plot is self-relative rather
 * than tied to an arbitrary absolute threshold.
 */
export function WhiteSpace() {
  const points: QuadrantPoint[] = TECHNOLOGIES.map((t) => ({
    id: t.id,
    name: t.name,
    mineral: t.minerals[0],
    x: t.metrics.patentFamilies,
    y: t.metrics.rdProjects,
  }));

  const medianX = median(points.map((p) => p.x));
  const medianY = median(points.map((p) => p.y));
  const maxX = Math.max(...points.map((p) => p.x)) * 1.12;
  const maxY = Math.max(...points.map((p) => p.y)) * 1.15;

  const colorFor = (p: QuadrantPoint) => {
    const highX = p.x >= medianX;
    const highY = p.y >= medianY;
    if (highX && highY) return "rgb(var(--success))";
    if (highX && !highY) return "rgb(var(--mineral))";
    if (!highX && highY) return "rgb(var(--data))";
    return "rgb(var(--ink-faint))";
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <div className="mb-1 font-mono text-2xs uppercase tracking-[0.18em] text-mineral">
            Spec §32 · Technology White Space
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">Patent × R&D activity quadrant</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Each point is a technology positioned by indexed patent-family count (x) and R&D-project count
            (y), split at the dataset median. Low evidence does not necessarily mean no activity — it may
            mean under-indexed activity.
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="relative h-[380px] w-full">
          {/* Quadrant background labels — decorative, purely visual guidance */}
          <div className="pointer-events-none absolute inset-4 grid grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-md">
            <div className="flex items-start justify-end bg-data/[0.04] p-2">
              <span className="text-2xs font-medium uppercase tracking-wider text-data/70">
                {QUADRANT_LABELS.lh}
              </span>
            </div>
            <div className="flex items-start justify-start bg-success/[0.04] p-2">
              <span className="text-2xs font-medium uppercase tracking-wider text-success/70">
                {QUADRANT_LABELS.hh}
              </span>
            </div>
            <div className="flex items-end justify-end bg-ink-faint/[0.04] p-2">
              <span className="text-2xs font-medium uppercase tracking-wider text-ink-faint">
                {QUADRANT_LABELS.ll}
              </span>
            </div>
            <div className="flex items-end justify-start bg-mineral/[0.04] p-2">
              <span className="text-2xs font-medium uppercase tracking-wider text-mineral/70">
                {QUADRANT_LABELS.hl}
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 24, bottom: 16, left: 8 }}>
              <XAxis
                type="number"
                dataKey="x"
                name="Patent families"
                domain={[0, maxX]}
                tick={{ fill: "rgb(var(--ink-faint))", fontSize: 11 }}
                stroke="rgb(var(--border-strong))"
                label={{ value: "Patent activity →", position: "insideBottomRight", fill: "rgb(var(--ink-faint))", fontSize: 11, offset: -4 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="R&D projects"
                domain={[0, maxY]}
                tick={{ fill: "rgb(var(--ink-faint))", fontSize: 11 }}
                stroke="rgb(var(--border-strong))"
                label={{ value: "R&D activity →", angle: -90, position: "insideTopLeft", fill: "rgb(var(--ink-faint))", fontSize: 11 }}
              />
              <ZAxis range={[60, 60]} />
              <ReferenceLine x={medianX} stroke="rgb(var(--border-strong))" strokeDasharray="4 4" />
              <ReferenceLine y={medianY} stroke="rgb(var(--border-strong))" strokeDasharray="4 4" />
              <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: "rgb(var(--border-strong))" }} />
              <Scatter data={points} shape={<CustomDot />}>
                {points.map((p) => (
                  <Cell key={p.id} fill={colorFor(p)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Accessible data fallback for non-visual / non-chart consumption */}
        <table className="sr-only">
          <caption>Technology patent and R&D activity counts, used to derive the white-space quadrant.</caption>
          <thead>
            <tr>
              <th>Technology</th>
              <th>Mineral</th>
              <th>Patent families</th>
              <th>R&D projects</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{mineralName(p.mineral)}</td>
                <td>{p.x}</td>
                <td>{p.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
