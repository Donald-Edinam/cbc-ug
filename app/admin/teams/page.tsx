"use client";

import { useState } from "react";
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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
            Team Management
          </h1>
          <p className="text-sm" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Monitor teams and participants across your hackathons.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--earth)" }} />
            <select
              value={selectedHackathonId}
              onChange={(e) => setSelectedHackathonId(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border text-sm font-medium appearance-none min-w-[200px]"
              style={{ background: "var(--warm-white)", borderColor: "var(--sand)", color: "var(--ink)", outline: "none" }}
            >
              {loadingHackathons ? (
                <option>Loading hackathons...</option>
              ) : (
                hackathons.map(h => (
                  <option key={h.id} value={h.id}>{h.title}</option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Total Teams</p>
          <p className="text-2xl font-bold" style={{ color: "var(--ink)" }}>{loadingTeams ? "..." : teams.length}</p>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Participants</p>
          <p className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
            {loadingTeams ? "..." : teams.reduce((acc, t) => acc + (t._count?.members || 0), 0)}
          </p>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Projects</p>
          <p className="text-2xl font-bold" style={{ color: "var(--ink)" }}>{loadingTeams ? "..." : teams.filter(t => t.project).length}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--earth)" }} />
          <Input 
            placeholder="Search teams or participants..." 
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loadingTeams ? (
          <div className="flex items-center gap-2 py-12 justify-center" style={{ color: "var(--earth)" }}>
            <Loader2 size={20} className="animate-spin" />
            <span>Loading teams...</span>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-semibold" style={{ color: "var(--ink)" }}>No teams found</p>
            <p className="text-sm" style={{ color: "var(--earth)" }}>Try adjusting your search or select a different hackathon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTeams.map((team) => (
              <div 
                key={team.id}
                className="flex flex-col rounded-2xl border overflow-hidden transition-all hover:shadow-md"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
              >
                <div className="p-5 border-b flex items-start justify-between" style={{ borderColor: "var(--sand)" }}>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{team.name}</h3>
                    {team.project && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit" 
                        style={{ background: "var(--tag-hack-bg)", color: "var(--tag-hack-text)" }}>
                        <Trophy size={12} />
                        Project: {team.project.title}
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: "var(--sand)", color: "var(--earth)" }}>
                    {team.members.length} Members
                  </div>
                </div>
                
                <div className="p-5 flex-1 bg-white/40">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Participants</p>
                  <div className="flex flex-col gap-3">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" 
                            style={{ background: "var(--cream)", border: "1px solid var(--sand)", color: "var(--ink)" }}>
                            {member.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>{member.user.name}</p>
                            <p className="text-[0.7rem]" style={{ color: "var(--earth)" }}>{member.user.department || "No department listed"}</p>
                          </div>
                        </div>
                        {member.role === "LEADER" && (
                          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full" 
                            style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)" }}>
                            LEAD
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {team.description && (
                  <div className="p-5 pt-0">
                    <p className="text-xs line-clamp-2 italic" style={{ color: "var(--earth)" }}>
                      &quot;{team.description}&quot;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
