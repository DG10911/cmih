"use client";
import * as React from "react";
import { Pencil, Trash2, Bell } from "lucide-react";
import { Card, CardBody, Pill } from "@/components/ui";
import { mineralName, technologyName } from "@/lib/data";
import type { Alert } from "./types";

export function AlertCard({ alert, onEdit, onDelete }: { alert: Alert; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Bell className="h-4 w-4 text-mineral" />
              {mineralName(alert.mineralId)}
              {alert.technologyId !== "all" && <span className="text-ink-soft">· {technologyName(alert.technologyId)}</span>}
            </div>
            <div className="mt-0.5 text-2xs text-ink-faint">
              Created {alert.createdAt} · {alert.frequency}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              aria-label="Edit alert"
              className="rounded-md p-1.5 text-ink-faint hover:bg-surface-2 hover:text-ink"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              aria-label="Delete alert"
              className="rounded-md p-1.5 text-ink-faint hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {alert.triggers.map((t) => (
            <Pill key={t} className="border-data/30 bg-data/10 text-data">
              {t}
            </Pill>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
