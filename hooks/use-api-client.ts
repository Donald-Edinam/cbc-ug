import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { apiClient, createAuthClient } from "@/lib/api-client";
import type { AxiosInstance } from "axios";

/**
 * Returns an authenticated axios instance that automatically refreshes the
 * access token on 401 and updates the NextAuth session with the new tokens.
 * Falls back to the public client when there is no session.
 */
export function useApiClient(): AxiosInstance {
  const { data: session, update } = useSession();

  return useMemo(
    () => {
      if (!session?.user?.accessToken) return apiClient;
      return createAuthClient(
        session.user.accessToken,
        session.user.refreshToken ?? "",
        (tokens) => update(tokens),
      );
    },
    // Re-create only when the access token changes (after a refresh the session updates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.user?.accessToken],
  );
}
