"use client";

import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { themeToggleApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
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

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Theme Toggle" },
];

function getDetails(): DetailItem[] {
  return themeToggleApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react/toggle, lucide-react.",
        "This page documents the Base UI install only. Theme Toggle uses the Base UI Toggle primitive for pressed state.",
        "The generated registry file is /r/theme-toggle.json.",
      ],
      registryPath: "theme-toggle.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function ThemeTogglePage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="theme-toggle"
      description="Animated light/dark pill switch with sun and moon icons."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/theme-toggle/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="theme-toggle"
      pageUrl="/inputs-and-forms/theme-toggle"
      preview={<ThemeTogglePreview />}
      previewClassName="min-h-[18rem] overflow-visible"
      previewDescription="Inline sentence with the theme toggle embedded between light and dark."
      title="Theme Toggle"
      usageCode={usageCode}
      usageDescription={
        "Render `ThemeToggle` where you need a self-contained theme control. Built on the Base UI Toggle primitive, it toggles the `dark` class on `document.documentElement` and reads the initial state from `prefers-color-scheme`. Use the `size` prop for `sm`, `md`, or `lg` layouts."
      }
      v0PageCode={themeTogglePreviewCode}
    />
  );
}
