"use client";
import * as React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ACTIVITY_TIMELINE } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

const SERIES = [
  { key: "patents", label: "Patent Families", color: "var(--mineral)", grad: "gradPatents" },
  { key: "rd", label: "R&D Records", color: "var(--data)", grad: "gradRd" },
  { key: "publications", label: "Publications", color: "var(--success)", grad: "gradPub" },
] as const;

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color?: string }[];
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-2xs shadow-elevated">
      <div className="mb-1 font-mono font-semibold text-ink">{label}</div>
      <div className="space-y-0.5">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </span>
            <span className="font-mono tabular-nums text-ink">{formatNumber(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Technology Activity Timeline — multi-series area chart of platform-wide
 * patent, R&D and publication activity (spec §22). DEMO series.
 */
export function ActivityTimelineChart() {
  return (
    <div>
      <div
        role="img"
        aria-label="Line chart of platform patent, R&D and publication activity from 2016 to 2026, all three series trending upward with a slight dip in 2026 due to partial-year data."
        className="h-[280px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ACTIVITY_TIMELINE} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.grad} id={s.grad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`rgb(${s.color})`} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={`rgb(${s.color})`} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="rgb(var(--border))" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: "rgb(var(--ink-faint))", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgb(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "rgb(var(--ink-faint))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, color: "rgb(var(--ink-soft))" }}
            />
            {SERIES.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={`rgb(${s.color})`}
                strokeWidth={2}
                fill={`url(#${s.grad})`}
                animationDuration={900}
                animationBegin={i * 120}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Accessible data fallback for screen readers / no-JS */}
      <table className="sr-only">
        <caption>Platform activity timeline by year: patent families, R&amp;D records, publications.</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Patent Families</th>
            <th scope="col">R&amp;D Records</th>
            <th scope="col">Publications</th>
          </tr>
        </thead>
        <tbody>
          {ACTIVITY_TIMELINE.map((p) => (
            <tr key={p.year}>
              <th scope="row">{p.year}</th>
              <td>{p.patents}</td>
              <td>{p.rd}</td>
              <td>{p.publications}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
