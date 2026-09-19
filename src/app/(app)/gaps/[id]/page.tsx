import { notFound } from "next/navigation";
import { GAP_SIGNALS, getGapSignal } from "@/lib/data";
import { GapDetail } from "@/components/gaps/gap-detail";

export function generateStaticParams() {
  return GAP_SIGNALS.map((g) => ({ id: g.id }));
}

export default function GapDetailPage({ params }: { params: { id: string } }) {
  const signal = getGapSignal(params.id);
  if (!signal) notFound();

  return <GapDetail signal={signal} />;
}
