"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminHackathons } from "@/hooks/use-admin";
import { useHackathonTeams } from "@/hooks/use-teams";
import {
  Users,
  Search,
  ChevronRight,
  ExternalLink,
  Loader2,
  User,
  Trophy,
  Filter,
  UserCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminTeamsPage() {
  const router = useRouter();
  const { data: hackathons = [], isLoading: loadingHackathons } = useAdminHackathons();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data: teams = [], isLoading: loadingTeams } = useHackathonTeams(selectedHackathonId);

  // Set initial selected hackathon
  if (!selectedHackathonId && hackathons.length > 0) {
    setSelectedHackathonId(hackathons[0].id);
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.members.some(m => m.user.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-4 relative overflow-hidden min-h-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
            Team Management
          </h1>
          <p className="text-sm font-medium" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Manage participants, view projects, and oversee team dynamics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10" style={{ color: "var(--earth)" }} />
            <select
              value={selectedHackathonId}
              onChange={(e) => setSelectedHackathonId(e.target.value)}
              className="pl-9 pr-9 py-2 rounded-xl border text-[0.75rem] font-bold appearance-none min-w-[200px] transition-all hover:shadow-sm cursor-pointer"
              style={{ background: "var(--warm-white)", border: "1px solid var(--sand)", color: "var(--ink)", outline: "none" }}
            >
              {loadingHackathons ? (
                <option>Loading hackathons...</option>
              ) : (
                hackathons.map(h => (
                  <option key={h.id} value={h.id}>{h.title}</option>
                ))
              )}
            </select>
            <ChevronRight size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color: "var(--earth)" }} />
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Teams", val: teams.length, icon: Users, color: "var(--claude-tan)" },
          { label: "Total Minds", val: teams.reduce((acc, t) => acc + (t._count?.members || 0), 0), icon: UserCircle, color: "var(--earth)" },
          { label: "Submitted Projects", val: teams.filter(t => t.project).length, icon: Trophy, color: "#b45c1a" }
        ].map((stat, i) => (
          <div key={i} className="relative group p-4 rounded-2xl border transition-all hover:shadow-md"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl" style={{ background: "rgba(0,0,0,0.03)" }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>{stat.label}</p>
            <p className="text-xl font-black" style={{ color: "var(--ink)" }}>{loadingTeams ? "..." : stat.val}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3">
        <div className="relative group max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--earth)" }} />
          <Input
            placeholder="Search teams or people..."
            className="pl-10 py-5 rounded-xl border-sand bg-warm-white/50 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border overflow-hidden shadow-sm"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--sand)", background: "rgba(0,0,0,0.01)" }}>
                  {["Team", "Leader", "Size", "Status", "Action"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-wider"
                      style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sand)]">
                {loadingTeams ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-sm font-medium" style={{ color: "var(--earth)" }}>
                      <Loader2 size={24} className="animate-spin mx-auto mb-2 opacity-30" />
                      Decrypting team database...
                    </td>
                  </tr>
                ) : filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <Users size={48} className="mb-4" />
                        <p className="font-bold">No assets found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => {
                    const leader = team.members.find(m => m.role === "LEADER");
                    return (
                      <tr
                        key={team.id}
                        onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                        className="group hover:bg-sand/20 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-[0.85rem] leading-none mb-1" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{team.name}</p>
                          <p className="text-[0.65rem] font-medium opacity-60 truncate max-w-[150px]" style={{ color: "var(--earth)" }}>{team.description || "No mission brief"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-black bg-sand text-ink border border-sand-deep">
                              {leader?.user.name.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="text-[0.75rem] font-bold leading-tight" style={{ color: "var(--ink)" }}>{leader?.user.name}</p>
                              <p className="text-[0.6rem] font-medium opacity-60 leading-tight" style={{ color: "var(--earth)" }}>{leader?.user.department || "Specialist"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[0.7rem] font-black px-2 py-0.5 rounded-lg border bg-white/50"
                            style={{ borderColor: "var(--sand)", color: "var(--ink)" }}>
                            {team.members.length}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {team.project ? (
                            <div className="flex items-center gap-1.5 text-[0.6rem] font-bold px-2 py-0.5 rounded-full w-fit bg-[#e8f4e8] text-[#4a6940]">
                              <Trophy size={10} /> Submitted
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[0.6rem] font-bold px-2 py-0.5 rounded-full w-fit bg-[#fdf0ed] text-[#b45c1a]">
                              <Loader2 size={10} className="animate-spin" /> Coding
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <ChevronRight size={16} className="text-earth/40 group-hover:text-ink transition-colors" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
