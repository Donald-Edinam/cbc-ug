"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Users, Loader2, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useHackathons } from "@/hooks/use-hackathons";
import { useHackathonTeams } from "@/hooks/use-teams";
import type { HackathonStatus } from "@/lib/types";

const STATUS_COLOR: Record<HackathonStatus, { bg: string; color: string }> = {
  DRAFT:             { bg: "var(--sand)",  color: "var(--earth)"   },
  REGISTRATION_OPEN: { bg: "#e8f4e8",      color: "#4a6940"        },
  IN_PROGRESS:       { bg: "#fef3e8",      color: "#b45c1a"        },
  JUDGING:           { bg: "#f0edf8",      color: "#6b50a8"        },
  COMPLETED:         { bg: "var(--sand)",  color: "var(--earth)"   },
};

const STATUS_LABEL: Record<HackathonStatus, string> = {
  DRAFT: "Draft",
  REGISTRATION_OPEN: "Registration Open",
  IN_PROGRESS: "In Progress",
  JUDGING: "Judging",
  COMPLETED: "Completed",
};

export default function TeamsPage() {
  const { data: session } = useSession();

  const { data: hackathons = [], isLoading: loadingHackathons } = useHackathons();

  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeHackathon = useMemo(() => {
    if (selectedHackathonId) return hackathons.find((h) => h.id === selectedHackathonId) ?? null;
    return (
      hackathons.find((h) => h.status === "REGISTRATION_OPEN") ??
      hackathons.find((h) => h.status === "IN_PROGRESS") ??
      hackathons[0] ?? null
    );
  }, [hackathons, selectedHackathonId]);

  const { data: teams = [], isLoading: loadingTeams } = useHackathonTeams(activeHackathon?.id ?? "");

  const myTeamId = useMemo(
    () => teams.find((t) => t.members.some((m) => m.user.id === session?.user?.id))?.id ?? null,
    [teams, session?.user?.id],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return teams;
    const q = search.toLowerCase();
    return teams.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q),
    );
  }, [teams, search]);

  if (loadingHackathons) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[1.75rem] font-semibold leading-tight mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          All Teams
        </h1>
        <p className="text-[0.9rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
          {activeHackathon
            ? `${teams.length} team${teams.length !== 1 ? "s" : ""} registered for ${activeHackathon.title}`
            : "Browse registered teams."}
        </p>
      </div>

      {/* Hackathon switcher */}
      {hackathons.length > 1 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {hackathons.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHackathonId(h.id)}
              className="text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all"
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
        <>
          {/* Search */}
          <div className="relative mb-5">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--earth)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teams…"
              className="w-full rounded-xl border pl-9 pr-4 py-2.5 text-[0.88rem] outline-none"
              style={{
                background: "var(--warm-white)",
                borderColor: "var(--sand)",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>

          {/* Teams list */}
          {loadingTeams ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin" style={{ color: "var(--earth)" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="rounded-2xl border px-8 py-10 text-center"
              style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
            >
              <Users size={28} className="mx-auto mb-3" style={{ color: "var(--earth)", opacity: 0.4 }} />
              <p className="text-[0.9rem] font-semibold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                {search ? "No teams match your search" : "No teams yet"}
              </p>
              <p className="text-[0.83rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                {search ? "Try a different keyword." : "Be the first to create a team on the dashboard."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((team) => {
                const isMyTeam = team.id === myTeamId;
                const isFull = team._count.members >= activeHackathon.maxTeamSize;

                return (
                  <Link
                    key={team.id}
                    href={`/dashboard/teams/${team.id}`}
                    className="rounded-2xl border px-5 py-4 block transition-opacity hover:opacity-80"
                    style={{
                      background: isMyTeam ? "var(--tag-ai-bg)" : "var(--warm-white)",
                      borderColor: isMyTeam ? "var(--claude-tan)" : "var(--sand)",
                      textDecoration: "none",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <h3
                          className="text-[1rem] font-semibold truncate"
                          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                        >
                          {team.name}
                        </h3>
                        {isMyTeam && (
                          <span
                            className="shrink-0 text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: "var(--claude-tan)",
                              color: "#fff",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            Your team
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-[0.72rem] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: isFull ? "var(--sand)" : "#e8f4e8",
                            color: isFull ? "var(--earth)" : "#4a6940",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {isFull ? "Full" : "Open"}
                        </span>
                        <span
                          className="flex items-center gap-1 text-[0.78rem]"
                          style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
                        >
                          <Users size={12} strokeWidth={1.8} />
                          {team._count.members}/{activeHackathon.maxTeamSize}
                        </span>
                      </div>
                    </div>

                    {team.description && (
                      <p
                        className="text-[0.83rem] mb-3 line-clamp-2"
                        style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}
                      >
                        {team.description}
                      </p>
                    )}

                    {/* Member avatars + chevron */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {team.members.map((m) => (
                          <div
                            key={m.id}
                            title={m.user.name}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-bold shrink-0"
                            style={{
                              background: m.user.id === session?.user?.id ? "var(--claude-tan)" : "var(--sand)",
                              color: m.user.id === session?.user?.id ? "#fff" : "var(--ink)",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {m.user.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {team._count.members === 0 && (
                          <span className="text-[0.75rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                            No members yet
                          </span>
                        )}
                      </div>
                      <ChevronRight size={15} style={{ color: "var(--earth)", opacity: 0.5, flexShrink: 0 }} />
                    </div>

                    {/* Project submitted badge */}
                    {team.project?.submittedAt && (
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: isMyTeam ? "rgba(211,134,87,0.2)" : "var(--sand)" }}>
                        <span
                          className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background: STATUS_COLOR["IN_PROGRESS"].bg,
                            color: STATUS_COLOR["IN_PROGRESS"].color,
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          Project submitted
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </main>
  );
}
