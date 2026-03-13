"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Trophy, Users, LogOut, Gavel, Rocket } from "lucide-react";

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
    <div className="min-h-screen flex" style={{ background: "var(--cream)" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col border-r"
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
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.82rem] font-medium transition-colors"
              style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}
            >
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "var(--sand)" }}>
          <p className="text-[0.72rem] px-3 mb-1 truncate" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            {session.user.name}
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[0.8rem] font-medium text-left transition-colors"
            style={{ color: "var(--earth)", fontFamily: "var(--font-display)", background: "none", border: "none", cursor: "pointer" }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 px-8 py-8">{children}</main>
    </div>
  );
}
