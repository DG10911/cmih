import { FileText, FlaskConical, BookOpen, Building2, Sparkles } from "lucide-react";
import { DemoBadge, KpiCard, Pill } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import type { Mineral } from "@/lib/types";

/** Hero header for the Mineral Intelligence Profile. */
export function MineralHero({ mineral }: { mineral: Mineral }) {
  return (
    <FadeIn>
      <div className="rounded-card border border-border bg-surface/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-2xs uppercase tracking-[0.18em] text-mineral">
            Technology Intelligence Profile
          </div>
          <DemoBadge />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-mineral/40 bg-mineral/10 font-mono text-lg font-bold text-mineral">
            {mineral.symbol}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{mineral.name}</h1>
            <Pill className="mt-1 border-border-strong bg-surface-2 text-ink-soft">{mineral.category}</Pill>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">{mineral.summary}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Patent families" value={mineral.metrics.patentFamilies} icon={FileText} />
          <KpiCard label="R&D projects" value={mineral.metrics.rdProjects} icon={FlaskConical} />
          <KpiCard label="Publications" value={mineral.metrics.publications} icon={BookOpen} />
          <KpiCard label="Organisations" value={mineral.metrics.organisations} icon={Building2} />
          <KpiCard
            label="Emerging technologies"
            value={mineral.metrics.emergingTechnologies ?? 0}
            icon={Sparkles}
            hint={mineral.metrics.emergingTechnologies ? undefined : "No radar signals yet"}
          />
        </div>
      </div>
    </FadeIn>
  );
}
