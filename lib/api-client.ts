import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Unauthenticated client — for public endpoints.
 */
export const apiClient = axios.create({ baseURL: BASE_URL });

/**
 * Returns an axios instance with the given Bearer token pre-set.
 * Used by `useApiClient()` so every authed hook gets a fresh client
 * whenever the session token changes.
 */
export function createAuthClient(accessToken: string) {
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
