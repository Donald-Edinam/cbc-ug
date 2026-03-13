import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useApiClient } from "./use-api-client";
import type {
  Hackathon,
  HackathonDetail,
  HackathonStatus,
  RankedProject,
  CreateHackathonInput,
  UpdateHackathonInput,
} from "@/lib/types";

const KEYS = {
  all: ["hackathons"] as const,
  detail: (id: string) => ["hackathons", id] as const,
  rankings: (id: string) => ["hackathons", id, "rankings"] as const,
};

// ── GET /api/hackathons ───────────────────────────────────────────────────────

export function useHackathons() {
  return useQuery<Hackathon[]>({
    queryKey: KEYS.all,
    queryFn: () => apiClient.get("/api/hackathons").then((r) => r.data),
    retry: false
  });
}

// ── GET /api/hackathons/:id ───────────────────────────────────────────────────

export function useHackathon(id: string) {
  return useQuery<HackathonDetail>({
    queryKey: KEYS.detail(id),
    queryFn: () => apiClient.get(`/api/hackathons/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });
}

// ── GET /api/hackathons/:id/rankings ─────────────────────────────────────────

export function useHackathonRankings(id: string) {
  return useQuery<RankedProject[]>({
    queryKey: KEYS.rankings(id),
    queryFn: () =>
      apiClient.get(`/api/hackathons/${id}/rankings`).then((r) => r.data),
    enabled: Boolean(id),
  });
}

// ── POST /api/hackathons ──────────────────────────────────────────────────────

export function useCreateHackathon() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Hackathon, Error, CreateHackathonInput>({
    mutationFn: (input) =>
      api.post("/api/hackathons", input).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

// ── PUT /api/hackathons/:id ───────────────────────────────────────────────────

export function useUpdateHackathon() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Hackathon, Error, { id: string; input: UpdateHackathonInput }>({
    mutationFn: ({ id, input }) =>
      api.put(`/api/hackathons/${id}`, input).then((r) => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      qc.invalidateQueries({ queryKey: KEYS.detail(id) });
    },
  });
}

// ── PATCH /api/hackathons/:id/status ─────────────────────────────────────────

export function useUpdateHackathonStatus() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Hackathon, Error, { id: string; status: HackathonStatus }>({
    mutationFn: ({ id, status }) =>
      api.patch(`/api/hackathons/${id}/status`, { status }).then((r) => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      qc.invalidateQueries({ queryKey: KEYS.detail(id) });
    },
  });
}

// ── DELETE /api/hackathons/:id ────────────────────────────────────────────────

export function useDeleteHackathon() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) =>
      api.delete(`/api/hackathons/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
