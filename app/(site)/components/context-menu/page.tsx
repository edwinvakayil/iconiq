"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
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

type ContextMenuParts = {
  CheckboxItem: ComponentType<{
    checked?: boolean;
    children?: ReactNode;
    disabled?: boolean;
  }>;
  Content: ComponentType<{ children?: ReactNode; className?: string }>;
  Group: ComponentType<{ children?: ReactNode }>;
  Item: ComponentType<{
    children?: ReactNode;
    variant?: "default" | "destructive";
  }>;
  Label: ComponentType<{ children?: ReactNode }>;
  RadioGroup: ComponentType<{ children?: ReactNode; value?: string }>;
  RadioItem: ComponentType<{ children?: ReactNode; value: string }>;
  Root: ComponentType<{ children?: ReactNode }>;
  Separator: ComponentType;
  Shortcut: ComponentType<{ children?: ReactNode }>;
  Sub: ComponentType<{ children?: ReactNode }>;
  SubContent: ComponentType<{ children?: ReactNode; className?: string }>;
  SubTrigger: ComponentType<{ children?: ReactNode }>;
  Trigger: ComponentType<{
    asChild?: boolean;
    children?: ReactNode;
    className?: string;
  }>;
};

const baseParts: ContextMenuParts = {
  Root: ContextMenu,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Group: ContextMenuGroup,
  Item: ContextMenuItem,
  Sub: ContextMenuSub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
  Separator: ContextMenuSeparator,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Label: ContextMenuLabel,
  Shortcut: ContextMenuShortcut,
};

const radixParts: ContextMenuParts = {
  Root: RadixContextMenu,
  Trigger: RadixContextMenuTrigger,
  Content: RadixContextMenuContent,
  Group: RadixContextMenuGroup,
  Item: RadixContextMenuItem,
  Sub: RadixContextMenuSub,
  SubTrigger: RadixContextMenuSubTrigger,
  SubContent: RadixContextMenuSubContent,
  Separator: RadixContextMenuSeparator,
  CheckboxItem: RadixContextMenuCheckboxItem,
  RadioGroup: RadixContextMenuRadioGroup,
  RadioItem: RadixContextMenuRadioItem,
  Label: RadixContextMenuLabel,
  Shortcut: RadixContextMenuShortcut,
};

const previewTrigger = (
  <div className="w-full border border-border/80 px-6 py-16 text-center">
    <p className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
      Right-click this workspace block
    </p>
    <p className="mt-2 text-[14px] text-secondary leading-6">
      Inspect spacing, shortcuts, separators, and the destructive row in the
      same menu.
    </p>
  </div>
);

function ContextMenuPreviewMenu({
  parts: {
    CheckboxItem,
    Content,
    Group,
    Item,
    Label,
    RadioGroup,
    RadioItem,
    Separator,
    Shortcut,
    Sub,
    SubContent,
    SubTrigger,
  },
}: {
  parts: Omit<ContextMenuParts, "Root" | "Trigger">;
}) {
  return (
    <Content className="w-52">
      <Group>
        <Item>
          <span className="flex items-center gap-2.5">
            <PencilLine className="size-3.5 opacity-70" />
            Rename
          </span>
          <Shortcut>R</Shortcut>
        </Item>
        <Item>
          <span className="flex items-center gap-2.5">
            <Copy className="size-3.5 opacity-70" />
            Duplicate
          </span>
          <Shortcut>⌘D</Shortcut>
        </Item>
        <Item>
          <span className="flex items-center gap-2.5">
            <Share2 className="size-3.5 opacity-70" />
            Share
          </span>
          <Shortcut>S</Shortcut>
        </Item>
        <Sub>
          <SubTrigger>More Tools</SubTrigger>
          <SubContent className="w-44">
            <Group>
              <Item>Save Page...</Item>
              <Item>Create Shortcut...</Item>
              <Item>Name Window...</Item>
            </Group>
            <Separator />
            <Group>
              <Item>Developer Tools</Item>
            </Group>
            <Separator />
            <Group>
              <Item variant="destructive">Delete</Item>
            </Group>
          </SubContent>
        </Sub>
        <Separator />
        <Item variant="destructive">
          <span className="flex items-center gap-2.5">
            <Trash2 className="size-3.5 opacity-70" />
            Delete
          </span>
          <Shortcut>Del</Shortcut>
        </Item>
      </Group>
      <Separator />
      <Group>
        <CheckboxItem checked>Show Shortcuts</CheckboxItem>
        <CheckboxItem disabled>Show Metadata</CheckboxItem>
      </Group>
      <Separator />
      <Group>
        <RadioGroup value="pedro">
          <Label>People</Label>
          <RadioItem value="pedro">Pedro Duarte</RadioItem>
          <RadioItem value="colm">Colm Tuite</RadioItem>
        </RadioGroup>
      </Group>
    </Content>
  );
}

function ContextMenuPreview({ parts }: { parts: ContextMenuParts }) {
  const { Root, Trigger } = parts;

  return (
    <Root>
      <Trigger asChild className="w-full max-w-2xl">
        {previewTrigger}
      </Trigger>
      <ContextMenuPreviewMenu parts={parts} />
    </Root>
  );
}

const usageCodeTemplate = (importPath: string) => `"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
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
} from "${importPath}";

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild className="w-full max-w-2xl">
        <div className="w-full border border-border/80 px-6 py-16 text-center">
          <p className="font-medium text-[15px] tracking-[-0.02em] text-foreground">
            Right-click this workspace block
          </p>
          <p className="mt-2 text-[14px] leading-6 text-secondary">
            Inspect spacing, shortcuts, separators, and the destructive row in the same menu.
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuItem>
            <span className="flex items-center gap-2.5">
              <PencilLine className="size-3.5 opacity-70" />
              Rename
            </span>
            <ContextMenuShortcut>R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <span className="flex items-center gap-2.5">
              <Copy className="size-3.5 opacity-70" />
              Duplicate
            </span>
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <span className="flex items-center gap-2.5">
              <Share2 className="size-3.5 opacity-70" />
              Share
            </span>
            <ContextMenuShortcut>S</ContextMenuShortcut>
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
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <span className="flex items-center gap-2.5">
              <Trash2 className="size-3.5 opacity-70" />
              Delete
            </span>
            <ContextMenuShortcut>Del</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem checked>Show Shortcuts</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem disabled>Show Metadata</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuRadioGroup value="pedro">
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}`;

type ProviderConfig = {
  componentName: "b-context-menu" | "r-context-menu";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  preview: ReactNode;
  usageCode: string;
};

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-context-menu": usageCodeTemplate("@/components/ui/b-context-menu"),
  "r-context-menu": usageCodeTemplate("@/components/ui/r-context-menu"),
};

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
        preview: <ContextMenuPreview parts={baseParts} />,
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
      preview: <ContextMenuPreview parts={radixParts} />,
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
          <div className="w-full max-w-2xl">{provider.preview}</div>
        </div>
      }
      title="Context Menu"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
