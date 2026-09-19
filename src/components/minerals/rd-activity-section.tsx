import Link from "next/link";
import { FileText, BookOpen, FlaskConical, Factory, Repeat2, Handshake, ArrowUpRight } from "lucide-react";
import { Card, Pill, EmptyState } from "@/components/ui";
import { orgName } from "@/lib/data";
import { ProfileSection } from "./section-shell";
import type { EvidenceType, RDProject, TimelineEvent, ValueChainStage } from "@/lib/types";

const TYPE_META: Record<EvidenceType, { icon: typeof FileText; label: string }> = {
  patent: { icon: FileText, label: "Patent" },
  publication: { icon: BookOpen, label: "Publication" },
  rd_project: { icon: FlaskConical, label: "R&D Project" },
  pilot: { icon: Factory, label: "Pilot Plant" },
  tech_transfer: { icon: Repeat2, label: "Tech Transfer" },
  mou: { icon: Handshake, label: "MoU" },
};

/** Section 6 — R&D Activity: chronological event timeline + R&D project list (stage-filtered). */
export function RdActivitySection({
  timeline,
  rdProjects,
  stageFilter,
}: {
  timeline: TimelineEvent[];
  rdProjects: RDProject[];
  stageFilter: ValueChainStage | null;
}) {
  return (
    <ProfileSection
      id="rd"
      eyebrow="Section 06"
      title="R&D Activity"
      subtitle={stageFilter ? `Filtered to the ${stageFilter} stage.` : "Pilot plants, MoUs, technology transfers, funded and research projects."}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <Card className="p-4">
          <div className="mb-3 text-2xs font-medium uppercase tracking-wider text-ink-faint">Event timeline</div>
          {timeline.length === 0 ? (
            <p className="text-xs text-ink-soft">No timeline events for this filter.</p>
          ) : (
            <ol className="relative space-y-4 border-l border-border pl-4">
              {timeline.map((ev, i) => {
                const meta = TYPE_META[ev.type];
                const Icon = meta.icon;
                return (
                  <li key={`${ev.refId ?? ev.label}-${i}`} className="relative">
                    <span className="absolute -left-[21px] flex h-6 w-6 items-center justify-center rounded-full border border-data/40 bg-surface text-data">
                      <Icon className="h-3 w-3" />
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xs tabular-nums text-ink-faint">{ev.year}</span>
                      <Pill className="border-border-strong bg-surface-2 text-ink-soft">{meta.label}</Pill>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink">{ev.label}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        {rdProjects.length === 0 ? (
          <EmptyState
            icon={FlaskConical}
            title={stageFilter ? `No R&D projects observed at the ${stageFilter} stage.` : "No R&D projects observed."}
            hint="Try clearing the value-chain filter above."
          />
        ) : (
          <div className="space-y-3">
            {rdProjects.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-ink">{r.title}</div>
                  <Pill className="border-border-strong bg-surface-2 text-ink-soft">{r.projectType}</Pill>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{r.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-2xs text-ink-faint">
                  <Link href={`/organisations/${r.organisation}`} className="inline-flex items-center gap-1 text-data hover:text-data-soft">
                    {orgName(r.organisation)}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                  <span>{r.year}</span>
                  {r.fundingSource && <span>Funded by {r.fundingSource}</span>}
                  <Pill className="border-border-strong bg-surface-2 text-ink-soft">Maturity: {r.maturityEvidence}</Pill>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProfileSection>
  );
}
