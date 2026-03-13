"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  House, FolderOpen, Bell, User, LogOut, ShieldCheck, Loader2, Users,
} from "lucide-react";

const NAV = [
  { label: "Home",          href: "/dashboard",               icon: House      },
  { label: "Teams",         href: "/dashboard/teams",         icon: Users      },
  { label: "Project",       href: "/dashboard/project",       icon: FolderOpen },
  { label: "Announcements", href: "/dashboard/announcements", icon: Bell       },
  { label: "Profile",       href: "/dashboard/profile",       icon: User       },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  const isAdminOrOrg = ["ADMIN", "ORGANIZER"].includes(session?.user?.role ?? "");

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>

      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-56 flex-col z-20 border-r"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "var(--sand)" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[0.6rem] font-bold tracking-wider shrink-0"
            style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            CBC
          </div>
          <div>
            <p className="text-[0.8rem] font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              Claude Builders&apos; Club
            </p>
            <p className="text-[0.68rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
              University of Ghana
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[0.88rem] transition-all"
                style={{
                  background: active ? "var(--tag-ai-bg)" : "transparent",
                  color: active ? "var(--claude-tan)" : "var(--earth)",
                  fontFamily: "var(--font-display)",
                  fontWeight: active ? 600 : 500,
                  textDecoration: "none",
                }}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: admin + user + sign out */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "var(--sand)" }}>
          {isAdminOrOrg && (
            <a
              href="/admin/hackathons"
              className="flex items-center gap-2 text-[0.8rem] font-medium px-3.5 py-2 rounded-xl mb-2"
              style={{ color: "var(--claude-tan)", background: "var(--tag-ai-bg)", fontFamily: "var(--font-display)", textDecoration: "none" }}
            >
              <ShieldCheck size={14} /> Admin panel
            </a>
          )}
          <p className="text-[0.78rem] px-1 mb-2 truncate"
            style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            {session?.user?.name}
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 text-[0.8rem] font-medium w-full px-3.5 py-2 rounded-xl transition-colors"
            style={{ background: "transparent", border: "none", color: "var(--earth)", cursor: "pointer", fontFamily: "var(--font-display)" }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile / tablet top header ──────────────────────────────── */}
      <header
        className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-bold tracking-wider shrink-0"
            style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            CBC
          </div>
          <span className="text-[0.82rem] font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Claude Builders&apos; Club
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isAdminOrOrg && (
            <a
              href="/admin/hackathons"
              className="flex items-center gap-1.5 text-[0.75rem] font-medium px-2.5 py-1.5 rounded-lg"
              style={{ color: "var(--claude-tan)", background: "var(--tag-ai-bg)", fontFamily: "var(--font-display)", textDecoration: "none" }}
            >
              <ShieldCheck size={12} /> Admin
            </a>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 text-[0.78rem] font-medium p-2 rounded-lg"
            style={{ background: "transparent", border: "none", color: "var(--earth)", cursor: "pointer" }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="lg:pl-56">
        <div className="pb-28 lg:pb-0">
          {children}
        </div>
      </div>

      {/* ── Mobile / tablet bottom nav ──────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around px-2 py-2 border-t"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
              style={{ textDecoration: "none" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: active ? "var(--claude-tan)" : "transparent" }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.8}
                  style={{ color: active ? "#fff" : "var(--earth)" }}
                />
              </div>
              <span
                className="text-[0.62rem] font-medium"
                style={{
                  color: active ? "var(--claude-tan)" : "var(--earth)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
