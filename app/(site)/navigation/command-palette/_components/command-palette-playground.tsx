"use client";

import { Copy, FileText, Home, Layers, LogOut, Search } from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSegmentedField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import {
  type CommandMenuGroupDef,
  type CommandMenuItemDef,
  CommandPalette,
} from "@/registry/command-palette";

type TriggerMode = "default" | "custom";

type CommandPalettePlaygroundState = {
  enableGlobalShortcut: boolean;
  includeActions: boolean;
  includeDisabled: boolean;
  showFooterHints: boolean;
  showRecentGroup: boolean;
  showThemeGroup: boolean;
  themed: boolean;
  triggerMode: TriggerMode;
  useAsyncSearch: boolean;
};

export const COMMAND_PALETTE_DEFAULT_STATE: CommandPalettePlaygroundState = {
  enableGlobalShortcut: false,
  includeActions: true,
  includeDisabled: true,
  showFooterHints: true,
  showRecentGroup: true,
  showThemeGroup: true,
  themed: false,
  triggerMode: "default",
  useAsyncSearch: false,
};

const TRIGGER_MODE_OPTIONS: Array<{
  label: string;
  value: TriggerMode;
}> = [
  { label: "Default", value: "default" },
  { label: "Custom", value: "custom" },
];

const BASE_GROUPS: CommandMenuGroupDef[] = [
  {
    heading: "Pages",
    items: [
      {
        id: "overview",
        label: "Overview",
        href: "/",
        icon: Home,
        description: "Return to the docs home page.",
        keywords: ["home", "start"],
        shortcut: "G H",
      },
      {
        id: "installation",
        label: "Installation",
        href: "/installation",
        icon: FileText,
        description: "Add Iconiq components to your project.",
        keywords: ["setup", "shadcn", "registry"],
      },
    ],
  },
  {
    heading: "Components",
    items: [
      {
        id: "button",
        label: "Button",
        href: "/buttons-and-actions/button",
        icon: Layers,
        description: "Primary action control with motion variants.",
        keywords: ["cta", "action"],
      },
      {
        id: "dialog",
        label: "Dialog",
        href: "/overlay-and-popups/dialog",
        icon: Layers,
        description: "Modal surface for focused tasks and confirmations.",
        keywords: ["modal", "overlay"],
        disabled: true,
      },
    ],
  },
];

const ACTION_ITEMS: CommandMenuItemDef[] = [
  {
    id: "copy-link",
    label: "Copy page link",
    icon: Copy,
    description: "Copy the current docs URL to the clipboard.",
    keywords: ["share", "clipboard"],
    shortcut: "⌘C",
    action: () => {
      navigator.clipboard
        ?.writeText(window.location.href)
        .catch(() => undefined);
    },
  },
  {
    id: "sign-out",
    label: "Sign out",
    icon: LogOut,
    description: "Demo action item without navigation.",
    keywords: ["logout", "session"],
    action: () => {
      // Playground-only demo action.
    },
  },
];

const ASYNC_RESULTS: CommandMenuGroupDef[] = [
  {
    heading: "Remote",
    items: [
      {
        id: "async-calendar",
        label: "Calendar",
        href: "/inputs-and-forms/calendar",
        icon: Layers,
        description: "Loaded from an async search callback.",
        keywords: ["date", "picker"],
      },
      {
        id: "async-slider",
        label: "Slider",
        href: "/inputs-and-forms/slider",
        icon: Layers,
        description: "Another async result for the current query.",
        keywords: ["range", "input"],
      },
    ],
  },
];

function buildPlaygroundGroups(
  state: CommandPalettePlaygroundState
): CommandMenuGroupDef[] {
  const groups = BASE_GROUPS.map((group) => ({
    ...group,
    items: group.items
      .filter((item) => state.includeDisabled || !item.disabled)
      .map((item) => ({ ...item })),
  }));

  if (state.includeActions) {
    groups.push({
      heading: "Actions",
      items: ACTION_ITEMS,
    });
  }

  return groups;
}

const ICON_NAME_BY_COMPONENT = new Map<
  NonNullable<CommandMenuItemDef["icon"]>,
  string
>([
  [Home, "Home"],
  [FileText, "FileText"],
  [Layers, "Layers"],
  [Copy, "Copy"],
  [LogOut, "LogOut"],
]);

function getIconName(icon?: CommandMenuItemDef["icon"]) {
  if (!icon) {
    return undefined;
  }

  return ICON_NAME_BY_COMPONENT.get(icon) ?? "Layers";
}

