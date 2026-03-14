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
  announcements: (hackathonId?: string) => ["admin", "announcements", hackathonId ?? "all"] as const,
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

// ── GET /api/admin/users?role=PARTICIPANT,JUDGE,ORGANIZER ─────────────────────

export function useAdminUsersByRole(roles: string[]) {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<AdminUser[]>({
    queryKey: [...KEYS.users, roles],
    queryFn: () =>
      api.get(`/api/admin/users?role=${roles.join(",")}`).then((r) => r.data.users ?? r.data),
    enabled: !!session?.user?.accessToken && roles.length > 0,
  });
}

// ── GET /api/admin/users (paginated) ─────────────────────────────────────────

export interface AdminUsersPage {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export function useAdminUsersPaginated(params: { page: number; limit: number; search: string; role: string }) {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<AdminUsersPage>({
    queryKey: [...KEYS.users, "paginated", params],
    queryFn: () => {
      const p = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
      if (params.search) p.set("search", params.search);
      if (params.role) p.set("role", params.role);
      return api.get(`/api/admin/users?${p.toString()}`).then((r) => r.data);
    },
    enabled: !!session?.user?.accessToken,
    placeholderData: (prev) => prev,
  });
}

// ── GET /api/admin/users/counts ───────────────────────────────────────────────

export function useAdminUserCounts() {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<Record<string, number>>({
    queryKey: [...KEYS.users, "counts"],
    queryFn: () => api.get("/api/admin/users/counts").then((r) => r.data),
    enabled: !!session?.user?.accessToken,
  });
}

// ── POST /api/admin/judges ────────────────────────────────────────────────────

export function useCreateJudge() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<{ id: string; name: string; email: string }, Error, { name: string; email: string }>({
    mutationFn: (input) => api.post("/api/admin/judges", input).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.users }),
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

// ── GET /api/admin/announcements ─────────────────────────────────────────────

export function useAdminAnnouncements(hackathonId?: string) {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<Announcement[]>({
    queryKey: KEYS.announcements(hackathonId),
    queryFn: () =>
      api
        .get("/api/admin/announcements", { params: hackathonId ? { hackathonId } : {} })
        .then((r) => r.data),
    enabled: !!session?.user?.accessToken,
  });
}

// ── POST /api/admin/announcements ─────────────────────────────────────────────

export function useCreateAnnouncement(hackathonId?: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Announcement, Error, CreateAnnouncementInput>({
    mutationFn: (input) =>
      api.post("/api/admin/announcements", input).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.announcements(hackathonId) });
      // Also invalidate the public hackathon detail so the participant view refreshes
      qc.invalidateQueries({ queryKey: ["hackathons"] });
    },
  });
}

// ── DELETE /api/admin/announcements/:id ───────────────────────────────────────

export function useDeleteAnnouncement(hackathonId?: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) =>
      api.delete(`/api/admin/announcements/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.announcements(hackathonId) });
      qc.invalidateQueries({ queryKey: ["hackathons"] });
    },
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
