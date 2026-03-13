"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Users, Crown, Loader2, FolderOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTeam } from "@/hooks/use-teams";

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { data: team, isLoading, isError } = useTeam(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  if (isError || !team) {
    return (
      <main className="max-w-2xl mx-auto px-5 py-10">
        <Link
          href="/dashboard/teams"
          className="flex items-center gap-1.5 text-[0.83rem] mb-8"
          style={{ color: "var(--earth)", fontFamily: "var(--font-display)", textDecoration: "none" }}
        >
          <ArrowLeft size={14} /> Back to teams
        </Link>
        <div
          className="rounded-2xl border px-8 py-10 text-center"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
        >
          <p className="text-[0.95rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Team not found
          </p>
        </div>
      </main>
    );
  }

  const isMyTeam = team.members.some((m) => m.user.id === session?.user?.id);

  return (
    <main className="max-w-2xl mx-auto px-5 py-10">
      {/* Back */}
      <Link
        href="/dashboard/teams"
        className="flex items-center gap-1.5 text-[0.83rem] mb-8 w-fit"
        style={{ color: "var(--earth)", fontFamily: "var(--font-display)", textDecoration: "none" }}
      >
        <ArrowLeft size={14} /> Back to teams
      </Link>

      {/* Team header */}
      <div
        className="rounded-2xl border px-6 py-5 mb-4"
        style={{
          background: isMyTeam ? "var(--tag-ai-bg)" : "var(--warm-white)",
          borderColor: isMyTeam ? "var(--claude-tan)" : "var(--sand)",
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <h1
              className="text-[1.4rem] font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              {team.name}
            </h1>
            {isMyTeam && (
              <span
                className="shrink-0 text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}
              >
                Your team
              </span>
            )}
          </div>
          <span
            className="flex items-center gap-1.5 text-[0.8rem] shrink-0"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
          >
            <Users size={14} strokeWidth={1.8} />
            {team.members.length} member{team.members.length !== 1 ? "s" : ""}
          </span>
        </div>
        {team.description && (
          <p className="text-[0.88rem] mt-1" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            {team.description}
          </p>
        )}
        {team.project?.submittedAt && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: isMyTeam ? "rgba(211,134,87,0.2)" : "var(--sand)" }}>
            <span
              className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#fef3e8", color: "#b45c1a", fontFamily: "var(--font-display)" }}
            >
              Project submitted
            </span>
          </div>
        )}
      </div>

      {/* Members */}
      <div
        className="rounded-2xl border px-6 py-5 mb-4"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        <h2
          className="text-[0.72rem] font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
        >
          Members
        </h2>
        <div className="flex flex-col gap-3">
          {team.members.map((m) => {
            const isYou = m.user.id === session?.user?.id;
            const isLeader = m.role === "LEADER";
            return (
              <div key={m.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[0.75rem] font-bold shrink-0"
                    style={{
                      background: isYou ? "var(--claude-tan)" : "var(--sand)",
                      color: isYou ? "#fff" : "var(--ink)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {m.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[0.9rem] font-medium truncate"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    >
                      {m.user.name}
                      {isYou && (
                        <span className="ml-1.5 text-[0.75rem]" style={{ color: "var(--earth)" }}>
                          (you)
                        </span>
                      )}
                    </p>
                    {m.user.department && (
                      <p className="text-[0.78rem] truncate" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                        {m.user.department}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isLeader && (
                    <Crown size={13} style={{ color: "var(--claude-tan)" }} />
                  )}
                  <span
                    className="text-[0.75rem] font-medium"
                    style={{
                      color: isLeader ? "var(--claude-tan)" : "var(--earth)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {isLeader ? "Leader" : "Member"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project (if exists) */}
      {team.project && (
        <div
          className="rounded-2xl border px-6 py-5"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
        >
          <h2
            className="text-[0.72rem] font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
          >
            Project
          </h2>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FolderOpen size={16} style={{ color: isMyTeam ? "var(--claude-tan)" : "var(--earth)" }} />
              <span
                className="text-[0.9rem] font-medium truncate"
                style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}
              >
                {team.project.title || "Untitled project"}
              </span>
            </div>
            {team.project.submittedAt && (
              <span
                className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: "#fef3e8", color: "#b45c1a", fontFamily: "var(--font-display)" }}
              >
                Submitted
              </span>
            )}
          </div>
          {isMyTeam && (
            <Link
              href="/dashboard/project"
              className="flex items-center gap-1.5 mt-3 text-[0.8rem] font-medium w-fit"
              style={{ color: "var(--claude-tan)", fontFamily: "var(--font-display)", textDecoration: "none" }}
            >
              <ExternalLink size={13} /> Open project
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
