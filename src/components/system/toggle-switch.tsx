"use client";
import { cn } from "@/lib/utils";

/** Minimal accessible toggle switch, styled with semantic tokens only. */
export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none",
        checked ? "border-mineral/50 bg-mineral/25" : "border-border-strong bg-surface-3"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 translate-x-1 rounded-full bg-ink transition-transform",
          checked && "translate-x-5 bg-mineral"
        )}
      />
    </button>
  );
}
