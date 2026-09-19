"use client";
import * as React from "react";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui";
import { EvidenceDrawer } from "@/components/intelligence/evidence-drawer";

/** "Evidence summary" trigger opening the shared EvidenceDrawer for an organisation. */
export function OrgEvidenceSummaryButton({ evidenceIds }: { evidenceIds: string[] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <FileSearch className="h-3.5 w-3.5" /> Evidence summary
      </Button>
      <EvidenceDrawer open={open} onClose={() => setOpen(false)} evidenceIds={evidenceIds} title="Organisation Evidence Summary" />
    </>
  );
}
