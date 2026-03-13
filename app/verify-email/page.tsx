"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { data: session } = useSession();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  async function handleResend() {
    setResending(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.user?.accessToken ? { Authorization: `Bearer ${session.user.accessToken}` } : {}),
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not resend. Try again.");
      } else {
        setResent(true);
      }
    } catch {
      setError("Something went wrong. Check your connection.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-14" style={{ background: "var(--cream)" }}>
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="flex items-center gap-3 mb-8">
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

        <div
          className="rounded-2xl border px-10 py-10 text-center"
          style={{
            background: "var(--warm-white)",
            borderColor: "var(--sand)",
            boxShadow: "0 4px 24px rgba(27,26,24,0.07), 0 1px 4px rgba(27,26,24,0.05)",
          }}
        >
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--tag-ai-bg)" }}
          >
            <Mail size={24} style={{ color: "var(--claude-tan)" }} />
          </div>

          <h1 className="text-[1.5rem] font-semibold leading-tight mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Check your email
          </h1>
          <p className="text-[0.88rem] leading-relaxed mb-1"
            style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            We sent a verification link to
          </p>
          {email && (
            <p className="text-[0.9rem] font-semibold mb-6"
              style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
              {email}
            </p>
          )}

          <p className="text-[0.83rem] leading-relaxed mb-8"
            style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Click the link in the email to verify your account. Check your spam folder if you don&apos;t see it.
          </p>

          {/* Resend */}
          {resent ? (
            <div className="flex items-center justify-center gap-2 text-[0.85rem]"
              style={{ color: "#4a6940", fontFamily: "var(--font-display)" }}>
              <CheckCircle size={15} />
              Email resent successfully
            </div>
          ) : (
            <div>
              {error && (
                <p className="text-[0.82rem] mb-3" style={{ color: "var(--claude-deep)", fontFamily: "var(--font-body)" }}>
                  {error}
                </p>
              )}
              <button
                onClick={handleResend}
                disabled={resending}
                className="flex items-center gap-2 mx-auto text-[0.83rem] font-semibold disabled:opacity-50"
                style={{ color: "var(--claude-tan)", fontFamily: "var(--font-display)", background: "none", border: "none", cursor: "pointer" }}
              >
                <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                {resending ? "Sending…" : "Resend verification email"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-5">
          <Link href="/login" className="text-[0.8rem]"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
