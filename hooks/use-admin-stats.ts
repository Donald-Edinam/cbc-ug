import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { useSession } from "next-auth/react";
import type { AdminStats } from "@/lib/types";

export function useAdminStats() {
  const api = useApiClient();
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get<AdminStats>("/api/admin/stats");
      return data;
    },
    enabled: !!session?.user?.accessToken,
  });
}
