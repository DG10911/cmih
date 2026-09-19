import type { Alert } from "./types";

/** Example seeded alerts (spec §44) so the screen never starts fully empty. */
export const SEED_ALERTS: Alert[] = [
  {
    id: "seed-1",
    mineralId: "lithium",
    technologyId: "direct-lithium-extraction",
    triggers: ["New patent family", "Technology momentum change"],
    frequency: "Weekly",
    createdAt: "2026-08-01",
  },
  {
    id: "seed-2",
    mineralId: "ree",
    technologyId: "magnet-recycling",
    triggers: ["R&D activity increase"],
    frequency: "Monthly",
    createdAt: "2026-08-10",
  },
  {
    id: "seed-3",
    mineralId: "cobalt",
    technologyId: "all",
    triggers: ["New patent family"],
    frequency: "Daily",
    createdAt: "2026-09-05",
  },
];
