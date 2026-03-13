"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ChevronDown, Loader2, AlertCircle, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  useAdminHackathons, 
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
  const { data: hackathons = [], isLoading } = useAdminHackathons();

  console.log("Logging hackathon", hackathons);

  const router = useRouter();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-[1.75rem] font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Hackathons
          </h1>
          <p className="text-[0.85rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Manage and monitor all your hackathon events in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => router.push("/admin/hackathons/new")}
            className="group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus size={16} className="relative z-10" />
            <span className="relative z-10 font-semibold tracking-wide">New hackathon</span>
          </Button>
        </div>
      </div>


      {/* Hackathons list */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-12 justify-center text-[0.88rem]"
          style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : hackathons.length === 0 ? (
        <div
          className="relative overflow-hidden rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center px-8 py-20 text-center animate-in fade-in zoom-in duration-700"
          style={{ 
            background: "var(--warm-white)", 
            borderColor: "var(--sand)",
          }}
        >
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sand/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 mb-6 group">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
              style={{ background: "var(--sand-light, #f8f6f2)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}>
              <Trophy size={40} className="text-claude-tan transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
          
          <h3 className="text-[1.25rem] font-bold mb-2 relative z-10" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            No Hackathons Yet
          </h3>
          <p className="text-[0.9rem] max-w-sm mb-10 leading-relaxed relative z-10" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            The arena is quiet. Ready to spark some innovation? Create your first event to get the club building.
          </p>
          
          <Button 
            onClick={() => router.push("/admin/hackathons/new")}
            className="relative z-10 flex items-center gap-2.5 px-8 py-3 rounded-2xl font-bold tracking-wide shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            Start New Event
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {hackathons.map((h, idx) => (
            <div
              key={h.id}
              className="group rounded-[1.5rem] border px-6 py-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ 
                background: "var(--warm-white)", 
                borderColor: "var(--sand)",
                animationDelay: `${idx * 100}ms`
              }}
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
