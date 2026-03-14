"use client";

import { useState } from "react";
import { useAdminHackathons } from "@/hooks/use-admin";
import { useHackathonProjects } from "@/hooks/use-projects";
import {
  Rocket, Search, ExternalLink, GitBranch, Loader2,
  Globe, Filter, Users, Calendar, ChevronRight,
} from "lucide-react";

export default function AdminProjectsPage() {
  const { data: hackathons = [], isLoading: loadingHackathons } = useAdminHackathons();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data: projects = [], isLoading: loadingProjects } = useHackathonProjects(selectedHackathonId);

  if (!selectedHackathonId && hackathons.length > 0) {
    setSelectedHackathonId(hackathons[0].id);
  }

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.team?.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2"
            style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
            Project Showcase
          </h1>
          <p className="text-sm font-medium"
            style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Review all project submissions and track team progress.
          </p>
        </div>

        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
            style={{ color: "var(--earth)" }} />
          <select
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-xl border text-[0.75rem] font-bold appearance-none min-w-[200px] cursor-pointer outline-none"
            style={{ background: "var(--warm-white)", border: "1px solid var(--sand)", color: "var(--ink)" }}
          >
            {loadingHackathons ? (
              <option>Loading…</option>
            ) : (
              hackathons.map((h) => (
                <option key={h.id} value={h.id}>{h.title}</option>
              ))
            )}
          </select>
          <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"
            style={{ color: "var(--earth)" }} />
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Projects",      val: projects.length,                               icon: Rocket,   color: "var(--claude-tan)" },
          { label: "Submitted",           val: projects.filter((p) => p.submittedAt).length,  icon: Globe,    color: "#4a6940" },
          { label: "In Progress",         val: projects.filter((p) => !p.submittedAt).length, icon: Loader2,  color: "#b45c1a" },
        ].map((stat, i) => (
          <div key={i}
            className="p-4 rounded-2xl border transition-all hover:shadow-md"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <div className="p-2 rounded-xl w-fit mb-2" style={{ background: "rgba(0,0,0,0.03)" }}>
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <p className="text-[0.65rem] font-black uppercase tracking-wider mb-0.5"
              style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
              {stat.label}
            </p>
            <p className="text-xl font-black" style={{ color: "var(--ink)" }}>
              {loadingProjects ? "…" : stat.val}
            </p>
          </div>
        ))}
      </div>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--earth)" }} />
        <input
          type="text"
          placeholder="Search projects or teams…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-[0.85rem] outline-none"
          style={{ background: "var(--warm-white)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        />
      </div>

      {/* ── Project list ───────────────────────────────────────────────────── */}
      {loadingProjects ? (
        <div className="py-20 text-center rounded-2xl border"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <Loader2 size={24} className="animate-spin mx-auto mb-2 opacity-30" style={{ color: "var(--earth)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Loading projects…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border flex flex-col items-center gap-3"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <Rocket size={40} className="opacity-20" style={{ color: "var(--earth)" }} />
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>No projects found</p>
            <p className="text-[0.8rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
              Try adjusting your search or select a different hackathon.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden shadow-sm"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>

          {/* Table header */}
          <div className="border-b px-6 py-4" style={{ borderColor: "var(--sand)", background: "rgba(0,0,0,0.01)" }}>
            <div className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 items-center">
              {["Project", "Team", "Tech Stack", "Links", "Status"].map((h) => (
                <span key={h} className="text-[0.65rem] font-black uppercase tracking-wider"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--sand)" }}>
            {filtered.map((project) => (
              <div
                key={project.id}
                className="px-6 py-4 grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 items-center hover:bg-black/[0.01] transition-colors"
              >
                {/* Project title + description */}
                <div className="min-w-0">
                  <p className="text-[0.88rem] font-bold leading-tight mb-0.5 truncate"
                    style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    {project.title}
                  </p>
                  <p className="text-[0.75rem] line-clamp-1"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                    {project.description}
                  </p>
                </div>

                {/* Team */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <Users size={12} style={{ color: "var(--earth)", flexShrink: 0 }} />
                  <span className="text-[0.78rem] font-medium truncate"
                    style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }}>
                    {project.team?.name ?? "—"}
                  </span>
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((t) => (
                    <span key={t}
                      className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                      {t}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--sand)", color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex items-center gap-1">
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition-colors hover:bg-[var(--sand)]"
                      title="Repository" style={{ color: "var(--earth)" }}>
                      <GitBranch size={14} />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition-colors hover:bg-[var(--sand)]"
                      title="Demo" style={{ color: "var(--earth)" }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {!project.repoUrl && !project.demoUrl && (
                    <span className="text-[0.72rem]" style={{ color: "var(--earth)", opacity: 0.4 }}>—</span>
                  )}
                </div>

                {/* Status */}
                <div>
                  {project.submittedAt ? (
                    <span className="flex items-center gap-1 text-[0.68rem] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{ background: "#e8f4e8", color: "#4a6940", fontFamily: "var(--font-display)" }}>
                      <Globe size={10} /> Submitted
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[0.68rem] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{ background: "#fef3e8", color: "#b45c1a", fontFamily: "var(--font-display)" }}>
                      <Calendar size={10} /> Draft
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
