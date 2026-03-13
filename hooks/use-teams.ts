import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useApiClient } from "./use-api-client";
import { useSession } from "next-auth/react";
import type { Team, CreateTeamInput } from "@/lib/types";

const KEYS = {
  hackathonTeams: (hackathonId: string) =>
    ["teams", "hackathon", hackathonId] as const,
  team: (id: string) => ["teams", id] as const,
  invite: (id: string) => ["teams", id, "invite"] as const,
};

// ── GET /api/teams/hackathon/:hackathonId ────────────────────────────────────

export function useHackathonTeams(hackathonId: string) {
  return useQuery<Team[]>({
    queryKey: KEYS.hackathonTeams(hackathonId),
    queryFn: () =>
      apiClient
        .get(`/api/teams/hackathon/${hackathonId}`)
        .then((r) => r.data),
    enabled: Boolean(hackathonId),
  });
}

// ── GET /api/teams/:id ────────────────────────────────────────────────────────

export function useTeam(id: string) {
  return useQuery<Team>({
    queryKey: KEYS.team(id),
    queryFn: () => apiClient.get(`/api/teams/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });
}

// ── GET /api/teams/:id/invite ─────────────────────────────────────────────────

export function useTeamInviteCode(teamId: string) {
  const api = useApiClient();
  const { data: session } = useSession();
  return useQuery<{ inviteCode: string }>({
    queryKey: KEYS.invite(teamId),
    queryFn: () =>
      api.get(`/api/teams/${teamId}/invite`).then((r) => r.data),
    enabled: Boolean(teamId) && !!session?.user?.accessToken,
  });
}

// ── POST /api/teams/hackathon/:hackathonId ───────────────────────────────────

export function useCreateTeam(hackathonId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<Team, Error, CreateTeamInput>({
    mutationFn: (input) =>
      api
        .post(`/api/teams/hackathon/${hackathonId}`, input)
        .then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.hackathonTeams(hackathonId) }),
  });
}

// ── POST /api/teams/join ──────────────────────────────────────────────────────

export function useJoinTeam(hackathonId?: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<unknown, Error, { inviteCode: string }>({
    mutationFn: (input) =>
      api.post("/api/teams/join", input).then((r) => r.data),
    onSuccess: () => {
      if (hackathonId) {
        qc.invalidateQueries({ queryKey: KEYS.hackathonTeams(hackathonId) });
      }
    },
  });
}

// ── DELETE /api/teams/:id/leave ───────────────────────────────────────────────

export function useLeaveTeam(hackathonId?: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (teamId) =>
      api.delete(`/api/teams/${teamId}/leave`).then((r) => r.data),
    onSuccess: () => {
      if (hackathonId) {
        qc.invalidateQueries({ queryKey: KEYS.hackathonTeams(hackathonId) });
      }
    },
  });
}

// ── DELETE /api/teams/:teamId/members/:memberId ───────────────────────────────

export function useKickMember(teamId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (memberId) =>
      api
        .delete(`/api/teams/${teamId}/members/${memberId}`)
        .then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.team(teamId) }),
  });
}
