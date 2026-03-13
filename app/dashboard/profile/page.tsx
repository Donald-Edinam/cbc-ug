"use client";

import { Loader2 } from "lucide-react";
import { useMe } from "@/hooks/use-auth";

interface Row {
  label: string;
  value: string | null | undefined;
}

export default function ProfilePage() {
  const { data: me, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  const rows: Row[] = [
    { label: "Full name",         value: me?.name           },
    { label: "Email",             value: me?.email          },
    { label: "University",        value: me?.university     },
    { label: "Program of study",  value: me?.programOfStudy },
    { label: "Level",             value: me?.level          },
    { label: "LinkedIn / GitHub", value: me?.linkedinGithub },
  ];

  return (
    <main className="max-w-2xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-semibold leading-tight mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          Profile
        </h1>
        <p className="text-[0.88rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
          Your registered details
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--warm-white)", border: "1px solid rgba(27,26,24,0.08)" }}
      >
        {/* Avatar row */}
        <div
          className="flex items-center gap-4 px-6 py-5 border-b"
          style={{ borderColor: "rgba(27,26,24,0.07)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-[1.1rem] font-bold shrink-0"
            style={{ background: "var(--sand)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
          >
            {me?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-[1.05rem] font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              {me?.name}
            </p>
            <span
              className="text-[0.72rem] font-medium px-2 py-0.5 rounded-full"
              style={{ background: "var(--sand)", color: "var(--earth)", fontFamily: "var(--font-display)" }}
            >
              {me?.role ?? "PARTICIPANT"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="divide-y" style={{ borderColor: "rgba(27,26,24,0.07)" }}>
          {rows.map(({ label, value }) => {
            if (!value) return null;
            const isLink = label === "LinkedIn / GitHub";
            return (
              <div key={label} className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-wider mb-0.5"
                    style={{ color: "var(--stone)", fontFamily: "var(--font-display)" }}>
                    {label}
                  </p>
                  {isLink ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.9rem] break-all"
                      style={{ color: "var(--earth)", fontFamily: "var(--font-body)", textDecoration: "none" }}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-[0.9rem] break-words"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }}>
                      {value}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
