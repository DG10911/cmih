"use client";
import Link from "next/link";
import { MapPin, FileStack, FlaskConical, BookOpen } from "lucide-react";
import { Card, CardBody, Pill } from "@/components/ui";
import type { Organisation } from "@/lib/types";

const TYPE_TONE: Record<Organisation["type"], string> = {
  Academic: "border-data/30 bg-data/10 text-data",
  Government: "border-info/30 bg-info/10 text-info",
  "R&D Institute": "border-mineral/30 bg-mineral/10 text-mineral",
  Industry: "border-warning/30 bg-warning/10 text-warning",
  PSU: "border-success/30 bg-success/10 text-success",
};

/** Organisations Explorer grid card — links to `/organisations/[id]`. */
export function OrgCard({ organisation }: { organisation: Organisation }) {
  return (
    <Card className="relative flex flex-col transition-colors hover:border-border-strong">
      <Link href={`/organisations/${organisation.id}`} className="absolute inset-0 z-0 rounded-card" aria-label={organisation.name} />
      <CardBody className="relative z-10 flex flex-1 flex-col gap-3 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <Pill className={TYPE_TONE[organisation.type]}>{organisation.type}</Pill>
          <span className="inline-flex items-center gap-1 text-2xs text-ink-faint">
            <MapPin className="h-3 w-3" /> {organisation.country}
          </span>
        </div>

        <h3 className="text-sm font-semibold leading-snug text-ink group-hover:text-mineral">{organisation.name}</h3>

        {organisation.aliases.length > 0 && (
          <p className="text-2xs text-ink-faint">also known as {organisation.aliases.slice(0, 3).join(", ")}</p>
        )}

        <div className="mt-auto flex items-center gap-3 border-t border-border pt-3 text-2xs text-ink-soft">
          <span className="inline-flex items-center gap-1" title="Patent families">
            <FileStack className="h-3.5 w-3.5 text-ink-faint" />
            <span className="font-mono tabular-nums">{organisation.metrics.patentFamilies}</span>
          </span>
          <span className="inline-flex items-center gap-1" title="R&D projects">
            <FlaskConical className="h-3.5 w-3.5 text-ink-faint" />
            <span className="font-mono tabular-nums">{organisation.metrics.rdProjects}</span>
          </span>
          <span className="inline-flex items-center gap-1" title="Publications">
            <BookOpen className="h-3.5 w-3.5 text-ink-faint" />
            <span className="font-mono tabular-nums">{organisation.metrics.publications}</span>
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
