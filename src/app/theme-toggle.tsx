"use client";

import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only execute client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={() => {
        if (mounted) setTheme(theme === "dark" ? "light" : "dark");
      }}
      className={`focus-visible:ring-opacity-75 relative inline-flex h-[26px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 sm:h-[30px] sm:w-[60px] md:h-[34px] md:w-[70px] ${
        !mounted
          ? "bg-secondary" // Initial placeholder state
          : theme === "dark"
            ? "bg-accent"
            : "bg-primary"
      } focus-visible:ring-ring transition-opacity ${mounted ? "opacity-100" : "opacity-70"}`}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <div
        className={`${
          !mounted
            ? "translate-x-0" // Default position for SSR
            : theme === "dark"
              ? "translate-x-[26px] sm:translate-x-[30px] md:translate-x-9"
              : "translate-x-0"
        } pointer-events-none flex h-[22px] w-[22px] transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out sm:h-[26px] sm:w-[26px] md:h-[30px] md:w-[30px]`}
      >
        {!mounted ? (
          // Placeholder icon during SSR
          <div className="bg-secondary h-2.5 w-2.5 animate-pulse rounded-full sm:h-3 sm:w-3 md:h-4 md:w-4"></div>
        ) : theme === "dark" ? (
          <FaMoon className="text-accent h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
        ) : (
          <FaSun className="text-primary h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
        )}
      </div>
    </button>
  );
}
