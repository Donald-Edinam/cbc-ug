import type { ReactNode } from "react";
import {
  Bot,
  MessageSquare,
  Trophy,
  BarChart2,
  Rocket,
  BookOpen,
  Brain,
  GitMerge,
} from "lucide-react";

// bg / text / border per chip — dark-mode tag palette from design system
const CHIPS: {
  text: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  top: string;
  left: string;
  delay: string;
  dur: string;
  bg: string;
  color: string;
  border: string;
}[] = [
  // Safe zones: brand mark ≈ top 5–14% left 5–35% | headline ≈ top 35–53% | stats ≈ bottom 20%
  // ── row 1 (right half only, brand mark lives on the left) ──
  { text: "Web app shipped",  Icon: Rocket,       top: "7%",  left: "44%", delay: "3.9s", dur: "5.2s", bg: "#302818", color: "#c4a870", border: "#503e20" },
  { text: "Data pipeline",    Icon: BarChart2,    top: "10%", left: "60%", delay: "0.6s", dur: "6.0s", bg: "#28203a", color: "#b8a0d0", border: "#3e3060" },
  // ── row 2 (full width — below brand mark) ──
  { text: "Hackathon 2026",   Icon: Trophy,       top: "19%", left: "8%",  delay: "2.7s", dur: "4.4s", bg: "#1e2e1a", color: "#8ac470", border: "#2e4a28" },
  { text: "AI chatbot",       Icon: MessageSquare,top: "22%", left: "54%", delay: "1.3s", dur: "5.6s", bg: "#1e2a36", color: "#8ab4d8", border: "#2e4560" },
  // ── row 3 (above headline) ──
  { text: "Claude API",       Icon: Bot,          top: "30%", left: "14%", delay: "0s",   dur: "4.8s", bg: "#3d2318", color: "#d97c5d", border: "#6b3a25" },
  { text: "Model fine-tuned", Icon: Brain,        top: "31%", left: "62%", delay: "0.4s", dur: "5.8s", bg: "#3d2318", color: "#d97c5d", border: "#6b3a25" },
  // ── below headline, above stats ──
  { text: "Study session",    Icon: BookOpen,     top: "62%", left: "6%",  delay: "1.9s", dur: "4.6s", bg: "#1e2a36", color: "#8ab4d8", border: "#2e4560" },
  { text: "PR merged",        Icon: GitMerge,     top: "65%", left: "54%", delay: "3.1s", dur: "4.2s", bg: "#1e2e1a", color: "#8ac470", border: "#2e4a28" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid" style={{ gridTemplateColumns: "1fr 1.35fr" }}>

      {/* ── Left decorative panel (desktop only) ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "#1b1a18", minHeight: "100vh" }}
      >
        {/* Dot-grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(237,233,224,0.06) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(27,26,24,0.65) 100%)",
          }}
        />

        {/* Floating chips — scattered across the full panel */}
        {CHIPS.map((chip) => (
          <div
            key={chip.text}
            className="absolute flex items-center gap-2 rounded-full text-[0.73rem] font-medium pointer-events-none"
            style={{
              top: chip.top,
              left: chip.left,
              padding: "5px 12px 5px 9px",
              background: chip.bg,
              border: `1px solid ${chip.border}`,
              color: chip.color,
              fontFamily: "var(--font-display)",
              whiteSpace: "nowrap",
              zIndex: 0,
              animation: `auth-bob ${chip.dur} ease-in-out ${chip.delay} infinite`,
            }}
          >
            <chip.Icon size={12} strokeWidth={1.8} />
            {chip.text}
          </div>
        ))}

        {/* Top: brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[0.68rem] font-bold tracking-wider shrink-0"
            style={{
              background: "var(--claude-tan)",
              color: "#fff",
              fontFamily: "var(--font-display)",
            }}
          >
            CBC
          </div>
          <div>
            <p
              className="text-[0.82rem] font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#ede9e0" }}
            >
              Claude Builders&apos; Club
            </p>
            <p
              className="text-[0.72rem] leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#5b5954" }}
            >
              University of Ghana
            </p>
          </div>
        </div>

        {/* Middle: headline */}
        <div className="relative z-10">
          <h2
            className="text-[2.6rem] font-semibold leading-[1.15] mb-4"
            style={{ fontFamily: "var(--font-display)", color: "#ede9e0" }}
          >
            Build with AI.<br />
            Ship at UG.
          </h2>
          <p
            className="text-[0.95rem] leading-relaxed"
            style={{ color: "#5b5954", fontFamily: "var(--font-body)", maxWidth: "26ch" }}
          >
            Join the community of student builders at UG — shipping real projects with Claude and Anthropic tools.
          </p>
        </div>

        {/* Bottom: stat pills */}
        <div className="relative z-10 flex flex-col gap-2.5">
          {[
            { label: "Active members",          value: "200+"              },
            { label: "Open to all UG students", value: "Free to join"      },
            { label: "Powered by",              value: "Anthropic & Claude" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: "rgba(237,233,224,0.04)",
                border: "1px solid rgba(237,233,224,0.07)",
              }}
            >
              <span
                className="text-[0.78rem]"
                style={{ color: "#5b5954", fontFamily: "var(--font-display)" }}
              >
                {item.label}
              </span>
              <span
                className="text-[0.78rem] font-semibold"
                style={{ color: "#ede9e0", fontFamily: "var(--font-display)" }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div
        className="flex items-center justify-center px-8 py-14 min-h-screen"
        style={{ background: "var(--cream)" }}
      >
        {children}
      </div>
    </div>
  );
}
