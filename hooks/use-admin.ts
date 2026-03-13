import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { useSession } from "next-auth/react";
import type {
  Hackathon,
  AdminUser,
  Announcement,
  Role,
  CreateAnnouncementInput,
} from "@/lib/types";

const KEYS = {
  hackathons: ["admin", "hackathons"] as const,
  users: ["admin", "users"] as const,
};

// ── GET /api/admin/hackathons ─────────────────────────────────────────────────

export function useAdminHackathons() {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<Hackathon[]>({
    queryKey: KEYS.hackathons,
    queryFn: () => api.get("/api/admin/hackathons").then((r) => r.data),
    enabled: !!session?.user?.accessToken,
  });
}

// ── GET /api/admin/users ──────────────────────────────────────────────────────

export function useAdminUsers() {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<AdminUser[]>({
    queryKey: KEYS.users,
    queryFn: () => api.get("/api/admin/users").then((r) => r.data),
    enabled: !!session?.user?.accessToken,
  });
}

// ── PATCH /api/admin/users/:id/role ──────────────────────────────────────────

export function useUpdateUserRole() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<AdminUser, Error, { userId: string; role: Role }>({
    mutationFn: ({ userId, role }) =>
      api
        .patch(`/api/admin/users/${userId}/role`, { role })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.users }),
  });
}

// ── POST /api/admin/announcements ─────────────────────────────────────────────

export function useCreateAnnouncement() {
  const api = useApiClient();
  return useMutation<Announcement, Error, CreateAnnouncementInput>({
    mutationFn: (input) =>
      api.post("/api/admin/announcements", input).then((r) => r.data),
  });
}

// ── POST /api/admin/hackathons/:id/publish-results ────────────────────────────

export function usePublishResults() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (hackathonId) =>
      api
        .post(`/api/admin/hackathons/${hackathonId}/publish-results`)
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.hackathons });
      qc.invalidateQueries({ queryKey: ["hackathons"] });
    },
  });
}
