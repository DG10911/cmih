"use client";
import * as React from "react";
import { Search, X } from "lucide-react";
import { SectionHeader, EmptyState, Button } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { RDProjectCard } from "@/components/rd/rd-project-card";
import { RD_PROJECTS, orgName, mineralName, technologyName, VALUE_CHAIN_STAGES } from "@/lib/data";

const ALL = "All";

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values)).sort();
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1 text-2xs text-ink-faint">
      <span className="uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-border-strong bg-surface-2 px-2 text-xs text-ink outline-none focus-visible:border-data"
      >
        <option value={ALL}>All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function RDExplorerPage() {
  const [query, setQuery] = React.useState("");
  const [mineral, setMineral] = React.useState(ALL);
  const [technology, setTechnology] = React.useState(ALL);
  const [institution, setInstitution] = React.useState(ALL);
  const [year, setYear] = React.useState(ALL);
  const [projectType, setProjectType] = React.useState(ALL);
  const [stage, setStage] = React.useState(ALL);
  const [fundingSource, setFundingSource] = React.useState(ALL);

  const minerals = React.useMemo(() => unique(RD_PROJECTS.map((r) => mineralName(r.mineral))), []);
  const technologies = React.useMemo(() => unique(RD_PROJECTS.map((r) => technologyName(r.technology))), []);
  const institutions = React.useMemo(() => unique(RD_PROJECTS.map((r) => orgName(r.organisation))), []);
  const years = React.useMemo(() => unique(RD_PROJECTS.map((r) => String(r.year))).reverse(), []);
  const projectTypes = React.useMemo(() => unique(RD_PROJECTS.map((r) => r.projectType)), []);
  const stages = React.useMemo(
    () => VALUE_CHAIN_STAGES.filter((s) => RD_PROJECTS.some((r) => r.stage === s)),
    []
  );
  const fundingSources = React.useMemo(
    () => unique(RD_PROJECTS.map((r) => r.fundingSource).filter(Boolean) as string[]),
    []
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return RD_PROJECTS.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q)) return false;
      if (mineral !== ALL && mineralName(r.mineral) !== mineral) return false;
      if (technology !== ALL && technologyName(r.technology) !== technology) return false;
      if (institution !== ALL && orgName(r.organisation) !== institution) return false;
      if (year !== ALL && String(r.year) !== year) return false;
      if (projectType !== ALL && r.projectType !== projectType) return false;
      if (stage !== ALL && r.stage !== stage) return false;
      if (fundingSource !== ALL && r.fundingSource !== fundingSource) return false;
      return true;
    });
  }, [query, mineral, technology, institution, year, projectType, stage, fundingSource]);

  const hasActiveFilters =
    query !== "" ||
    [mineral, technology, institution, year, projectType, stage, fundingSource].some((v) => v !== ALL);

  function resetFilters() {
    setQuery("");
    setMineral(ALL);
    setTechnology(ALL);
    setInstitution(ALL);
    setYear(ALL);
    setProjectType(ALL);
    setStage(ALL);
    setFundingSource(ALL);
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <SectionHeader
          eyebrow="R&D Explorer"
          title="Research & Development Projects"
          subtitle="Funded projects, pilots, tech demonstrations and MoUs mapped across India's critical mineral value chain. Demonstration dataset."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search R&D projects by title…"
              className="h-9 flex-1 rounded-md border border-border-strong bg-surface-2 px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:border-data"
            />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-3.5 w-3.5" /> Clear filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            <Select label="Mineral" value={mineral} onChange={setMineral} options={minerals} />
            <Select label="Technology" value={technology} onChange={setTechnology} options={technologies} />
            <Select label="Institution" value={institution} onChange={setInstitution} options={institutions} />
            <Select label="Year" value={year} onChange={setYear} options={years} />
            <Select label="Project type" value={projectType} onChange={setProjectType} options={projectTypes} />
            <Select label="Value-chain stage" value={stage} onChange={setStage} options={stages} />
            <Select label="Funding source" value={fundingSource} onChange={setFundingSource} options={fundingSources} />
          </div>
        </div>
      </FadeIn>

      <div className="text-2xs text-ink-faint">
        Showing {filtered.length} of {RD_PROJECTS.length} R&D projects
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No R&D projects match these filters."
          hint="Try clearing a filter or broadening your search term."
          actions={[{ label: "Clear filters", onClick: resetFilters }]}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <StaggerItem key={project.id}>
              <RDProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
