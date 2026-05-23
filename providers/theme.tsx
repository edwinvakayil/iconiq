"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { themeProviderConfig } from "@/lib/theme-script";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider disableScript {...themeProviderConfig} {...props}>
      {children}
    </NextThemesProvider>
  );
}
