"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSegmentedField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";

type ContextMenuItemVariant = "default" | "destructive";

type ContextMenuRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

type ContextMenuTriggerProps = {
  asChild?: boolean;
  children?: ReactNode;
  className?: string;
};

type ContextMenuContentProps = {
  children?: ReactNode;
  className?: string;
  collisionPadding?: number;
};

type ContextMenuItemProps = {
  children?: ReactNode;
  disabled?: boolean;
  variant?: ContextMenuItemVariant;
};

type ContextMenuCheckboxItemProps = {
  checked?: boolean;
  children?: ReactNode;
  disabled?: boolean;
};

type ContextMenuRadioGroupProps = {
  children?: ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
};

type ContextMenuRadioItemProps = {
  children?: ReactNode;
  value: string;
};

export type ContextMenuModule = {
  ContextMenu: ComponentType<ContextMenuRootProps>;
  ContextMenuCheckboxItem: ComponentType<ContextMenuCheckboxItemProps>;
  ContextMenuContent: ComponentType<ContextMenuContentProps>;
  ContextMenuGroup: ComponentType<{ children?: ReactNode }>;
  ContextMenuItem: ComponentType<ContextMenuItemProps>;
  ContextMenuLabel: ComponentType<{ children?: ReactNode }>;
  ContextMenuRadioGroup: ComponentType<ContextMenuRadioGroupProps>;
  ContextMenuRadioItem: ComponentType<ContextMenuRadioItemProps>;
  ContextMenuSeparator: ComponentType;
  ContextMenuShortcut: ComponentType<{ children?: ReactNode }>;
  ContextMenuSub: ComponentType<{ children?: ReactNode }>;
  ContextMenuSubContent: ComponentType<ContextMenuContentProps>;
  ContextMenuSubTrigger: ComponentType<{ children?: ReactNode }>;
  ContextMenuTrigger: ComponentType<ContextMenuTriggerProps>;
  contextMenuTriggerClassName: string;
};

type ContextMenuPlaygroundState = {
  collisionPadding: "8" | "24";
  controlled: boolean;
  customTrigger: boolean;
  showCheckbox: boolean;
  showDestructive: boolean;
  showRadio: boolean;
  showShortcuts: boolean;
  showSubmenu: boolean;
};

const CONTEXT_MENU_DEFAULT_STATE: ContextMenuPlaygroundState = {
  collisionPadding: "8",
  controlled: false,
  customTrigger: true,
  showCheckbox: true,
  showDestructive: true,
  showRadio: true,
  showShortcuts: true,
  showSubmenu: true,
};

const COLLISION_PADDING_OPTIONS = [
  { label: "8px", value: "8" as const },
  { label: "24px", value: "24" as const },
];

function buildTriggerCode(state: ContextMenuPlaygroundState) {
  if (state.customTrigger) {
    return `      <ContextMenuTrigger asChild className="w-full max-w-xl">
        <div className={contextMenuTriggerClassName + " w-full border border-border/80 px-6 py-14 text-center"}>
          <p className="font-medium text-[15px] tracking-[-0.02em]">Right-click this block</p>
        </div>
      </ContextMenuTrigger>`;
  }

  return `      <ContextMenuTrigger className="w-full max-w-xl border border-border/80 px-6 py-14 text-center">
        Right-click this block
      </ContextMenuTrigger>`;
}

