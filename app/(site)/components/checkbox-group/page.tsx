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

const demoOptions: CheckboxGroupOption[] = [
  {
    group: "Pressing",
    label: "High press",
    value: "press",
    description: "Close the alley when they receive on the turn",
  },
  {
    group: "Pressing",
    label: "Hold the half-spaces",
    value: "halfspaces",
    description: "Narrow tens, full-backs hold the width",
  },
  {
    group: "Pressing",
    label: "Back-three rehearsal",
    value: "backthree",
    description: "Not on the teamsheet for Saturday",
    disabled: true,
    disabledReason: "Available after the squad list is published.",
  },
  {
    group: "Set pieces",
    label: "Near-post corner trap",
    value: "corner-trap",
    description: "Front zone clear, weak-side winger seals the rebound lane",
  },
  {
    group: "Set pieces",
    label: "Late-run overload",
    value: "late-run",
    description: "Delay the extra runner until the second movement starts",
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
    group: "Pressing",
    label: "High press",
    value: "press",
    description: "Close the alley when they receive on the turn",
  },
  {
    group: "Pressing",
    label: "Hold the half-spaces",
    value: "halfspaces",
    description: "Narrow tens, full-backs hold the width",
  },
  {
    group: "Pressing",
    label: "Back-three rehearsal",
    value: "backthree",
    description: "Not on the teamsheet for Saturday",
    disabled: true,
    disabledReason: "Available after the squad list is published.",
  },
  {
    group: "Set pieces",
    label: "Near-post corner trap",
    value: "corner-trap",
    description: "Front zone clear, weak-side winger seals the rebound lane",
  },
  {
    group: "Set pieces",
    label: "Late-run overload",
    value: "late-run",
    description: "Delay the extra runner until the second movement starts",
  },
];

export function CheckboxGroupPreview() {
  const [value, setValue] = useState<string[]>(["press"]);

  return (
    <CheckboxGroup
      className="max-w-md"
      maxVisible={4}
      onChange={setValue}
      options={options}
      showMoreLabel="Show remaining plans"
      value={value}
    />
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
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
  const [selected, setSelected] = useState<string[]>(["press"]);
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="b-checkbox-group"
      description="Base UI checkbox group with the same Iconiq row motion and disclosure behavior."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/checkbox-group/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="checkbox-group"
      pageUrl="/components/checkbox-group"
      preview={
        <div className="flex min-h-[320px] items-center justify-center">
          <CheckboxGroup
            className="max-w-md"
            maxVisible={4}
            onChange={setSelected}
            options={demoOptions}
            showMoreLabel="Show remaining plans"
            value={selected}
          />
        </div>
      }
      title="Checkbox Group"
      usageCode={usageCode}
      usageDescription="This Base UI install keeps the same public option shape, optimistic selection flow, grouped headings, and motion treatment as the core Iconiq checkbox-group."
      v0PageCode={usageCode}
    />
  );
}
