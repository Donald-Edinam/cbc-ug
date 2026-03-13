"use client";

import { useHackathons } from "@/hooks/use-hackathons";
import { useAdminUsers } from "@/hooks/use-admin";
import { 
  Trophy, 
  Users, 
  Rocket, 
  Gavel, 
  ChevronRight,
  Plus,
  ArrowUpRight,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function AdminDashboardPage() {
  const { data: hackathons = [], isLoading: loadingHackathons } = useHackathons();
  const { data: users = [], isLoading: loadingUsers } = useAdminUsers();

  const stats = useMemo(() => {
    return [
      {
        label: "Total Hackathons",
        value: hackathons.length,
        icon: Trophy,
        color: "var(--claude-tan)",
        bg: "var(--tag-ai-bg)",
        link: "/admin/hackathons"
      },
      {
        label: "Registered Users",
        value: users.length,
        icon: Users,
        color: "#4a6940",
        bg: "#f1f8f1",
        link: "/admin/users"
      },
      {
        label: "Active Projects",
        value: "...", // Would need a useAllProjects hook for total count across all hackathons
        icon: Rocket,
        color: "#b45c1a",
        bg: "#fdf5f0",
        link: "/admin/projects"
      },
      {
        label: "Judged Projects",
        value: "...", // Placeholder
        icon: Gavel,
        color: "#6b50a8",
        bg: "#f4f2fa",
        link: "/admin/judging"
      },
    ];
  }, [hackathons.length, users.length]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Admin Overview
          </h1>
          <p className="text-[0.95rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Monitor hackathons, teams, and submissions across the platform.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <Link 
            key={idx} 
            href={stat.link}
            className="group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1"
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm"
                  style={{ background: stat.bg, color: stat.color }}
                >
                  <stat.icon size={22} strokeWidth={2} />
                </div>
                <ArrowUpRight size={16} className="text-earth opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-widest mb-1"
                  style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[1.75rem] font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                    {stat.value}
                  </p>
                  <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">+12%</span>
                </div>
              </div>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300">
              <stat.icon size={100} strokeWidth={1} />
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Recent Hackathons */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="rounded-2xl border overflow-hidden shadow-sm flex flex-col h-full" style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <div className="px-6 py-5 border-b flex items-center justify-between bg-white/50 backdrop-blur-sm" style={{ borderColor: "var(--sand)" }}>
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-earth" />
                <h2 className="text-[1rem] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  Recent Hackathons
                </h2>
              </div>
              <Link href="/admin/hackathons">
                <button className="text-[0.78rem] font-semibold text-earth hover:text-ink transition-colors px-3 py-1 rounded-lg hover:bg-sand">
                  View All Projects
                </button>
              </Link>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--sand)" }}>
              {loadingHackathons ? (
                <div className="p-12 text-center text-earth text-sm flex-col items-center gap-2 flex-1 flex justify-center">
                  <div className="w-5 h-5 border-2 border-sand border-t-earth rounded-full animate-spin" />
                  Syncing hackathon data...
                </div>
              ) : hackathons.length === 0 ? (
                <div className="p-12 text-center text-earth text-sm italic flex-1 flex items-center justify-center">No hackathons exist yet. Build something amazing!</div>
              ) : (
                hackathons.slice(0, 4).map((h) => (
                  <Link 
                    key={h.id} 
                    href={`/admin/hackathons?id=${h.id}`}
                    className="flex items-center justify-between p-5 hover:bg-cream/50 transition-colors group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-sand/50 flex items-center justify-center text-ink font-bold text-lg border border-sand">
                        {h.title.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[0.95rem] font-bold group-hover:text-ink transition-colors" style={{ color: "var(--ink)" }}>{h.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[0.72rem] text-earth flex items-center gap-1 font-medium">
                            <Users size={12} /> {h._count?.teams ?? 0} Teams
                          </span>
                          <span className="w-1 h-1 rounded-full bg-sand" />
                          <span className="text-[0.7rem] uppercase tracking-wider font-bold" 
                            style={{ color: h.status === "REGISTRATION_OPEN" ? "#4a6940" : "var(--earth)" }}>
                            {h.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex flex-col items-end">
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-earth">Ends</p>
                        <p className="text-[0.75rem] font-medium">{new Date(h.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-sand/30 group-hover:bg-sand transition-colors">
                        <ChevronRight size={14} className="text-earth group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            {hackathons.length > 4 && (
              <Link href="/admin/hackathons" className="block p-4 text-center text-[0.8rem] font-bold bg-sand/10 hover:bg-sand/20 transition-colors text-earth uppercase tracking-widest border-t" style={{ borderColor: "var(--sand)" }}>
                View {hackathons.length - 4} More Hackathons
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col">
          <div className="rounded-2xl border p-8 flex flex-col justify-between h-full transition-all hover:shadow-md relative overflow-hidden" 
            style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)" }}>
                <Rocket size={24} strokeWidth={1.5} />
              </div>
              <h2 className="text-[1.25rem] font-bold mb-2 tracking-tight" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                Create New Event
              </h2>
              <p className="text-[0.85rem] font-body leading-relaxed mb-8" style={{ color: "var(--earth)" }}>
                Ready to launch the next competition? Start here to set up rules, prizes, and timelines.
              </p>
            </div>
            <Link href="/admin/hackathons?create=true" className="relative z-10">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[0.85rem] font-bold transition-all hover:brightness-110 active:scale-[0.98] shadow-sm"
                style={{ background: "var(--ink)", color: "var(--cream)" }}>
                Launch Hackathon
                <Plus size={18} />
              </button>
            </Link>
            {/* Background overlay icon restored with subtle opacity */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]">
              <Rocket size={160} strokeWidth={1} style={{ color: "var(--ink)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal button for the dashboard view
function Button({ children, size = "md", variant = "primary", className = "", ...props }: any) {
  const sizes = {
    sm: "px-3 py-1.5 text-[0.72rem]",
    md: "px-4 py-2 text-[0.82rem]",
  };
  const variants = {
    primary: { background: "var(--ink)", color: "#fff" },
    ghost: { background: "transparent", color: "var(--earth)" },
  };

  return (
    <button
      className={`rounded-lg font-medium transition-all ${sizes[size as keyof typeof sizes]} ${className}`}
      style={variants[variant as keyof typeof variants]}
      {...props}
    >
      {children}
    </button>
  );
}
