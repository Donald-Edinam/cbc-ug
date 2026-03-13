"use client";

import { useState } from "react";
import { useAdminHackathons } from "@/hooks/use-admin";
import { useHackathonProjects } from "@/hooks/use-projects";
import { 
  Rocket, 
  Search, 
  ExternalLink, 
  Github, 
  Loader2, 
  Globe, 
  Filter,
  Users,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminProjectsPage() {
  const { data: hackathons = [], isLoading: loadingHackathons } = useAdminHackathons();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data: projects = [], isLoading: loadingProjects } = useHackathonProjects(selectedHackathonId);

  // Set initial selected hackathon
  if (!selectedHackathonId && hackathons.length > 0) {
    setSelectedHackathonId(hackathons[0].id);
  }

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.team?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
            Project Showcase
          </h1>
          <p className="text-sm" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Review all project submissions and team progress.
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
                <option>Loading...</option>
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
          <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Total Projects</p>
          <p className="text-2xl font-bold" style={{ color: "var(--ink)" }}>{loadingProjects ? "..." : projects.length}</p>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Submitted</p>
          <p className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
            {loadingProjects ? "..." : projects.filter(p => p.submittedAt).length}
          </p>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>In Progress</p>
          <p className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
            {loadingProjects ? "..." : projects.filter(p => !p.submittedAt).length}
          </p>
        </div>
      </div>

      {/* Search & List */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--earth)" }} />
          <Input 
            placeholder="Search projects or teams..." 
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loadingProjects ? (
          <div className="flex items-center gap-2 py-12 justify-center" style={{ color: "var(--earth)" }}>
            <Loader2 size={20} className="animate-spin" />
            <span>Loading projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <Rocket size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-semibold" style={{ color: "var(--ink)" }}>No projects found</p>
            <p className="text-sm" style={{ color: "var(--earth)" }}>Try adjusting your search or select a different hackathon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="group flex flex-col rounded-2xl border overflow-hidden transition-all hover:shadow-lg"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
              >
                {/* Banner Placeholder or Actual Banner if exists */}
                <div className="h-32 w-full relative bg-gradient-to-br from-[var(--sand)] to-[var(--cream)] flex items-center justify-center overflow-hidden">
                  <Rocket className="opacity-10 group-hover:scale-110 transition-transform duration-500" size={64} />
                  <div className="absolute top-3 right-3">
                    {project.submittedAt ? (
                      <span className="flex items-center gap-1 text-[0.65rem] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 shadow-sm">
                        <CheckCircle2 size={10} /> SUBMITTED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[0.65rem] font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700 shadow-sm">
                        <Clock size={10} /> DRAFT
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                      {project.title}
                    </h3>
                    <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--earth)" }}>
                      <Users size={12} /> {project.team?.name || "Independent"}
                    </p>
                  </div>

                  <p className="text-sm line-clamp-3 mb-6 flex-1" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                    {project.description}
                  </p>

                  <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: "var(--sand)" }}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        {project.repoUrl && (
                          <a 
                            href={project.repoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-[var(--sand)] transition-colors"
                            title="GitHub Repository"
                          >
                            <Github size={16} />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a 
                            href={project.demoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-[var(--sand)] transition-colors"
                            title="Live Demo"
                          >
                            <Globe size={16} />
                          </a>
                        )}
                      </div>
                      <div className="text-[0.65rem] font-medium flex items-center gap-1" style={{ color: "var(--earth)" }}>
                        <Calendar size={10} />
                        {project.submittedAt 
                          ? new Date(project.submittedAt).toLocaleDateString() 
                          : "Updated " + new Date(project.updatedAt).toLocaleDateString()
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
