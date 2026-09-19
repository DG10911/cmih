import * as React from "react";
import Link from "next/link";
import { FileText, FlaskConical, Building2, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMineral, getOrganisation, getTechnology, mineralName, technologyName, orgName } from "@/lib/data";
import type { Patent } from "@/lib/types";

interface Node {
  key: string;
  label: string;
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number;
  y: number;
}

/**
 * Technology Relationship Map — a compact diagram linking
 * Patent <-> Technology <-> Organisation <-> Mineral (spec §41 related entities).
 * Plain SVG + absolutely-positioned nodes, no graph library required.
 */
export function TechnologyRelationshipMap({ patent }: { patent: Patent }) {
  const technology = getTechnology(patent.technology);
  const mineral = getMineral(patent.mineral);
  const primaryApplicant = patent.applicants[0];
  const organisation = primaryApplicant ? getOrganisation(primaryApplicant) : undefined;

  const nodes: Node[] = [
    { key: "patent", label: "Patent", name: patent.title, icon: FileText, x: 50, y: 12 },
    {
      key: "technology",
      label: "Technology",
      name: technologyName(patent.technology),
      href: technology ? `/technologies/${technology.id}` : undefined,
      icon: FlaskConical,
      x: 86,
      y: 50,
    },
    {
      key: "organisation",
      label: "Organisation",
      name: organisation ? organisation.name : orgName(primaryApplicant ?? ""),
      href: organisation ? `/organisations/${organisation.id}` : undefined,
      icon: Building2,
      x: 50,
      y: 88,
    },
    {
      key: "mineral",
      label: "Mineral",
      name: mineralName(patent.mineral),
      href: mineral ? `/minerals/${mineral.id}` : undefined,
      icon: Gem,
      x: 14,
      y: 50,
    },
  ];

  const edges: [Node, Node][] = [
    [nodes[0], nodes[1]],
    [nodes[1], nodes[2]],
    [nodes[2], nodes[3]],
    [nodes[3], nodes[0]],
  ];

  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgb(var(--border-strong))"
              strokeWidth={0.6}
              strokeDasharray="2 2"
            />
          ))}
        </svg>
        {nodes.map((n) => {
          const content = (
            <div
              className={cn(
                "flex w-[124px] flex-col items-center gap-1 rounded-card border border-border-strong bg-surface-2 px-2.5 py-2 text-center shadow-panel transition-colors",
                n.href && "hover:border-data/60 hover:bg-surface-3"
              )}
            >
              <n.icon className="h-4 w-4 text-mineral" />
              <span className="text-2xs uppercase tracking-wider text-ink-faint">{n.label}</span>
              <span className="line-clamp-2 text-2xs font-medium leading-snug text-ink">{n.name}</span>
            </div>
          );
          return (
            <div
              key={n.key}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              {n.href ? (
                <Link href={n.href} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-2xs text-ink-faint">
        Illustrative relationship graph — connects this patent to its matched technology, primary applicant and
        mineral.
      </p>
    </div>
  );
}
