"use client";

import { themeToggleApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { themeTogglePreviewCode } from "@/lib/component-v0-pages";
import { ThemeToggle } from "@/registry/theme-toggle";

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

const usageCode = `"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ThemeTogglePreview() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm">
        <span>Switch between light</span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <ThemeToggle size="md" />
        </span>
        <span>and dark.</span>
      </p>
    </div>
  );
}`;

function ThemeTogglePreview() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className={previewSentenceClassName}>
        <span>Switch between light</span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <ThemeToggle size="md" />
        </span>
        <span>and dark.</span>
      </p>
    </div>
  );
}

export default function ThemeTogglePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Inputs & Forms" },
        { label: "Theme Toggle" },
      ]}
      componentName="theme-toggle"
      description="Animated light/dark pill switch with sun and moon icons."
      details={themeToggleApiDetails}
      preview={<ThemeTogglePreview />}
      previewClassName="min-h-[18rem] overflow-visible"
      previewDescription="Inline sentence with the theme toggle embedded between light and dark."
      title="Theme Toggle"
      usageCode={usageCode}
      usageDescription={
        "Render `ThemeToggle` where you need a self-contained theme control. It toggles the `dark` class on `document.documentElement` and reads the initial state from `prefers-color-scheme`. Use the `size` prop for `sm`, `md`, or `lg` layouts."
      }
      v0PageCode={themeTogglePreviewCode}
    />
  );
}
