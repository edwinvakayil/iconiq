"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { contextMenuApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/b-context-menu";
import {
  ContextMenu as RadixContextMenu,
  ContextMenuCheckboxItem as RadixContextMenuCheckboxItem,
  ContextMenuContent as RadixContextMenuContent,
  ContextMenuGroup as RadixContextMenuGroup,
  ContextMenuItem as RadixContextMenuItem,
  ContextMenuLabel as RadixContextMenuLabel,
  ContextMenuRadioGroup as RadixContextMenuRadioGroup,
  ContextMenuRadioItem as RadixContextMenuRadioItem,
  ContextMenuSeparator as RadixContextMenuSeparator,
  ContextMenuShortcut as RadixContextMenuShortcut,
  ContextMenuSub as RadixContextMenuSub,
  ContextMenuSubContent as RadixContextMenuSubContent,
  ContextMenuSubTrigger as RadixContextMenuSubTrigger,
  ContextMenuTrigger as RadixContextMenuTrigger,
} from "@/registry/r-context-menu";

type ProviderConfig = {
  componentName: "b-context-menu" | "r-context-menu";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  preview: ReactNode;
  usageCode: string;
};

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-context-menu": `import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/b-context-menu";

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        <span className="hidden pointer-fine:inline-block">
          Right click here
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Long press here
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuGroup>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem checked>
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuRadioGroup value="pedro">
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
  "r-context-menu": `import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/r-context-menu";

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        <span className="hidden pointer-fine:inline-block">
          Right click here
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Long press here
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuGroup>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem checked>
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuRadioGroup value="pedro">
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
};

function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        <span className="pointer-fine:inline-block hidden">
          Right click here
        </span>
        <span className="pointer-coarse:inline-block hidden">
          Long press here
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuGroup>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem checked>
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuRadioGroup value="pedro">
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function RadixContextMenuDemo() {
  return (
    <RadixContextMenu>
      <RadixContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        <span className="pointer-fine:inline-block hidden">
          Right click here
        </span>
        <span className="pointer-coarse:inline-block hidden">
          Long press here
        </span>
      </RadixContextMenuTrigger>
      <RadixContextMenuContent className="w-48">
        <RadixContextMenuGroup>
          <RadixContextMenuItem>
            Back
            <RadixContextMenuShortcut>⌘[</RadixContextMenuShortcut>
          </RadixContextMenuItem>
          <RadixContextMenuItem disabled>
            Forward
            <RadixContextMenuShortcut>⌘]</RadixContextMenuShortcut>
          </RadixContextMenuItem>
          <RadixContextMenuItem>
            Reload
            <RadixContextMenuShortcut>⌘R</RadixContextMenuShortcut>
          </RadixContextMenuItem>
          <RadixContextMenuSub>
            <RadixContextMenuSubTrigger>More Tools</RadixContextMenuSubTrigger>
            <RadixContextMenuSubContent className="w-44">
              <RadixContextMenuGroup>
                <RadixContextMenuItem>Save Page...</RadixContextMenuItem>
                <RadixContextMenuItem>Create Shortcut...</RadixContextMenuItem>
                <RadixContextMenuItem>Name Window...</RadixContextMenuItem>
              </RadixContextMenuGroup>
              <RadixContextMenuSeparator />
              <RadixContextMenuGroup>
                <RadixContextMenuItem>Developer Tools</RadixContextMenuItem>
              </RadixContextMenuGroup>
              <RadixContextMenuSeparator />
              <RadixContextMenuGroup>
                <RadixContextMenuItem variant="destructive">
                  Delete
                </RadixContextMenuItem>
              </RadixContextMenuGroup>
            </RadixContextMenuSubContent>
          </RadixContextMenuSub>
        </RadixContextMenuGroup>
        <RadixContextMenuSeparator />
        <RadixContextMenuGroup>
          <RadixContextMenuCheckboxItem checked>
            Show Bookmarks
          </RadixContextMenuCheckboxItem>
          <RadixContextMenuCheckboxItem>
            Show Full URLs
          </RadixContextMenuCheckboxItem>
        </RadixContextMenuGroup>
        <RadixContextMenuSeparator />
        <RadixContextMenuGroup>
          <RadixContextMenuRadioGroup value="pedro">
            <RadixContextMenuLabel>People</RadixContextMenuLabel>
            <RadixContextMenuRadioItem value="pedro">
              Pedro Duarte
            </RadixContextMenuRadioItem>
            <RadixContextMenuRadioItem value="colm">
              Colm Tuite
            </RadixContextMenuRadioItem>
          </RadixContextMenuRadioGroup>
        </RadixContextMenuGroup>
      </RadixContextMenuContent>
    </RadixContextMenu>
  );
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Context Menu" },
];

export default function RadixBaseContextMenuPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-context-menu",
        dependencyLabel: "@base-ui/react, motion, lucide-react",
        libraryLabel: "Base UI",
        notes: [
          "Installs the Base UI context-menu parts under the same composable ContextMenu API used by the Radix build.",
          "Base UI handles anchor positioning, dismissal, and roving focus while the menu shell keeps the original Iconiq motion treatment.",
          "The generated registry file is /r/b-context-menu.json.",
        ],
        preview: <ContextMenuDemo />,
        usageCode: usageCodeByProvider["b-context-menu"],
      };
    }

    return {
      componentName: "r-context-menu",
      dependencyLabel: "@radix-ui/react-context-menu, motion, lucide-react",
      libraryLabel: "Radix UI",
      notes: [
        "Installs the Radix context-menu primitive under the same composable ContextMenu API used by the Base UI build.",
        "Radix handles focus, dismissal, and pointer anchoring while the menu shell keeps the original Iconiq motion treatment.",
        "The generated registry file is /r/r-context-menu.json.",
      ],
      preview: <RadixContextMenuDemo />,
      usageCode: usageCodeByProvider["r-context-menu"],
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () =>
      contextMenuApiDetails.map((item) => {
        if (item.id === "context-menu") {
          return {
            ...item,
            notes: [
              "Compose ContextMenuTrigger, ContextMenuContent, and item primitives inside the root.",
              `Current install target: ${provider.libraryLabel}.`,
              `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
              ...provider.notes,
            ],
          };
        }

        if (item.id !== "registry") {
          return item;
        }

        return {
          ...item,
          notes: [
            `Dependencies: ${provider.dependencyLabel}.`,
            ...provider.notes,
          ],
          registryPath: `${provider.componentName}.json`,
        };
      }),
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Right-click menu for contextual actions and shortcuts."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/context-menu/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="context-menu"
      pageUrl="/components/context-menu"
      preview={
        <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-10">
          {provider.preview}
        </div>
      }
      title="Context Menu"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
