import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { apiClient, createAuthClient } from "@/lib/api-client";
import type { AxiosInstance } from "axios";

/**
 * Returns an axios instance that carries the current session's access token.
 * Falls back to the public (unauthenticated) client when there is no session.
 */
export function useApiClient(): AxiosInstance {
  const { data: session } = useSession();
  return useMemo(
    () =>
      session?.user?.accessToken
        ? createAuthClient(session.user.accessToken)
        : apiClient,
    [session?.user?.accessToken],
  );
}
