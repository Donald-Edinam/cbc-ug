"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Info, Calendar, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateHackathon } from "@/hooks/use-hackathons";
import { BannerUpload } from "@/components/banner-upload";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { CreateHackathonInput } from "@/lib/types";

export default function NewHackathonPage() {
  const router = useRouter();
  const createMutation = useCreateHackathon();
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    theme: "",
    description: "",
    bannerUrl: "",
    prizes: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    registrationDeadline: null as Date | null,
    submissionDeadline: null as Date | null,
    maxTeamSize: "4",
    minTeamSize: "2",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.bannerUrl) {
      setError("Please upload a hackathon banner to continue.");
      return;
    }

    const input: CreateHackathonInput = {
      ...form,
      bannerUrl: form.bannerUrl,
      prizes: form.prizes || null,
      startDate: form.startDate ? form.startDate.toISOString() : "",
      endDate: form.endDate ? form.endDate.toISOString() : "",
      registrationDeadline: form.registrationDeadline ? form.registrationDeadline.toISOString() : "",
      submissionDeadline: form.submissionDeadline ? form.submissionDeadline.toISOString() : "",
      maxTeamSize: Number(form.maxTeamSize),
      minTeamSize: Number(form.minTeamSize),
    };

    try {
      await createMutation.mutateAsync(input);
      router.push("/admin/hackathons");
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to create hackathon. Please try again.");
    }
  }

  const updateField = (key: string, value: any) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2.5 rounded-lg hover:bg-sand/20 transition-colors text-earth"
          title="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Create New Event
          </h1>
          <p className="text-[0.85rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Launch a new hackathon arena for the community.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Banner Section */}
        <section className="bg-white/40 dark:bg-ink-soft/20 rounded-2xl p-1 border border-sand/50 shadow-sm overflow-hidden">
          <BannerUpload 
            onUpload={(url) => updateField("bannerUrl", url)} 
            defaultValue={form.bannerUrl}
          />
        </section>

        {/* Form Error */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 animate-in shake duration-500">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[0.9rem] font-medium">{error}</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-6 bg-warm-white/30 p-8 rounded-2xl border border-sand/30 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-sand/20 text-claude-tan">
                <Info size={18} />
              </div>
              <h2 className="text-[1.1rem] font-bold" style={{ fontFamily: "var(--font-display)" }}>Basic Information</h2>
            </div>
            
            <Input 
              label="Event Title" 
              required 
              placeholder="e.g. BuildAI Hackathon 2026"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
            
            <Input 
              label="Grand Theme" 
              required 
              placeholder="e.g. AI for Human Flourishing"
              value={form.theme}
              onChange={(e) => updateField("theme", e.target.value)}
            />

            <div className="space-y-2">
              <label className="text-[0.8rem] font-bold tracking-tight px-1" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                About the Event
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share the vision, goals, and what makes this hackathon unique..."
                className="w-full rounded-lg border px-4 py-3.5 text-[0.9rem] resize-none transition-all focus:ring-2 focus:ring-claude-tan/20 focus:border-claude-tan outline-none"
                style={{ borderColor: "var(--stone)", background: "var(--sand)", border: "1.5px solid var(--stone)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
            
            <Input 
              label="Prizes & Rewards" 
              placeholder="e.g. $10,000 Total Pool, Claude API Credits..."
              value={form.prizes}
              onChange={(e) => updateField("prizes", e.target.value)}
            />
          </section>

          {/* Dates & Constraints */}
          <div className="space-y-8">
            <section className="space-y-6 bg-warm-white/30 p-8 rounded-2xl border border-sand/30 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-sand/20 text-claude-tan">
                  <Calendar size={18} />
                </div>
                <h2 className="text-[1.1rem] font-bold" style={{ fontFamily: "var(--font-display)" }}>Schedule</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DateTimePicker 
                  label="Hackathon Start" 
                  required
                  selected={form.startDate}
                  onChange={(date) => updateField("startDate", date)}
                />
                <DateTimePicker 
                  label="Hackathon End" 
                  required
                  selected={form.endDate}
                  onChange={(date) => updateField("endDate", date)}
                />
                <DateTimePicker 
                  label="Registration Ends" 
                  required
                  selected={form.registrationDeadline}
                  onChange={(date) => updateField("registrationDeadline", date)}
                />
                <DateTimePicker 
                  label="Submissions Due" 
                  required
                  selected={form.submissionDeadline}
                  onChange={(date) => updateField("submissionDeadline", date)}
                />
              </div>
            </section>

            <section className="space-y-6 bg-warm-white/30 p-8 rounded-2xl border border-sand/30 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-sand/20 text-claude-tan">
                  <Users size={18} />
                </div>
                <h2 className="text-[1.1rem] font-bold" style={{ fontFamily: "var(--font-display)" }}>Teams & Capacity</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  type="number" min={1} max={10} 
                  label="Min Team Size" 
                  value={form.minTeamSize}
                  onChange={(e) => updateField("minTeamSize", e.target.value)}
                />
                <Input 
                  type="number" min={1} max={10} 
                  label="Max Team Size" 
                  value={form.maxTeamSize}
                  onChange={(e) => updateField("maxTeamSize", e.target.value)}
                />
              </div>
            </section>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-8 border-t border-sand/30">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => router.back()}
            className="px-8 py-3 rounded-xl font-semibold border-2 border-sand"
          >
            Discard
          </Button>
          <Button 
            type="submit" 
            loading={createMutation.isPending} 
            loadingText="Launching Arena..."
            className="px-10 py-3 rounded-xl font-bold text-[1rem] shadow-xl hover:-translate-y-1 transition-all"
          >
            Launch Hackathon
          </Button>
        </div>
      </form>
    </div>
  );
}
