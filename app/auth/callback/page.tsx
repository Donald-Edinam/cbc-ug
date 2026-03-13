"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const called = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Guard against React strict-mode double-fire
    if (called.current) return;
    called.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      setError(true);
      return;
    }

    signIn("credentials", {
      callbackType: "google",
      accessToken,
      refreshToken,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        setError(true);
      } else {
        router.replace("/dashboard");
        router.refresh();
      }
    });
  }, [searchParams, router]);

  if (error) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ background: "var(--cream)" }}
      >
        <p
          className="text-[0.95rem]"
          style={{ color: "var(--stone)", fontFamily: "var(--font-body)" }}
        >
          Authentication failed. Please try again.
        </p>
        <a
          href="/login"
          className="text-[0.88rem] font-semibold underline underline-offset-2"
          style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}
        >
          Back to sign in
        </a>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-3 px-4"
      style={{ background: "var(--cream)" }}
    >
      {/* Spinner */}
      <div
        className="w-8 h-8 rounded-full border-[2.5px] animate-spin"
        style={{ borderColor: "var(--sand)", borderTopColor: "transparent" }}
      />
      <p
        className="text-[0.88rem]"
        style={{ color: "var(--stone)", fontFamily: "var(--font-display)" }}
      >
        Signing you in…
      </p>
    </main>
  );
}
