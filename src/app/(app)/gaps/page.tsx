import { SectionHeader } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { GapsExplorer } from "@/components/gaps/gaps-explorer";
import { WhiteSpace } from "@/components/gaps/white-space";

export default function GapsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Gap Intelligence"
        title="Critical Mineral Technology Capability Gap Signals"
        subtitle="These are potential signals derived from indexed patent, R&D and publication evidence — not definitive conclusions about what India does or doesn't have. Every card surfaces its confidence, evidence sufficiency and data limitations so it can be read critically."
      />

      <FadeIn>
        <GapsExplorer />
      </FadeIn>

      <FadeIn delay={0.08}>
        <WhiteSpace />
      </FadeIn>
    </div>
  );
}
