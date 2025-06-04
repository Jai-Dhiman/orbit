import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "../../../apps/server/convex/_generated/api";
import { HealthStatus } from "../api/healthApi"; // Adjust path as needed

const healthQueryKeys = {
  all: ["health"] as const,
  status: () => [...healthQueryKeys.all, "status"] as const,
};

export const useGetHealth = () => {
  const convex = useConvex();
  return useQuery<HealthStatus, Error>({
    queryKey: healthQueryKeys.status(),
    queryFn: () => convex.query(api.health.getHealth),
  });
};
