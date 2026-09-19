import type { ActivityPoint } from "@/lib/types";

export const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

/** Platform-wide activity timeline (spec §22). DEMO values. */
export const ACTIVITY_TIMELINE: ActivityPoint[] = [
  { year: 2016, patents: 42, rd: 8, publications: 96, events: 3 },
  { year: 2017, patents: 51, rd: 11, publications: 118, events: 4 },
  { year: 2018, patents: 63, rd: 14, publications: 142, events: 6 },
  { year: 2019, patents: 78, rd: 18, publications: 171, events: 7 },
  { year: 2020, patents: 96, rd: 22, publications: 205, events: 9 },
  { year: 2021, patents: 121, rd: 27, publications: 248, events: 12 },
  { year: 2022, patents: 148, rd: 33, publications: 302, events: 15 },
  { year: 2023, patents: 176, rd: 41, publications: 358, events: 19 },
  { year: 2024, patents: 204, rd: 48, publications: 421, events: 23 },
  { year: 2025, patents: 231, rd: 54, publications: 486, events: 28 },
  { year: 2026, patents: 138, rd: 31, publications: 274, events: 16 },
];

/**
 * Deterministically synthesise a per-mineral activity series scaled to its
 * total patent-family count so charts feel alive without randomness (spec §52).
 */
export function mineralActivity(patentFamilies: number, publications: number, rdProjects: number): ActivityPoint[] {
  // Growth curve weights per year (sums to ~1), front-loaded toward recent years.
  const w = [0.02, 0.03, 0.04, 0.05, 0.07, 0.09, 0.12, 0.14, 0.17, 0.19, 0.08];
  return YEARS.map((year, i) => ({
    year,
    patents: Math.round(patentFamilies * w[i]),
    rd: Math.max(0, Math.round(rdProjects * w[i] * 1.4)),
    publications: Math.round(publications * w[i]),
    events: Math.max(0, Math.round((rdProjects + patentFamilies / 20) * w[i] * 0.6)),
  }));
}

/** India vs Global comparison factors per metric (spec §35). DEMO ratios (India share 0..1). */
export const INDIA_SHARE = {
  patents: 0.14,
  rd: 0.22,
  publications: 0.19,
  technologyDiversity: 0.28,
  organisations: 0.17,
  growth: 0.62, // India growth rate relative to global (India growing faster off a lower base)
};
