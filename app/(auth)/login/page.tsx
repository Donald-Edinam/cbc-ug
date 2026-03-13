"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
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
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      // Small delay to allow session to update
      setTimeout(() => {
        router.push(callbackUrl === "/dashboard" || callbackUrl === "/" ? "/dashboard" : callbackUrl);
        router.refresh();
      }, 100);
    }
  }

  function handleGoogleSignIn() {
    setGoogleLoading(true);
    window.location.href = `${API_URL}/api/auth/google`;
  }

  return (
    <div className="w-full max-w-lg">
      {/* Brand mark — only visible on mobile (desktop shows left panel) */}
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
        <div className="mb-6">
          <h1 className="text-[1.75rem] font-semibold leading-tight mb-1.5"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Sign in
          </h1>
          <p className="text-[0.88rem]"
            style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Welcome back — pick up where you left off.
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
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@st.ug.edu.gh"
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

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: "var(--sand)" }} />
          <span className="text-[0.75rem] font-medium"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
            or continue with
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--sand)" }} />
        </div>

        <Button
          variant="secondary"
          onClick={handleGoogleSignIn}
          loading={googleLoading}
          loadingText="Redirecting…"
        >
          <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Google
        </Button>

        <p className="text-center text-[0.83rem] mt-6"
          style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold"
            style={{ color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}>
            Create one
          </Link>
        </p>
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
