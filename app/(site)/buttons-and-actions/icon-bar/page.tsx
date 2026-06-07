"use client";

import { Building2, Cloud, GraduationCap, Sun } from "lucide-react";
import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { iconBarApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { IconBar, IconBarItem } from "@/registry/icon-bar";

const usageCode = `"use client";

import { Building2, Cloud, GraduationCap, Sun } from "lucide-react";
import { IconBar, IconBarItem } from "@/components/ui/icon-bar";

export function IconBarPreview() {
  return (
    <IconBar>
      <IconBarItem icon={Building2} label="Office" />
      <IconBarItem icon={GraduationCap} label="School" />
      <IconBarItem icon={Sun} label="Sunny" />
      <IconBarItem icon={Cloud} label="Cloudy" />
    </IconBar>
  );
}`;

function IconBarPreview() {
  return (
    <div className="flex min-h-[12rem] w-full items-center justify-center px-4 py-10">
      <IconBar>
        <IconBarItem icon={Building2} label="Office" />
        <IconBarItem icon={GraduationCap} label="School" />
        <IconBarItem icon={Sun} label="Sunny" />
        <IconBarItem icon={Cloud} label="Cloudy" />
      </IconBar>
    </div>
  );
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Buttons & Actions" },
  { label: "Icon Bar" },
];

function getDetails(): DetailItem[] {
  return iconBarApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react/toggle, @base-ui/react/toggle-group, motion, lucide-react.",
        "This page documents the Base UI install only. Icon Bar uses Base UI Toggle Group and Toggle for selection.",
        "The generated registry file is /r/icon-bar.json.",
      ],
      registryPath: "icon-bar.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function IconBarPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="icon-bar"
      description="Icon chips that spring open on hover to reveal labels."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/icon-bar/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="icon-bar"
      pageUrl="/buttons-and-actions/icon-bar"
      preview={<IconBarPreview />}
      previewClassName="min-h-[16rem] overflow-visible"
      title="Icon Bar"
      usageCode={usageCode}
      usageDescription="Compose `IconBar` with one or more `IconBarItem` children. Built on Base UI Toggle Group for single-select chips. Hover or focus previews the label; clicking selects and keeps a chip expanded; clicking the active chip again collapses it."
    />
  );
}
