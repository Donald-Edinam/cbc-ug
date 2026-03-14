"use client";

import { Loader2, Trophy, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useJudgeAssignments } from "@/hooks/use-judging";

export default function JudgeHomePage() {
  const { data: hackathons, isLoading } = useJudgeAssignments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-extrabold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          My Hackathons
        </h1>
        <p className="text-[0.88rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
          Select a hackathon to start scoring projects.
        </p>
      </div>

      {!hackathons?.length ? (
        <div
          className="rounded-2xl border px-8 py-12 text-center"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--sand)" }}
          >
            <Trophy size={22} style={{ color: "var(--earth)" }} />
          </div>
          <p className="text-[0.95rem] font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            No assignments yet
          </p>
          <p className="text-[0.82rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            You haven&apos;t been assigned to any hackathon yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {hackathons.map((h) => (
            <Link
              key={h.id}
              href={`/judge/${h.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="flex items-center justify-between px-6 py-5 rounded-2xl border transition-all hover:shadow-sm group cursor-pointer"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--tag-ai-bg)" }}
                  >
                    <Trophy size={18} style={{ color: "var(--claude-tan)" }} />
                  </div>
                  <div>
                    <p className="text-[0.95rem] font-semibold leading-tight" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                      {h.title}
                    </p>
                    {h.startDate && (
                      <p className="flex items-center gap-1 text-[0.75rem] mt-0.5" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                        <Calendar size={11} />
                        {new Date(h.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "var(--earth)" }} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
