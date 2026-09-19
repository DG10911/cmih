"use client";
import * as React from "react";
import { BellPlus } from "lucide-react";
import { SectionHeader, EmptyState, Button } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { AlertForm, type AlertDraft } from "./alert-form";
import { AlertCard } from "./alert-card";
import { SEED_ALERTS } from "./seed";
import type { Alert } from "./types";

let nextAlertSeq = SEED_ALERTS.length + 1;

/** Top-level Alerts screen (spec §44) — local, in-memory alert management. */
export function AlertsManager() {
  const [alerts, setAlerts] = React.useState<Alert[]>(SEED_ALERTS);
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const editingAlert = alerts.find((a) => a.id === editingId);

  function handleCreate(data: AlertDraft) {
    setAlerts((prev) => [
      { ...data, id: `alert-${nextAlertSeq++}`, createdAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setShowForm(false);
  }

  function handleUpdate(data: AlertDraft) {
    if (!editingId) return;
    setAlerts((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...data } : a)));
    setEditingId(null);
  }

  function handleDelete(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  const formOpen = showForm || !!editingAlert;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Alerts"
        title="Technology & Patent Alerts"
        subtitle="Get notified on new patent families, R&D activity increases, or technology momentum changes for the minerals and technologies you track."
        action={
          !formOpen && (
            <Button
              variant="primary"
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
              }}
            >
              <BellPlus className="h-4 w-4" /> Create Alert
            </Button>
          )
        }
      />

      {showForm && !editingAlert && <AlertForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      {editingAlert && <AlertForm initial={editingAlert} onSubmit={handleUpdate} onCancel={() => setEditingId(null)} />}

      {alerts.length === 0 ? (
        <EmptyState
          icon={BellPlus}
          title="No alerts yet."
          hint="Create an alert to get notified about new evidence for a mineral or technology."
          actions={[{ label: "Create Alert", onClick: () => setShowForm(true) }]}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alerts.map((a) => (
            <StaggerItem key={a.id}>
              <AlertCard
                alert={a}
                onEdit={() => {
                  setShowForm(false);
                  setEditingId(a.id);
                }}
                onDelete={() => handleDelete(a.id)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
