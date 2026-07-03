"use client";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import {
  type DropdownModule,
  DropdownPlaygroundProvider,
  getDropdownDefaultUsageCode,
} from "@/app/(site)/overlay-and-popups/dropdown/_components/dropdown-playground";
import { dropdownApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as DropdownUI from "@/registry/r-dropdown";

const IMPORT_PATH = "@/components/ui/r-dropdown";

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Overlay & Popups" },
  { label: "Dropdown" },
];

function getDetails(): DetailItem[] {
  return dropdownApiDetails.map((item) => {
    if (item.id === "registry") {
      return {
        ...item,
        notes: [
          "Dependencies: @radix-ui/react-dropdown-menu, @radix-ui/react-scroll-area, motion, lucide-react.",
          "This page documents the Radix UI install only. Base UI does not ship an equivalent dropdown menu primitive in this comparison set.",
          "Shadcn-style aliases such as DropdownMenu and DropdownMenuItem are exported from the same file.",
          "The generated registry file is /r/r-dropdown.json.",
        ],
        registryPath: "r-dropdown.json",
      };
    }

    return item;
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function RadixBaseDropdownPage() {
  const details = getDetails();
  const usageCode = getDropdownDefaultUsageCode(IMPORT_PATH);

  return (
    <DropdownPlaygroundProvider
      importPath={IMPORT_PATH}
      ui={DropdownUI as DropdownModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="r-dropdown"
          description="Compact menu for actions, overflow controls, and quick commands."
          details={details}
          detailsDescription="Compound parts cover select and action variants, grouped rows, submenu/checkbox/radio helpers, portaled collision-aware placement, and Radix keyboard typeahead with Iconiq motion."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/overlay-and-popups/dropdown/page.tsx`}
          headerActions={
            <ProviderSwitch
              disabledProviders={["base"]}
              onSelect={handleProviderSelect}
              selectedProvider="radix"
            />
          }
          itemSlug="dropdown"
          pageUrl="/overlay-and-popups/dropdown"
          preview={preview}
          previewClassName="min-h-[22rem] overflow-visible"
          previewDescription="Tune variant, placement, trigger shape, and list density from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Dropdown"
          title="Dropdown"
          usageCode={usageCode}
          usageDescription="This Radix UI install keeps the Iconiq trigger shell, grouped rows, panel motion, and scroll treatment while delegating focus, typeahead, and collision handling to Radix Dropdown Menu primitives."
          v0PageCode={usageCode}
        />
      )}
    </DropdownPlaygroundProvider>
  );
}
