"use client";

import { Building2, Cloud, GraduationCap, Sun } from "lucide-react";

import { iconBarApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
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

export default function IconBarPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Special One" },
        { label: "Icon Bar" },
      ]}
      componentName="icon-bar"
      description="Icon chips that spring open on hover to reveal labels."
      details={iconBarApiDetails}
      preview={<IconBarPreview />}
      previewClassName="min-h-[16rem] overflow-visible"
      title="Icon Bar"
      usageCode={usageCode}
      usageDescription="Compose `IconBar` with one or more `IconBarItem` children. Hover or focus previews the label; clicking selects and keeps a chip expanded; clicking the active chip again collapses it."
    />
  );
}
