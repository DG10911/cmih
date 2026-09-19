import { Bot, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";

const STEPS = [
  { label: "AI Classification", icon: Bot },
  { label: "Human Validation", icon: UserCheck },
  { label: "Verified Knowledge", icon: ShieldCheck },
] as const;

/** Small visual flow header for the human-in-the-loop review queue (spec §14). */
export function ClassificationFlowHeader() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border border-border bg-surface-2/60 px-4 py-3">
      {STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-2.5 py-1 text-2xs font-medium text-ink-soft">
            <step.icon className="h-3.5 w-3.5 text-mineral" />
            {step.label}
          </span>
          {i < STEPS.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-ink-faint" />}
        </div>
      ))}
      <span className="ml-1 text-2xs text-ink-faint">
        Every correction you make here becomes training feedback for the next classification pass.
      </span>
    </div>
  );
}
