"use client";
import { UserCircle2, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardBody, Pill } from "@/components/ui";

export type UserRole = "Viewer" | "Researcher" | "Analyst" | "Administrator";

export const ROLES: { role: UserRole; description: string }[] = [
  { role: "Viewer", description: "Read-only access to dashboards, evidence and briefs." },
  { role: "Researcher", description: "Adds Viewer access plus the classification review queue." },
  { role: "Analyst", description: "Adds saved views, gap-signal exports and collaboration notes." },
  { role: "Administrator", description: "Full access, including source connector and taxonomy configuration." },
];

/** Demo profile card with a local role selector (spec §76). */
export function ProfileCard({
  name,
  email,
  role,
  onRoleChange,
}: {
  name: string;
  email: string;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}) {
  const active = ROLES.find((r) => r.role === role) ?? ROLES[2];
  return (
    <Card>
      <CardHeader>
        <div>
          <div className="text-sm font-semibold text-ink">Profile</div>
          <p className="mt-0.5 text-2xs text-ink-soft">Demo identity for this session</p>
        </div>
        <Pill className="border-mineral/40 bg-mineral/10 text-mineral">Demo User</Pill>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center gap-3">
          <UserCircle2 className="h-10 w-10 shrink-0 text-ink-faint" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink">{name}</div>
            <div className="truncate text-2xs text-ink-faint">{email}</div>
          </div>
        </div>

        <div>
          <label className="flex flex-col gap-1.5 text-2xs text-ink-faint">
            <span className="uppercase tracking-wider">Role</span>
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="h-9 rounded-md border border-border-strong bg-surface-2 px-2 text-sm text-ink outline-none focus-visible:border-data"
            >
              {ROLES.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.role}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 flex items-start gap-1.5 text-2xs leading-relaxed text-ink-faint">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-data" />
            {active.description} All roles currently see the same demo dataset — this selector is role-ready
            authorization scaffolding for when access control is wired to a real identity provider.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
