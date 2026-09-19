import type { Node, Edge } from "reactflow";
import {
  MINERALS,
  TECHNOLOGIES,
  ORGANISATIONS,
  PATENTS,
  RD_PROJECTS,
  PUBLICATIONS,
  technologiesByMineral,
  patentsByTechnology,
  rdByTechnology,
  publicationsByTechnology,
} from "@/lib/data";
import {
  Gem,
  Cpu,
  ScrollText,
  FlaskConical,
  Building2,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

/**
 * Knowledge graph builder for /graph (spec §19,39).
 *
 * Builds a deterministic, radial "hub" layout — no simulation dependency:
 *  - Technologies sit on a mid ring, evenly spaced by angle.
 *  - Minerals sit on an inner ring, angled at the circular mean of their
 *    connected technologies.
 *  - Patents / R&D / Publications ("evidence" records) sit on three outer
 *    lanes, fanned out around their technology's angle.
 *  - Organisations sit on the outermost ring, angled at the circular mean
 *    of the technologies they work on.
 *
 * All figures are DEMO / synthetic (spec §53) — labelled via <DemoBadge/>
 * at the page level, not repeated per-node here.
 */

export type GraphNodeType = "mineral" | "technology" | "patent" | "rd" | "organisation" | "publication";

export const ALL_NODE_TYPES: GraphNodeType[] = [
  "mineral",
  "technology",
  "patent",
  "rd",
  "organisation",
  "publication",
];

export interface GraphNodeData {
  kind: GraphNodeType;
  refId: string;
  label: string;
  subtitle?: string;
  /** Visual state flags, set by the canvas at render time (not by buildGraph). */
  matched?: boolean;
  dimmed?: boolean;
  pathHighlight?: boolean;
  selected?: boolean;
}

export type KDNode = Node<GraphNodeData>;
export type KDEdge = Edge;

export interface NodeTypeMeta {
  kind: GraphNodeType;
  label: string;
  plural: string;
  icon: LucideIcon;
  textClass: string;
  bgClass: string;
  borderClass: string;
  /** CSS color string (rgb(var(--token))) for use outside Tailwind class contexts (MiniMap / edges). */
  colorVar: string;
}

export const NODE_TYPE_META: Record<GraphNodeType, NodeTypeMeta> = {
  mineral: {
    kind: "mineral",
    label: "Mineral",
    plural: "Minerals",
    icon: Gem,
    textClass: "text-mineral",
    bgClass: "bg-mineral/10",
    borderClass: "border-mineral/50",
    colorVar: "rgb(var(--mineral))",
  },
  technology: {
    kind: "technology",
    label: "Technology",
    plural: "Technologies",
    icon: Cpu,
    textClass: "text-data",
    bgClass: "bg-data/10",
    borderClass: "border-data/50",
    colorVar: "rgb(var(--data))",
  },
  patent: {
    kind: "patent",
    label: "Patent",
    plural: "Patents",
    icon: ScrollText,
    textClass: "text-info",
    bgClass: "bg-info/10",
    borderClass: "border-info/50",
    colorVar: "rgb(var(--info))",
  },
  rd: {
    kind: "rd",
    label: "R&D Project",
    plural: "R&D Projects",
    icon: FlaskConical,
    textClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/50",
    colorVar: "rgb(var(--success))",
  },
  organisation: {
    kind: "organisation",
    label: "Organisation",
    plural: "Organisations",
    icon: Building2,
    textClass: "text-ink",
    bgClass: "bg-surface-2",
    borderClass: "border-border-strong",
    colorVar: "rgb(var(--ink-faint))",
  },
  publication: {
    kind: "publication",
    label: "Publication",
    plural: "Publications",
    icon: BookOpen,
    textClass: "text-danger",
    bgClass: "bg-danger/10",
    borderClass: "border-danger/50",
    colorVar: "rgb(var(--danger))",
  },
};

export const nodeId = (kind: GraphNodeType, refId: string): string => `${kind}-${refId}`;

/** The "Explore path" demo affordance (spec §19): Lithium → DLE → a patent → its org → a publication. */
export const EXPLORE_PATH_IDS: string[] = [
  nodeId("mineral", "lithium"),
  nodeId("technology", "direct-lithium-extraction"),
  nodeId("patent", "kd-p-0001"),
  nodeId("organisation", "iit-bombay"),
  nodeId("publication", "kd-pub-0001"),
];

/** True if an edge connects two consecutive nodes on the explore path, in either direction. */
export function isExplorePathEdge(edge: KDEdge): boolean {
  for (let i = 0; i < EXPLORE_PATH_IDS.length - 1; i++) {
    const a = EXPLORE_PATH_IDS[i];
    const b = EXPLORE_PATH_IDS[i + 1];
    if ((edge.source === a && edge.target === b) || (edge.source === b && edge.target === a)) return true;
  }
  return false;
}

/* --------------------------------------------------------------- layout */

const CENTER = { x: 760, y: 640 };
const R_MINERAL = 130;
const R_TECHNOLOGY = 320;
const R_PATENT = 480;
const R_RD = 570;
const R_PUBLICATION = 660;
const R_ORGANISATION = 780;

function polar(radius: number, angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER.x + radius * Math.cos(rad), y: CENTER.y + radius * Math.sin(rad) };
}

