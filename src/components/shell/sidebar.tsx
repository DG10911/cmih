"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { NAV } from "./nav";
import { APP_META } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link href="/command" className="flex items-center gap-2.5 px-4 py-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-md border border-mineral/40 bg-mineral/10 font-mono text-sm font-bold text-mineral">
        कृ
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight text-ink">KhanijDrishti</span>
        <span className="block font-mono text-2xs text-ink-faint">{APP_META.hindi}</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 overflow-y-auto px-2 pb-4">
      {NAV.map((group) => (
        <div key={group.heading} className="mb-4">
          <div className="px-3 pb-1.5 pt-2 font-mono text-2xs uppercase tracking-[0.18em] text-ink-faint">
            {group.heading}
          </div>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== "/command" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-surface-3 font-medium text-ink"
                        : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-mineral" : "text-ink-faint group-hover:text-ink-soft")} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function BottomStatus() {
  return (
    <div className="border-t border-border px-4 py-3">
      <div className="flex items-center gap-2 text-2xs">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-mineral" />
        <span className="text-ink-soft">{APP_META.environment}</span>
      </div>
      <div className="mt-1 font-mono text-2xs text-ink-faint">{APP_META.version} · Updated {APP_META.updated}</div>
    </div>
  );
}

/** Desktop persistent sidebar. */
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface/60 lg:flex">
      <Brand />
      <NavLinks />
      <BottomStatus />
    </aside>
  );
}

/** Mobile slide-in sidebar. */
export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.26 }}
            className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-surface"
          >
            <div className="flex items-center justify-between pr-2">
              <Brand />
              <button onClick={onClose} className="rounded-md p-1.5 text-ink-faint hover:bg-surface-2 hover:text-ink" aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavLinks onNavigate={onClose} />
            <BottomStatus />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
