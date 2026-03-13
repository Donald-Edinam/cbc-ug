import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--cream)" }}>
      {children}
    </main>
  );
}
