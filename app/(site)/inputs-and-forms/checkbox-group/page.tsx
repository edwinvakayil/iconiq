"use client";

import { useMemo, useState } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { checkboxGroupApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  CheckboxGroup,
  type CheckboxGroupOption,
} from "@/registry/b-checkbox-group";

const previewOptions: CheckboxGroupOption[] = [
  {
    label: "Email updates",
    value: "email",
    description: "Release notes and changelog digests.",
  },
  {
    label: "Product news",
    value: "news",
    description: "Feature launches and roadmap highlights.",
  },
  {
    label: "Security alerts",
    value: "security",
    description: "Critical patches and account notices.",
  },
];

const usageCode = `"use client";

import { useState } from "react";
import {
  CheckboxGroup,
  type CheckboxGroupOption,
} from "@/components/ui/b-checkbox-group";

const options: CheckboxGroupOption[] = [
  {
    label: "Email updates",
    value: "email",
    description: "Release notes and changelog digests.",
  },
  {
    label: "Product news",
    value: "news",
    description: "Feature launches and roadmap highlights.",
  },
  {
    label: "Security alerts",
    value: "security",
    description: "Critical patches and account notices.",
  },
];

export function CheckboxGroupPreview() {
  const [value, setValue] = useState<string[]>(["email"]);

  return (
    <CheckboxGroup
      className="w-[min(100%,28rem)]"
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Checkbox Group" },
];

function getDetails(): DetailItem[] {
  return checkboxGroupApiDetails.map((item) => {
    if (item.id === "checkbox-group") {
      return {
        ...item,
        notes: [
          "The component previews the next state immediately after a click, then re-syncs with whatever value the parent sends back.",
          "If a selected option would be hidden by maxVisible, the list stays expanded so users do not lose track of active choices.",
          "This Base UI version keeps checkbox-group semantics and hidden form inputs through the underlying Base UI primitives, while preserving the same visible row motion.",
        ],
      };
    }

    if (item.id === "checkbox-motion") {
      return {
        ...item,
        notes: [
          "Selection is still represented by a Lucide Check icon instead of a filled checkbox background.",
          "The hover surface, tap spring, check icon entrance, and disclosure behavior match the original checkbox-group motion exactly.",
          "Base UI supplies the checkbox and group semantics underneath the same animated shell.",
        ],
      };
    }

    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react, motion, lucide-react.",
        "This page documents the Base UI install only, because Radix UI does not ship a dedicated checkbox-group primitive.",
        "The generated registry file is /r/b-checkbox-group.json.",
      ],
      registryPath: "b-checkbox-group.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function RadixBaseCheckboxGroupPage() {
  const [selected, setSelected] = useState<string[]>(["email"]);
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="b-checkbox-group"
      description="Grouped checkboxes for selecting multiple related options."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/checkbox-group/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="checkbox-group"
      pageUrl="/inputs-and-forms/checkbox-group"
      preview={
        <CheckboxGroup
          className="w-[min(100%,28rem)]"
          onChange={setSelected}
          options={previewOptions}
          value={selected}
        />
      }
      title="Checkbox Group"
      usageCode={usageCode}
      usageDescription="This Base UI install keeps the same public option shape, optimistic selection flow, grouped headings, and motion treatment as the core Iconiq checkbox-group."
      v0PageCode={usageCode}
    />
  );
}
