"use client";
import { TECHNOLOGIES, MINERALS } from "@/lib/data";
import { Card, CardHeader, CardBody, SectionHeader, DemoBadge } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { TechnologyMapChart } from "@/components/technologies/technology-map-chart";
import { IndiaGlobalPanel } from "@/components/technologies/india-global-panel";

export default function TechnologyMapPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <SectionHeader
          eyebrow="Technology Landscape"
          title="Technology Map"
          subtitle="Maturity vs. research momentum across tracked technologies. Bubble size reflects total indexed evidence volume."
          action={<DemoBadge />}
        />
      </FadeIn>

      <Card>
        <CardHeader>
          <div>
            <h2 className="text-sm font-semibold text-ink">Maturity × momentum landscape</h2>
            <p className="mt-1 text-xs text-ink-soft">
              Colour indicates momentum — rising (success), stable (neutral) or declining (danger). Click a bubble
              to open its technology profile.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <TechnologyMapChart technologies={TECHNOLOGIES} minerals={MINERALS} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <h2 className="text-sm font-semibold text-ink">India vs Global evidence share</h2>
            <p className="mt-1 text-xs text-ink-soft">Relative share of publicly indexed evidence attributable to India across five activity dimensions.</p>
          </div>
        </CardHeader>
        <CardBody>
          <IndiaGlobalPanel />
        </CardBody>
      </Card>
    </div>
  );
}
