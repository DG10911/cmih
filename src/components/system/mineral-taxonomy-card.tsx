"use client";
import * as React from "react";
import { Plus } from "lucide-react";
import { Card, CardBody, Pill } from "@/components/ui";
import type { Mineral } from "@/lib/types";

/**
 * Mineral reference card for the Taxonomy Manager (spec §11). The "add
 * alias" affordance is a read-only prototype: it appends to local component
 * state only and never touches `@/lib/data` — refreshing the page resets it.
 */
export function MineralTaxonomyCard({ mineral }: { mineral: Mineral }) {
  const [draftAliases, setDraftAliases] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  const [adding, setAdding] = React.useState(false);

  function submitAlias(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setDraftAliases((prev) => [...prev, value]);
    setInput("");
    setAdding(false);
  }

  return (
    <Card className="flex h-full flex-col">
      <CardBody className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-mineral/30 bg-mineral/10 font-mono text-sm font-semibold text-mineral">
              {mineral.symbol}
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-ink">{mineral.name}</div>
              <div className="mt-0.5 text-2xs text-ink-faint">{mineral.category}</div>
            </div>
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">{mineral.summary}</p>

        <div>
          <div className="mb-1.5 text-2xs uppercase tracking-wider text-ink-faint">Aliases</div>
          <div className="flex flex-wrap gap-1.5">
            {mineral.aliases.map((a) => (
              <Pill key={a} className="border-border-strong bg-surface-2 text-ink-soft">
                {a}
              </Pill>
            ))}
            {draftAliases.map((a) => (
              <Pill key={a} className="border-mineral/40 bg-mineral/10 text-mineral" title="Not persisted — prototype only">
                {a}
              </Pill>
            ))}
            {adding ? (
              <form onSubmit={submitAlias} className="inline-flex items-center gap-1">
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onBlur={() => !input && setAdding(false)}
                  placeholder="new alias…"
                  className="h-6 w-24 rounded-full border border-border-strong bg-surface-2 px-2 text-2xs text-ink outline-none focus-visible:border-data"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-border-strong px-2 py-0.5 text-2xs text-ink-faint transition-colors hover:border-data/50 hover:text-ink"
              >
                <Plus className="h-3 w-3" /> Add alias
              </button>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-1.5 text-2xs uppercase tracking-wider text-ink-faint">Covered stages</div>
          <div className="flex flex-wrap gap-1.5">
            {mineral.stages.map((s) => (
              <Pill key={s} className="border-data/30 bg-data/10 text-data">
                {s}
              </Pill>
            ))}
          </div>
        </div>

        {draftAliases.length > 0 && (
          <p className="text-2xs leading-relaxed text-ink-faint">
            Prototype only — added aliases are held in this browser tab and are not written back to the taxonomy.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
