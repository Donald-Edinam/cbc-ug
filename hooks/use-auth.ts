import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useApiClient } from "./use-api-client";
import type {
  AuthUser,
  RegisterInput,
  RegisterResponse,
  VerifyEmailResponse,
} from "@/lib/types";

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

export function useMe() {
  const api = useApiClient();
  return useQuery<AuthUser>({
    queryKey: ["me"],
    queryFn: () => api.get("/api/auth/me").then((r) => r.data),
  });
}

// ── POST /api/auth/register (interest form) ───────────────────────────────────

export interface InterestInput {
  name: string;
  email: string;
  university: string;
  programOfStudy: string;
  level: string;
linkedinGithub?: string;
}

export function useRegister() {
  return useMutation<{ message: string }, Error, InterestInput>({
    mutationFn: (input) =>
      apiClient.post("/api/auth/register", input).then((r) => r.data),
  });
}

// ── POST /api/auth/magic-link ─────────────────────────────────────────────────

export function useMagicLinkRequest() {
  return useMutation<{ message: string }, Error, { email: string }>({
    mutationFn: (input) =>
      apiClient.post("/api/auth/magic-link", input).then((r) => r.data),
  });
}

// ── GET /api/auth/verify-email?token= ────────────────────────────────────────

export function useVerifyEmail(token: string) {
  return useQuery<VerifyEmailResponse>({
    queryKey: ["verify-email", token],
    queryFn: () =>
      apiClient
        .get("/api/auth/verify-email", { params: { token } })
        .then((r) => r.data),
    enabled: Boolean(token),
    retry: false,
  });
}

// ── POST /api/auth/resend-verification ───────────────────────────────────────

export function useResendVerification() {
  const api = useApiClient();
  return useMutation<{ message: string }, Error, void>({
    mutationFn: () =>
      api.post("/api/auth/resend-verification").then((r) => r.data),
  });
}
