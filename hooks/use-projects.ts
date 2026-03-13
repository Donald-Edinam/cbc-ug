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

// ── GET /api/hackathons/:hackathonId/projects ─────────────────────────────────

export function useHackathonProjects(hackathonId: string) {
  const api = useApiClient();
  return useQuery<Project[]>({
    queryKey: KEYS.hackathonProjects(hackathonId),
    queryFn: () =>
      api
        .get(`/api/hackathons/${hackathonId}/projects`)
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

// ── GET /api/teams/:teamId/project ────────────────────────────────────────────

export function useTeamProject(teamId: string) {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<Project>({
    queryKey: KEYS.teamProject(teamId),
    queryFn: () =>
      api.get(`/api/teams/${teamId}/project`).then((r) => r.data),
    enabled: Boolean(teamId) && !!session?.user?.accessToken,
    retry: false,
  });
}

// ── POST /api/teams/:teamId/project ──────────────────────────────────────────

export function useUpsertProject(teamId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Project, Error, UpsertProjectInput>({
    mutationFn: (input) =>
      api.post(`/api/teams/${teamId}/project`, input).then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.teamProject(teamId) }),
  });
}

// ── POST /api/teams/:teamId/project/submit ────────────────────────────────────

export function useSubmitProject(teamId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Project, Error, void>({
    mutationFn: () =>
      api
        .post(`/api/teams/${teamId}/project/submit`)
        .then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.teamProject(teamId) }),
  });
}