function collectIconImports(groups: CommandMenuGroupDef[]) {
  const iconImports = new Set<string>();

  for (const group of groups) {
    for (const item of group.items) {
      const iconName = getIconName(item.icon);

      if (iconName) {
        iconImports.add(iconName);
      }
    }
  }

  return iconImports;
}

function serializeItem(item: CommandMenuItemDef, indent: string) {
  const lines = [`${indent}label: "${item.label}",`];

  if (item.id) {
    lines.push(`${indent}id: "${item.id}",`);
  }

  if (item.href) {
    lines.push(`${indent}href: "${item.href}",`);
  }

  const iconName = getIconName(item.icon);

  if (iconName) {
    lines.push(`${indent}icon: ${iconName},`);
  }

  if (item.description) {
    lines.push(`${indent}description: "${item.description}",`);
  }

  if (item.keywords?.length) {
    lines.push(
      `${indent}keywords: [${item.keywords.map((keyword) => `"${keyword}"`).join(", ")}],`
    );
  }

  if (item.shortcut) {
    lines.push(`${indent}shortcut: "${item.shortcut}",`);
  }

  if (item.disabled) {
    lines.push(`${indent}disabled: true,`);
  }

  if (item.action) {
    lines.push(`${indent}action: () => {},`);
  }

  return lines.join("\n");
}

function serializeGroups(groups: CommandMenuGroupDef[]) {
  return groups
    .map((group) => {
      const items = group.items
        .map(
          (item) => `      {
${serializeItem(item, "        ")}
      }`
        )
        .join(",\n");

      return `  {
    heading: "${group.heading}",
    items: [
${items}
    ],
  }`;
    })
    .join(",\n");
}

function buildPaletteProps(state: CommandPalettePlaygroundState) {
  const props = [
    "groups={groups}",
    'placeholder="Search pages, components, actions…"',
  ];

  if (state.showThemeGroup) {
    props.push("showThemeGroup");
  }

  if (state.showRecentGroup) {
    props.push("showRecentGroup");
  }

  if (!state.showFooterHints) {
    props.push("showFooterHints={false}");
  }

  if (state.enableGlobalShortcut) {
    props.push("enableGlobalShortcut");
  } else {
    props.push("enableGlobalShortcut={false}");
  }

  if (state.themed) {
    props.push("themed");
  }

  if (state.useAsyncSearch) {
    props.push("onSearch={searchCommands}");
    props.push("searchDebounceMs={250}");
  }

  if (state.triggerMode === "custom") {
    props.push(`trigger={
    <button
      className="inline-flex w-full max-w-md items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
      type="button"
    >
      <Search className="size-4 shrink-0" />
      Custom trigger
    </button>
  }`);
  } else {
    props.push(`triggerProps={{
    className: "w-full max-w-md",
    label: "Open command palette",
  }}`);
  }

  return props;
}

function getAsyncHelper(useAsyncSearch: boolean) {
  if (!useAsyncSearch) {
    return "";
  }

  return `
async function searchCommands(query: string) {
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return [
    {
      heading: "Remote",
      items: [
        {
          label: "Calendar",
          href: "/inputs-and-forms/calendar",
          icon: Layers,
          description: "Loaded from an async search callback.",
          keywords: ["date", "picker"],
        },
      ],
    },
  ];
}
`;
}

function getIconImportLine(iconImports: Set<string>) {
  if (iconImports.size === 0) {
    return `import { Search } from "lucide-react";\n\n`;
  }

  return `import { ${["Search", ...Array.from(iconImports).sort()].join(", ")} } from "lucide-react";\n\n`;
}

function generateCommandPaletteCode(
  state: CommandPalettePlaygroundState,
  importPath: string
) {
  const groups = buildPlaygroundGroups(state);
  const iconImports = collectIconImports(groups);
  const props = buildPaletteProps(state);
  const iconImportLine = getIconImportLine(iconImports);
  const asyncHelper = getAsyncHelper(state.useAsyncSearch);

  return `"use client";

${iconImportLine}import {
  CommandPalette,
  type CommandMenuGroupDef,
} from "${importPath}";

const groups: CommandMenuGroupDef[] = [
${serializeGroups(groups)}
];${asyncHelper}

export function CommandPalettePreview() {
  return (
    <CommandPalette
      ${props.join("\n      ")}
    />
  );
}`;
}

export function getCommandPaletteDefaultUsageCode(importPath: string) {
  return generateCommandPaletteCode(COMMAND_PALETTE_DEFAULT_STATE, importPath);
}

