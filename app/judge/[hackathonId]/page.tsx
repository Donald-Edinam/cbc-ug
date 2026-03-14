"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, FolderOpen, GitBranch, ExternalLink, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useJudgeProjects, useHackathonCriteria } from "@/hooks/use-judging";

export default function JudgeHackathonPage({ params }: { params: Promise<{ hackathonId: string }> }) {
  const { hackathonId } = use(params);
  const { data: projects, isLoading: loadingProjects } = useJudgeProjects(hackathonId);
  const { data: criteria, isLoading: loadingCriteria } = useHackathonCriteria(hackathonId);

  const isLoading = loadingProjects || loadingCriteria;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  const totalCriteria = criteria?.length ?? 0;

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <Link
        href="/judge"
        className="flex items-center gap-1.5 text-[0.83rem] mb-8 w-fit"
        style={{ color: "var(--earth)", fontFamily: "var(--font-display)", textDecoration: "none" }}
      >
        <ArrowLeft size={14} /> All hackathons
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-extrabold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          Projects to Score
        </h1>
        {totalCriteria > 0 && (
          <p className="text-[0.85rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            {totalCriteria} scoring {totalCriteria === 1 ? "criterion" : "criteria"} · select a project to begin
          </p>
        )}
      </div>

      {/* Criteria chips */}
      {!!criteria?.length && (
        <div className="flex flex-wrap gap-2 mb-6">
          {criteria.map((c) => (
            <span
              key={c.id}
              className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}
            >
              {c.name} / {c.maxScore}
            </span>
          ))}
        </div>
      )}

      {!projects?.length ? (
        <div
          className="rounded-2xl border px-8 py-12 text-center"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--sand)" }}
          >
            <FolderOpen size={22} style={{ color: "var(--earth)" }} />
          </div>
          <p className="text-[0.95rem] font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            No submitted projects
          </p>
          <p className="text-[0.82rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Projects will appear here once teams submit them.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => {
            const scoredCount = project.scores?.length ?? 0;
            const isFullyScored = totalCriteria > 0 && scoredCount >= totalCriteria;

            return (
              <Link
                key={project.id}
                href={`/judge/${hackathonId}/${project.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="px-6 py-5 rounded-2xl border transition-all hover:shadow-sm group cursor-pointer"
                  style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2 mb-1">
                        {isFullyScored ? (
                          <CheckCircle2 size={15} style={{ color: "#4a6940", flexShrink: 0 }} />
                        ) : (
                          <Circle size={15} style={{ color: "var(--earth)", flexShrink: 0, opacity: 0.4 }} />
                        )}
                        <p className="text-[0.95rem] font-semibold leading-tight truncate" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                          {project.title}
                        </p>
                      </div>

                      {/* Team */}
                      {project.team?.name && (
                        <p className="text-[0.78rem] mb-2 pl-[23px]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                          by {project.team.name}
                        </p>
                      )}

                      {/* Description */}
                      {project.description && (
                        <p className="text-[0.8rem] line-clamp-2 pl-[23px]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                          {project.description}
                        </p>
                      )}

                      {/* Links */}
                      {(project.repoUrl || project.demoUrl) && (
                        <div className="flex items-center gap-2 mt-3 pl-[23px]">
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-[0.72rem] font-medium px-2.5 py-1 rounded-lg border transition-colors hover:bg-[var(--sand)]"
                              style={{ color: "var(--earth)", borderColor: "var(--sand)", fontFamily: "var(--font-display)" }}
                            >
                              <GitBranch size={11} /> Repo
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-[0.72rem] font-medium px-2.5 py-1 rounded-lg border transition-colors hover:bg-[var(--sand)]"
                              style={{ color: "var(--earth)", borderColor: "var(--sand)", fontFamily: "var(--font-display)" }}
                            >
                              <ExternalLink size={11} /> Demo
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Score progress */}
                      {totalCriteria > 0 && (
                        <span
                          className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: isFullyScored ? "#e8f4e8" : "var(--sand)",
                            color: isFullyScored ? "#4a6940" : "var(--earth)",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {scoredCount}/{totalCriteria}
                        </span>
                      )}
                      <ChevronRight size={15} style={{ color: "var(--earth)" }} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