/** Circular mean of a set of angles (degrees), so averaging near 0/360 doesn't break. */
function circularMeanDeg(angles: number[]): number {
  if (angles.length === 0) return 0;
  let sumSin = 0;
  let sumCos = 0;
  for (const a of angles) {
    const rad = (a * Math.PI) / 180;
    sumSin += Math.sin(rad);
    sumCos += Math.cos(rad);
  }
  const mean = Math.atan2(sumSin / angles.length, sumCos / angles.length);
  return (mean * 180) / Math.PI;
}

/** Fan a list of items around a base angle, spread proportional to count (capped). */
function fanAngle(index: number, count: number, baseAngle: number): number {
  if (count <= 1) return baseAngle;
  const spread = Math.min(52, 15 * count);
  const start = baseAngle - spread / 2;
  return start + (spread * index) / (count - 1);
}

export interface GraphCounts {
  minerals: number;
  technologies: number;
  patents: number;
  rd: number;
  publications: number;
  organisations: number;
  edges: number;
}

export interface BuiltGraph {
  nodes: KDNode[];
  edges: KDEdge[];
  counts: GraphCounts;
}

/**
 * Build the full knowledge-graph node/edge set from demo data (spec §19,39).
 * Only minerals with at least one connected technology are included, so the
 * graph stays fully connected and readable (per the build contract's
 * "all MINERALS (or the connected ones)" allowance).
 */
