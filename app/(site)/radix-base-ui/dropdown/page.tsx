"use client";

import { LogOut, Settings, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { ProviderSwitch } from "@/app/(site)/radix-base-ui/_components/provider-switch";
import { dropdownApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "@/registry/r-dropdown";

const usageCode = `"use client";

import { LogOut, Settings, UserRound } from "lucide-react";
import { useState } from "react";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "@/components/ui/r-dropdown";

export function DropdownPreview() {
  const [team, setTeam] = useState<string | undefined>("design");
  const [, setLastAction] = useState("No action yet");

  return (
    <div className="mx-auto grid w-fit justify-items-center gap-5 md:grid-cols-[220px_56px] md:items-center md:gap-6">
      <Dropdown className="w-[220px]" onValueChange={setTeam} value={team}>
        <DropdownTrigger>
          <DropdownValue placeholder="Choose a team" />
        </DropdownTrigger>
        <DropdownContent className="w-full">
          <DropdownGroup label="Product">
            <DropdownItem value="design">Design</DropdownItem>
            <DropdownItem value="product">Product</DropdownItem>
            <DropdownItem value="engineering">Engineering</DropdownItem>
          </DropdownGroup>
          <DropdownGroup label="Operations">
            <DropdownItem value="finance">Finance</DropdownItem>
            <DropdownItem value="people">People Ops</DropdownItem>
            <DropdownItem value="legal">Legal</DropdownItem>
          </DropdownGroup>
          <DropdownGroup>
            <DropdownItem value="security">Security</DropdownItem>
            <DropdownItem value="it">IT</DropdownItem>
            <DropdownItem value="data">Data</DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>

      <Dropdown className="w-14" variant="action">
        <DropdownTrigger
          aria-label="Open profile menu"
          className="mx-auto h-11 w-11 overflow-hidden rounded-full border-border/80 bg-[url('/assets/av1.png')] bg-center bg-cover p-0 shadow-none"
          showChevron={false}
        >
          <span className="sr-only">Open profile menu</span>
        </DropdownTrigger>
        <DropdownContent align="center" className="w-56">
          <DropdownGroup label="Account">
            <DropdownItem onClick={() => setLastAction("Profile")}>
              <UserRound className="size-4" />
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => setLastAction("Settings")}>
              <Settings className="size-4" />
              Settings
            </DropdownItem>
          </DropdownGroup>
          <DropdownGroup>
            <DropdownItem
              className="text-rose-600 hover:text-rose-700 focus-visible:text-rose-700 dark:text-rose-400 dark:focus-visible:text-rose-300 dark:hover:text-rose-300"
              onClick={() => setLastAction("Logout")}
            >
              <LogOut className="size-4" />
              Logout
            </DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Radix UI + Base UI" },
  { label: "Dropdown" },
];

function getDetails(): DetailItem[] {
  return dropdownApiDetails.map((item) => {
    if (item.id === "dropdown") {
      return {
        ...item,
        notes: [
          "Radix DropdownMenu.Root and Trigger handle open state, focus restoration, outside interactions, and keyboard typeahead while the public Iconiq parts API stays the same.",
          "The select and action variants keep the exact same trigger shell, chevron spring, row styling, and grouped layout as the core dropdown component.",
          "This Radix version portals the menu content, then reuses the same visible motion timings and offsets from registry/dropdown.tsx.",
        ],
      };
    }

    if (item.id === "dropdown-content") {
      return {
        ...item,
        notes: [
          "The motion layer is intentionally identical to the core dropdown: the same fade/slide entrance, the same delayed inner content settle, and the same rounded panel shell.",
          'When you pass className="w-full", this Radix install maps that width to the trigger-width CSS variable so existing examples keep the same layout.',
          "Radix manages collision-aware placement and focus, while the Iconiq layer preserves the original content styling and scroll treatment.",
        ],
      };
    }

    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @radix-ui/react-dropdown-menu, motion, lucide-react.",
        "This page documents the Radix UI install only. Base UI does not ship an equivalent dropdown menu primitive in this comparison set.",
        "The generated registry file is /r/r-dropdown.json.",
      ],
      registryPath: "r-dropdown.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

function DropdownPreview() {
  const [team, setTeam] = useState<string | undefined>("design");
  const [, setLastAction] = useState("No action yet");

  return (
    <div className="mx-auto grid w-fit justify-items-center gap-5 md:grid-cols-[220px_56px] md:items-center md:gap-6">
      <Dropdown className="w-[220px]" onValueChange={setTeam} value={team}>
        <DropdownTrigger className="border-neutral-200 shadow-none hover:border-neutral-200 dark:border-neutral-800 dark:hover:border-neutral-800">
          <DropdownValue placeholder="Choose a team" />
        </DropdownTrigger>
        <DropdownContent className="w-full">
          <DropdownGroup label="Product">
            <DropdownItem value="design">Design</DropdownItem>
            <DropdownItem value="product">Product</DropdownItem>
            <DropdownItem value="engineering">Engineering</DropdownItem>
          </DropdownGroup>
          <DropdownGroup label="Operations">
            <DropdownItem value="finance">Finance</DropdownItem>
            <DropdownItem value="people">People Ops</DropdownItem>
            <DropdownItem value="legal">Legal</DropdownItem>
          </DropdownGroup>
          <DropdownGroup>
            <DropdownItem value="security">Security</DropdownItem>
            <DropdownItem value="it">IT</DropdownItem>
            <DropdownItem value="data">Data</DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>
      <Dropdown className="w-14" variant="action">
        <DropdownTrigger
          aria-label="Open profile menu"
          className="mx-auto h-11 w-11 overflow-hidden rounded-full border-border/80 bg-[url('/assets/av1.png')] bg-center bg-cover p-0 shadow-none"
          showChevron={false}
        >
          <span className="sr-only">Open profile menu</span>
        </DropdownTrigger>
        <DropdownContent align="center" className="w-56">
          <DropdownGroup label="Account">
            <DropdownItem onClick={() => setLastAction("Profile")}>
              <UserRound className="size-4" />
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => setLastAction("Settings")}>
              <Settings className="size-4" />
              Settings
            </DropdownItem>
          </DropdownGroup>
          <DropdownGroup>
            <DropdownItem
              className="text-rose-600 hover:text-rose-700 focus-visible:text-rose-700 dark:text-rose-400 dark:focus-visible:text-rose-300 dark:hover:text-rose-300"
              onClick={() => setLastAction("Logout")}
            >
              <LogOut className="size-4" />
              Logout
            </DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}

export default function RadixBaseDropdownPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="r-dropdown"
      description="Radix UI dropdown with the exact same Iconiq shell, motion, and two-variant API as the core dropdown."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/dropdown/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["base"]}
          onSelect={handleProviderSelect}
          selectedProvider="radix"
        />
      }
      itemSlug="dropdown"
      pageUrl="/radix-base-ui/dropdown"
      preview={<DropdownPreview />}
      previewClassName="min-h-[22rem] overflow-visible"
      title="Dropdown"
      usageCode={usageCode}
      usageDescription="This Radix UI install keeps the same public parts API, trigger shell, content motion, and item styling as the core Iconiq dropdown while delegating focus and typeahead to Radix Dropdown Menu primitives."
      v0PageCode={usageCode}
    />
  );
}
