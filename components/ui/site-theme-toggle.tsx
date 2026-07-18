"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { useThemeKeyboardShortcut } from "@/hooks/use-theme-keyboard-shortcut";
import { cn } from "@/lib/utils";

type SiteThemeToggleProps = {
  className?: string;
};

const SiteThemeToggle = ({ className }: SiteThemeToggleProps) => {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  const handleChangeTheme = useCallback(() => {
    setTheme(nextTheme);
  }, [nextTheme, setTheme]);

  useThemeKeyboardShortcut();

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "relative flex size-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-[background-color,color,transform] hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary active:scale-[0.96] dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white",
        className
      )}
      onClick={handleChangeTheme}
      suppressHydrationWarning
      tabIndex={0}
      type="button"
    >
      <SunIcon
        aria-hidden="true"
        className="size-5 rotate-0 scale-100 transition-[transform,opacity] dark:-rotate-90 dark:scale-0"
      />
      <MoonIcon
        aria-hidden="true"
        className="absolute size-5 rotate-90 scale-0 transition-[transform,opacity] dark:rotate-0 dark:scale-100"
      />
    </button>
  );
};

export { SiteThemeToggle };
