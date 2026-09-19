import * as React from "react";
import { FlaskConical, Rocket, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GapSignal } from "@/lib/types";

/**
 * Shared gapType → tone/icon/copy mapping so the card grid and detail page
 * render identical visual language for the three signal categories.
 * Reminder: these are POTENTIAL SIGNALS derived from evidence, never
 * definitive conclusions (spec golden rule §1).
 */
export const GAP_TYPE_META: Record<
  GapSignal["gapType"],
  { icon: React.ComponentType<{ className?: string }>; tone: string; blurb: string }
> = {
  "Research Gap": {
    icon: FlaskConical,
    tone: "border-data/40 bg-data/10 text-data",
    blurb: "Sparse research evidence relative to global attention.",
  },
  "Technology Opportunity": {
    icon: Rocket,
    tone: "border-mineral/40 bg-mineral/10 text-mineral",
    blurb: "Rising global momentum with room for domestic entry.",
  },
  "Strategic Capability Gap": {
    icon: ShieldAlert,
    tone: "border-danger/40 bg-danger/10 text-danger",
    blurb: "High strategic need paired with limited domestic capability.",
  },
};

export function GapTypeBadge({ gapType, className }: { gapType: GapSignal["gapType"]; className?: string }) {
  const meta = GAP_TYPE_META[gapType];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-semibold",
        meta.tone,
        className
      )}
      title={meta.blurb}
    >
      <Icon className="h-3.5 w-3.5" />
      {gapType}
    </span>
  );
}
