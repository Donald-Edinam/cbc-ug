"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft, Check, CheckCircle2, AlertCircle, Loader2,
  Plus, X, ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHackathons } from "@/hooks/use-hackathons";
import { useHackathonTeams } from "@/hooks/use-teams";
import { useTeamProject, useUpsertProject, useSubmitProject } from "@/hooks/use-projects";

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function ProjectPage() {
  const { data: session } = useSession();

  // ── Find my team ─────────────────────────────────────────────────────────

  const { data: hackathons = [], isLoading: loadingHackathons } = useHackathons();

  const activeHackathon = useMemo(
    () =>
      hackathons.find((h) => h.status === "REGISTRATION_OPEN") ??
      hackathons.find((h) => h.status === "IN_PROGRESS") ??
      hackathons[0] ?? null,
    [hackathons],
  );

  const { data: teams = [], isLoading: loadingTeams } = useHackathonTeams(
    activeHackathon?.id ?? "",
  );

  const myTeam = useMemo(
    () =>
      teams.find((t) => t.members.some((m) => m.user.id === session?.user?.id)) ?? null,
    [teams, session?.user?.id],
  );

  // ── Project data ─────────────────────────────────────────────────────────

  const {
    data: project,
    isLoading: loadingProject,
  } = useTeamProject(myTeam?.id ?? "");

  const upsert = useUpsertProject(myTeam?.id ?? "");
  const submit = useSubmitProject(myTeam?.id ?? "");

  // ── Form state ────────────────────────────────────────────────────────────

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [presentationUrl, setPresentationUrl] = useState("");

  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // Prefill form when project loads
  useEffect(() => {
    if (project) {
      setTitle(project.title ?? "");
      setDescription(project.description ?? "");
      setTechStack(project.techStack ?? []);
      setRepoUrl(project.repoUrl ?? "");
      setDemoUrl(project.demoUrl ?? "");
      setVideoUrl(project.videoUrl ?? "");
      setPresentationUrl(project.presentationUrl ?? "");
    }
  }, [project]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !techStack.includes(tag)) {
      setTechStack((prev) => [...prev, tag]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTechStack((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await upsert.mutateAsync({
        title,
        description,
        techStack,
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        videoUrl: videoUrl || null,
        presentationUrl: presentationUrl || null,
      });
      setSavedAt(new Date());
    } catch { /* error shown via mutation state */ }
  }

  async function handleSubmit() {
    try {
      await submit.mutateAsync();
      setConfirmSubmit(false);
    } catch { /* error shown via mutation state */ }
  }

  // ── Loading guard ─────────────────────────────────────────────────────────

  if (loadingHackathons || loadingTeams) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  const isSubmitted = Boolean(project?.submittedAt);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
      <main className="max-w-2xl mx-auto px-5 py-10">
        {/* Back link — visible on mobile since nav doesn't show labels clearly */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[0.82rem] mb-6 lg:hidden"
          style={{ color: "var(--earth)", fontFamily: "var(--font-display)", textDecoration: "none" }}
        >
          <ArrowLeft size={13} /> Dashboard
        </Link>

        {/* No team */}
        {!myTeam && (
          <div
            className="rounded-2xl border px-8 py-10 text-center"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
          >
            <p className="text-[0.95rem] font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              You&apos;re not in a team yet
            </p>
            <p className="text-[0.85rem] mb-5" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
              Join or create a team before you can submit a project.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 text-[0.85rem] font-semibold px-5 py-2.5 rounded-xl"
              style={{ background: "var(--ink)", color: "var(--cream)", fontFamily: "var(--font-display)", textDecoration: "none" }}
            >
              Go to dashboard
            </Link>
          </div>
        )}

        {myTeam && (
          <>
            {/* Page header */}
            <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-[1.75rem] font-semibold leading-tight mb-1"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  Project
                </h1>
                <p className="text-[0.88rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                  Team: <strong>{myTeam.name}</strong>
                  {activeHackathon && (
                    <> · Submission deadline: {fmt(activeHackathon.submissionDeadline)}</>
                  )}
                </p>
              </div>
              {isSubmitted && (
                <span
                  className="flex items-center gap-1.5 text-[0.78rem] font-semibold px-3 py-1.5 rounded-full shrink-0"
                  style={{ background: "#e8f4e8", color: "#4a6940", fontFamily: "var(--font-display)" }}
                >
                  <CheckCircle2 size={13} /> Submitted {fmt(project!.submittedAt!)}
                </span>
              )}
            </div>

            {loadingProject ? (
              <div className="flex items-center gap-2 py-8 text-[0.85rem]"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                <Loader2 size={14} className="animate-spin" /> Loading project…
              </div>
            ) : (
              <div
                className="rounded-2xl border px-6 py-6"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
              >
                {/* Submitted state errors (e.g. already submitted) */}
                {submit.error && (
                  <div
                    className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 mb-5 text-[0.85rem]"
                    style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}
                  >
                    <AlertCircle size={14} className="mt-px shrink-0" />
                    <span>{submit.error.message}</span>
                  </div>
                )}

                <form onSubmit={handleSave} className="flex flex-col gap-5">
                  {/* Title */}
                  <Input
                    id="project-title"
                    label="Project title *"
                    required
                    disabled={isSubmitted}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. ClaudeHelper"
                  />

                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="project-desc"
                      className="text-[0.72rem] font-semibold uppercase tracking-widest"
                      style={{ color: "var(--bark)", fontFamily: "var(--font-display)" }}
                    >
                      Description *
                    </label>
                    <textarea
                      id="project-desc"
                      required
                      disabled={isSubmitted}
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What does your project do? What problem does it solve?"
                      className="w-full rounded-lg px-3.5 py-2.5 text-[0.93rem] outline-none resize-none transition-all duration-200"
                      style={{
                        background: "var(--sand)",
                        border: "1.5px solid var(--stone)",
                        color: "var(--ink)",
                        fontFamily: "var(--font-body)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--claude-tan)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,124,93,0.12)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--stone)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-[0.72rem] font-semibold uppercase tracking-widest"
                      style={{ color: "var(--bark)", fontFamily: "var(--font-display)" }}
                    >
                      Tech stack
                    </label>
                    {!isSubmitted && (
                      <div className="flex gap-2">
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder="e.g. Next.js, Claude API…"
                          className="flex-1 rounded-lg px-3.5 py-2.5 text-[0.93rem] outline-none transition-all duration-200"
                          style={{
                            background: "var(--sand)",
                            border: "1.5px solid var(--stone)",
                            color: "var(--ink)",
                            fontFamily: "var(--font-body)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--claude-tan)";
                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,124,93,0.12)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "var(--stone)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg text-[0.82rem] font-semibold shrink-0"
                          style={{ background: "var(--sand)", border: "1.5px solid var(--stone)", color: "var(--ink)", cursor: "pointer", fontFamily: "var(--font-display)" }}
                        >
                          <Plus size={13} /> Add
                        </button>
                      </div>
                    )}
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {techStack.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 text-[0.78rem] font-medium px-2.5 py-1 rounded-full"
                            style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}
                          >
                            {tag}
                            {!isSubmitted && (
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-0.5 opacity-60 hover:opacity-100"
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}
                              >
                                <X size={11} />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex flex-col gap-4 pt-1 border-t" style={{ borderColor: "var(--sand)" }}>
                    <p className="text-[0.78rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                      Links are optional but encouraged.
                    </p>
                    <Input
                      id="repo-url"
                      label="GitHub / Repo URL"
                      type="url"
                      disabled={isSubmitted}
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/team/project"
                    />
                    <Input
                      id="demo-url"
                      label="Live demo URL"
                      type="url"
                      disabled={isSubmitted}
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://yourproject.vercel.app"
                    />
                    <Input
                      id="video-url"
                      label="Demo video URL"
                      type="url"
                      disabled={isSubmitted}
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <Input
                      id="presentation-url"
                      label="Presentation / Slides URL"
                      type="url"
                      disabled={isSubmitted}
                      value={presentationUrl}
                      onChange={(e) => setPresentationUrl(e.target.value)}
                      placeholder="https://docs.google.com/presentation/..."
                    />
                  </div>

                  {/* Save error */}
                  {upsert.error && (
                    <div
                      className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[0.85rem]"
                      style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}
                    >
                      <AlertCircle size={14} className="mt-px shrink-0" />
                      <span>{upsert.error.message}</span>
                    </div>
                  )}

                  {!isSubmitted && (
                    <div className="flex flex-col gap-3 pt-2">
                      {/* Saved indicator */}
                      {savedAt && !upsert.isPending && (
                        <p className="flex items-center gap-1.5 text-[0.78rem]"
                          style={{ color: "#4a6940", fontFamily: "var(--font-body)" }}>
                          <Check size={13} /> Draft saved at {savedAt.toLocaleTimeString()}
                        </p>
                      )}

                      {/* Save draft */}
                      <Button type="submit" variant="secondary" loading={upsert.isPending} loadingText="Saving…">
                        Save draft
                      </Button>

                      {/* Submit — only if a draft exists */}
                      {project && !confirmSubmit && (
                        <button
                          type="button"
                          onClick={() => setConfirmSubmit(true)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.9rem] font-semibold transition-all"
                          style={{ background: "var(--ink)", color: "var(--cream)", border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}
                        >
                          Submit project
                        </button>
                      )}

                      {/* Confirm submit */}
                      {confirmSubmit && (
                        <div
                          className="rounded-xl border px-5 py-4 flex flex-col gap-3"
                          style={{ borderColor: "var(--claude-tan)", background: "var(--tag-ai-bg)" }}
                        >
                          <p className="text-[0.88rem] font-semibold"
                            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                            Submit project?
                          </p>
                          <p className="text-[0.83rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                            Once submitted, you won&apos;t be able to edit the project. Make sure everything is correct.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              loading={submit.isPending}
                              loadingText="Submitting…"
                              onClick={handleSubmit}
                              className="flex-1"
                            >
                              Yes, submit
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setConfirmSubmit(false)}
                              className="flex-1"
                              style={{ flex: "1" }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form>

                {/* Submitted read-only link summary */}
                {isSubmitted && (
                  <div className="mt-6 pt-5 border-t flex flex-col gap-2.5" style={{ borderColor: "var(--sand)" }}>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                      Submitted links
                    </p>
                    {[
                      { label: "Repo", url: project?.repoUrl },
                      { label: "Demo", url: project?.demoUrl },
                      { label: "Video", url: project?.videoUrl },
                      { label: "Slides", url: project?.presentationUrl },
                    ]
                      .filter((l) => l.url)
                      .map(({ label, url }) => (
                        <a
                          key={label}
                          href={url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[0.85rem]"
                          style={{ color: "var(--claude-tan)", fontFamily: "var(--font-body)", textDecoration: "none" }}
                        >
                          <ExternalLink size={13} /> {label}: {url}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
  );
}
