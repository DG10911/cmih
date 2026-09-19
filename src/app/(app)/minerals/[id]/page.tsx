import { notFound } from "next/navigation";
import { MINERALS, getMineral } from "@/lib/data";
import { MineralProfile } from "@/components/minerals/mineral-profile";

export function generateStaticParams() {
  return MINERALS.map((m) => ({ id: m.id }));
}

export default function MineralProfilePage({ params }: { params: { id: string } }) {
  const mineral = getMineral(params.id);
  if (!mineral) notFound();

  return <MineralProfile id={params.id} />;
}
