"use client";

import { useTheme } from "@/lib/theme-context";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
      style={{ 
        background: "var(--sand-light)", 
        border: "1px solid var(--sand)",
        color: "var(--ink)"
      }}
      aria-label="Toggle theme"
    >
      <div className="relative overflow-hidden w-5 h-5 flex items-center justify-center">
        {theme === "light" ? (
          <Sun size={18} strokeWidth={2} className="transition-all duration-300" />
        ) : (
          <Moon size={18} strokeWidth={2} className="transition-all duration-300" />
        )}
      </div>
      
      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-2 py-1 rounded bg-ink text-warm-white text-[0.65rem] font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-50">
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </span>
    </button>
  );
}
