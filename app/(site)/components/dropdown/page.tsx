"use client";

import { LogOut, Settings, UserRound } from "lucide-react";
import { useState } from "react";

import { dropdownApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "@/registry/dropdown";

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
} from "@/components/ui/dropdown";

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

      <Dropdown
        className="w-14"
        variant="action"
      >
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

export default function DropdownPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Dropdown" },
      ]}
      componentName="dropdown"
      description="Composable dropdown primitives with a selectable value flow for persistent choices and an action-menu flow for immediate commands."
      details={dropdownApiDetails}
      preview={<DropdownPreview />}
      previewClassName="min-h-[22rem] overflow-visible"
      previewDescription="Use the first menu as a grouped team picker with typeahead, then open the avatar trigger to fire one-off actions like profile, settings, or logout."
      title="Dropdown"
      usageCode={usageCode}
      usageDescription="Compose the trigger, content, and items directly when you want the API to feel closer to shadcn patterns while still supporting a built-in select mode."
    />
  );
}
