import { TECHNOLOGIES, MINERALS } from "@/lib/data";
import { TechnologyExplorer } from "@/components/technologies/technology-explorer";

export default function TechnologiesPage() {
  return <TechnologyExplorer technologies={TECHNOLOGIES} minerals={MINERALS} />;
}
