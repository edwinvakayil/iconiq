"use client";

import { themeToggleApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { themeTogglePreviewCode } from "@/lib/component-v0-pages";
import { ThemeToggle } from "@/registry/theme-toggle";

const usageCode = `"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ThemeTogglePreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-muted-foreground text-sm">
        Click the toggle to switch between light and dark mode.
      </p>
      <ThemeToggle size="md" />
    </div>
  );
}`;

function ThemeTogglePreview() {
  return (
    <div className="flex min-h-[12rem] w-full flex-col items-center justify-center gap-4 px-4 py-10">
      <p className="text-center text-muted-foreground text-sm">
        Click the toggle to switch between light and dark mode.
      </p>
      <ThemeToggle size="md" />
    </div>
  );
}

export default function ThemeTogglePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Special One" },
        { label: "Theme Toggle" },
      ]}
      componentName="theme-toggle"
      description="Pill switch with a sliding knob, sun and moon icons, and bouncy light/dark transitions."
      details={themeToggleApiDetails}
      preview={<ThemeTogglePreview />}
      previewClassName="min-h-[12rem] overflow-visible"
      title="Theme Toggle"
      usageCode={usageCode}
      usageDescription={
        "Render `ThemeToggle` where you need a self-contained theme control. It toggles the `dark` class on `document.documentElement` and reads the initial state from `prefers-color-scheme`. Use the `size` prop for `sm`, `md`, or `lg` layouts."
      }
      v0PageCode={themeTogglePreviewCode}
    />
  );
}
