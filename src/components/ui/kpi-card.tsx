"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Animated count-up number (spec §55). Respects reduced-motion. */
export function CountUp({ value, format }: { value: number; format?: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(reduce ? value : 0);

  React.useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);

  return <>{format ? format(display) : Math.round(display).toLocaleString("en-IN")}</>;
}

interface KpiCardProps {
  label: string;
  value: number;
  format?: (n: number) => string;
  delta?: string;
  hint?: string;
  icon?: LucideIcon;
  demo?: boolean;
  className?: string;
}

export function KpiCard({ label, value, format, delta, hint, icon: Icon, demo, className }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group relative overflow-hidden rounded-card border border-border bg-surface p-4 transition-colors hover:border-border-strong", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xs font-medium uppercase tracking-wider text-ink-faint">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-ink-faint transition-colors group-hover:text-mineral" />}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-ink">
        <CountUp value={value} format={format} />
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        {delta && <span className="text-2xs font-medium text-success">{delta}</span>}
        {hint && <span className="text-2xs text-ink-faint">{hint}</span>}
        {demo && <span className="font-mono text-2xs uppercase tracking-wider text-mineral/80">demo</span>}
      </div>
    </motion.div>
  );
}
