"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

type ThemeToggleProps = {
  className?: string;
};

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { setTheme, theme: currentTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  const handleChangeTheme = (theme: Theme) => {
    if (theme === currentTheme) return;

    setTheme(theme);
  };

  useHotkey("Mod+U", () => {
    handleChangeTheme(nextTheme);
  });

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "relative flex size-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white",
        className
      )}
      onClick={() => handleChangeTheme(nextTheme)}
      suppressHydrationWarning
      tabIndex={0}
      type="button"
    >
      <SunIcon
        aria-hidden="true"
        className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <MoonIcon
        aria-hidden="true"
        className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </button>
  );
};

export { ThemeToggle };