function generateContextMenuCode(
  state: ContextMenuPlaygroundState,
  importPath: string
) {
  const imports = [
    "ContextMenu",
    "ContextMenuContent",
    "ContextMenuGroup",
    "ContextMenuItem",
    ...(state.showSubmenu
      ? ["ContextMenuSub", "ContextMenuSubContent", "ContextMenuSubTrigger"]
      : []),
    ...(state.showDestructive ? [] : []),
    ...(state.showCheckbox ? ["ContextMenuCheckboxItem"] : []),
    ...(state.showRadio
      ? ["ContextMenuLabel", "ContextMenuRadioGroup", "ContextMenuRadioItem"]
      : []),
    "ContextMenuSeparator",
    ...(state.showShortcuts ? ["ContextMenuShortcut"] : []),
    "ContextMenuTrigger",
    ...(state.customTrigger ? ["contextMenuTriggerClassName"] : []),
  ];
  const needsState = state.controlled || state.showRadio;
  const rootProps = state.controlled
    ? " open={open} onOpenChange={setOpen}"
    : "";
  const trigger = buildTriggerCode(state);
  const shortcutBlock = state.showShortcuts
    ? "\n            <ContextMenuShortcut>R</ContextMenuShortcut>"
    : "";
  const submenuBlock = state.showSubmenu
    ? `
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              <ContextMenuItem>Save Page...</ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>`
    : "";
  const destructiveBlock = state.showDestructive
    ? `
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <Trash2 className="size-3.5 opacity-70" />
            Delete${state.showShortcuts ? "\n            <ContextMenuShortcut>Del</ContextMenuShortcut>" : ""}
          </ContextMenuItem>`
    : "";
  const checkboxBlock = state.showCheckbox
    ? `
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem checked>Show Shortcuts</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem disabled>Show Metadata</ContextMenuCheckboxItem>
        </ContextMenuGroup>`
    : "";
  const radioBlock = state.showRadio
    ? `
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>`
    : "";

  return `"use client";
${needsState ? '\nimport { useState } from "react";' : ""}
import { Copy, PencilLine, Share2${state.showDestructive ? ", Trash2" : ""} } from "lucide-react";
import {
  ${imports.join(",\n  ")},
} from "${importPath}";

export function ContextMenuPreview() {${needsState ? `\n  const [open, setOpen] = useState(false);${state.showRadio ? '\n  const [person, setPerson] = useState("pedro");' : ""}` : ""}
  return (
    <ContextMenu${rootProps}>
${trigger}
      <ContextMenuContent className="w-52" collisionPadding={${state.collisionPadding}}>
        <ContextMenuGroup>
          <ContextMenuItem>
            <PencilLine className="size-3.5 opacity-70" />
            Rename${shortcutBlock}
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="size-3.5 opacity-70" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem>
            <Share2 className="size-3.5 opacity-70" />
            Share
          </ContextMenuItem>${submenuBlock}${destructiveBlock}
        </ContextMenuGroup>${checkboxBlock}${radioBlock}
      </ContextMenuContent>
    </ContextMenu>
  );
}`;
}

export function getContextMenuDefaultUsageCode(importPath: string) {
  return generateContextMenuCode(CONTEXT_MENU_DEFAULT_STATE, importPath);
}

