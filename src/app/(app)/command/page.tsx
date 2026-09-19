"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardBody, SectionHeader, DemoBadge } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { APP_META } from "@/lib/data";
import { KpiGrid } from "@/components/command/kpi-grid";
import { ActivityTimelineChart } from "@/components/command/activity-timeline-chart";
import { MineralHeatmap } from "@/components/command/mineral-heatmap";
import { EmergingPanel } from "@/components/command/emerging-panel";
import { GapSignalsPanel } from "@/components/command/gap-signals-panel";
import { LeadersPanel } from "@/components/command/leaders-panel";

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-2xs font-medium text-ink-soft transition-colors hover:text-mineral"
    >
      {label}
      <ArrowRight className="h-3 w-3" />
    </Link>
  );
}

/**
 * Command Center — the flagship intelligence dashboard (spec §20-22).
 * Frontend-only: composed entirely from @/lib/data demo records.
 */
export default function CommandCenterPage() {
  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-mono text-2xs uppercase tracking-[0.18em] text-mineral">
              Critical Mineral Technology Intelligence
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Command Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-soft">
              Evidence-backed intelligence for India&apos;s critical mineral ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DemoBadge />
            <span className="font-mono text-2xs text-ink-faint">Updated {APP_META.updated}</span>
          </div>
        </div>
      </FadeIn>

      <Stagger className="space-y-8">
        <StaggerItem>
          <KpiGrid />
        </StaggerItem>

        <StaggerItem>
          <Card>
            <CardHeader>
              <SectionHeader
                eyebrow="Trend"
                title="Technology Activity Timeline"
                subtitle="Platform-wide patent, R&D and publication activity, 2016–2026 (DEMO series)."
                action={<ViewAllLink href="/technology-map" label="Technology map" />}
              />
            </CardHeader>
            <CardBody>
              <ActivityTimelineChart />
            </CardBody>
          </Card>
        </StaggerItem>

        <div className="grid gap-6 lg:grid-cols-12">
          <StaggerItem className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <SectionHeader
                  eyebrow="Coverage"
                  title="Critical Mineral Heatmap"
                  subtitle="Activity intensity by mineral and value-chain stage."
                  action={<ViewAllLink href="/minerals" label="All minerals" />}
                />
              </CardHeader>
              <CardBody>
                <MineralHeatmap />
              </CardBody>
            </Card>
          </StaggerItem>

          <StaggerItem className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <SectionHeader
                  eyebrow="Signals"
                  title="Emerging Technology Radar"
                  subtitle="Top technologies by composite emerging-score."
                  action={<ViewAllLink href="/emerging" label="Full radar" />}
                />
              </CardHeader>
              <CardBody>
                <EmergingPanel />
              </CardBody>
            </Card>
          </StaggerItem>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <StaggerItem className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <SectionHeader
                  eyebrow="Signals"
                  title="Potential Gap Signals"
                  subtitle="Heuristic capability-gap indicators for analyst review — not confirmed conclusions."
                  action={<ViewAllLink href="/gaps" label="All signals" />}
                />
              </CardHeader>
              <CardBody>
                <GapSignalsPanel />
              </CardBody>
            </Card>
          </StaggerItem>

          <StaggerItem className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <SectionHeader
                  eyebrow="Ecosystem"
                  title="Leading Organisations"
                  subtitle="Ranked by patent-family volume."
                  action={<ViewAllLink href="/organisations" label="All organisations" />}
                />
              </CardHeader>
              <CardBody>
                <LeadersPanel />
              </CardBody>
            </Card>
          </StaggerItem>
        </div>
      </Stagger>
    </div>
  );
}
