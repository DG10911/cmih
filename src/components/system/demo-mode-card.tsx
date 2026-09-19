"use client";
import { FlaskConical } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { ToggleSwitch } from "./toggle-switch";

/** Demo Mode explainer + display-only toggle (spec §76). */
export function DemoModeCard({ enabled, onToggle }: { enabled: boolean; onToggle: (v: boolean) => void }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <div className="text-sm font-semibold text-ink">Demo Mode</div>
          <p className="mt-0.5 text-2xs text-ink-soft">Deterministic synthetic dataset</p>
        </div>
        <FlaskConical className="h-4 w-4 text-mineral" />
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-2/60 px-3 py-2.5">
          <span className="text-sm text-ink">Demo Mode enabled</span>
          <ToggleSwitch checked={enabled} onChange={onToggle} label="Demo mode" />
        </div>
        <p className="text-2xs leading-relaxed text-ink-faint">
          KhanijDrishti runs entirely on deterministic, synthetic data. This switch is display-only — every screen
          in this prototype uses the same demo dataset regardless of its position, and never implies live
          government or connector connectivity. Production deployment requires authorised source connectors.
        </p>
      </CardBody>
    </Card>
  );
}
