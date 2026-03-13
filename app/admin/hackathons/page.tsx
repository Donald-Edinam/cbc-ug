"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, Loader2, AlertCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  useHackathons, 
  useCreateHackathon, 
  useUpdateHackathon, 
  useDeleteHackathon, 
  useUpdateHackathonStatus 
} from "@/hooks/use-hackathons";
import type { CreateHackathonInput, UpdateHackathonInput, Hackathon, HackathonStatus } from "@/lib/types";

// Status options remain same...

const STATUS_OPTIONS: HackathonStatus[] = ["DRAFT", "REGISTRATION_OPEN", "IN_PROGRESS", "JUDGING", "COMPLETED"];
const STATUS_LABEL: Record<HackathonStatus, string> = {
  DRAFT: "Draft",
  REGISTRATION_OPEN: "Registration Open",
  IN_PROGRESS: "In Progress",
  JUDGING: "Judging",
  COMPLETED: "Completed",
};
const STATUS_STYLE: Record<HackathonStatus, { bg: string; color: string }> = {
  DRAFT:             { bg: "var(--sand)",  color: "var(--earth)"   },
  REGISTRATION_OPEN: { bg: "#e8f4e8",      color: "#4a6940"        },
  IN_PROGRESS:       { bg: "#fef3e8",      color: "#b45c1a"        },
  JUDGING:           { bg: "#f0edf8",      color: "#6b50a8"        },
  COMPLETED:         { bg: "#ede9e0",      color: "var(--ink)"     },
};

type FormData = {
  title: string; theme: string; description: string;
  bannerUrl: string; prizes: string;
  startDate: string; endDate: string;
  registrationDeadline: string; submissionDeadline: string;
  maxTeamSize: string; minTeamSize: string;
  status: HackathonStatus;
};

const EMPTY_FORM: FormData = {
  title: "", theme: "", description: "",
  bannerUrl: "", prizes: "",
  startDate: "", endDate: "",
  registrationDeadline: "", submissionDeadline: "",
  maxTeamSize: "4", minTeamSize: "2",
  status: "DRAFT",
};

function toLocal(iso: string) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

function fromLocal(local: string) {
  return local ? new Date(local).toISOString() : "";
}

