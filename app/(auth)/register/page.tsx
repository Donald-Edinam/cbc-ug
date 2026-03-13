"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const LEVELS = [
  { value: "L100", label: "L100" },
  { value: "L200", label: "L200" },
  { value: "L300", label: "L300" },
  { value: "L400", label: "L400" },
  { value: "Other", label: "Other" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState<"University of Ghana" | "Other" | "">("");
  const [universityOther, setUniversityOther] = useState("");
  const [programOfStudy, setProgramOfStudy] = useState("");
  const [level, setLevel] = useState("");
  const [linkedinGithub, setLinkedinGithub] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!university) {
      setError("Please select your university.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          university: university === "Other" ? universityOther || "Other" : university,
          programOfStudy,
          level,
...(linkedinGithub && { linkedinGithub }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setDone(true);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* Brand mark — only visible on mobile */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[0.68rem] font-bold tracking-wider shrink-0"
          style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}
        >
          CBC
        </div>
        <div>
          <p className="text-[0.82rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Claude Builders&apos; Club
          </p>
          <p className="text-[0.72rem] leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--earth)" }}>
            University of Ghana
          </p>
        </div>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border px-10 py-10"
        style={{
          background: "var(--warm-white)",
          borderColor: "var(--sand)",
          boxShadow: "0 4px 24px rgba(27,26,24,0.07), 0 1px 4px rgba(27,26,24,0.05)",
        }}
      >
        {done ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "#e8f4e8" }}
            >
              <CheckCircle2 size={24} style={{ color: "#4a6940" }} />
            </div>
            <div>
              <h2 className="text-[1.3rem] font-semibold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                Check your email
              </h2>
              <p className="text-[0.88rem]"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                We sent an access link to <strong>{email}</strong>. Click it to join the hackathon dashboard.
              </p>
              <p className="text-[0.78rem] mt-2" style={{ color: "var(--stone)", fontFamily: "var(--font-body)" }}>
                The link expires in 30 days.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-[1.75rem] font-semibold leading-tight mb-1.5"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                Show interest
              </h1>
              <p className="text-[0.88rem]"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                Tell us a bit about yourself and we&apos;ll keep you in the loop.
              </p>
            </div>

            {error && (
              <div
                className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 mb-5 text-[0.85rem]"
                style={{ background: "var(--tag-ai-bg)", color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}
              >
                <AlertCircle size={14} className="mt-px shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                id="name"
                label="Full Name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kwame Mensah"
              />

              <div className="flex flex-col gap-1">
                <Input
                  id="email"
                  label="Email (for hackathon communication)"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <p className="text-[0.75rem] px-0.5" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                  Preferably your personal email
                </p>
              </div>

              {/* University */}
              <fieldset>
                <legend className="text-[0.82rem] font-semibold mb-2"
                  style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                  Current University <span style={{ color: "var(--claude-tan)" }}>*</span>
                </legend>
                <div className="flex flex-col gap-2">
                  {(["University of Ghana", "Other"] as const).map((opt) => (
                    <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="university"
                        value={opt}
                        checked={university === opt}
                        onChange={() => setUniversity(opt)}
                        className="accent-[var(--claude-tan)]"
                      />
                      <span className="text-[0.85rem]"
                        style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
                {university === "Other" && (
                  <div className="mt-2">
                    <Input
                      id="university-other"
                      label=""
                      type="text"
                      required
                      value={universityOther}
                      onChange={(e) => setUniversityOther(e.target.value)}
                      placeholder="Enter your university"
                    />
                  </div>
                )}
              </fieldset>

              <Input
                id="program"
                label="Program of Study"
                type="text"
                required
                value={programOfStudy}
                onChange={(e) => setProgramOfStudy(e.target.value)}
                placeholder="e.g. Computer Science"
              />

              <Select
                id="level"
                label="Current Level"
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="Choose…"
                options={LEVELS}
              />

              <Input
                id="linkedin"
                label="LinkedIn / GitHub Profile Link"
                type="url"
                value={linkedinGithub}
                onChange={(e) => setLinkedinGithub(e.target.value)}
                placeholder="https://github.com/username"
              />

              <Button type="submit" loading={loading} loadingText="Submitting…" className="mt-1">
                Submit interest
              </Button>
            </form>

            <p className="text-center text-[0.83rem] mt-6"
              style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
              Already registered?{" "}
              <Link href="/login" className="font-semibold"
                style={{ color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}>
                Get access link
              </Link>
            </p>
          </>
        )}
      </div>

      <p className="text-center mt-5">
        <Link href="/" className="text-[0.8rem]"
          style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
