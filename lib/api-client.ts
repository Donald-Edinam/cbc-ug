import axios from "axios";
import type { AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Unauthenticated client — for public endpoints.
 */
export const apiClient = axios.create({ baseURL: BASE_URL });

type UpdateSession = (data: { accessToken: string; refreshToken: string }) => Promise<unknown>;

/**
 * Authenticated client with automatic token refresh on 401.
 * When a request fails with 401 it calls POST /api/auth/refresh,
 * updates the NextAuth session, then retries the original request.
 * Concurrent 401s are queued and flushed once the refresh resolves.
 */
export function createAuthClient(
  accessToken: string,
  refreshToken: string,
  updateSession: UpdateSession,
): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let isRefreshing = false;
  let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

  function flushQueue(err: unknown, token: string | null) {
    queue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
    queue = [];
  }

  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        const newAccess: string = data.accessToken;
        const newRefresh: string = data.refreshToken;

        await updateSession({ accessToken: newAccess, refreshToken: newRefresh });

        client.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        original.headers.Authorization = `Bearer ${newAccess}`;
        flushQueue(null, newAccess);
        return client(original);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        // Both tokens expired — send user back to login
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );

  return client;
}
