"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  const handleChangeTheme = useCallback(() => {
    setTheme(nextTheme);
  }, [nextTheme, setTheme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isEditableTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if (isEditableTarget) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return;
      if (event.repeat) return;
      if (event.key.toLowerCase() !== "d") return;

      handleChangeTheme();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleChangeTheme]);

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "relative flex size-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white",
        className
      )}
      onClick={handleChangeTheme}
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
