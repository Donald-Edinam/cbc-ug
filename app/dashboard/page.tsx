"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users, Plus, LogIn, Copy, Check, ChevronRight,
  CalendarDays, Clock, LogOut, Loader2, AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type HackathonStatus = "REGISTRATION_OPEN" | "IN_PROGRESS" | "JUDGING" | "COMPLETED";

interface Hackathon {
  id: string;
  title: string;
  theme: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxTeamSize: number;
  minTeamSize: number;
  status: HackathonStatus;
}

interface TeamMember {
  id: string;
  role: "LEADER" | "MEMBER";
  user: { id: string; name: string; avatarUrl: string | null };
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  _count: { members: number };
  members: TeamMember[];
}

const STATUS_LABEL: Record<HackathonStatus, string> = {
  REGISTRATION_OPEN: "Registration Open",
  IN_PROGRESS: "In Progress",
  JUDGING: "Judging",
  COMPLETED: "Completed",
};

const STATUS_COLOR: Record<HackathonStatus, { bg: string; color: string }> = {
  REGISTRATION_OPEN: { bg: "#e8f4e8", color: "#4a6940" },
  IN_PROGRESS: { bg: "#fef3e8", color: "#b45c1a" },
  JUDGING: { bg: "#f0edf8", color: "#6b50a8" },
  COMPLETED: { bg: "var(--sand)", color: "var(--earth)" },
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [activeHackathon, setActiveHackathon] = useState<Hackathon | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Create team state
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Join team state
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`${API_URL}/api/hackathons`)
      .then((r) => r.json())
      .then((data: Hackathon[]) => {
        setHackathons(data);
        const active =
          data.find((h) => h.status === "REGISTRATION_OPEN") ??
          data.find((h) => h.status === "IN_PROGRESS") ??
          data[0] ?? null;
        setActiveHackathon(active);
      })
      .finally(() => setLoadingHackathons(false));
  }, [status]);

  useEffect(() => {
    if (!activeHackathon) return;
    setLoadingTeams(true);
    fetch(`${API_URL}/api/hackathons/${activeHackathon.id}/teams`)
      .then((r) => r.json())
      .then((data: Team[]) => {
        setTeams(data);
        const mine = data.find((t) =>
          t.members.some((m) => m.user.id === session?.user?.id)
        ) ?? null;
        setMyTeam(mine);
      })
      .finally(() => setLoadingTeams(false));
  }, [activeHackathon, session?.user?.id]);

  // Fetch invite code for my team
  useEffect(() => {
    if (!myTeam || !session?.user?.accessToken) return;
    fetch(`${API_URL}/api/teams/${myTeam.id}/invite`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.inviteCode) setInviteCode(d.inviteCode); });
  }, [myTeam, session?.user?.accessToken]);

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!activeHackathon || !session?.user?.accessToken) return;
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch(`${API_URL}/api/hackathons/${activeHackathon.id}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ name: createName, description: createDesc }),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error ?? "Could not create team."); return; }
      // Refresh teams
      const teamsRes = await fetch(`${API_URL}/api/hackathons/${activeHackathon.id}/teams`);
      const teamsData = await teamsRes.json();
      setTeams(teamsData);
      setMyTeam(teamsData.find((t: Team) => t.members.some((m) => m.user.id === session.user.id)) ?? null);
      setShowCreate(false);
      setCreateName("");
      setCreateDesc("");
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.accessToken) return;
    setJoining(true);
    setJoinError("");
    try {
      const res = await fetch(`${API_URL}/api/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ inviteCode: joinCode }),
      });
      const data = await res.json();
      if (!res.ok) { setJoinError(data.error ?? "Could not join team."); return; }
      // Refresh teams
      if (!activeHackathon) return;
      const teamsRes = await fetch(`${API_URL}/api/hackathons/${activeHackathon.id}/teams`);
      const teamsData = await teamsRes.json();
      setTeams(teamsData);
      setMyTeam(teamsData.find((t: Team) => t.members.some((m) => m.user.id === session.user.id)) ?? null);
      setShowJoin(false);
      setJoinCode("");
    } finally {
      setJoining(false);
    }
  }

  function copyInvite() {
    navigator.clipboard.writeText(inviteCode);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  }

  if (status === "loading" || loadingHackathons) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 border-b"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-bold tracking-wider shrink-0"
            style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            CBC
          </div>
          <span className="text-[0.82rem] font-semibold hidden sm:block"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Claude Builders&apos; Club
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.8rem] hidden sm:block" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            {session?.user?.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 text-[0.78rem] font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-[1.75rem] font-semibold leading-tight mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Welcome back, {session?.user?.name?.split(" ")[0]}.
          </h1>
          <p className="text-[0.9rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            {myTeam
              ? `You're on team "${myTeam.name}" — ready to build.`
              : "Join or create a team to get started."}
          </p>
        </div>

        {/* No hackathons */}
        {!activeHackathon && (
          <div
            className="rounded-2xl border px-8 py-10 text-center"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
          >
            <p className="text-[0.95rem] font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              No active hackathons
            </p>
            <p className="text-[0.85rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
              Check back soon — the next one is on its way.
            </p>
          </div>
        )}

        {activeHackathon && (
          <div className="flex flex-col gap-5">
            {/* Hackathon card */}
            <div
              className="rounded-2xl border px-6 py-5"
              style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                <h2 className="text-[1.1rem] font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {activeHackathon.title}
                </h2>
                <span
                  className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-full shrink-0"
                  style={{ ...STATUS_COLOR[activeHackathon.status], fontFamily: "var(--font-display)" }}
                >
                  {STATUS_LABEL[activeHackathon.status]}
                </span>
              </div>
              <p className="text-[0.83rem] mb-4" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                {activeHackathon.theme}
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1.5 text-[0.78rem]"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                  <CalendarDays size={13} strokeWidth={1.8} />
                  {fmt(activeHackathon.startDate)} — {fmt(activeHackathon.endDate)}
                </span>
                <span className="flex items-center gap-1.5 text-[0.78rem]"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                  <Clock size={13} strokeWidth={1.8} />
                  Registration closes {fmt(activeHackathon.registrationDeadline)}
                </span>
                <span className="flex items-center gap-1.5 text-[0.78rem]"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                  <Users size={13} strokeWidth={1.8} />
                  {activeHackathon.minTeamSize}–{activeHackathon.maxTeamSize} members per team
                </span>
              </div>
            </div>

            {/* My team */}
            {myTeam && (
              <div
                className="rounded-2xl border px-6 py-5"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-wider mb-0.5"
                      style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                      Your Team
                    </p>
                    <h3 className="text-[1.05rem] font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                      {myTeam.name}
                    </h3>
                    {myTeam.description && (
                      <p className="text-[0.83rem] mt-0.5" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                        {myTeam.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[0.75rem] font-medium px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}>
                    {myTeam._count.members} / {activeHackathon.maxTeamSize}
                  </span>
                </div>

                {/* Members */}
                <div className="flex flex-col gap-2 mb-5">
                  {myTeam.members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[0.65rem] font-bold shrink-0"
                          style={{ background: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
                        >
                          {m.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[0.85rem]"
                          style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }}>
                          {m.user.name}
                          {m.user.id === session?.user?.id && (
                            <span className="ml-1.5 text-[0.72rem]" style={{ color: "var(--earth)" }}>(you)</span>
                          )}
                        </span>
                      </div>
                      <span className="text-[0.72rem] font-medium"
                        style={{ color: m.role === "LEADER" ? "var(--claude-tan)" : "var(--earth)", fontFamily: "var(--font-display)" }}>
                        {m.role === "LEADER" ? "Leader" : "Member"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Invite code */}
                {inviteCode && (
                  <div
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: "var(--cream)", border: "1px solid var(--sand)" }}
                  >
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                        Invite code
                      </p>
                      <p className="text-[0.88rem] font-mono" style={{ color: "var(--ink)" }}>
                        {inviteCode}
                      </p>
                    </div>
                    <button
                      onClick={copyInvite}
                      className="flex items-center gap-1.5 text-[0.78rem] font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: copiedInvite ? "#e8f4e8" : "var(--sand)",
                        color: copiedInvite ? "#4a6940" : "var(--ink)",
                        border: "none", cursor: "pointer",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {copiedInvite ? <Check size={13} /> : <Copy size={13} />}
                      {copiedInvite ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* No team — create / join */}
            {!myTeam && (
              <div
                className="rounded-2xl border px-6 py-6"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
              >
                <p className="text-[0.9rem] font-semibold mb-1"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  You&apos;re not in a team yet
                </p>
                <p className="text-[0.83rem] mb-5"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                  Create a new team or join one with an invite code.
                </p>

                <div className="flex flex-wrap gap-3 mb-5">
                  <button
                    onClick={() => { setShowCreate(true); setShowJoin(false); }}
                    className="flex items-center gap-2 text-[0.83rem] font-semibold px-4 py-2.5 rounded-xl transition-all"
                    style={{
                      background: showCreate ? "var(--ink)" : "var(--sand)",
                      color: showCreate ? "var(--cream)" : "var(--ink)",
                      border: "none", cursor: "pointer",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <Plus size={14} /> Create team
                  </button>
                  <button
                    onClick={() => { setShowJoin(true); setShowCreate(false); }}
                    className="flex items-center gap-2 text-[0.83rem] font-semibold px-4 py-2.5 rounded-xl transition-all"
                    style={{
                      background: showJoin ? "var(--ink)" : "var(--sand)",
                      color: showJoin ? "var(--cream)" : "var(--ink)",
                      border: "none", cursor: "pointer",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <LogIn size={14} /> Join with code
                  </button>
                </div>

                {/* Create form */}
                {showCreate && (
                  <form onSubmit={handleCreateTeam} className="flex flex-col gap-3 pt-3 border-t" style={{ borderColor: "var(--sand)" }}>
                    {createError && (
                      <div className="flex items-center gap-2 text-[0.82rem] px-3 py-2.5 rounded-xl"
                        style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}>
                        <AlertCircle size={13} className="shrink-0" />
                        {createError}
                      </div>
                    )}
                    <Input
                      id="team-name"
                      label="Team name"
                      required
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="e.g. Byte Brigade"
                    />
                    <Input
                      id="team-desc"
                      label="Description (optional)"
                      value={createDesc}
                      onChange={(e) => setCreateDesc(e.target.value)}
                      placeholder="What are you building?"
                    />
                    <Button type="submit" loading={creating} loadingText="Creating…">
                      Create team
                    </Button>
                  </form>
                )}

                {/* Join form */}
                {showJoin && (
                  <form onSubmit={handleJoinTeam} className="flex flex-col gap-3 pt-3 border-t" style={{ borderColor: "var(--sand)" }}>
                    {joinError && (
                      <div className="flex items-center gap-2 text-[0.82rem] px-3 py-2.5 rounded-xl"
                        style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}>
                        <AlertCircle size={13} className="shrink-0" />
                        {joinError}
                      </div>
                    )}
                    <Input
                      id="invite-code"
                      label="Invite code"
                      required
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Paste the invite code here"
                    />
                    <Button type="submit" loading={joining} loadingText="Joining…">
                      Join team
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* All teams */}
            <div>
              <h3 className="text-[0.78rem] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                All teams ({teams.length})
              </h3>

              {loadingTeams ? (
                <div className="flex items-center gap-2 py-4 text-[0.85rem]"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                  <Loader2 size={14} className="animate-spin" />
                  Loading teams…
                </div>
              ) : teams.length === 0 ? (
                <div
                  className="rounded-2xl border px-6 py-6 text-center"
                  style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
                >
                  <p className="text-[0.88rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                    No teams yet — be the first to create one.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {teams.map((team) => {
                    const isMyTeam = team.id === myTeam?.id;
                    const full = team._count.members >= activeHackathon.maxTeamSize;
                    return (
                      <div
                        key={team.id}
                        className="flex items-center justify-between rounded-xl border px-5 py-4"
                        style={{
                          background: isMyTeam ? "var(--tag-ai-bg)" : "var(--warm-white)",
                          borderColor: isMyTeam ? "var(--claude-tan)" : "var(--sand)",
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[0.9rem] font-semibold"
                              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                              {team.name}
                            </span>
                            {isMyTeam && (
                              <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}>
                                your team
                              </span>
                            )}
                          </div>
                          {team.description && (
                            <p className="text-[0.8rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                              {team.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <span className="flex items-center gap-1.5 text-[0.75rem]"
                            style={{ color: full ? "var(--earth)" : "var(--ink)", fontFamily: "var(--font-display)" }}>
                            <Users size={12} strokeWidth={1.8} />
                            {team._count.members}/{activeHackathon.maxTeamSize}
                          </span>
                          {!isMyTeam && (
                            <ChevronRight size={14} style={{ color: "var(--earth)" }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
