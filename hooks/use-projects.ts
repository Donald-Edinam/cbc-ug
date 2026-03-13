import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useApiClient } from "./use-api-client";
import { useSession } from "next-auth/react";
import type { Project, UpsertProjectInput } from "@/lib/types";

const KEYS = {
  hackathonProjects: (hackathonId: string) =>
    ["projects", "hackathon", hackathonId] as const,
  teamProject: (teamId: string) => ["projects", "team", teamId] as const,
  public: ["projects", "public"] as const,
};

// ── GET /api/projects/hackathon/:hackathonId ─────────────────────────────────

export function useHackathonProjects(hackathonId: string) {
  const api = useApiClient();
  return useQuery<Project[]>({
    queryKey: KEYS.hackathonProjects(hackathonId),
    queryFn: () =>
      api
        .get(`/api/projects/hackathon/${hackathonId}`)
        .then((r) => r.data),
    enabled: Boolean(hackathonId),
  });
}

// ── GET /api/projects/public ──────────────────────────────────────────────────

export function usePublicProjects() {
  return useQuery<Project[]>({
    queryKey: KEYS.public,
    queryFn: () => apiClient.get("/api/projects/public").then((r) => r.data),
  });
}

// ── GET /api/projects/teams/:teamId ────────────────────────────────────────────

export function useTeamProject(teamId: string) {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<Project>({
    queryKey: KEYS.teamProject(teamId),
    queryFn: () =>
      api.get(`/api/projects/teams/${teamId}`).then((r) => r.data),
    enabled: Boolean(teamId) && !!session?.user?.accessToken,
    retry: false,
  });
}

// ── POST /api/projects/teams/:teamId ──────────────────────────────────────────

export function useUpsertProject(teamId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Project, Error, UpsertProjectInput>({
    mutationFn: (input) =>
      api.post(`/api/projects/teams/${teamId}`, input).then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.teamProject(teamId) }),
  });
}

// ── POST /api/projects/teams/:teamId/submit ────────────────────────────────────

export function useSubmitProject(teamId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Project, Error, void>({
    mutationFn: () =>
      api
        .post(`/api/projects/teams/${teamId}/submit`)
        .then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.teamProject(teamId) }),
  });
}
