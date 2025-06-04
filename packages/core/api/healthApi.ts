import { ConvexReactClient } from "convex/react";
import { api } from "../../../apps/server/convex/_generated/api";

export type HealthStatus = {
  status: string;
  timestamp: string;
};

// Conceptual representation
export const healthApi = {
  getHealth: async (convex: ConvexReactClient): Promise<HealthStatus> => {
    return await convex.query(api.health.getHealth);
  },
};
