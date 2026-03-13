"use client";

import { useState } from "react";
import { useAdminHackathons, useAdminUsers, usePublishResults } from "@/hooks/use-admin";
import { 
  useHackathonCriteria, 
  useCreateCriteria, 
  useAssignJudge,
  useHackathonScores
} from "@/hooks/use-judging";
import { useHackathonRankings } from "@/hooks/use-hackathons";
import { 
  Gavel, 
  Plus, 
  UserPlus, 
  Trophy, 
  BarChart3, 
  Settings2, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Filter,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminJudgingPage() {
  const { data: hackathons = [], isLoading: loadingHackathons } = useAdminHackathons();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  
  const { data: criteria = [], isLoading: loadingCriteria } = useHackathonCriteria(selectedHackathonId);
  const { data: rankings = [], isLoading: loadingRankings } = useHackathonRankings(selectedHackathonId);
  const { data: users = [] } = useAdminUsers();
  
  const createCriteria = useCreateCriteria(selectedHackathonId);
  const assignJudge = useAssignJudge(selectedHackathonId);
  const publishResults = usePublishResults();

  const [newCriteria, setNewCriteria] = useState({ name: "", description: "", maxScore: 10, weight: 1 });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [activeTab, setActiveTab] = useState<"criteria" | "judges" | "rankings">("criteria");

  // Set initial selected hackathon
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

  const potentialJudges = users.filter(u => u.role === "ORGANIZER" || u.role === "JUDGE");

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
            Judging Management
          </h1>
          <p className="text-sm" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Define criteria, assign judges, and finalize results.
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
          <Button 
            onClick={handlePublish} 
            disabled={publishResults.isPending}
            className="rounded-xl shadow-sm"
          >
            {publishResults.isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} className="mr-2" />}
            Publish Results
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl w-fit" style={{ background: "var(--sand)" }}>
        {[
          { id: "criteria", label: "Criteria", Icon: Settings2 },
          { id: "judges", label: "Judges", Icon: Users },
          { id: "rankings", label: "Rankings", Icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id 
                ? "bg-white text-[var(--ink)] shadow-sm" 
                : "text-[var(--earth)] hover:text-[var(--ink)]"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <tab.Icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        {activeTab === "criteria" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Criteria Form */}
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                  <Plus size={18} /> Add Criterion
                </h3>
                <form onSubmit={handleAddCriteria} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--earth)" }}>Name</label>
                    <Input 
                      placeholder="e.g. Technical Complexity" 
                      value={newCriteria.name}
                      onChange={e => setNewCriteria(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--earth)" }}>Description</label>
                    <textarea 
                      className="w-full rounded-xl border p-3 text-sm min-h-[100px]"
                      placeholder="What should judges look for?"
                      style={{ background: "white", borderColor: "var(--sand)", outline: "none" }}
                      value={newCriteria.description}
                      onChange={e => setNewCriteria(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--earth)" }}>Max Score</label>
                      <Input 
                        type="number" 
                        value={newCriteria.maxScore}
                        onChange={e => setNewCriteria(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--earth)" }}>Weight (x)</label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={newCriteria.weight}
                        onChange={e => setNewCriteria(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={createCriteria.isPending}>
                    {createCriteria.isPending ? <Loader2 className="animate-spin" size={16} /> : "Save Criterion"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Right: Criteria List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {loadingCriteria ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
              ) : criteria.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border bg-white/50 border-dashed" style={{ borderColor: "var(--sand)" }}>
                  <p style={{ color: "var(--earth)" }}>No criteria defined yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criteria.map(c => (
                    <div key={c.id} className="p-5 rounded-2xl border bg-white shadow-sm" style={{ borderColor: "var(--sand)" }}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold" style={{ color: "var(--ink)" }}>{c.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--cream)", color: "var(--ink)" }}>
                            Max: {c.maxScore}
                          </span>
                          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)" }}>
                            Weight: {c.weight}x
                          </span>
                        </div>
                      </div>
                      <p className="text-sm line-clamp-2" style={{ color: "var(--earth)" }}>{c.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "judges" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Assign Judge Panel */}
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl border" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                  <UserPlus size={18} /> Assign Judge
                </h3>
                <div className="flex flex-col gap-4">
                  <select
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    className="w-full p-3 rounded-xl border text-sm"
                    style={{ background: "white", borderColor: "var(--sand)", outline: "none" }}
                  >
                    <option value="">Select a user...</option>
                    {potentialJudges.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                  <Button onClick={handleAssignJudge} disabled={!selectedUserId || assignJudge.isPending}>
                    {assignJudge.isPending ? <Loader2 className="animate-spin" size={16} /> : "Assign to Hackathon"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rankings" && (
          <div className="flex flex-col gap-4">
            {loadingRankings ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
            ) : rankings.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border bg-white/50 border-dashed" style={{ borderColor: "var(--sand)" }}>
                <p style={{ color: "var(--earth)" }}>No rankings available yet. Waiting for scores.</p>
              </div>
            ) : (
              <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/50" style={{ fontFamily: "var(--font-display)" }}>
                    <tr style={{ color: "var(--earth)" }}>
                      <th className="px-6 py-4 font-bold border-b" style={{ borderColor: "var(--sand)" }}>Rank</th>
                      <th className="px-6 py-4 font-bold border-b" style={{ borderColor: "var(--sand)" }}>Project</th>
                      <th className="px-6 py-4 font-bold border-b" style={{ borderColor: "var(--sand)" }}>Team</th>
                      <th className="px-6 py-4 font-bold border-b text-center" style={{ borderColor: "var(--sand)" }}>Judges</th>
                      <th className="px-6 py-4 font-bold border-b text-right" style={{ borderColor: "var(--sand)" }}>Final Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((r) => (
                      <tr key={r.projectId} className="hover:bg-white/30 transition-colors">
                        <td className="px-6 py-4 font-bold border-b" style={{ borderColor: "var(--sand)", color: "var(--ink)" }}>
                          {r.rank === 1 ? <Trophy size={16} className="text-yellow-500 inline mr-2" /> : `#${r.rank}`}
                        </td>
                        <td className="px-6 py-4 font-bold border-b" style={{ borderColor: "var(--sand)", color: "var(--ink)" }}>{r.title}</td>
                        <td className="px-6 py-4 border-b" style={{ borderColor: "var(--sand)", color: "var(--earth)" }}>{r.teamName}</td>
                        <td className="px-6 py-4 border-b text-center" style={{ borderColor: "var(--sand)", color: "var(--earth)" }}>{r.judgeCount}</td>
                        <td className="px-6 py-4 border-b text-right font-bold" style={{ borderColor: "var(--sand)", color: "var(--claude-deep)" }}>
                          {r.finalScore.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
