import { Info } from "lucide-react";
import { Card, CardHeader, CardBody, Stat } from "@/components/ui";
import { APP_META, PROTOTYPE_DISCLAIMER } from "@/lib/data";

/** Environment info block (spec §76). */
export function EnvironmentInfoCard() {
  return (
    <Card>
      <CardHeader>
        <div>
          <div className="text-sm font-semibold text-ink">Environment</div>
          <p className="mt-0.5 text-2xs text-ink-soft">Build & deployment info</p>
        </div>
        <Info className="h-4 w-4 text-ink-faint" />
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Version" value={APP_META.version} />
          <Stat label="Environment" value={APP_META.environment} />
          <Stat label="Last updated" value={APP_META.updated} />
        </div>
        <p className="text-2xs leading-relaxed text-ink-faint">{PROTOTYPE_DISCLAIMER}</p>
      </CardBody>
    </Card>
  );
}
