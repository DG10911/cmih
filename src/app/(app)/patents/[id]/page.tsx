import { notFound } from "next/navigation";
import { getPatent, PATENTS } from "@/lib/data";
import { PatentDetail } from "@/components/patents/patent-detail";

export function generateStaticParams() {
  return PATENTS.map((p) => ({ id: p.id }));
}

export default function PatentDetailPage({ params }: { params: { id: string } }) {
  const patent = getPatent(params.id);
  if (!patent) notFound();
  return <PatentDetail patent={patent} />;
}
