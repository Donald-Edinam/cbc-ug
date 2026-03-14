"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function MagicPage() {
  return (
    <Suspense>
      <MagicVerify />
    </Suspense>
  );
}

function MagicVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No token provided.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`${API_URL}/api/auth/magic-link/verify?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "This link has expired or already been used.");
          return;
        }

        const result = await signIn("credentials", {
          callbackType: "magic",
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          redirect: false,
        });

        if (result?.error) {
          setError("Sign in failed. Please request a new link.");
        } else {
          const role = data.user?.role;
          router.replace(role === "JUDGE" ? "/judge" : "/dashboard");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    }

    verify();
  }, [token, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--cream)" }}
    >
      <div
        className="rounded-2xl border px-10 py-10 w-full max-w-sm text-center"
        style={{
          background: "var(--warm-white)",
          borderColor: "var(--sand)",
          boxShadow: "0 4px 24px rgba(27,26,24,0.07), 0 1px 4px rgba(27,26,24,0.05)",
        }}
      >
        {error ? (
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "var(--tag-ai-bg)" }}
            >
              <AlertCircle size={22} style={{ color: "var(--claude-deep)" }} />
            </div>
            <div>
              <h2 className="text-[1.1rem] font-semibold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                Link invalid
              </h2>
              <p className="text-[0.85rem]"
                style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                {error}
              </p>
            </div>
            <Link
              href="/login"
              className="text-[0.85rem] font-semibold px-5 py-2.5 rounded-xl"
              style={{
                background: "var(--ink)",
                color: "var(--cream)",
                fontFamily: "var(--font-display)",
                textDecoration: "none",
              }}
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--earth)" }} />
            <p className="text-[0.88rem]"
              style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
              Signing you in…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