function CommandPalettePlaygroundPreview({
  state,
}: {
  state: CommandPalettePlaygroundState;
}) {
  const groups = useMemo(() => buildPlaygroundGroups(state), [state]);

  const onSearch = useMemo(() => {
    if (!state.useAsyncSearch) {
      return undefined;
    }

    return async (query: string) => {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      const normalized = query.trim().toLowerCase();

      if (!normalized) {
        return [];
      }

      return ASYNC_RESULTS.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          [item.label, item.description, ...(item.keywords ?? [])]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        ),
      })).filter((group) => group.items.length > 0);
    };
  }, [state.useAsyncSearch]);

  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-8">
      <CommandPalette
        enableGlobalShortcut={state.enableGlobalShortcut}
        groups={groups}
        onSearch={onSearch}
        placeholder="Search pages, components, actions…"
        searchDebounceMs={250}
        showFooterHints={state.showFooterHints}
        showRecentGroup={state.showRecentGroup}
        showThemeGroup={state.showThemeGroup}
        themed={state.themed}
        trigger={
          state.triggerMode === "custom" ? (
            <button
              className="inline-flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-muted-foreground text-sm transition-colors hover:bg-accent/50"
              type="button"
            >
              <Search className="size-4 shrink-0" />
              <span className="flex-1 truncate">Custom trigger</span>
            </button>
          ) : undefined
        }
        triggerProps={
          state.triggerMode === "default"
            ? {
                className: "w-full max-w-md",
                label: "Open command palette",
              }
            : undefined
        }
      />
    </div>
  );
}

function CommandPalettePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<CommandPalettePlaygroundState>) => void;
  onClose: () => void;
  onReset: () => void;
  state: CommandPalettePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Command Palette"
    >
      <DocsPlaygroundSegmentedField
        label="Trigger"
        onChange={(triggerMode) => onChange({ triggerMode })}
        options={TRIGGER_MODE_OPTIONS}
        value={state.triggerMode}
      />
      <DocsPlaygroundToggleField
        checked={state.showThemeGroup}
        label="Theme group"
        onChange={(showThemeGroup) => onChange({ showThemeGroup })}
      />
      <DocsPlaygroundToggleField
        checked={state.showRecentGroup}
        label="Recent items"
        onChange={(showRecentGroup) => onChange({ showRecentGroup })}
      />
      <DocsPlaygroundToggleField
        checked={state.includeActions}
        label="Action items"
        onChange={(includeActions) => onChange({ includeActions })}
      />
      <DocsPlaygroundToggleField
        checked={state.includeDisabled}
        label="Disabled item"
        onChange={(includeDisabled) => onChange({ includeDisabled })}
      />
      <DocsPlaygroundToggleField
        checked={state.useAsyncSearch}
        label="Async search"
        onChange={(useAsyncSearch) => onChange({ useAsyncSearch })}
      />
      <DocsPlaygroundToggleField
        checked={state.showFooterHints}
        label="Footer hints"
        onChange={(showFooterHints) => onChange({ showFooterHints })}
      />
      <DocsPlaygroundToggleField
        checked={state.enableGlobalShortcut}
        label="Global shortcut"
        onChange={(enableGlobalShortcut) => onChange({ enableGlobalShortcut })}
      />
      <DocsPlaygroundToggleField
        checked={state.themed}
        label="Themed surface"
        onChange={(themed) => onChange({ themed })}
      />
    </DocsPlaygroundPanel>
  );
}

type CommandPalettePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

const IMPORT_PATH = "@/components/ui/command-palette";

export function CommandPalettePlaygroundProvider({
  children,
}: {
  children: (props: CommandPalettePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<CommandPalettePlaygroundState>(
    COMMAND_PALETTE_DEFAULT_STATE
  );

  const updateState = (next: Partial<CommandPalettePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(COMMAND_PALETTE_DEFAULT_STATE);
  };

  useLayoutEffect(() => {
    setPlaygroundCode(generateCommandPaletteCode(state, IMPORT_PATH));
  }, [setPlaygroundCode, state]);

  useEffect(() => {
    return () => {
      setPlaygroundCode(null);
    };
  }, [setPlaygroundCode]);

  const renderSettings = (onClose: () => void) => (
    <CommandPalettePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <>
      {children({
        preview: <CommandPalettePlaygroundPreview state={state} />,
        renderSettings,
      })}
    </>
  );
}