export function buildGraph(): BuiltGraph {
  const nodes: KDNode[] = [];
  const edges: KDEdge[] = [];
  const edgeIds = new Set<string>();

  function addEdge(sourceId: string, targetId: string, kind: GraphNodeType) {
    const id = `e-${sourceId}-${targetId}`;
    if (edgeIds.has(id)) return;
    edgeIds.add(id);
    const meta = NODE_TYPE_META[kind];
    edges.push({
      id,
      source: sourceId,
      target: targetId,
      style: { stroke: meta.colorVar, strokeWidth: 1, opacity: 0.35 },
    });
  }

  // 1. Technologies — evenly spaced ring, angle map reused by everything else.
  const techAngle = new Map<string, number>();
  TECHNOLOGIES.forEach((t, i) => techAngle.set(t.id, (360 / TECHNOLOGIES.length) * i));

  TECHNOLOGIES.forEach((t) => {
    const angle = techAngle.get(t.id) ?? 0;
    const pos = polar(R_TECHNOLOGY, angle);
    nodes.push({
      id: nodeId("technology", t.id),
      type: "kd",
      position: pos,
      data: { kind: "technology", refId: t.id, label: t.name, subtitle: `${t.maturity} · ${t.momentum === "up" ? "Rising" : t.momentum === "down" ? "Declining" : "Stable"}` },
    });
  });

  // 2. Minerals — connected ones only, angled at the mean of their technologies.
  const minerals = MINERALS.filter((m) => technologiesByMineral(m.id).length > 0);
  minerals.forEach((m) => {
    const techs = technologiesByMineral(m.id);
    const angle = circularMeanDeg(techs.map((t) => techAngle.get(t.id) ?? 0));
    const pos = polar(R_MINERAL, angle);
    nodes.push({
      id: nodeId("mineral", m.id),
      type: "kd",
      position: pos,
      data: { kind: "mineral", refId: m.id, label: m.name, subtitle: m.category },
    });
    techs.forEach((t) => addEdge(nodeId("mineral", m.id), nodeId("technology", t.id), "mineral"));
  });

  // 3. Evidence lanes (patents / R&D / publications), fanned around their technology's angle.
  TECHNOLOGIES.forEach((t) => {
    const baseAngle = techAngle.get(t.id) ?? 0;

    const patents = patentsByTechnology(t.id);
    patents.forEach((p, i) => {
      const angle = fanAngle(i, patents.length, baseAngle);
      const pos = polar(R_PATENT + (i % 2) * 30, angle);
      nodes.push({
        id: nodeId("patent", p.id),
        type: "kd",
        position: pos,
        data: { kind: "patent", refId: p.id, label: p.title, subtitle: `${p.legalStatus} · ${p.jurisdictions.join("/")}` },
      });
      addEdge(nodeId("technology", t.id), nodeId("patent", p.id), "technology");
      p.applicants.forEach((orgIdOrName) => {
        if (ORGANISATIONS.some((o) => o.id === orgIdOrName)) {
          addEdge(nodeId("patent", p.id), nodeId("organisation", orgIdOrName), "patent");
        }
      });
    });

    const rdProjects = rdByTechnology(t.id);
    rdProjects.forEach((r, i) => {
      const angle = fanAngle(i, rdProjects.length, baseAngle);
      const pos = polar(R_RD + (i % 2) * 30, angle);
      nodes.push({
        id: nodeId("rd", r.id),
        type: "kd",
        position: pos,
        data: { kind: "rd", refId: r.id, label: r.title, subtitle: `${r.projectType} · ${r.year}` },
      });
      addEdge(nodeId("technology", t.id), nodeId("rd", r.id), "technology");
      if (ORGANISATIONS.some((o) => o.id === r.organisation)) {
        addEdge(nodeId("rd", r.id), nodeId("organisation", r.organisation), "rd");
      }
    });

    const publications = publicationsByTechnology(t.id);
    publications.forEach((pub, i) => {
      const angle = fanAngle(i, publications.length, baseAngle);
      const pos = polar(R_PUBLICATION + (i % 2) * 30, angle);
      nodes.push({
        id: nodeId("publication", pub.id),
        type: "kd",
        position: pos,
        data: { kind: "publication", refId: pub.id, label: pub.title, subtitle: `${pub.venue} · ${pub.year}` },
      });
      addEdge(nodeId("technology", t.id), nodeId("publication", pub.id), "technology");
      if (ORGANISATIONS.some((o) => o.id === pub.organisation)) {
        addEdge(nodeId("publication", pub.id), nodeId("organisation", pub.organisation), "publication");
      }
    });
  });

  // 4. Organisations — outermost ring, angled at the mean of the technologies they work on.
  ORGANISATIONS.forEach((o) => {
    const angle = circularMeanDeg(o.technologies.map((tid) => techAngle.get(tid) ?? 0));
    const pos = polar(R_ORGANISATION, angle);
    nodes.push({
      id: nodeId("organisation", o.id),
      type: "kd",
      position: pos,
      data: { kind: "organisation", refId: o.id, label: o.name, subtitle: `${o.type} · ${o.country}` },
    });
  });

  const counts: GraphCounts = {
    minerals: minerals.length,
    technologies: TECHNOLOGIES.length,
    patents: PATENTS.length,
    rd: RD_PROJECTS.length,
    publications: PUBLICATIONS.length,
    organisations: ORGANISATIONS.length,
    edges: edges.length,
  };

  return { nodes, edges, counts };
}
