"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users, Plus, LogIn, Copy, Check, ChevronRight,
  CalendarDays, Clock, Loader2, AlertCircle, FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHackathons } from "@/hooks/use-hackathons";
import { useHackathonTeams, useCreateTeam, useJoinTeam, useTeamInviteCode } from "@/hooks/use-teams";
import type { HackathonStatus } from "@/lib/types";

const STATUS_LABEL: Record<HackathonStatus, string> = {
  DRAFT: "Draft",
  REGISTRATION_OPEN: "Registration Open",
  IN_PROGRESS: "In Progress",
  JUDGING: "Judging",
  COMPLETED: "Completed",
};

const STATUS_COLOR: Record<HackathonStatus, { bg: string; color: string }> = {
  DRAFT:             { bg: "var(--sand)",  color: "var(--earth)"   },
  REGISTRATION_OPEN: { bg: "#e8f4e8",      color: "#4a6940"        },
  IN_PROGRESS:       { bg: "#fef3e8",      color: "#b45c1a"        },
  JUDGING:           { bg: "#f0edf8",      color: "#6b50a8"        },
  COMPLETED:         { bg: "var(--sand)",  color: "var(--earth)"   },
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function DashboardPage() {
  const { data: session } = useSession();

  // ── Data ──────────────────────────────────────────────────────────────────

  const { data: hackathons = [], isLoading: loadingHackathons } = useHackathons();

  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);

  const activeHackathon = useMemo(() => {
    if (selectedHackathonId) return hackathons.find((h) => h.id === selectedHackathonId) ?? null;
    return (
      hackathons.find((h) => h.status === "REGISTRATION_OPEN") ??
      hackathons.find((h) => h.status === "IN_PROGRESS") ??
      hackathons[0] ?? null
    );
  }, [hackathons, selectedHackathonId]);

  const { data: teams = [] } = useHackathonTeams(activeHackathon?.id ?? "");

  const myTeam = useMemo(
    () => teams.find((t) => t.members.some((m) => m.user.id === session?.user?.id)) ?? null,
    [teams, session?.user?.id],
  );

  const { data: inviteData } = useTeamInviteCode(myTeam?.id ?? "");
  const inviteCode = inviteData?.inviteCode ?? "";

  // ── Mutations ─────────────────────────────────────────────────────────────

  const createTeam = useCreateTeam(activeHackathon?.id ?? "");
  const joinTeam = useJoinTeam(activeHackathon?.id);

  // ── Local UI state ────────────────────────────────────────────────────────

  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");

  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const [copiedInvite, setCopiedInvite] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createTeam.mutateAsync({ name: createName, description: createDesc });
      setShowCreate(false);
      setCreateName("");
      setCreateDesc("");
    } catch { /* error displayed from mutation state */ }
  }

  async function handleJoinTeam(e: React.FormEvent) {
    e.preventDefault();
    try {
      await joinTeam.mutateAsync({ inviteCode: joinCode });
      setShowJoin(false);
      setJoinCode("");
    } catch { /* error displayed from mutation state */ }
  }

  function copyInvite() {
    navigator.clipboard.writeText(inviteCode);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  }

  // ── Loading guard ─────────────────────────────────────────────────────────

  if (loadingHackathons) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
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

        {/* Hackathon switcher (when multiple) */}
        {hackathons.length > 1 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {hackathons.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelectedHackathonId(h.id)}
                className="flex items-center gap-1.5 text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all"
                style={{
                  background: activeHackathon?.id === h.id ? "var(--ink)" : "var(--warm-white)",
                  color: activeHackathon?.id === h.id ? "var(--cream)" : "var(--ink)",
                  borderColor: activeHackathon?.id === h.id ? "var(--ink)" : "var(--sand)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                }}
              >
                {h.title}
              </button>
            ))}
          </div>
        )}

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

                {/* Project link */}
                <Link
                  href="/dashboard/project"
                  className="flex items-center justify-between rounded-xl px-4 py-3 mb-3 transition-colors"
                  style={{ background: "var(--tag-ai-bg)", border: "1px solid var(--claude-tan)", textDecoration: "none" }}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderOpen size={15} style={{ color: "var(--claude-tan)" }} />
                    <span className="text-[0.88rem] font-semibold"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                      {myTeam.project?.submittedAt
                        ? "View submitted project"
                        : myTeam.project
                        ? "Continue project draft"
                        : "Start your project"}
                    </span>
                  </div>
                  <ChevronRight size={14} style={{ color: "var(--claude-tan)" }} />
                </Link>

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
                    {createTeam.error && (
                      <div className="flex items-center gap-2 text-[0.82rem] px-3 py-2.5 rounded-xl"
                        style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}>
                        <AlertCircle size={13} className="shrink-0" />
                        {createTeam.error.message}
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
                    <Button type="submit" loading={createTeam.isPending} loadingText="Creating…">
                      Create team
                    </Button>
                  </form>
                )}

                {/* Join form */}
                {showJoin && (
                  <form onSubmit={handleJoinTeam} className="flex flex-col gap-3 pt-3 border-t" style={{ borderColor: "var(--sand)" }}>
                    {joinTeam.error && (
                      <div className="flex items-center gap-2 text-[0.82rem] px-3 py-2.5 rounded-xl"
                        style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}>
                        <AlertCircle size={13} className="shrink-0" />
                        {joinTeam.error.message}
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
                    <Button type="submit" loading={joinTeam.isPending} loadingText="Joining…">
                      Join team
                    </Button>
                  </form>
                )}
              </div>
            )}

          </div>
        )}
      </main>
  );
}
