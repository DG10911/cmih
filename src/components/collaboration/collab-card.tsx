"use client";
import * as React from "react";
import Link from "next/link";
import { Plus, FlaskConical } from "lucide-react";
import { Card, CardBody, Button, Pill, MeterBar, EvidenceBadge } from "@/components/ui";
import { EvidenceDrawer } from "@/components/intelligence/evidence-drawer";
import { orgName, mineralName } from "@/lib/data";
import type { CollaborationSignal } from "@/lib/types";

function OrgBlock({ orgId, strength }: { orgId: string; strength: string }) {
  return (
    <div className="min-w-0 flex-1">
      <Link href={`/organisations/${orgId}`} className="text-sm font-semibold text-ink hover:text-data">
        {orgName(orgId)}
      </Link>
      <p className="mt-0.5 text-xs leading-snug text-ink-soft">{strength}</p>
    </div>
  );
}

/**
 * Potential complementary capability signal card (spec §34). Deliberately
 * evidence-first phrasing — never "should collaborate", only a signal.
 */
export function CollabCard({ signal }: { signal: CollaborationSignal }) {
  const [evidenceOpen, setEvidenceOpen] = React.useState(false);

  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Pill className="border-mineral/40 bg-mineral/10 text-mineral">
            <Link href={`/minerals/${signal.mineral}`} className="hover:underline">
              {mineralName(signal.mineral)}
            </Link>
          </Pill>
          <EvidenceBadge count={signal.evidenceIds.length} />
        </div>

        <div className="flex items-center gap-3">
          <OrgBlock orgId={signal.orgA} strength={signal.strengthA} />
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-data/40 bg-data/10 text-data">
            <Plus className="h-3.5 w-3.5" />
          </span>
          <OrgBlock orgId={signal.orgB} strength={signal.strengthB} />
        </div>

        <MeterBar
          value={signal.complementarity}
          label="Complementarity"
          valueLabel={signal.complementarity.toFixed(2)}
          tone="data"
        />

        <p className="text-xs leading-relaxed text-ink-soft">{signal.rationale}</p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-2xs text-ink-faint">Potential complementary capability signal — not a recommendation.</span>
          <Button variant="outline" size="sm" onClick={() => setEvidenceOpen(true)}>
            <FlaskConical className="h-3.5 w-3.5" /> View evidence
          </Button>
        </div>
      </CardBody>

      <EvidenceDrawer
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceIds={signal.evidenceIds}
        title={`Evidence — ${orgName(signal.orgA)} × ${orgName(signal.orgB)}`}
      />
    </Card>
  );
}