function ContextMenuPlaygroundPreview({
  state,
  ui,
}: {
  state: ContextMenuPlaygroundState;
  ui: ContextMenuModule;
}) {
  const {
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
    contextMenuTriggerClassName,
  } = ui;
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState("pedro");

  const trigger = state.customTrigger ? (
    <ContextMenuTrigger asChild className="w-full max-w-xl">
      <div
        className={cn(
          contextMenuTriggerClassName,
          "w-full border border-border/80 px-6 py-14 text-center"
        )}
      >
        <p className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
          Right-click this workspace block
        </p>
        <p className="mt-2 text-[14px] text-secondary leading-6">
          Shift+F10 and the Context Menu key also open the menu from keyboard
          focus.
        </p>
      </div>
    </ContextMenuTrigger>
  ) : (
    <ContextMenuTrigger className="w-full max-w-xl border border-border/80 px-6 py-14 text-center">
      Right-click this workspace block
    </ContextMenuTrigger>
  );

  return (
    <div className="flex min-h-[320px] items-center justify-center p-6">
      <ContextMenu
        onOpenChange={state.controlled ? setOpen : undefined}
        open={state.controlled ? open : undefined}
      >
        {trigger}
        <ContextMenuContent
          className="w-52"
          collisionPadding={Number(state.collisionPadding)}
        >
          <ContextMenuGroup>
            <ContextMenuItem>
              <span className="flex items-center gap-2.5">
                <PencilLine className="size-3.5 opacity-70" />
                Rename
              </span>
              {state.showShortcuts ? (
                <ContextMenuShortcut>R</ContextMenuShortcut>
              ) : null}
            </ContextMenuItem>
            <ContextMenuItem>
              <span className="flex items-center gap-2.5">
                <Copy className="size-3.5 opacity-70" />
                Duplicate
              </span>
              {state.showShortcuts ? (
                <ContextMenuShortcut>⌘D</ContextMenuShortcut>
              ) : null}
            </ContextMenuItem>
            <ContextMenuItem>
              <span className="flex items-center gap-2.5">
                <Share2 className="size-3.5 opacity-70" />
                Share
              </span>
              {state.showShortcuts ? (
                <ContextMenuShortcut>S</ContextMenuShortcut>
              ) : null}
            </ContextMenuItem>
            {state.showSubmenu ? (
              <ContextMenuSub>
                <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-44">
                  <ContextMenuGroup>
                    <ContextMenuItem>Save Page...</ContextMenuItem>
                    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                    <ContextMenuItem>Name Window...</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
            ) : null}
            {state.showDestructive ? (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">
                  <span className="flex items-center gap-2.5">
                    <Trash2 className="size-3.5 opacity-70" />
                    Delete
                  </span>
                  {state.showShortcuts ? (
                    <ContextMenuShortcut>Del</ContextMenuShortcut>
                  ) : null}
                </ContextMenuItem>
              </>
            ) : null}
          </ContextMenuGroup>
          {state.showCheckbox ? (
            <>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuCheckboxItem checked>
                  Show Shortcuts
                </ContextMenuCheckboxItem>
                <ContextMenuCheckboxItem disabled>
                  Show Metadata
                </ContextMenuCheckboxItem>
              </ContextMenuGroup>
            </>
          ) : null}
          {state.showRadio ? (
            <>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuRadioGroup onValueChange={setPerson} value={person}>
                  <ContextMenuLabel>People</ContextMenuLabel>
                  <ContextMenuRadioItem value="pedro">
                    Pedro Duarte
                  </ContextMenuRadioItem>
                  <ContextMenuRadioItem value="colm">
                    Colm Tuite
                  </ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuGroup>
            </>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

function ContextMenuPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ContextMenuPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ContextMenuPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Context Menu"
    >
      <DocsPlaygroundSegmentedField
        label="Collision padding"
        onChange={(collisionPadding) => onChange({ collisionPadding })}
        options={COLLISION_PADDING_OPTIONS}
        value={state.collisionPadding}
      />
      <DocsPlaygroundToggleField
        checked={state.controlled}
        label="Controlled"
        onChange={(controlled) => onChange({ controlled })}
      />
      <DocsPlaygroundToggleField
        checked={state.customTrigger}
        label="Custom trigger"
        onChange={(customTrigger) => onChange({ customTrigger })}
      />
      <DocsPlaygroundToggleField
        checked={state.showSubmenu}
        label="Submenu"
        onChange={(showSubmenu) => onChange({ showSubmenu })}
      />
      <DocsPlaygroundToggleField
        checked={state.showDestructive}
        label="Destructive row"
        onChange={(showDestructive) => onChange({ showDestructive })}
      />
      <DocsPlaygroundToggleField
        checked={state.showShortcuts}
        label="Shortcuts"
        onChange={(showShortcuts) => onChange({ showShortcuts })}
      />
      <DocsPlaygroundToggleField
        checked={state.showCheckbox}
        label="Checkbox items"
        onChange={(showCheckbox) => onChange({ showCheckbox })}
      />
      <DocsPlaygroundToggleField
        checked={state.showRadio}
        label="Radio group"
        onChange={(showRadio) => onChange({ showRadio })}
      />
    </DocsPlaygroundPanel>
  );
}

type ContextMenuPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ContextMenuPlaygroundProvider({
  children,
  importPath,
  ui,
}: {
  children: (props: ContextMenuPlaygroundRenderProps) => ReactNode;
  importPath: string;
  ui: ContextMenuModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ContextMenuPlaygroundState>(
    CONTEXT_MENU_DEFAULT_STATE
  );

  const updateState = (next: Partial<ContextMenuPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => setState(CONTEXT_MENU_DEFAULT_STATE);

  useEffect(() => {
    setPlaygroundCode(generateContextMenuCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ContextMenuPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <ContextMenuPlaygroundPreview state={state} ui={ui} />,
    renderSettings,
  });
}
