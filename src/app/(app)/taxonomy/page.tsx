import { SectionHeader, DemoBadge } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { ValueChainStrip } from "@/components/system/value-chain-strip";
import { MineralTaxonomyCard } from "@/components/system/mineral-taxonomy-card";
import { TechnologyTaxonomyTable } from "@/components/system/technology-taxonomy-table";
import { MINERALS, TECHNOLOGIES, VALUE_CHAIN_STAGES } from "@/lib/data";

export default function TaxonomyPage() {
  return (
    <div className="space-y-8">
      <FadeIn>
        <SectionHeader
          eyebrow="Taxonomy Manager"
          title="Minerals, Technologies & Value Chain"
          subtitle={`The ${MINERALS.length}-mineral taxonomy, ${TECHNOLOGIES.length} tracked technologies and ${VALUE_CHAIN_STAGES.length}-stage value chain are configured from \`@/lib/data\` — every classification in the platform is driven by this reference, not hardcoded per screen.`}
          action={<DemoBadge />}
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div>
          <SectionHeader eyebrow="Configured Sequence" title="Value Chain Stages" className="mb-3" />
          <ValueChainStrip />
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <SectionHeader
          eyebrow={`${MINERALS.length} minerals`}
          title="Mineral Taxonomy"
          subtitle="Symbol, category, aliases and covered value-chain stages, as configured in the mineral registry."
          className="mb-3"
        />
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MINERALS.map((m) => (
            <StaggerItem key={m.id}>
              <MineralTaxonomyCard mineral={m} />
            </StaggerItem>
          ))}
        </Stagger>
      </FadeIn>

      <FadeIn delay={0.15}>
        <SectionHeader
          eyebrow={`${TECHNOLOGIES.length} technologies`}
          title="Technology Taxonomy"
          subtitle="Each technology's mineral coverage, value-chain stages, maturity stage and current research momentum."
          className="mb-3"
        />
        <TechnologyTaxonomyTable technologies={TECHNOLOGIES} />
      </FadeIn>
    </div>
  );
}
