import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`focus-visible:ring-opacity-75 relative inline-flex h-6.5 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 sm:h-7.5 sm:w-15 md:h-8.5 md:w-17.5 ${
        !mounted
          ? "bg-secondary"
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
            ? "translate-x-0"
            : theme === "dark"
              ? "translate-x-6.5 sm:translate-x-7.5 md:translate-x-9"
              : "translate-x-0"
        } pointer-events-none flex h-5.5 w-5.5 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out sm:h-[26px] sm:w-[26px] md:h-[30px] md:w-[30px]`}
      >
        {!mounted ? (
          <div className="bg-secondary h-2.5 w-2.5 animate-pulse rounded-full sm:h-3 sm:w-3 md:h-4 md:w-4" />
        ) : theme === "dark" ? (
          <Moon className="text-accent h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
        ) : (
          <Sun className="text-primary h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
        )}
      </div>
    </button>
  );
}
