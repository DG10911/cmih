"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "value-chain", label: "Value Chain" },
  { id: "technologies", label: "Technology Landscape" },
  { id: "trends", label: "Technology Trends" },
  { id: "patents", label: "Patent Activity" },
  { id: "rd", label: "R&D Activity" },
  { id: "organisations", label: "Leading Organisations" },
  { id: "emerging", label: "Emerging Technologies" },
  { id: "gaps", label: "Gap Signals" },
  { id: "collaboration", label: "Collaboration" },
  { id: "evidence", label: "Evidence" },
];

/** Sticky in-page anchor navigation for the mineral profile (desktop only). */
export function SectionNav() {
  const [active, setActive] = React.useState<string>(ITEMS[0].id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );
    ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Profile section navigation" className="hidden lg:block">
      <div className="sticky top-6 space-y-0.5 border-l border-border pl-4">
        <div className="mb-2 pl-3 text-2xs font-medium uppercase tracking-wider text-ink-faint">On this page</div>
        {ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "-ml-4 block border-l-2 py-1.5 pl-3 text-xs transition-colors",
              active === item.id
                ? "border-mineral font-medium text-mineral"
                : "border-transparent text-ink-faint hover:text-ink-soft"
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
