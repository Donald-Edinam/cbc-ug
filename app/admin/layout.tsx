"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Trophy, Users, LogOut, Gavel, Rocket,
  Megaphone, X, ShieldCheck, MoreHorizontal,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/admin",               label: "Dashboard",     Icon: LayoutDashboard },
  { href: "/admin/hackathons",    label: "Hackathons",    Icon: Trophy          },
  { href: "/admin/teams",         label: "Teams",         Icon: Users           },
  { href: "/admin/projects",      label: "Projects",      Icon: Rocket          },
  { href: "/admin/judging",       label: "Judging",       Icon: Gavel           },
  { href: "/admin/announcements", label: "Announcements", Icon: Megaphone       },
  { href: "/admin/users",         label: "Users",         Icon: Users           },
];

// Primary items shown in the mobile bottom bar
const BOTTOM_NAV = [
  { href: "/admin",            label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/admin/hackathons", label: "Hackathons", Icon: Trophy          },
  { href: "/admin/judging",    label: "Judging",    Icon: Gavel           },
  { href: "/admin/users",      label: "Users",      Icon: Users           },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    const role = session?.user?.role;
    if (!role || !["ADMIN", "ORGANIZER"].includes(role)) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (status === "loading") return null;
  if (!session?.user?.role || !["ADMIN", "ORGANIZER"].includes(session.user.role)) return null;

  // "More" is active when current page is not in BOTTOM_NAV
  const moreActive = !BOTTOM_NAV.some(
    ({ href }) => pathname === href || (href !== "/admin" && pathname.startsWith(href))
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)", transition: "background 0.3s ease" }}>

      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-56 flex-col z-20 border-r transition-colors duration-300"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: "var(--sand)" }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-bold tracking-wider shrink-0"
            style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            CBC
          </div>
          <div>
            <p className="text-[0.75rem] font-semibold leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              Admin
            </p>
            <p className="text-[0.65rem] leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--earth)" }}>
              CBC-UG
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
          {NAV.map(({ href, label, Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
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
                <Icon size={15} strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ color: isActive ? "var(--claude-tan)" : "inherit" }} />
                <span className={isActive ? "font-bold" : ""}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t" style={{ borderColor: "var(--sand)" }}>
          <div className="flex items-center justify-between gap-2 mb-3 px-3">
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold truncate" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                {session.user.name}
              </p>
              <p className="text-[0.6rem] truncate" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                {session.user.role}
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
        className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-bold tracking-wider shrink-0"
            style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            CBC
          </div>
          <span className="text-[0.85rem] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            Admin
          </span>
          <span
            className="flex items-center gap-1 text-[0.62rem] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "var(--tag-ai-bg)", color: "var(--claude-tan)", fontFamily: "var(--font-display)" }}
          >
            <ShieldCheck size={9} /> {session.user.role}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 rounded-xl"
            style={{ background: "transparent", border: "none", color: "var(--earth)", cursor: "pointer" }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer backdrop ───────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer (slides up from bottom) ────────────────────── */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--sand)" }} />
        </div>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--sand)" }}>
          <p className="text-[0.8rem] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            More
          </p>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg"
            style={{ background: "var(--sand)", border: "none", cursor: "pointer", color: "var(--earth)" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* All nav items in the drawer */}
        <nav className="grid grid-cols-2 gap-2 px-4 py-4">
          {NAV.map(({ href, label, Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all"
                style={{
                  background: isActive ? "var(--tag-ai-bg)" : "var(--cream)",
                  borderColor: isActive ? "var(--claude-tan)" + "44" : "var(--sand)",
                  color: isActive ? "var(--claude-tan)" : "var(--earth)",
                  fontFamily: "var(--font-display)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.83rem",
                  textDecoration: "none",
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-4 pb-6">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2.5 w-full px-4 py-3 rounded-2xl text-[0.85rem] font-medium border transition-all"
            style={{
              color: "var(--earth)",
              fontFamily: "var(--font-display)",
              background: "var(--cream)",
              borderColor: "var(--sand)",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="lg:pl-56">
        <div className="px-5 pt-6 pb-28 lg:px-8 lg:pt-8 lg:pb-8">
          {children}
        </div>
      </div>

      {/* ── Mobile bottom bar ────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-around px-2 py-2 border-t"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        {BOTTOM_NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
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
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8}
                  style={{ color: isActive ? "#fff" : "var(--earth)" }} />
              </div>
              <span
                className="text-[0.62rem] font-medium"
                style={{ color: isActive ? "var(--claude-tan)" : "var(--earth)", fontFamily: "var(--font-display)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: moreActive ? "var(--claude-tan)" : "transparent" }}
          >
            <MoreHorizontal size={20} strokeWidth={moreActive ? 2.2 : 1.8}
              style={{ color: moreActive ? "#fff" : "var(--earth)" }} />
          </div>
          <span
            className="text-[0.62rem] font-medium"
            style={{ color: moreActive ? "var(--claude-tan)" : "var(--earth)", fontFamily: "var(--font-display)" }}
          >
            More
          </span>
        </button>
      </nav>

    </div>
  );
}
