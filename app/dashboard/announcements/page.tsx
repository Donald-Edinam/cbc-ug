"use client";

import { useMemo } from "react";
import { Loader2, Bell, Megaphone, Mail, Users } from "lucide-react";
import { useHackathons, useHackathon } from "@/hooks/use-hackathons";
import { useHackathonTeams } from "@/hooks/use-teams";

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AnnouncementsPage() {
  const { data: hackathons = [], isLoading: loadingHackathons } = useHackathons();

  const activeHackathon = useMemo(
    () =>
      hackathons.find((h) => h.status === "REGISTRATION_OPEN") ??
      hackathons.find((h) => h.status === "IN_PROGRESS") ??
      hackathons[0] ?? null,
    [hackathons],
  );

  const { data: hackathonDetail, isLoading: loadingDetail } = useHackathon(
    activeHackathon?.id ?? "",
  );

  const { data: teams = [] } = useHackathonTeams(activeHackathon?.id ?? "");

  const announcements = hackathonDetail?.announcements ?? [];

  if (loadingHackathons || loadingDetail) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-semibold leading-tight mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          Announcements
        </h1>
        <p className="text-[0.88rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
          {activeHackathon
            ? `Updates for ${activeHackathon.title}`
            : "No active hackathon"}
        </p>
      </div>

      {/* No hackathon */}
      {!activeHackathon && (
        <div
          className="rounded-2xl border px-8 py-10 text-center"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
        >
          <p className="text-[0.9rem] font-semibold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            No active hackathon
          </p>
          <p className="text-[0.85rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Announcements will appear here once a hackathon is live.
          </p>
        </div>
      )}

      {/* Empty announcements */}
      {activeHackathon && announcements.length === 0 && (
        <div
          className="rounded-2xl border px-8 py-12 text-center flex flex-col items-center gap-3"
          style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--sand)" }}
          >
            <Bell size={20} style={{ color: "var(--earth)" }} />
          </div>
          <div>
            <p className="text-[0.9rem] font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              No announcements yet
            </p>
            <p className="text-[0.85rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
              Check back here for updates from the organizers.
            </p>
          </div>
        </div>
      )}

      {/* Announcements list */}
      {announcements.length > 0 && (
        <div className="flex flex-col gap-4">
          {[...announcements]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((ann) => (
              <div
                key={ann.id}
                className="rounded-2xl border px-6 py-5"
                style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "var(--tag-ai-bg)" }}
                  >
                    <Megaphone size={14} style={{ color: "var(--claude-tan)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="text-[0.95rem] font-semibold"
                        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                        {ann.title}
                      </h3>
                      <span className="text-[0.72rem] shrink-0"
                        style={{ color: "var(--earth)", fontFamily: "var(--font-display)", opacity: 0.6 }}>
                        {fmt(ann.createdAt)}
                      </span>
                    </div>
                    {/* Badges */}
                    {(ann.targetType === "TEAM" || ann.sentViaEmail) && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {ann.targetType === "TEAM" && (
                          <span
                            className="flex items-center gap-1 text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}
                          >
                            <Users size={10} />
                            {teams.find((t) => t.id === ann.targetTeamId)?.name ?? "Your team"}
                          </span>
                        )}
                        {ann.sentViaEmail && (
                          <span
                            className="flex items-center gap-1 text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "#e8f4e8", color: "#4a6940", fontFamily: "var(--font-display)" }}
                          >
                            <Mail size={10} /> Sent via email
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-[0.88rem] leading-relaxed whitespace-pre-wrap"
                      style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                      {ann.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
