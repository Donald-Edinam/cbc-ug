"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Loader2, GitBranch, ExternalLink, CheckCircle2, Save,
} from "lucide-react";
import { useJudgeProjects, useHackathonCriteria, useSubmitScore } from "@/hooks/use-judging";
import type { JudgingCriteria } from "@/lib/types";

export default function JudgeProjectPage({
  params,
}: {
  params: Promise<{ hackathonId: string; projectId: string }>;
}) {
  const { hackathonId, projectId } = use(params);
  const { data: projects, isLoading: loadingProjects } = useJudgeProjects(hackathonId);
  const { data: criteria, isLoading: loadingCriteria } = useHackathonCriteria(hackathonId);
  const submitScore = useSubmitScore(hackathonId);

  // local state: { [criteriaId]: { score: number; feedback: string; saved: boolean } }
  const [local, setLocal] = useState<Record<string, { score: number; feedback: string; saved: boolean }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const project = projects?.find((p) => p.id === projectId);

  if (loadingProjects || loadingCriteria) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl">
        <Link
          href={`/judge/${hackathonId}`}
          className="flex items-center gap-1.5 text-[0.83rem] mb-8 w-fit"
          style={{ color: "var(--earth)", fontFamily: "var(--font-display)", textDecoration: "none" }}
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>
        <div
          className="rounded-2xl border px-8 py-10 text-center"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
        >
          <p className="text-[0.95rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Project not found
          </p>
        </div>
      </div>
    );
  }

  function getExistingScore(criteriaId: string) {
    return project?.scores?.find((s) => s.criteria?.id === criteriaId || (s as any).criteriaId === criteriaId);
  }

  function getScore(c: JudgingCriteria) {
    if (local[c.id]) return local[c.id].score;
    return getExistingScore(c.id)?.score ?? 0;
  }

  function getFeedback(c: JudgingCriteria) {
    if (local[c.id]) return local[c.id].feedback;
    return getExistingScore(c.id)?.feedback ?? "";
  }

  function isSaved(c: JudgingCriteria) {
    return local[c.id]?.saved ?? !!getExistingScore(c.id);
  }

  async function handleSave(c: JudgingCriteria) {
    setSaving(c.id);
    try {
      await submitScore.mutateAsync({
        projectId,
        criteriaId: c.id,
        score: getScore(c),
        feedback: getFeedback(c) || undefined,
      });
      setLocal((prev) => ({
        ...prev,
        [c.id]: { ...prev[c.id], score: getScore(c), feedback: getFeedback(c), saved: true },
      }));
    } finally {
      setSaving(null);
    }
  }

  const allSaved = criteria?.every((c) => isSaved(c)) ?? false;

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <Link
        href={`/judge/${hackathonId}`}
        className="flex items-center gap-1.5 text-[0.83rem] mb-8 w-fit"
        style={{ color: "var(--earth)", fontFamily: "var(--font-display)", textDecoration: "none" }}
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      {/* Project info card */}
      <div
        className="rounded-2xl border px-6 py-5 mb-6"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1
            className="text-[1.4rem] font-bold leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {project.title}
          </h1>
          {allSaved && (
            <span
              className="flex items-center gap-1 shrink-0 text-[0.7rem] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#e8f4e8", color: "#4a6940", fontFamily: "var(--font-display)" }}
            >
              <CheckCircle2 size={11} /> Scored
            </span>
          )}
        </div>

        {project.team?.name && (
          <p className="text-[0.8rem] mb-3" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            by {project.team.name}
          </p>
        )}

        {project.description && (
          <p className="text-[0.85rem] mb-4" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            {project.description}
          </p>
        )}

        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[0.68rem] font-medium px-2 py-0.5 rounded-full"
                style={{ background: "var(--sand)", color: "var(--earth)", fontFamily: "var(--font-display)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {(project.repoUrl || project.demoUrl) && (
          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-xl border transition-colors hover:bg-[var(--sand)]"
                style={{ color: "var(--earth)", borderColor: "var(--sand)", fontFamily: "var(--font-display)" }}
              >
                <GitBranch size={12} /> Repository
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
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
      </div>

      {/* Scoring */}
      <div className="mb-2">
        <p
          className="text-[0.7rem] font-black uppercase tracking-wider px-1 mb-4"
          style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
        >
          Scoring Criteria
        </p>

        {!criteria?.length ? (
          <div
            className="rounded-2xl border px-6 py-8 text-center"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
          >
            <p className="text-[0.88rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
              No criteria defined for this hackathon yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {criteria.map((c) => {
              const currentScore = getScore(c);
              const currentFeedback = getFeedback(c);
              const scored = isSaved(c);
              const isDirty = local[c.id] && !local[c.id].saved;
              const isSavingThis = saving === c.id;

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border px-6 py-5"
                  style={{
                    background: "var(--warm-white)",
                    borderColor: scored && !isDirty ? "#c6dfc6" : "var(--sand)",
                  }}
                >
                  {/* Criteria header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        {scored && !isDirty && <CheckCircle2 size={13} style={{ color: "#4a6940", flexShrink: 0 }} />}
                        <p className="text-[0.9rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                          {c.name}
                        </p>
                      </div>
                      {c.description && (
                        <p className="text-[0.78rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                          {c.description}
                        </p>
                      )}
                    </div>
                    <span
                      className="shrink-0 text-[0.72rem] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}
                    >
                      / {c.maxScore}
                    </span>
                  </div>

                  {/* Score slider */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[0.72rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Score</span>
                      <span
                        className="text-[0.88rem] font-bold tabular-nums"
                        style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}
                      >
                        {currentScore} / {c.maxScore}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={c.maxScore}
                      step={1}
                      value={currentScore}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setLocal((prev) => ({
                          ...prev,
                          [c.id]: { score: v, feedback: currentFeedback, saved: false },
                        }));
                      }}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: "var(--claude-tan)" }}
                    />
                    <div className="flex justify-between text-[0.62rem] mt-1" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                      <span>0</span>
                      <span>{c.maxScore}</span>
                    </div>
                  </div>

                  {/* Feedback textarea */}
                  <div className="mb-4">
                    <label className="block text-[0.72rem] mb-1" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                      Feedback <span style={{ opacity: 0.5 }}>(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add comments for this criterion…"
                      value={currentFeedback}
                      onChange={(e) => {
                        setLocal((prev) => ({
                          ...prev,
                          [c.id]: { score: currentScore, feedback: e.target.value, saved: false },
                        }));
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-[0.82rem] resize-none outline-none border transition-colors"
                      style={{
                        background: "var(--cream)",
                        borderColor: "var(--sand)",
                        color: "var(--ink)",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                  </div>

                  {/* Save button */}
                  <button
                    onClick={() => handleSave(c)}
                    disabled={isSavingThis || (scored && !isDirty)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.78rem] font-semibold transition-all"
                    style={{
                      background: scored && !isDirty ? "var(--sand)" : "var(--ink)",
                      color: scored && !isDirty ? "var(--earth)" : "var(--cream)",
                      fontFamily: "var(--font-display)",
                      border: "none",
                      cursor: isSavingThis || (scored && !isDirty) ? "default" : "pointer",
                      opacity: isSavingThis ? 0.6 : 1,
                    }}
                  >
                    {isSavingThis ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : scored && !isDirty ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <Save size={13} />
                    )}
                    {isSavingThis ? "Saving…" : scored && !isDirty ? "Saved" : "Save score"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
