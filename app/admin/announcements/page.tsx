"use client";

import { useState, useMemo } from "react";
import {
  Megaphone, Plus, Trash2, Send, Loader2, Mail, Users, Globe,
  X, AlertCircle, Check, Filter, ChevronRight,
} from "lucide-react";
import { useAdminHackathons, useAdminAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from "@/hooks/use-admin";
import { useHackathonTeams } from "@/hooks/use-teams";
import type { AnnouncementTarget } from "@/lib/types";

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminAnnouncementsPage() {
  const { data: hackathons = [], isLoading: loadingHackathons } = useAdminHackathons();

  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const activeHackathonId = selectedHackathonId || hackathons[0]?.id || "";

  const { data: announcements = [], isLoading: loadingAnnouncements } = useAdminAnnouncements(activeHackathonId);
  const { data: teams = [] } = useHackathonTeams(activeHackathonId);

  const createAnnouncement = useCreateAnnouncement(activeHackathonId);
  const deleteAnnouncement = useDeleteAnnouncement(activeHackathonId);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetType, setTargetType] = useState<AnnouncementTarget>("ALL");
  const [targetTeamId, setTargetTeamId] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useMemo(() => {
    if (!selectedHackathonId && hackathons.length > 0) {
      setSelectedHackathonId(hackathons[0].id);
    }
  }, [hackathons, selectedHackathonId]);

  function resetForm() {
    setTitle(""); setBody(""); setTargetType("ALL");
    setTargetTeamId(""); setSendEmail(false); setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeHackathonId) return;
    try {
      await createAnnouncement.mutateAsync({
        hackathonId: activeHackathonId,
        title, body, targetType,
        targetTeamId: targetType === "TEAM" ? targetTeamId : undefined,
        sendEmail,
      });
      resetForm();
      setSuccessMsg(sendEmail ? "Announcement posted and emails dispatched." : "Announcement posted.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch { /* error shown inline */ }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAnnouncement.mutateAsync(id);
      setDeleteConfirm(null);
    } catch { /* noop */ }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2"
            style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
            Announcements
          </h1>
          <p className="text-sm font-medium"
            style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Post updates to all participants or a specific team, with optional email delivery.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Hackathon filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ color: "var(--earth)" }} />
            <select
              value={activeHackathonId}
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

          {/* New announcement button */}
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 text-[0.82rem] font-bold px-4 py-2 rounded-xl transition-all"
            style={{
              background: showForm ? "var(--ink)" : "var(--claude-tan)",
              color: "#fff", border: "none", cursor: "pointer",
              fontFamily: "var(--font-display)",
            }}
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? "Cancel" : "New announcement"}
          </button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Announcements", val: announcements.length, icon: Megaphone, color: "var(--claude-tan)" },
          { label: "Emailed", val: announcements.filter((a) => a.sentViaEmail).length, icon: Mail, color: "#4a6940" },
          { label: "Team-Targeted", val: announcements.filter((a) => a.targetType === "TEAM").length, icon: Users, color: "#6b50a8" },
        ].map((stat, i) => (
          <div key={i}
            className="p-4 rounded-2xl border transition-all hover:shadow-md"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <div className="p-2 rounded-xl w-fit mb-2" style={{ background: "rgba(0,0,0,0.03)" }}>
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-0.5"
              style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
              {stat.label}
            </p>
            <p className="text-xl font-black" style={{ color: "var(--ink)" }}>
              {loadingAnnouncements ? "…" : stat.val}
            </p>
          </div>
        ))}
      </div>

      {/* ── Success banner ─────────────────────────────────────────────────── */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-[0.83rem]"
          style={{ background: "#e8f4e8", color: "#4a6940", fontFamily: "var(--font-body)" }}>
          <Check size={14} className="shrink-0" /> {successMsg}
        </div>
      )}

      {/* ── Compose form ───────────────────────────────────────────────────── */}
      {showForm && (
        <div className="rounded-2xl border p-6"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
          <h2 className="text-[1rem] font-extrabold mb-5"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Compose announcement
          </h2>

          {createAnnouncement.error && (
            <div className="flex items-center gap-2 text-[0.82rem] px-3 py-2.5 rounded-xl mb-4"
              style={{ background: "#fef2f2", color: "#b91c1c", fontFamily: "var(--font-body)" }}>
              <AlertCircle size={13} className="shrink-0" />
              {createAnnouncement.error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="text-[0.72rem] font-black uppercase tracking-wider mb-1.5 block"
                style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                Title <span style={{ color: "var(--claude-tan)" }}>*</span>
              </label>
              <input
                type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Submission deadline extended"
                className="w-full rounded-xl border px-3.5 py-2.5 text-[0.88rem] outline-none"
                style={{ background: "var(--cream)", borderColor: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-[0.72rem] font-black uppercase tracking-wider mb-1.5 block"
                style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                Message <span style={{ color: "var(--claude-tan)" }}>*</span>
              </label>
              <textarea
                required rows={5} value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your announcement here…"
                className="w-full rounded-xl border px-3.5 py-2.5 text-[0.88rem] outline-none resize-y"
                style={{ background: "var(--cream)", borderColor: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}
              />
            </div>

            {/* Target */}
            <div>
              <label className="text-[0.72rem] font-black uppercase tracking-wider mb-2 block"
                style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                Send to
              </label>
              <div className="flex gap-2 flex-wrap">
                {(["ALL", "TEAM"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setTargetType(t)}
                    className="flex items-center gap-2 text-[0.78rem] font-bold px-4 py-2 rounded-xl border transition-all"
                    style={{
                      background: targetType === t ? "var(--ink)" : "var(--cream)",
                      color: targetType === t ? "#fff" : "var(--earth)",
                      borderColor: targetType === t ? "var(--ink)" : "var(--sand)",
                      cursor: "pointer", fontFamily: "var(--font-display)",
                    }}
                  >
                    {t === "ALL" ? <><Globe size={13} /> All participants</> : <><Users size={13} /> Specific team</>}
                  </button>
                ))}
              </div>

              {targetType === "TEAM" && (
                <select required value={targetTeamId}
                  onChange={(e) => setTargetTeamId(e.target.value)}
                  className="mt-3 rounded-xl border px-3 py-2.5 text-[0.88rem] outline-none w-full max-w-sm"
                  style={{ background: "var(--cream)", borderColor: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                >
                  <option value="">Select a team…</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t._count.members} member{t._count.members !== 1 ? "s" : ""})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Email toggle */}
            <label
              className="flex items-center gap-3 cursor-pointer select-none rounded-xl border px-4 py-3 w-fit"
              style={{
                borderColor: sendEmail ? "var(--claude-tan)" : "var(--sand)",
                background: sendEmail ? "var(--tag-ai-bg)" : "var(--cream)",
              }}
            >
              <div className="w-10 h-6 rounded-full relative transition-colors shrink-0"
                style={{ background: sendEmail ? "var(--claude-tan)" : "var(--sand)" }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: sendEmail ? "calc(100% - 20px)" : "4px" }} />
              </div>
              <input type="checkbox" className="sr-only" checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)} />
              <div>
                <p className="text-[0.82rem] font-bold flex items-center gap-1.5"
                  style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                  <Mail size={13} style={{ color: sendEmail ? "var(--claude-tan)" : "var(--earth)" }} />
                  Also send via email
                </p>
                <p className="text-[0.72rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                  {targetType === "ALL"
                    ? "Emails sent to all participants in teams."
                    : "Emails sent to all members of the selected team."}
                </p>
              </div>
            </label>

            {/* Submit */}
            <div className="flex gap-3 pt-1">
              <button type="submit"
                disabled={createAnnouncement.isPending || (targetType === "TEAM" && !targetTeamId)}
                className="flex items-center gap-2 text-[0.83rem] font-bold px-5 py-2.5 rounded-xl transition-all"
                style={{
                  background: "var(--claude-tan)", color: "#fff", border: "none",
                  cursor: createAnnouncement.isPending ? "not-allowed" : "pointer",
                  opacity: createAnnouncement.isPending ? 0.7 : 1,
                  fontFamily: "var(--font-display)",
                }}
              >
                {createAnnouncement.isPending
                  ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
                  : <><Send size={14} /> {sendEmail ? "Post & send email" : "Post announcement"}</>}
              </button>
              <button type="button" onClick={resetForm}
                className="text-[0.83rem] font-bold px-5 py-2.5 rounded-xl"
                style={{ background: "var(--sand)", color: "var(--ink)", border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Announcements list ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border overflow-hidden shadow-sm"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>

        {/* Table header */}
        <div className="border-b px-6 py-4" style={{ borderColor: "var(--sand)", background: "rgba(0,0,0,0.01)" }}>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
            <span className="text-[0.65rem] font-black uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Announcement</span>
            <span className="text-[0.65rem] font-black uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Target</span>
            <span className="text-[0.65rem] font-black uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Date</span>
            <span className="text-[0.65rem] font-black uppercase tracking-wider" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Action</span>
          </div>
        </div>

        {loadingAnnouncements ? (
          <div className="py-20 text-center">
            <Loader2 size={24} className="animate-spin mx-auto mb-2 opacity-30" style={{ color: "var(--earth)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Loading announcements…</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3 opacity-40">
            <Megaphone size={40} style={{ color: "var(--earth)" }} />
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>No announcements yet</p>
              <p className="text-[0.8rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Click &ldquo;New announcement&rdquo; to post the first one.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--sand)" }}>
            {announcements.map((ann) => {
              const isDeleting = deleteAnnouncement.isPending && deleteConfirm === ann.id;
              const teamName = ann.targetTeamId
                ? teams.find((t) => t.id === ann.targetTeamId)?.name
                : null;

              return (
                <div key={ann.id} className="px-6 py-4 grid grid-cols-[1fr_auto_auto_auto] gap-4 items-start hover:bg-black/[0.01] transition-colors">

                  {/* Title + body */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[0.88rem] font-bold"
                        style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                        {ann.title}
                      </p>
                      {ann.sentViaEmail && (
                        <span className="flex items-center gap-1 text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "#e8f4e8", color: "#4a6940", fontFamily: "var(--font-display)" }}>
                          <Mail size={9} /> Emailed
                        </span>
                      )}
                    </div>
                    <p className="text-[0.8rem] line-clamp-2"
                      style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                      {ann.body}
                    </p>
                  </div>

                  {/* Target badge */}
                  <div className="flex items-center mt-0.5">
                    <span className="flex items-center gap-1 text-[0.68rem] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        background: ann.targetType === "ALL" ? "var(--sand)" : "var(--tag-ai-bg)",
                        color: ann.targetType === "ALL" ? "var(--earth)" : "var(--claude-tan)",
                        fontFamily: "var(--font-display)",
                      }}>
                      {ann.targetType === "ALL"
                        ? <><Globe size={10} /> All</>
                        : <><Users size={10} /> {teamName ?? "Team"}</>}
                    </span>
                  </div>

                  {/* Date */}
                  <p className="text-[0.72rem] mt-1 whitespace-nowrap"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-display)", opacity: 0.6 }}>
                    {fmt(ann.createdAt)}
                  </p>

                  {/* Delete */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {deleteConfirm === ann.id ? (
                      <>
                        <button onClick={() => handleDelete(ann.id)} disabled={isDeleting}
                          className="text-[0.72rem] font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: "#fef2f2", color: "#b91c1c", border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}>
                          {isDeleting ? <Loader2 size={11} className="animate-spin" /> : "Delete"}
                        </button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="text-[0.72rem] font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: "var(--sand)", color: "var(--ink)", border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}>
                          Keep
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setDeleteConfirm(ann.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50 group"
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        title="Delete">
                        <Trash2 size={14} className="group-hover:text-red-500 transition-colors" style={{ color: "var(--earth)" }} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
