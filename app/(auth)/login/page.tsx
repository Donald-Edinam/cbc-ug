"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  // Admin mode
  const [adminMode, setAdminMode] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Participant: request magic link ──────────────────────────────────────────
  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // ── Admin: password login ────────────────────────────────────────────────────
  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      setTimeout(() => {
        router.push(callbackUrl === "/dashboard" || callbackUrl === "/" ? "/admin" : callbackUrl);
        router.refresh();
      }, 100);
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
        {sent ? (
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
                We sent an access link to <strong>{email}</strong>. Click it to sign in.
              </p>
              <p className="text-[0.78rem] mt-2" style={{ color: "var(--stone)", fontFamily: "var(--font-body)" }}>
                The link expires in 15 minutes.
              </p>
            </div>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-[0.8rem] underline"
              style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-[1.75rem] font-semibold leading-tight mb-1.5"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                {adminMode ? "Admin sign in" : "Sign in"}
              </h1>
              <p className="text-[0.88rem]"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                {adminMode
                  ? "Enter your admin credentials."
                  : "Enter your email and we\u2019ll send you an access link."}
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

            {adminMode ? (
              <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cbcug.com"
                />
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="p-1 rounded-lg transition-all duration-150"
                      style={{ color: "var(--earth)" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <Button type="submit" loading={loading} loadingText="Signing in…" className="mt-2">
                  Sign in
                </Button>
              </form>
            ) : (
              <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Button type="submit" loading={loading} loadingText="Sending link…" className="mt-2">
                  Send access link
                </Button>
              </form>
            )}

            <div className="flex justify-between items-center mt-6">
              <p className="text-[0.83rem]"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                New here?{" "}
                <Link href="/register" className="font-semibold"
                  style={{ color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}>
                  Register interest
                </Link>
              </p>
              <button
                type="button"
                onClick={() => { setAdminMode((v) => !v); setError(""); }}
                className="text-[0.75rem]"
                style={{ color: "var(--stone)", fontFamily: "var(--font-display)" }}
              >
                {adminMode ? "\u2190 Back" : "Admin login"}
              </button>
            </div>
          </>
        )}
      </div>

      <p className="text-center mt-5">
        <Link href="/" className="text-[0.8rem]"
          style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
          \u2190 Back to site
        </Link>
      </p>
    </div>
  );
}
