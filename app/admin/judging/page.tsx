"use client";

import { useState } from "react";
import { useAdminHackathons, useAdminUsersByRole, usePublishResults, useCreateJudge } from "@/hooks/use-admin";
import {
  useHackathonCriteria,
  useCreateCriteria,
  useAssignJudge,
  useHackathonJudges,
} from "@/hooks/use-judging";
import { useHackathonRankings } from "@/hooks/use-hackathons";
import {
  Plus,
  UserPlus,
  Trophy,
  BarChart3,
  Settings2,
  Loader2,
  CheckCircle2,
  Filter,
  Users,
  ChevronRight,
  Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminJudgingPage() {
  const { data: hackathons = [], isLoading: loadingHackathons } = useAdminHackathons();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");

  const { data: criteria = [], isLoading: loadingCriteria } = useHackathonCriteria(selectedHackathonId);
  const { data: assignedJudges = [], isLoading: loadingJudges } = useHackathonJudges(selectedHackathonId);
  const { data: rankings = [], isLoading: loadingRankings } = useHackathonRankings(selectedHackathonId);
  const { data: users = [] } = useAdminUsersByRole(["JUDGE"]);

  const createCriteria = useCreateCriteria(selectedHackathonId);
  const assignJudge = useAssignJudge(selectedHackathonId);
  const publishResults = usePublishResults();
  const createJudge = useCreateJudge();

  const [newCriteria, setNewCriteria] = useState({ name: "", description: "", maxScore: 10, weight: 1 });
  const [newJudge, setNewJudge] = useState({ name: "", email: "" });
  const [judgeCreated, setJudgeCreated] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [activeTab, setActiveTab] = useState<"criteria" | "judges" | "rankings">("criteria");

  if (!selectedHackathonId && hackathons.length > 0) {
    setSelectedHackathonId(hackathons[0].id);
  }

  const handleAddCriteria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCriteria.mutateAsync(newCriteria);
      setNewCriteria({ name: "", description: "", maxScore: 10, weight: 1 });
    } catch (err) {
      console.error("Failed to add criteria", err);
    }
  };

  const handleAssignJudge = async () => {
    if (!selectedUserId) return;
    try {
      await assignJudge.mutateAsync({ judgeId: selectedUserId });
      setSelectedUserId("");
    } catch (err) {
      console.error("Failed to assign judge", err);
    }
  };

  const handlePublish = async () => {
    if (!confirm("Are you sure you want to publish the results? This will make the leaderboard public.")) return;
    try {
      await publishResults.mutateAsync(selectedHackathonId);
    } catch (err) {
      console.error("Failed to publish results", err);
    }
  };

  const potentialJudges = users;

  const tabs = [
    { id: "criteria",  label: "Criteria",  Icon: Settings2 },
    { id: "judges",    label: "Judges",    Icon: Users     },
    { id: "rankings",  label: "Rankings",  Icon: BarChart3 },
  ] as const;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2"
            style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
            Judging Management
          </h1>
          <p className="text-sm font-medium"
            style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Define criteria, assign judges, and finalize results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Hackathon filter */}
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
                hackathons.map(h => (
                  <option key={h.id} value={h.id}>{h.title}</option>
                ))
              )}
            </select>
            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"
              style={{ color: "var(--earth)" }} />
          </div>

          {/* Publish */}
          <button
            onClick={handlePublish}
            disabled={publishResults.isPending || !selectedHackathonId}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.75rem] font-bold border cursor-pointer disabled:opacity-50"
            style={{ background: "var(--warm-white)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
          >
            {publishResults.isPending
              ? <Loader2 size={14} className="animate-spin" style={{ color: "var(--earth)" }} />
              : <CheckCircle2 size={14} style={{ color: "var(--earth)" }} />}
            Publish Results
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b" style={{ borderColor: "var(--sand)" }}>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 px-4 py-2.5 text-[0.8rem] font-semibold border-b-2 -mb-px transition-colors"
            style={{
              fontFamily: "var(--font-display)",
              color: activeTab === id ? "var(--ink)" : "var(--earth)",
              borderBottomColor: activeTab === id ? "var(--claude-tan)" : "transparent",
            }}
          >
            <Icon size={14} style={{ color: activeTab === id ? "var(--claude-tan)" : "var(--earth)" }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Criteria tab ─────────────────────────────────────────────────────── */}
      {activeTab === "criteria" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form */}
          <div className="p-6 rounded-2xl border"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <h3 className="text-[0.88rem] font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
              <Plus size={15} style={{ color: "var(--claude-tan)" }} /> Add Criterion
            </h3>
            <form onSubmit={handleAddCriteria} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] font-black uppercase tracking-wider"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Name</label>
                <input
                  className="w-full px-3 py-2 rounded-xl border text-[0.85rem] outline-none"
                  style={{ background: "var(--cream)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                  placeholder="e.g. Technical Complexity"
                  value={newCriteria.name}
                  onChange={e => setNewCriteria(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] font-black uppercase tracking-wider"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-xl border text-[0.85rem] outline-none resize-none min-h-[90px]"
                  style={{ background: "var(--cream)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                  placeholder="What should judges look for?"
                  value={newCriteria.description}
                  onChange={e => setNewCriteria(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-black uppercase tracking-wider"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Max Score</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border text-[0.85rem] outline-none"
                    style={{ background: "var(--cream)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    value={newCriteria.maxScore}
                    onChange={e => setNewCriteria(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-black uppercase tracking-wider"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Weight (×)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-xl border text-[0.85rem] outline-none"
                    style={{ background: "var(--cream)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    value={newCriteria.weight}
                    onChange={e => setNewCriteria(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              <Button type="submit" disabled={createCriteria.isPending} className="w-full rounded-xl text-[0.78rem] font-bold gap-2">
                {createCriteria.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Save Criterion
              </Button>
            </form>
          </div>

          {/* Criteria list */}
          <div className="lg:col-span-2">
            {loadingCriteria ? (
              <div className="py-20 text-center rounded-2xl border"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                <Loader2 size={24} className="animate-spin mx-auto mb-2 opacity-30" style={{ color: "var(--earth)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Loading criteria…</p>
              </div>
            ) : criteria.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border flex flex-col items-center gap-3"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                <Gavel size={36} className="opacity-20" style={{ color: "var(--earth)" }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>No criteria yet</p>
                  <p className="text-[0.8rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Add your first scoring criterion using the form.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border overflow-hidden shadow-sm"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                {/* Table header */}
                <div className="border-b px-6 py-4" style={{ borderColor: "var(--sand)", background: "rgba(0,0,0,0.01)" }}>
                  <div className="grid grid-cols-[2fr_auto_auto] gap-4 items-center">
                    {["Criterion", "Max Score", "Weight"].map(h => (
                      <span key={h} className="text-[0.65rem] font-black uppercase tracking-wider"
                        style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--sand)" }}>
                  {criteria.map(c => (
                    <div key={c.id}
                      className="px-6 py-4 grid grid-cols-[2fr_auto_auto] gap-4 items-center hover:bg-black/[0.01] transition-colors">
                      <div className="min-w-0">
                        <p className="text-[0.88rem] font-bold mb-0.5 truncate"
                          style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{c.name}</p>
                        <p className="text-[0.75rem] line-clamp-1"
                          style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>{c.description}</p>
                      </div>
                      <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                        {c.maxScore}
                      </span>
                      <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}>
                        ×{c.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Judges tab ───────────────────────────────────────────────────────── */}
      {activeTab === "judges" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">

            {/* Create judge */}
            <div className="p-6 rounded-2xl border"
              style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
              <h3 className="text-[0.88rem] font-bold mb-5 flex items-center gap-2"
                style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                <UserPlus size={15} style={{ color: "var(--claude-tan)" }} /> Add Judge
              </h3>
              {judgeCreated ? (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <CheckCircle2 size={20} style={{ color: "#4a6940" }} />
                  <p className="text-[0.82rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    Magic link sent to {judgeCreated}
                  </p>
                  <button
                    onClick={() => setJudgeCreated("")}
                    className="text-[0.72rem] underline mt-1"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}
                  >
                    Add another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await createJudge.mutateAsync(newJudge);
                      setJudgeCreated(newJudge.email);
                      setNewJudge({ name: "", email: "" });
                    } catch (err: any) {
                      alert(err?.response?.data?.error ?? "Failed to create judge");
                    }
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.65rem] font-black uppercase tracking-wider"
                      style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Full Name</label>
                    <input
                      className="w-full px-3 py-2 rounded-xl border text-[0.85rem] outline-none"
                      style={{ background: "var(--cream)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                      placeholder="e.g. Ama Owusu"
                      value={newJudge.name}
                      onChange={e => setNewJudge(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.65rem] font-black uppercase tracking-wider"
                      style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 rounded-xl border text-[0.85rem] outline-none"
                      style={{ background: "var(--cream)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                      placeholder="judge@example.com"
                      value={newJudge.email}
                      onChange={e => setNewJudge(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createJudge.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[0.75rem] font-bold border cursor-pointer disabled:opacity-50"
                    style={{ background: "var(--warm-white)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
                  >
                    {createJudge.isPending ? <Loader2 size={14} className="animate-spin" style={{ color: "var(--earth)" }} /> : <UserPlus size={14} style={{ color: "var(--earth)" }} />}
                    Create & Send Magic Link
                  </button>
                </form>
              )}
            </div>

            {/* Assign to hackathon */}
            <div className="p-6 rounded-2xl border"
              style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
              <h3 className="text-[0.88rem] font-bold mb-5 flex items-center gap-2"
                style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                <Gavel size={15} style={{ color: "var(--claude-tan)" }} /> Assign to Hackathon
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-black uppercase tracking-wider"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>Judge</label>
                  <select
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-[0.85rem] outline-none appearance-none"
                    style={{ background: "var(--cream)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                  >
                    <option value="">Select a judge…</option>
                    {potentialJudges.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAssignJudge}
                  disabled={!selectedUserId || assignJudge.isPending || !selectedHackathonId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[0.75rem] font-bold border cursor-pointer disabled:opacity-50"
                  style={{ background: "var(--warm-white)", border: "1px solid var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
                >
                  {assignJudge.isPending ? <Loader2 size={14} className="animate-spin" style={{ color: "var(--earth)" }} /> : <Gavel size={14} style={{ color: "var(--earth)" }} />}
                  Assign to Hackathon
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {loadingJudges ? (
              <div className="py-20 text-center rounded-2xl border"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                <Loader2 size={24} className="animate-spin mx-auto mb-2 opacity-30" style={{ color: "var(--earth)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Loading judges…</p>
              </div>
            ) : assignedJudges.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border flex flex-col items-center gap-3"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                <Users size={36} className="opacity-20" style={{ color: "var(--earth)" }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>No judges assigned yet</p>
                  <p className="text-[0.8rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Use the form to assign a judge to this hackathon.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border overflow-hidden shadow-sm"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                <div className="border-b px-6 py-4" style={{ borderColor: "var(--sand)", background: "rgba(0,0,0,0.01)" }}>
                  <div className="grid grid-cols-[2fr_1fr] gap-4">
                    {["Judge", "Email"].map(h => (
                      <span key={h} className="text-[0.65rem] font-black uppercase tracking-wider"
                        style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>{h}</span>
                    ))}
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--sand)" }}>
                  {assignedJudges.map(judge => (
                    <div key={judge.id}
                      className="px-6 py-4 grid grid-cols-[2fr_1fr] gap-4 items-center hover:bg-black/[0.01] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.72rem] font-bold shrink-0"
                          style={{ background: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                          {judge.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-[0.88rem] font-bold"
                          style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{judge.name}</p>
                      </div>
                      <p className="text-[0.78rem] truncate"
                        style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>{judge.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Rankings tab ─────────────────────────────────────────────────────── */}
      {activeTab === "rankings" && (
        loadingRankings ? (
          <div className="py-20 text-center rounded-2xl border"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <Loader2 size={24} className="animate-spin mx-auto mb-2 opacity-30" style={{ color: "var(--earth)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Loading rankings…</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border flex flex-col items-center gap-3"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <Trophy size={36} className="opacity-20" style={{ color: "var(--earth)" }} />
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>No rankings yet</p>
              <p className="text-[0.8rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>Rankings will appear once judges submit scores.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden shadow-sm"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            {/* Table header */}
            <div className="border-b px-6 py-4" style={{ borderColor: "var(--sand)", background: "rgba(0,0,0,0.01)" }}>
              <div className="grid grid-cols-[auto_2fr_1fr_auto_auto] gap-4 items-center">
                {["Rank", "Project", "Team", "Judges", "Score"].map(h => (
                  <span key={h} className="text-[0.65rem] font-black uppercase tracking-wider"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--sand)" }}>
              {rankings.map((r) => (
                <div key={r.projectId}
                  className="px-6 py-4 grid grid-cols-[auto_2fr_1fr_auto_auto] gap-4 items-center hover:bg-black/[0.01] transition-colors">
                  <div className="w-8 flex items-center justify-center">
                    {r.rank === 1
                      ? <Trophy size={16} style={{ color: "#b45c1a" }} />
                      : <span className="text-[0.78rem] font-bold" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>#{r.rank}</span>}
                  </div>
                  <p className="text-[0.88rem] font-bold truncate"
                    style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{r.title}</p>
                  <p className="text-[0.78rem] truncate"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>{r.teamName}</p>
                  <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full text-center"
                    style={{ background: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    {r.judgeCount}
                  </span>
                  <span className="text-[0.78rem] font-black"
                    style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    {r.finalScore.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      )}

    </div>
  );
}
