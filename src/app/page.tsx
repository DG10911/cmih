"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Map, Gem, FileText, FlaskConical, Radar, TriangleAlert, Network, ShieldCheck } from "lucide-react";
import { APP_META } from "@/lib/data/constants";
import { NetworkHero } from "@/components/landing/network-hero";

const PILLARS = [
  { icon: Gem, label: "30 Critical Minerals" },
  { icon: FileText, label: "Patent Intelligence" },
  { icon: FlaskConical, label: "R&D Intelligence" },
  { icon: Map, label: "Technology Mapping" },
  { icon: Radar, label: "Emerging Technology Radar" },
  { icon: TriangleAlert, label: "Capability Gap Signals" },
  { icon: Network, label: "Evidence Graph" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <NetworkHero />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mineral/40 to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-mineral/40 bg-mineral/10 font-mono text-sm font-bold text-mineral">कृ</span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">KhanijDrishti</div>
              <div className="font-mono text-2xs text-ink-faint">{APP_META.hindi}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-mineral/30 bg-mineral/10 px-2.5 py-1 font-mono text-2xs uppercase tracking-wider text-mineral sm:inline-flex">
              {APP_META.version}
            </span>
            <Link href="/command" className="inline-flex items-center gap-1.5 rounded-md bg-mineral px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-mineral-soft">
              Launch Platform <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-2xs text-ink-soft backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-data" />
              CMiH 2026 · PS2 — Smart Technology & Patent Tracker for Critical Minerals
            </div>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              See the Mineral.
              <br />
              <span className="text-mineral">Map the Technology.</span>
              <br />
              Find the Gap.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              An evidence-backed intelligence platform for India&apos;s critical mineral technology ecosystem —
              turning fragmented patents, R&amp;D and publications into traceable, decision-ready intelligence.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/command" className="inline-flex items-center gap-2 rounded-md bg-mineral px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-mineral-soft">
                Explore Intelligence <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/technology-map" className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface/60 px-5 py-2.5 text-sm font-medium text-ink backdrop-blur transition-colors hover:border-data/50">
                <Map className="h-4 w-4 text-data" /> View Technology Map
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-16 flex flex-wrap gap-x-6 gap-y-3">
            {PILLARS.map((p) => (
              <div key={p.label} className="flex items-center gap-2 text-sm text-ink-soft">
                <p.icon className="h-4 w-4 text-mineral/80" />
                {p.label}
              </div>
            ))}
          </motion.div>
        </main>

        <footer className="border-t border-border py-5 text-2xs text-ink-faint">
          {APP_META.description} · Evidence-backed prototype intelligence · Demonstration environment — data shown is synthetic for prototype evaluation.
        </footer>
      </div>
    </div>
  );
}
