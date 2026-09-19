"use client";
import * as React from "react";
import { FileText, BookOpen, FlaskConical, Factory, Repeat2, Handshake, FlaskConicalOff } from "lucide-react";
import { Card, Button, EmptyState } from "@/components/ui";
import { EvidenceDrawer } from "@/components/intelligence/evidence-drawer";
import { PROTOTYPE_DISCLAIMER } from "@/lib/data";
import { ProfileSection } from "./section-shell";
import type { Evidence, EvidenceType } from "@/lib/types";

const TYPE_META: Record<EvidenceType, { icon: typeof FileText; label: string }> = {
  patent: { icon: FileText, label: "Patents" },
  publication: { icon: BookOpen, label: "Publications" },
  rd_project: { icon: FlaskConical, label: "R&D Projects" },
  pilot: { icon: Factory, label: "Pilot Plants" },
  tech_transfer: { icon: Repeat2, label: "Tech Transfers" },
  mou: { icon: Handshake, label: "MoUs" },
};

/** Section 11 — Evidence: summary + drawer over all evidence records for this mineral. */
export function EvidenceSection({ mineralName, evidence }: { mineralName: string; evidence: Evidence[] }) {
  const [open, setOpen] = React.useState(false);

  const counts = React.useMemo(() => {
    const map = new Map<EvidenceType, number>();
    evidence.forEach((e) => map.set(e.type, (map.get(e.type) ?? 0) + 1));
    return map;
  }, [evidence]);

  return (
    <ProfileSection
      id="evidence"
      eyebrow="Section 11"
      title="Evidence"
      subtitle="Every intelligence signal above is traceable to these underlying records."
    >
      {evidence.length === 0 ? (
        <EmptyState icon={FlaskConicalOff} title="No evidence records linked to this mineral." />
      ) : (
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(Object.keys(TYPE_META) as EvidenceType[])
              .filter((t) => counts.get(t))
              .map((t) => {
                const meta = TYPE_META[t];
                const Icon = meta.icon;
                return (
                  <div key={t} className="flex items-center gap-2 rounded-md border border-border bg-surface-2/60 px-2.5 py-2">
                    <Icon className="h-4 w-4 shrink-0 text-data" />
                    <div className="leading-tight">
                      <div className="font-mono text-sm font-semibold tabular-nums text-ink">{counts.get(t)}</div>
                      <div className="text-2xs text-ink-faint">{meta.label}</div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <p className="max-w-2xl text-2xs leading-relaxed text-ink-faint">
              {evidence.length} evidence records support the {mineralName} intelligence above. Records shown across
              this platform are synthetic / demo data for prototype purposes — {PROTOTYPE_DISCLAIMER.toLowerCase()}
            </p>
            <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
              View evidence
            </Button>
          </div>
        </Card>
      )}

      <EvidenceDrawer
        open={open}
        onClose={() => setOpen(false)}
        evidenceIds={evidence.map((e) => e.id)}
        title={`${mineralName} — Supporting Evidence`}
      />
    </ProfileSection>
  );
}
