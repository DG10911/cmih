"use client";
import * as React from "react";
import { SectionHeader } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { ProfileCard, type UserRole } from "@/components/system/profile-card";
import { DemoModeCard } from "@/components/system/demo-mode-card";
import { PreferencesCard } from "@/components/system/preferences-card";
import { EnvironmentInfoCard } from "@/components/system/environment-info-card";

export default function SettingsPage() {
  const [role, setRole] = React.useState<UserRole>("Analyst");
  const [demoMode, setDemoMode] = React.useState(true);

  return (
    <div className="space-y-6">
      <FadeIn>
        <SectionHeader
          eyebrow="Settings"
          title="Profile & Environment"
          subtitle="Session preferences for this demo. Nothing on this screen persists beyond your browser tab."
        />
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FadeIn delay={0.05}>
          <ProfileCard
            name="Demo User"
            email="pulkitmlk11@gmail.com"
            role={role}
            onRoleChange={setRole}
          />
        </FadeIn>
        <FadeIn delay={0.08}>
          <DemoModeCard enabled={demoMode} onToggle={setDemoMode} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <PreferencesCard />
        </FadeIn>
        <FadeIn delay={0.12}>
          <EnvironmentInfoCard />
        </FadeIn>
      </div>
    </div>
  );
}
