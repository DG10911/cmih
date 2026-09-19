import * as React from "react";
import { SectionHeader } from "@/components/ui";
import { FadeIn } from "@/components/motion";

/** Consistent anchor-scrollable section wrapper for the mineral profile. */
export function ProfileSection({
  id,
  eyebrow,
  title,
  subtitle,
  action,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <FadeIn>
      <section id={id} className="scroll-mt-24 border-t border-border pt-8 first:mt-0 first:border-t-0 first:pt-0">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} />
        {children}
      </section>
    </FadeIn>
  );
}