export default function AdminHackathonsPage() {
  const { data: hackathons = [], isLoading } = useHackathons();
  const createMutation = useCreateHackathon();
  const updateMutation = useUpdateHackathon();
  const deleteMutation = useDeleteHackathon();
  const statusMutation = useUpdateHackathonStatus();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Hackathon | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  }

  function openEdit(h: Hackathon) {
    setEditing(h);
    setForm({
      title: h.title, theme: h.theme, description: h.description,
      bannerUrl: h.bannerUrl ?? "", prizes: h.prizes ?? "",
      startDate: toLocal(h.startDate), endDate: toLocal(h.endDate),
      registrationDeadline: toLocal(h.registrationDeadline),
      submissionDeadline: toLocal(h.submissionDeadline),
      maxTeamSize: String(h.maxTeamSize), minTeamSize: String(h.minTeamSize),
      status: h.status,
    });
    setFormError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    
    const input: CreateHackathonInput = {
      title: form.title, theme: form.theme, description: form.description,
      bannerUrl: form.bannerUrl || null, prizes: form.prizes || null,
      startDate: fromLocal(form.startDate), endDate: fromLocal(form.endDate),
      registrationDeadline: fromLocal(form.registrationDeadline),
      submissionDeadline: fromLocal(form.submissionDeadline),
      maxTeamSize: Number(form.maxTeamSize), minTeamSize: Number(form.minTeamSize),
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ 
          id: editing.id, 
          input: { ...input, status: form.status } as UpdateHackathonInput 
        });
      } else {
        await createMutation.mutateAsync(input);
      }
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.response?.data?.error ?? "Failed to save.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this hackathon? This will also remove all its teams and projects.")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  async function handleStatusChange(id: string, status: HackathonStatus) {
    try {
      await statusMutation.mutateAsync({ id, status });
    } catch (err) {
      console.error("Status change failed", err);
    }
  }

  function field(key: keyof FormData) {
    return {
      value: form[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f: FormData) => ({ ...f, [key]: e.target.value })),
    };
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[1.5rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Hackathons
          </h1>
          <p className="text-[0.83rem] mt-0.5" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Create and manage hackathon events.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={14} className="mr-1.5" /> New hackathon
        </Button>
      </div>

      {/* Slide-in form */}
      {showForm && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-end"
          style={{ background: "rgba(27,26,24,0.35)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div
            className="h-full w-full max-w-lg overflow-y-auto flex flex-col"
            style={{ background: "var(--warm-white)", boxShadow: "-4px 0 24px rgba(27,26,24,0.12)" }}
          >
            {/* Form header */}
            <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: "var(--sand)" }}>
              <h2 className="text-[1.05rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                {editing ? "Edit hackathon" : "New hackathon"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--earth)" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-7 py-6 flex-1">
              {formError && (
                <div className="flex items-center gap-2 text-[0.82rem] px-3 py-2.5 rounded-xl"
                  style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}>
                  <AlertCircle size={13} className="shrink-0" /> {formError}
                </div>
              )}

              <Input id="title" label="Title" required {...field("title")} placeholder="e.g. BuildAI Hackathon 2026" />
              <Input id="theme" label="Theme" required {...field("theme")} placeholder="e.g. AI for Human Flourishing" />

              <div className="flex flex-col gap-1">
                <label className="text-[0.78rem] font-semibold"
                  style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the hackathon…"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-[0.88rem] resize-none"
                  style={{ borderColor: "var(--sand)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-body)", outline: "none" }}
                  {...field("description")}
                />
              </div>

              <Input id="bannerUrl" label="Banner URL (optional)" {...field("bannerUrl")} placeholder="https://…" />
              <Input id="prizes" label="Prizes (optional)" {...field("prizes")} placeholder="e.g. $500, Claude API credits…" />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[0.78rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    Start date
                  </label>
                  <input type="datetime-local" required
                    className="rounded-xl border px-3 py-2.5 text-[0.85rem]"
                    style={{ borderColor: "var(--sand)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    {...field("startDate")} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.78rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    End date
                  </label>
                  <input type="datetime-local" required
                    className="rounded-xl border px-3 py-2.5 text-[0.85rem]"
                    style={{ borderColor: "var(--sand)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    {...field("endDate")} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.78rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    Registration closes
                  </label>
                  <input type="datetime-local" required
                    className="rounded-xl border px-3 py-2.5 text-[0.85rem]"
                    style={{ borderColor: "var(--sand)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    {...field("registrationDeadline")} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.78rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    Submission deadline
                  </label>
                  <input type="datetime-local" required
                    className="rounded-xl border px-3 py-2.5 text-[0.85rem]"
                    style={{ borderColor: "var(--sand)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    {...field("submissionDeadline")} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.78rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    Min team size
                  </label>
                  <input type="number" min={1} max={10} required
                    className="rounded-xl border px-3 py-2.5 text-[0.85rem]"
                    style={{ borderColor: "var(--sand)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    {...field("minTeamSize")} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.78rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    Max team size
                  </label>
                  <input type="number" min={1} max={10} required
                    className="rounded-xl border px-3 py-2.5 text-[0.85rem]"
                    style={{ borderColor: "var(--sand)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    {...field("maxTeamSize")} />
                </div>
              </div>

              {editing && (
                <div className="flex flex-col gap-1">
                  <label className="text-[0.78rem] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    Status
                  </label>
                  <select
                    className="rounded-xl border px-3 py-2.5 text-[0.85rem]"
                    style={{ borderColor: "var(--sand)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as HackathonStatus }))}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2.5 mt-2">
                <Button type="submit" loading={createMutation.isPending || updateMutation.isPending} loadingText="Saving…" className="flex-1">
                  {editing ? "Save changes" : "Create hackathon"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hackathons list */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-12 justify-center text-[0.88rem]"
          style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : hackathons.length === 0 ? (
        <div
          className="rounded-2xl border px-8 py-12 text-center"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
        >
          <p className="text-[0.95rem] font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            No hackathons yet
          </p>
          <p className="text-[0.85rem] mb-5" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Create your first hackathon to get started.
          </p>
          <Button onClick={openCreate}><Plus size={14} className="mr-1.5" /> New hackathon</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {hackathons.map((h) => (
            <div
              key={h.id}
              className="rounded-2xl border px-6 py-5"
              style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <h3 className="text-[1rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                      {h.title}
                    </h3>
                    <span
                      className="text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                      style={{ ...STATUS_STYLE[h.status], fontFamily: "var(--font-display)" }}
                    >
                      {STATUS_LABEL[h.status]}
                    </span>
                  </div>
                  <p className="text-[0.82rem] mb-3" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                    {h.theme}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[0.75rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                    <span>{h._count?.teams || 0} teams</span>
                    <span>Reg. closes {new Date(h.registrationDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>Hack day {new Date(h.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Quick status selector */}
                  <div className="relative flex items-center">
                    <select
                      value={h.status}
                      disabled={statusMutation.isPending && statusMutation.variables?.id === h.id}
                      onChange={(e) => handleStatusChange(h.id, e.target.value as HackathonStatus)}
                      className="appearance-none rounded-lg border pl-2.5 pr-7 py-1.5 text-[0.75rem] font-medium"
                      style={{
                        borderColor: "var(--sand)", background: "var(--cream)",
                        color: "var(--ink)", fontFamily: "var(--font-display)", cursor: "pointer",
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 pointer-events-none" style={{ color: "var(--earth)" }} />
                  </div>
                  <button
                    onClick={() => openEdit(h as any)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: "var(--sand)", border: "none", cursor: "pointer", color: "var(--ink)" }}
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(h.id)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === h.id}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: "#fdf0ed", border: "none", cursor: "pointer", color: "var(--claude-deep)" }}
                    title="Delete"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === h.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
