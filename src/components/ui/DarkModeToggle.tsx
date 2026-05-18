"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative w-10 h-10 rounded-xl flex items-center justify-center
        transition-all duration-300 overflow-hidden group
        ${isDark
          ? "bg-brand-400/20 text-brand-300 hover:bg-brand-400/30"
          : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
        }
      `}
    >
      {/* Animated swap */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
        }`}
      >
        <Sun size={18} />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
        }`}
      >
        <Moon size={18} />
      </span>
    </button>
  );
}
