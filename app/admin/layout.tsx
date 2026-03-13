"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Trophy, Users, LogOut, Gavel, Rocket } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/admin",            label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/admin/hackathons", label: "Hackathons", Icon: Trophy },
  { href: "/admin/teams",      label: "Teams",      Icon: Users  },
  { href: "/admin/projects",   label: "Projects",   Icon: Rocket },
  { href: "/admin/judging",    label: "Judging",    Icon: Gavel  },
  { href: "/admin/users",      label: "Users",      Icon: Users  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    const role = session?.user?.role;
    if (!role || !["ADMIN", "ORGANIZER"].includes(role)) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") return null;
  if (!session?.user?.role || !["ADMIN", "ORGANIZER"].includes(session.user.role)) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--cream)", transition: "background 0.3s ease" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col border-r transition-colors duration-300"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: "var(--sand)" }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-bold tracking-wider shrink-0"
            style={{ background: "var(--claude-tan)", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            CBC
          </div>
          <div>
            <p className="text-[0.75rem] font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              Admin
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
                  fontFamily: "var(--font-display)" 
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

      {/* Main */}
      <main className="flex-1 min-w-0 px-8 py-8">{children}</main>
    </div>
  );
}
