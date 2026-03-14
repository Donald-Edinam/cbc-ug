"use client";

import { useState, useCallback } from "react";
import {
  Search, Filter, ChevronRight, ChevronLeft, Loader2,
  UserCircle, Shield, Gavel, Building2, User,
} from "lucide-react";
import { useAdminUsersPaginated, useAdminUserCounts, useUpdateUserRole } from "@/hooks/use-admin";
import type { Role } from "@/lib/types";

const ROLES: { value: string; label: string }[] = [
  { value: "", label: "All roles" },
  { value: "PARTICIPANT", label: "Participant" },
  { value: "JUDGE", label: "Judge" },
  { value: "ORGANIZER", label: "Organizer" },
  { value: "ADMIN", label: "Admin" },
];

const ROLE_STYLES: Record<string, { bg: string; color: string; Icon: React.ElementType }> = {
  ADMIN:       { bg: "#fef0f0", color: "#c0392b", Icon: Shield },
  ORGANIZER:   { bg: "#fef3e8", color: "#b45c1a", Icon: Building2 },
  JUDGE:       { bg: "var(--tag-ai-bg)", color: "var(--claude-tan)", Icon: Gavel },
  PARTICIPANT: { bg: "var(--sand)", color: "var(--earth)", Icon: User },
};

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: counts } = useAdminUserCounts();
  const { data, isLoading } = useAdminUsersPaginated({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    role,
  });

  const updateRole = useUpdateUserRole();

  // Debounce search
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 300);
  }, []);

  function handleRoleChange(val: string) {
    setRole(val);
    setPage(1);
  }

  async function handleUpdateRole(userId: string, newRole: Role) {
    setEditingId(userId);
    try {
      await updateRole.mutateAsync({ userId, role: newRole });
    } finally {
      setEditingId(null);
    }
  }

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-extrabold tracking-tight mb-1"
            style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}
          >
            Users
          </h1>
          <p className="text-sm font-medium" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
            Manage accounts and roles across the platform.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Role filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" style={{ color: "var(--earth)" }} />
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="pl-8 pr-8 py-2 rounded-xl border text-[0.75rem] font-bold appearance-none transition-all hover:shadow-sm cursor-pointer"
              style={{ background: "var(--warm-white)", border: "1px solid var(--sand)", color: "var(--ink)", outline: "none" }}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color: "var(--earth)" }} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["PARTICIPANT", "JUDGE", "ORGANIZER", "ADMIN"] as const).map((r) => {
          const s = ROLE_STYLES[r];
          return (
            <button
              key={r}
              onClick={() => handleRoleChange(role === r ? "" : r)}
              className="p-4 rounded-2xl border text-left transition-all hover:shadow-sm"
              style={{
                background: role === r ? s.bg : "var(--warm-white)",
                borderColor: role === r ? s.color + "55" : "var(--sand)",
              }}
            >
              <div className="p-2 rounded-xl w-fit mb-2" style={{ background: "rgba(0,0,0,0.04)" }}>
                <s.Icon size={15} style={{ color: s.color }} />
              </div>
              <p className="text-[0.62rem] font-black uppercase tracking-wider mb-0.5"
                style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                {r.charAt(0) + r.slice(1).toLowerCase()}s
              </p>
              <p className="text-xl font-black" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                {counts ? (counts[r] ?? 0) : "…"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--earth)" }} />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-[0.85rem] outline-none transition-all"
          style={{
            background: "var(--warm-white)",
            borderColor: "var(--sand)",
            color: "var(--ink)",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden shadow-sm"
        style={{ background: "var(--warm-white)", borderColor: "var(--sand)" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--sand)", background: "rgba(0,0,0,0.01)" }}>
                {["User", "Email", "Role", "Joined", "Change Role"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-wider"
                    style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--sand)" }}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 size={22} className="animate-spin mx-auto opacity-30" style={{ color: "var(--earth)" }} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <UserCircle size={40} style={{ color: "var(--earth)" }} />
                      <p className="text-[0.88rem] font-semibold" style={{ color: "var(--earth)", fontFamily: "var(--font-display)" }}>
                        No users found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const rs = ROLE_STYLES[user.role] ?? ROLE_STYLES.PARTICIPANT;
                  const isEditing = editingId === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[0.72rem] font-bold shrink-0"
                            style={{ background: rs.bg, color: rs.color, fontFamily: "var(--font-display)" }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-[0.85rem] font-semibold leading-tight"
                            style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                            {user.name}
                          </p>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <p className="text-[0.8rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                          {user.email}
                        </p>
                      </td>

                      {/* Role badge */}
                      <td className="px-6 py-4">
                        <span
                          className="flex items-center gap-1.5 w-fit text-[0.68rem] font-bold px-2.5 py-1 rounded-full"
                          style={{ background: rs.bg, color: rs.color, fontFamily: "var(--font-display)" }}
                        >
                          <rs.Icon size={10} />
                          {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <p className="text-[0.78rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
                          {new Date(user.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </td>

                      {/* Change role */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <Loader2 size={14} className="animate-spin" style={{ color: "var(--earth)" }} />
                        ) : (
                          <div className="relative">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value as Role)}
                              className="pl-3 pr-7 py-1.5 rounded-xl border text-[0.72rem] font-bold appearance-none cursor-pointer transition-all hover:shadow-sm"
                              style={{
                                background: "var(--warm-white)",
                                border: "1px solid var(--sand)",
                                color: "var(--ink)",
                                outline: "none",
                                fontFamily: "var(--font-display)",
                              }}
                            >
                              {(["PARTICIPANT", "JUDGE", "ORGANIZER", "ADMIN"] as const).map((r) => (
                                <option key={r} value={r}>
                                  {r.charAt(0) + r.slice(1).toLowerCase()}
                                </option>
                              ))}
                            </select>
                            <ChevronRight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color: "var(--earth)" }} />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {!isLoading && total > 0 && (
          <div
            className="flex items-center justify-between px-6 py-4 border-t"
            style={{ borderColor: "var(--sand)" }}
          >
            <p className="text-[0.75rem]" style={{ color: "var(--earth)", fontFamily: "var(--font-body)" }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[0.75rem] font-semibold transition-all disabled:opacity-30 hover:shadow-sm"
                style={{
                  background: "var(--warm-white)",
                  borderColor: "var(--sand)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-display)",
                  cursor: page === 1 ? "default" : "pointer",
                }}
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <span className="text-[0.75rem] font-bold px-1" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[0.75rem] font-semibold transition-all disabled:opacity-30 hover:shadow-sm"
                style={{
                  background: "var(--warm-white)",
                  borderColor: "var(--sand)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-display)",
                  cursor: page >= totalPages ? "default" : "pointer",
                }}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
