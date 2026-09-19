"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CornerDownLeft, Gem, Cpu, FileText, FlaskConical, Building2, ArrowRight } from "lucide-react";
import { NAV_FLAT } from "./nav";
import { search, type SearchResult } from "@/lib/data";
import { cn } from "@/lib/utils";

const KIND_ICON = {
  Mineral: Gem,
  Technology: Cpu,
  Patent: FileText,
  "R&D": FlaskConical,
  Publication: FileText,
  Organisation: Building2,
} as const;

interface Command {
  label: string;
  href: string;
  hint: string;
}

/** Global ⌘K command palette (spec §65). */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands: Command[] = React.useMemo(
    () => [
      ...NAV_FLAT.map((n) => ({ label: `Go to ${n.label}`, href: n.href, hint: "Navigate" })),
      { label: "Open Lithium", href: "/minerals/lithium", hint: "Mineral" },
      { label: "Open Rare Earth Elements", href: "/minerals/ree", hint: "Mineral" },
      { label: "Generate Intelligence Brief", href: "/policy-briefs", hint: "Action" },
    ],
    []
  );

  const searchResults: SearchResult[] = React.useMemo(() => (query ? search(query).slice(0, 8) : []), [query]);
  const filteredCommands = React.useMemo(
    () => (query ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : commands.slice(0, 7)),
    [commands, query]
  );

  type Row = { type: "command"; data: Command } | { type: "result"; data: SearchResult };
  const rows: Row[] = React.useMemo(
    () => [
      ...filteredCommands.map<Row>((c) => ({ type: "command", data: c })),
      ...searchResults.map<Row>((r) => ({ type: "result", data: r })),
    ],
    [filteredCommands, searchResults]
  );

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  React.useEffect(() => setActive(0), [query]);

  const go = React.useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, router]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[active];
      if (row) go(row.type === "command" ? row.data.href : row.data.href);
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-card border border-border-strong bg-surface shadow-elevated"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 text-ink-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search minerals, technologies, patents, organisations, researchers…"
                className="h-12 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <kbd className="rounded border border-border-strong px-1.5 py-0.5 font-mono text-2xs text-ink-faint">ESC</kbd>
            </div>
            <div className="max-h-[46vh] overflow-y-auto p-2">
              {rows.length === 0 && <div className="px-3 py-6 text-center text-sm text-ink-faint">No matches.</div>}
              {rows.map((row, i) => {
                const isActive = i === active;
                if (row.type === "command") {
                  return (
                    <button
                      key={`c-${row.data.href}-${i}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(row.data.href)}
                      className={cn("flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm", isActive ? "bg-surface-3 text-ink" : "text-ink-soft")}
                    >
                      <span className="flex items-center gap-2.5">
                        <ArrowRight className="h-3.5 w-3.5 text-ink-faint" />
                        {row.data.label}
                      </span>
                      <span className="font-mono text-2xs text-ink-faint">{row.data.hint}</span>
                    </button>
                  );
                }
                const Icon = KIND_ICON[row.data.kind];
                return (
                  <button
                    key={`r-${row.data.id}-${i}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(row.data.href)}
                    className={cn("flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left", isActive ? "bg-surface-3" : "")}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-data" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink">{row.data.title}</span>
                      <span className="block truncate text-2xs text-ink-faint">{row.data.subtitle}</span>
                    </span>
                    <span className="font-mono text-2xs text-ink-faint">{row.data.kind}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-2xs text-ink-faint">
              <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> select</span>
              <span>↑↓ navigate</span>
              <span className="ml-auto font-mono">KhanijDrishti</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
