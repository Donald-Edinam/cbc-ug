"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function VerifyEmailConfirmPage() {
  return (
    <Suspense>
      <VerifyEmailConfirmContent />
    </Suspense>
  );
}

type Status = "loading" | "success" | "error";

function VerifyEmailConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMsg("Invalid or missing verification token.");
      setStatus("error");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        );
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error ?? "Verification failed. The link may have expired.");
          setStatus("error");
          return;
        }

        // Re-sign into NextAuth with the fresh tokens (now emailVerified: true)
        const result = await signIn("credentials", {
          callbackType: "google", // reuse the "pass-through" flow
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          redirect: false,
        });

        if (result?.error) {
          setErrorMsg("Verified, but could not start session. Please sign in.");
          setStatus("error");
          return;
        }

        setStatus("success");
        setTimeout(() => router.replace("/"), 2000);
      } catch {
        setErrorMsg("Something went wrong. Check your connection.");
        setStatus("error");
      }
    }

    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-14"
      style={{ background: "var(--cream)" }}
    >
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
            <p
              className="text-[0.82rem] font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              Claude Builders&apos; Club
            </p>
            <p
              className="text-[0.72rem] leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--earth)" }}
            >
              University of Ghana
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl border px-10 py-12 text-center"
          style={{
            background: "var(--warm-white)",
            borderColor: "var(--sand)",
            boxShadow: "0 4px 24px rgba(27,26,24,0.07), 0 1px 4px rgba(27,26,24,0.05)",
          }}
        >
          {status === "loading" && (
            <>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "var(--tag-ai-bg)" }}
              >
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--claude-tan)" }} />
              </div>
              <h1
                className="text-[1.4rem] font-semibold leading-tight mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              >
                Verifying your email…
              </h1>
              <p
                className="text-[0.88rem]"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}
              >
                Just a moment.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "#edf7ea" }}
              >
                <CheckCircle size={24} style={{ color: "#4a6940" }} />
              </div>
              <h1
                className="text-[1.4rem] font-semibold leading-tight mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              >
                Email verified!
              </h1>
              <p
                className="text-[0.88rem]"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}
              >
                Redirecting you to the dashboard…
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "#fdf0ed" }}
              >
                <XCircle size={24} style={{ color: "var(--claude-deep)" }} />
              </div>
              <h1
                className="text-[1.4rem] font-semibold leading-tight mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              >
                Verification failed
              </h1>
              <p
                className="text-[0.88rem] mb-6"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}
              >
                {errorMsg}
              </p>
              <Link
                href="/verify-email"
                className="inline-block text-[0.85rem] font-semibold"
                style={{
                  color: "var(--claude-tan)",
                  fontFamily: "var(--font-display)",
                  textDecoration: "none",
                }}
              >
                Request a new link →
              </Link>
            </>
          )}
        </div>

        {status !== "success" && (
          <p className="text-center mt-5">
            <Link
              href="/login"
              className="text-[0.8rem]"
              style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
            >
              ← Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
