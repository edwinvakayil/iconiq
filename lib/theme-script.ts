import type { ThemeProviderProps } from "next-themes";

export const themeProviderConfig = {
  attribute: "class",
  defaultTheme: "system",
  enableColorScheme: true,
  enableSystem: true,
  storageKey: "theme",
  themes: ["light", "dark"],
} satisfies Pick<
  ThemeProviderProps,
  | "attribute"
  | "defaultTheme"
  | "enableColorScheme"
  | "enableSystem"
  | "storageKey"
  | "themes"
>;
