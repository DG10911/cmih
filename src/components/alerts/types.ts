export type AlertTrigger = "New patent family" | "R&D activity increase" | "Technology momentum change";
export type AlertFrequency = "Daily" | "Weekly" | "Monthly";

export interface Alert {
  id: string;
  mineralId: string;
  /** "all" or a specific technology id, scoped to the selected mineral. */
  technologyId: string;
  triggers: AlertTrigger[];
  frequency: AlertFrequency;
  createdAt: string;
}
