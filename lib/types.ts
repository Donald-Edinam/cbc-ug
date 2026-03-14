// ─── Enums ───────────────────────────────────────────────────────────────────

export type Role = "PARTICIPANT" | "JUDGE" | "ORGANIZER" | "ADMIN";
export type HackathonStatus = "DRAFT" | "REGISTRATION_OPEN" | "IN_PROGRESS" | "JUDGING" | "COMPLETED";
export type TeamRole = "LEADER" | "MEMBER";

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  studentId: string | null;
  department: string | null;
  university: string | null;
  programOfStudy: string | null;
  level: string | null;
  linkedinGithub: string | null;
  emailVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
  studentId?: string;
  department?: string;
}

export interface RegisterResponse extends AuthTokens {
  user: Pick<AuthUser, "id" | "email" | "name" | "role" | "emailVerified">;
}

export interface VerifyEmailResponse extends AuthTokens {
  user: Pick<AuthUser, "id" | "email" | "name" | "role" | "emailVerified">;
}

// ─── Hackathon ────────────────────────────────────────────────────────────────

export interface Hackathon {
  id: string;
  title: string;
  theme: string;
  description: string;
  bannerUrl: string | null;
  prizes: string | null;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  submissionDeadline: string;
  maxTeamSize: number;
  minTeamSize: number;
  status: HackathonStatus;
  createdAt?: string;
  _count?: { teams: number };
}

export interface HackathonDetail extends Hackathon {
  criteria: JudgingCriteria[];
  announcements: Announcement[];
  _count: { teams: number };
}

export interface CreateHackathonInput {
  title: string;
  theme: string;
  description: string;
  bannerUrl?: string | null;
  prizes?: string | null;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  submissionDeadline: string;
  maxTeamSize?: number;
  minTeamSize?: number;
}

export type UpdateHackathonInput = Partial<CreateHackathonInput> & {
  status?: HackathonStatus;
};

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface TeamMemberUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  department?: string | null;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt?: string;
  user: TeamMemberUser;
}

export interface Team {
  id: string;
  hackathonId: string;
  name: string;
  description: string | null;
  inviteCode?: string;
  createdById?: string;
  createdAt?: string;
  members: TeamMember[];
  _count: { members: number };
  project?: { id: string; title: string; description: string | null; repoUrl: string | null; demoUrl: string | null; submittedAt: string | null } | null;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface ProjectScore {
  id: string;
  score: number;
  feedback: string | null;
  criteria: JudgingCriteria;
  judge: { name: string };
}

export interface Project {
  id: string;
  teamId: string;
  hackathonId: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  presentationUrl: string | null;
  mediaUrls: string[];
  submittedAt: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  team?: { name: string; hackathon?: { title: string } };
  scores?: ProjectScore[];
}

export interface UpsertProjectInput {
  title: string;
  description: string;
  techStack?: string[];
  repoUrl?: string | null;
  demoUrl?: string | null;
  videoUrl?: string | null;
  presentationUrl?: string | null;
  mediaUrls?: string[];
}

// ─── Judging ──────────────────────────────────────────────────────────────────

export interface JudgingCriteria {
  id: string;
  hackathonId: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface CreateCriteriaInput {
  name: string;
  description: string;
  maxScore?: number;
  weight?: number;
}

export interface Score {
  id: string;
  judgeId: string;
  projectId: string;
  criteriaId: string;
  score: number;
  feedback: string | null;
  submittedAt: string;
  updatedAt: string;
  judge?: { name: string };
  project?: { title: string; team: { name: string } };
  criteria?: { name: string };
}

export interface SubmitScoreInput {
  projectId: string;
  criteriaId: string;
  score: number;
  feedback?: string;
}

export interface RankedProject {
  rank: number;
  projectId: string;
  teamName: string;
  title: string;
  finalScore: number;
  judgeCount: number;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  studentId: string | null;
  department: string | null;
  createdAt: string;
}

export interface AdminDashboardHackathon {
  id: string;
  title: string;
  status: HackathonStatus;
  endDate: string;
  _count: { teams: number };
}

export interface AdminStats {
  hackathons: {
    total: number;
    trend: number;
  };
  users: {
    total: number;
    trend: number;
  };
  projects: {
    total: number;
    trend: number;
  };
  judgedProjects: {
    total: number;
    trend: number;
  };
  recentHackathons: AdminDashboardHackathon[];
}

export type AnnouncementTarget = "ALL" | "TEAM";

export interface Announcement {
  id: string;
  hackathonId: string;
  title: string;
  body: string;
  targetType: AnnouncementTarget;
  targetTeamId: string | null;
  sentViaEmail: boolean;
  createdAt: string;
}

export interface CreateAnnouncementInput {
  hackathonId: string;
  title: string;
  body: string;
  targetType?: AnnouncementTarget;
  targetTeamId?: string;
  sendEmail?: boolean;
}
