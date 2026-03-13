import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useApiClient } from "./use-api-client";
import type {
  Hackathon,
  JudgingCriteria,
  Score,
  Project,
  CreateCriteriaInput,
  SubmitScoreInput,
} from "@/lib/types";

const KEYS = {
  criteria: (hackathonId: string) =>
    ["judging", "criteria", hackathonId] as const,
  judgeAssignments: ["judging", "assignments"] as const,
  judgeProjects: (hackathonId: string) =>
    ["judging", "projects", hackathonId] as const,
  scores: (hackathonId: string) =>
    ["judging", "scores", hackathonId] as const,
};

// ── GET /api/hackathons/:id/criteria ──────────────────────────────────────────

export function useHackathonCriteria(hackathonId: string) {
  return useQuery<JudgingCriteria[]>({
    queryKey: KEYS.criteria(hackathonId),
    queryFn: () =>
      apiClient
        .get(`/api/hackathons/${hackathonId}/criteria`)
        .then((r) => r.data),
    enabled: Boolean(hackathonId),
  });
}

// ── POST /api/hackathons/:id/criteria ─────────────────────────────────────────

export function useCreateCriteria(hackathonId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<JudgingCriteria, Error, CreateCriteriaInput>({
    mutationFn: (input) =>
      api
        .post(`/api/hackathons/${hackathonId}/criteria`, input)
        .then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.criteria(hackathonId) }),
  });
}

// ── GET /api/judge/assignments ────────────────────────────────────────────────

export function useJudgeAssignments() {
  const api = useApiClient();
  return useQuery<Hackathon[]>({
    queryKey: KEYS.judgeAssignments,
    queryFn: () =>
      api.get("/api/judge/assignments").then((r) => r.data),
  });
}

// ── GET /api/judge/projects/:hackathonId ──────────────────────────────────────

export function useJudgeProjects(hackathonId: string) {
  const api = useApiClient();
  return useQuery<Project[]>({
    queryKey: KEYS.judgeProjects(hackathonId),
    queryFn: () =>
      api
        .get(`/api/judge/projects/${hackathonId}`)
        .then((r) => r.data),
    enabled: Boolean(hackathonId),
  });
}

// ── POST /api/scores ──────────────────────────────────────────────────────────

export function useSubmitScore(hackathonId?: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Score, Error, SubmitScoreInput>({
    mutationFn: (input) =>
      api.post("/api/scores", input).then((r) => r.data),
    onSuccess: () => {
      if (hackathonId) {
        qc.invalidateQueries({ queryKey: KEYS.judgeProjects(hackathonId) });
        qc.invalidateQueries({ queryKey: KEYS.scores(hackathonId) });
      }
    },
  });
}

// ── GET /api/hackathons/:id/scores ────────────────────────────────────────────

export function useHackathonScores(hackathonId: string) {
  const api = useApiClient();
  return useQuery<Score[]>({
    queryKey: KEYS.scores(hackathonId),
    queryFn: () =>
      api
        .get(`/api/hackathons/${hackathonId}/scores`)
        .then((r) => r.data),
    enabled: Boolean(hackathonId),
  });
}

// ── POST /api/admin/judges/:hackathonId ───────────────────────────────────────

export function useAssignJudge(hackathonId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<unknown, Error, { judgeId: string }>({
    mutationFn: (input) =>
      api
        .post(`/api/admin/judges/${hackathonId}`, input)
        .then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.judgeAssignments }),
  });
}
