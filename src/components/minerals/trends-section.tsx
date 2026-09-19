"use client";
import * as React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui";
import { ProfileSection } from "./section-shell";
import type { ActivityPoint } from "@/lib/types";

/** Section 4 — Technology Trends: patents / R&D / publications over time. */
export function TrendsSection({ activity, mineralName }: { activity: ActivityPoint[]; mineralName: string }) {
  return (
    <ProfileSection
      id="trends"
      eyebrow="Section 04"
      title="Technology Trends"
      subtitle="Deterministic demo activity series scaled from this mineral's totals — illustrates growth shape, not exact counts."
    >
      <Card className="p-4">
        <div
          role="img"
          aria-label={`Line chart of patent, R&D and publication activity for ${mineralName} from ${activity[0]?.year} to ${activity[activity.length - 1]?.year}.`}
          className="h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activity} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="fillPatents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--mineral))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="rgb(var(--mineral))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillRd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--data))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="rgb(var(--data))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillPubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgb(var(--border))" vertical={false} />
              <XAxis dataKey="year" stroke="rgb(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgb(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} width={36} />
              <RTooltip
                contentStyle={{
                  background: "rgb(var(--surface-2))",
                  border: "1px solid rgb(var(--border-strong))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "rgb(var(--ink))" }}
              />
              <Area type="monotone" dataKey="patents" name="Patent families" stroke="rgb(var(--mineral))" fill="url(#fillPatents)" strokeWidth={2} />
              <Area type="monotone" dataKey="rd" name="R&D projects" stroke="rgb(var(--data))" fill="url(#fillRd)" strokeWidth={2} />
              <Area type="monotone" dataKey="publications" name="Publications" stroke="rgb(var(--success))" fill="url(#fillPubs)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-2xs text-ink-soft">
          <Legend swatch="bg-mineral" label="Patent families" />
          <Legend swatch="bg-data" label="R&D projects" />
          <Legend swatch="bg-success" label="Publications" />
        </div>

        <table className="sr-only">
          <caption>Yearly patent, R&amp;D and publication activity for {mineralName}</caption>
          <thead>
            <tr>
              <th>Year</th>
              <th>Patent families</th>
              <th>R&amp;D projects</th>
              <th>Publications</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{row.patents}</td>
                <td>{row.rd}</td>
                <td>{row.publications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ProfileSection>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${swatch}`} />
      {label}
    </span>
  );
}
