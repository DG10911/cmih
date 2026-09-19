import type { DataSource } from "@/lib/types";

/** Data source registry (spec §42-43). Never fake real connectivity. */
export const DATA_SOURCES: DataSource[] = [
  { id: "openalex", name: "OpenAlex", category: "Scholarly", records: 125421, lastSync: "2026-09-19", status: "CONNECTED", coverage: "High" },
  { id: "crossref", name: "Crossref", category: "Scholarly", records: 98240, lastSync: "2026-09-19", status: "CONNECTED", coverage: "High" },
  { id: "demo-patent", name: "Demo Patent Dataset", category: "Patent", records: 48210, lastSync: "2026-09-19", status: "DEMO", coverage: "Medium" },
  { id: "rd-dataset", name: "R&D Dataset", category: "Official", records: 6420, lastSync: "2026-09-19", status: "DEMO", coverage: "Medium" },
  { id: "ip-india", name: "IP India / Indian Patent Journal", category: "Patent", records: 0, lastSync: "—", status: "PLANNED", coverage: "Low" },
  { id: "wipo", name: "WIPO PATENTSCOPE", category: "Patent", records: 0, lastSync: "—", status: "PLANNED", coverage: "Low" },
  { id: "epo", name: "EPO OPS", category: "Patent", records: 0, lastSync: "—", status: "PLANNED", coverage: "Low" },
  { id: "satyabhama", name: "SATYABHAMA / Ministry of Mines", category: "Official", records: 0, lastSync: "—", status: "PLANNED", coverage: "Low" },
];

/** Pipeline stage monitor (spec §68). DEMO values. */
export const PIPELINE_STAGES = [
  { stage: "Sources", records: 278291, processed: 278291, errors: 0, lastRun: "2026-09-19 06:00" },
  { stage: "Ingestion", records: 278291, processed: 277104, errors: 1187, lastRun: "2026-09-19 06:04" },
  { stage: "Normalization", records: 277104, processed: 276880, errors: 224, lastRun: "2026-09-19 06:09" },
  { stage: "Classification", records: 276880, processed: 271342, errors: 5538, lastRun: "2026-09-19 06:18" },
  { stage: "Entity Resolution", records: 271342, processed: 269901, errors: 1441, lastRun: "2026-09-19 06:26" },
  { stage: "Deduplication", records: 269901, processed: 214603, errors: 0, lastRun: "2026-09-19 06:31" },
  { stage: "Knowledge Graph", records: 214603, processed: 214603, errors: 0, lastRun: "2026-09-19 06:40" },
  { stage: "Analytics", records: 214603, processed: 214603, errors: 0, lastRun: "2026-09-19 06:52" },
];

/** Data-quality metrics (spec §69). Prototype metrics — clearly labelled. */
export const DATA_QUALITY = [
  { label: "Classification Coverage", value: 0.94, detail: "Share of records with a mineral + technology classification." },
  { label: "Entity Resolution Rate", value: 0.89, detail: "Share of organisation/researcher mentions resolved to a canonical entity." },
  { label: "Duplicate Rate", value: 0.2, detail: "Publications collapsed into patent families / deduplicated records." },
  { label: "Source Freshness", value: 0.97, detail: "Share of connected sources synced within the last 24h." },
  { label: "Evidence Completeness", value: 0.86, detail: "Share of insights with linked evidence + provenance." },
];
