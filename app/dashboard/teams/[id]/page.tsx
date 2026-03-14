"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Users,
  Crown,
  Loader2,
  Globe,
  FileEdit,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const leader = team.members.find((m) => m.role === "LEADER");

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">
      {/* Back link */}
      <Link
        href="/dashboard/teams"
        className="flex items-center gap-1.5 text-[0.83rem] mb-8 w-fit"
        style={{ color: "var(--earth)", fontFamily: "var(--font-display)", textDecoration: "none" }}
      >
        <ArrowLeft size={14} /> Back to teams
      </Link>

      {/* Team header */}
      <div
        className="rounded-2xl border px-7 py-6 mb-6"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1
            className="text-[1.6rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {team.name}
          </h1>
          {isMyTeam && (
            <span
              className="shrink-0 text-[0.68rem] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}
            >
              Your team
            </span>
          )}
        </div>
        {team.description && (
          <p className="text-[0.88rem] mb-4" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            {team.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-[0.8rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {team.members.length} member{team.members.length !== 1 ? "s" : ""}
          </span>
          {leader && (
            <span className="flex items-center gap-1.5">
              <Crown size={13} /> Led by {leader.user.name}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Members */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <p
            className="text-[0.7rem] font-semibold uppercase tracking-wider px-1"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
          >
            Members
          </p>
          {team.members.map((m) => {
            const isYou = m.user.id === session?.user?.id;
            const isLeader = m.role === "LEADER";
            return (
              <div
                key={m.id}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl border"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
              >
                <div className="flex items-center gap-3">
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
                  <div>
                    <p className="text-[0.88rem] font-semibold leading-tight" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                      {m.user.name}{isYou && <span className="text-[0.72rem] font-normal opacity-40 ml-1">(you)</span>}
                    </p>
                    <p className="text-[0.72rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                      {m.user.department || "Participant"}
                    </p>
                  </div>
                </div>
                {isLeader ? (
                  <span
                    className="flex items-center gap-1 text-[0.68rem] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}
                  >
                    <Crown size={10} /> Leader
                  </span>
                ) : (
                  <span
                    className="text-[0.68rem] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "var(--sand)", color: "var(--earth)", fontFamily: "var(--font-display)" }}
                  >
                    Member
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Project */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <p
            className="text-[0.7rem] font-semibold uppercase tracking-wider px-1"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
          >
            Project
          </p>

          <div
            className="rounded-2xl border px-5 py-5 flex flex-col gap-4"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
          >
            {team.project ? (
              <>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    {team.project.submittedAt ? (
                      <span
                        className="flex items-center gap-1 text-[0.68rem] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "#e8f4e8", color: "#4a6940", fontFamily: "var(--font-display)" }}
                      >
                        <Globe size={10} /> Submitted
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-1 text-[0.68rem] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "#fef3e8", color: "#b45c1a", fontFamily: "var(--font-display)" }}
                      >
                        <FileEdit size={10} /> Draft
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-[1rem] font-semibold leading-snug"
                    style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}
                  >
                    {team.project.title || "Untitled project"}
                  </h3>
                  {team.project.description && (
                    <p className="text-[0.78rem] mt-1 line-clamp-2" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                      {team.project.description}
                    </p>
                  )}
                </div>

                {(team.project.repoUrl || team.project.demoUrl) && (
                  <div className="flex items-center gap-2">
                    {team.project.repoUrl && (
                      <a
                        href={team.project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-xl border transition-colors hover:bg-[var(--sand)]"
                        style={{ color: "var(--earth)", borderColor: "var(--sand)", fontFamily: "var(--font-display)" }}
                      >
                        <GitBranch size={12} /> Repo
                      </a>
                    )}
                    {team.project.demoUrl && (
                      <a
                        href={team.project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-xl border transition-colors hover:bg-[var(--sand)]"
                        style={{ color: "var(--earth)", borderColor: "var(--sand)", fontFamily: "var(--font-display)" }}
                      >
                        <ExternalLink size={12} /> Demo
                      </a>
                    )}
                  </div>
                )}

                {isMyTeam && (
                  <Link href="/dashboard/project">
                    <Button className="w-full rounded-xl text-[0.78rem]">
                      {team.project.submittedAt ? "View project" : "Continue editing"}
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <div className="py-4 text-center flex flex-col items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "var(--sand)" }}
                >
                  <FileEdit size={18} style={{ color: "var(--earth)" }} />
                </div>
                <div>
                  <p className="text-[0.88rem] font-semibold mb-1" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    No project yet
                  </p>
                  <p className="text-[0.78rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                    This team hasn&apos;t submitted a project.
                  </p>
                </div>
                {isMyTeam && (
                  <Link href="/dashboard/project" className="w-full">
                    <Button className="w-full rounded-xl text-[0.78rem]">
                      Add project
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
