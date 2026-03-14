"use client";

import { useEffect, type ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Gavel, Trophy, LogOut, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/judge", label: "My Hackathons", Icon: Trophy },
];

export default function JudgeLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    const role = session?.user?.role;
    if (role && !["JUDGE", "ADMIN"].includes(role)) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <Loader2 size={22} className="animate-spin" style={{ color: "var(--earth)" }} />
      </div>
    );
  }

  if (!session?.user?.role || !["JUDGE", "ADMIN"].includes(session.user.role)) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)", transition: "background 0.3s ease" }}>

      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-56 flex-col z-20 border-r transition-colors duration-300"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: "var(--sand)" }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--claude-tan)", color: "#fff" }}
          >
            <Gavel size={14} />
          </div>
          <div>
            <p className="text-[0.75rem] font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              Judge Portal
            </p>
            <p className="text-[0.65rem] leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--earth)" }}>
              CBC-UG
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
          {NAV.map(({ href, label, Icon }) => {
            const isActive = pathname === href || (href !== "/judge" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[0.82rem] font-medium transition-all duration-200 ${
                  isActive ? "shadow-sm border" : "hover:bg-sand/10 border border-transparent"
                }`}
                style={{
                  color: isActive ? "var(--ink)" : "var(--earth)",
                  background: isActive ? "var(--sand-light)" : "transparent",
                  borderColor: isActive ? "var(--sand)" : "transparent",
                  fontFamily: "var(--font-display)",
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ color: isActive ? "var(--claude-tan)" : "inherit" }}
                />
                <span className={isActive ? "font-bold" : ""}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "var(--sand)" }}>
          <div className="flex items-center justify-between gap-2 mb-3 px-3">
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold truncate" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                {session.user.name}
              </p>
              <p className="text-[0.6rem] truncate" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                Judge
              </p>
            </div>
            <ThemeToggle />
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[0.8rem] font-medium text-left transition-all hover:bg-red-50 hover:text-red-600 group"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)", background: "none", border: "none", cursor: "pointer" }}
          >
            <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top header ────────────────────────────────────────── */}
      <header
        className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--claude-tan)", color: "#fff" }}
          >
            <Gavel size={13} />
          </div>
          <span className="text-[0.82rem] font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Judge Portal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 p-2 rounded-lg"
            style={{ background: "transparent", border: "none", color: "var(--earth)", cursor: "pointer" }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="lg:pl-56">
        <div className="px-5 pt-6 pb-28 lg:px-8 lg:pt-8 lg:pb-8">
          {children}
        </div>
      </div>

      {/* ── Mobile bottom nav ───────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-around px-2 py-2 border-t"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        {NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== "/judge" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
              style={{ textDecoration: "none" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: isActive ? "var(--claude-tan)" : "transparent" }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{ color: isActive ? "#fff" : "var(--earth)" }}
                />
              </div>
              <span
                className="text-[0.62rem] font-medium"
                style={{
                  color: isActive ? "var(--claude-tan)" : "var(--earth)",
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
