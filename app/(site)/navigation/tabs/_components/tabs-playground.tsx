"use client";

import {
  Activity,
  Files,
  FolderKanban,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import {
  type ComponentType,
  type ReactNode,
  useEffect,
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
import type { TabsVariant } from "@/registry/tabs";

type TabsRootProps = {
  activationMode?: "automatic" | "manual";
  animateContent?: boolean;
  children?: ReactNode;
  className?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  value?: string;
  variant?: TabsVariant;
};

type TabsListProps = {
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

type TabsTriggerProps = {
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  value: string;
};

type TabsContentProps = {
  children?: ReactNode;
  className?: string;
  forceMount?: boolean;
  value: string;
};

export type TabsModule = {
  Tabs: ComponentType<TabsRootProps>;
  TabsContent: ComponentType<TabsContentProps>;
  TabsList: ComponentType<TabsListProps>;
  TabsTrigger: ComponentType<TabsTriggerProps>;
};

export type TabsDemoItem = {
  body: string;
  heading: string;
  icon: LucideIcon;
  label: string;
  value: string;
};

export const TABS_DEMO_ITEMS: TabsDemoItem[] = [
  {
    body: "Keep the main summary visible while switching between planning, delivery, and support details without leaving the current surface.",
    heading: "Product workspace",
    icon: LayoutGrid,
    label: "Overview",
    value: "overview",
  },
  {
    body: "Review the last design review, implementation notes, and timeline updates in a compact panel that still feels grounded.",
    heading: "Recent handoff",
    icon: Activity,
    label: "Activity",
    value: "activity",
  },
  {
    body: "Attach decks, mockups, and implementation references while preserving a clear transition between each content block.",
    heading: "Shared assets",
    icon: Files,
    label: "Files",
    value: "files",
  },
];

const OVERFLOW_ITEMS: TabsDemoItem[] = [
  {
    body: "Track milestones, owners, and delivery risks across the current release train.",
    heading: "Delivery board",
    icon: FolderKanban,
    label: "Delivery",
    value: "delivery",
  },
  {
    body: "Surface design review notes, open questions, and sign-off status in one place.",
    heading: "Design review",
    icon: LayoutGrid,
    label: "Design",
    value: "design",
  },
  {
    body: "Watch implementation progress, blockers, and pull-request activity for the active sprint.",
    heading: "Engineering",
    icon: Activity,
    label: "Engineering",
    value: "engineering",
  },
  {
    body: "Keep regression status, release candidates, and verification notes close to the tab rail.",
    heading: "QA",
    icon: Files,
    label: "QA",
    value: "qa",
  },
  {
    body: "Route customer escalations and support macros without leaving the workspace shell.",
    heading: "Support",
    icon: FolderKanban,
    label: "Support",
    value: "support",
  },
];

type TabsPlaygroundState = {
  activationMode: "automatic" | "manual";
  animateContent: boolean;
  controlled: boolean;
  disableMiddleTab: boolean;
  fullWidth: boolean;
  orientation: "horizontal" | "vertical";
  overflowTabs: boolean;
  showBadges: boolean;
  showIcons: boolean;
  variant: TabsVariant;
};

export const TABS_DEFAULT_STATE: TabsPlaygroundState = {
  activationMode: "automatic",
  animateContent: true,
  controlled: true,
  disableMiddleTab: false,
  fullWidth: false,
  orientation: "horizontal",
  overflowTabs: false,
  showBadges: false,
  showIcons: false,
  variant: "pill",
};

const VARIANT_OPTIONS: Array<{ label: string; value: TabsVariant }> = [
  { label: "Pill", value: "pill" },
  { label: "Underline", value: "underline" },
];

const ORIENTATION_OPTIONS = [
  { label: "Horizontal", value: "horizontal" as const },
  { label: "Vertical", value: "vertical" as const },
];

const ACTIVATION_OPTIONS = [
  { label: "Automatic", value: "automatic" as const },
  { label: "Manual", value: "manual" as const },
];

const ICON_IMPORTS: Record<string, string> = {
  activity: "Activity",
  delivery: "FolderKanban",
  design: "LayoutGrid",
  engineering: "Activity",
  files: "Files",
  overview: "LayoutGrid",
  qa: "Files",
  support: "FolderKanban",
};

function getVisibleItems(state: TabsPlaygroundState) {
  return state.overflowTabs
    ? [...TABS_DEMO_ITEMS, ...OVERFLOW_ITEMS]
    : TABS_DEMO_ITEMS;
}

function buildTabsRootProps(
  state: TabsPlaygroundState,
  supportsVariant: boolean
) {
  const props: string[] = ['className="w-full max-w-2xl"'];

  if (supportsVariant && state.variant !== "pill") {
    props.push(`variant="${state.variant}"`);
  }

  if (state.orientation !== "horizontal") {
    props.push(`orientation="${state.orientation}"`);
  }

  if (state.activationMode !== "automatic") {
    props.push('activationMode="manual"');
  }

  if (state.animateContent) {
    props.push("animateContent");
  }

  if (state.controlled) {
    props.push("value={value}");
    props.push("onValueChange={setValue}");
  } else {
    props.push('defaultValue="overview"');
  }

  return props.map((prop) => `      ${prop}`).join("\n");
}

function buildTabsListProps(state: TabsPlaygroundState) {
  if (state.fullWidth) {
    return " fullWidth";
  }

  return "";
}

function buildTriggerChildren(
  item: TabsDemoItem,
  state: TabsPlaygroundState,
  supportsVariant: boolean
) {
  const disabled =
    state.disableMiddleTab && item.value === "activity" ? " disabled" : "";

  if (state.showIcons && !supportsVariant) {
    return `        <TabsTrigger value="${item.value}"${disabled}>
          <${ICON_IMPORTS[item.value]} className="mr-1.5 inline size-4" />
          ${item.label}
        </TabsTrigger>`;
  }

  const parts: string[] = [];

  if (state.showIcons && supportsVariant) {
    parts.push(`icon={<${ICON_IMPORTS[item.value]} className="size-4" />}`);
  }

  if (state.showBadges && supportsVariant) {
    parts.push('badge="3"');
  }

  const attrs = parts.length > 0 ? ` ${parts.join(" ")}` : "";

  return `        <TabsTrigger value="${item.value}"${attrs}${disabled}>
          ${item.label}
        </TabsTrigger>`;
}

function buildContentBlock(item: TabsDemoItem) {
  return `        <TabsContent key="${item.value}" value="${item.value}">
          <div className="space-y-3 p-4">
            <p className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
              ${item.heading}
            </p>
            <p className="text-[14px] text-secondary leading-6">
              ${item.body}
            </p>
          </div>
        </TabsContent>`;
}

export function generateTabsCode(
  state: TabsPlaygroundState,
  importPath: string,
  supportsVariant: boolean
) {
  const items = getVisibleItems(state);
  const rootProps = buildTabsRootProps(state, supportsVariant);
  const listProps = buildTabsListProps(state);
  const triggers = items
    .map((item) => buildTriggerChildren(item, state, supportsVariant))
    .join("\n");
  const contents = items.map((item) => buildContentBlock(item)).join("\n");
  const iconImports = state.showIcons
    ? `\nimport { ${[...new Set(items.map((item) => ICON_IMPORTS[item.value]))].join(", ")} } from "lucide-react";`
    : "";
  const stateHook = state.controlled
    ? `\n  const [value, setValue] = useState("overview");\n`
    : "\n";

  return `"use client";
${state.controlled ? '\nimport { useState } from "react";' : ""}${iconImports}
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "${importPath}";

export function TabsPreview() {${stateHook}
  return (
    <Tabs
${rootProps}
    >
      <TabsList${listProps}>
${triggers}
      </TabsList>

${contents}
    </Tabs>
  );
}`;
}

export function getTabsDefaultUsageCode(
  importPath: string,
  supportsVariant = true
) {
  return generateTabsCode(TABS_DEFAULT_STATE, importPath, supportsVariant);
}

function TabsPlaygroundPreview({
  state,
  supportsVariant,
  ui,
}: {
  state: TabsPlaygroundState;
  supportsVariant: boolean;
  ui: TabsModule;
}) {
  const { Tabs, TabsContent, TabsList, TabsTrigger } = ui;
  const items = useMemo(() => getVisibleItems(state), [state]);
  const [value, setValue] = useState("overview");

  const remountKey = useMemo(
    () =>
      [
        state.variant,
        state.orientation,
        state.activationMode,
        state.animateContent,
        state.controlled,
        state.fullWidth,
        state.overflowTabs,
        state.showIcons,
        state.showBadges,
        state.disableMiddleTab,
        supportsVariant,
      ].join(":"),
    [state, supportsVariant]
  );

  const variant = supportsVariant ? state.variant : "underline";

  return (
    <div className="flex min-h-[320px] w-full items-center justify-center px-4 py-10">
      <Tabs
        activationMode={state.activationMode}
        animateContent={supportsVariant ? state.animateContent : undefined}
        className={cnTabsRoot(state.orientation)}
        defaultValue={state.controlled ? undefined : "overview"}
        key={remountKey}
        onValueChange={state.controlled ? setValue : undefined}
        orientation={state.orientation}
        value={state.controlled ? value : undefined}
        variant={variant}
      >
        <TabsList fullWidth={state.fullWidth}>
          {items.map((item) => {
            const Icon = item.icon;
            const triggerLabel = (
              <>
                {state.showIcons ? <Icon className="size-4" /> : null}
                {item.label}
              </>
            );

            return (
              <TabsTrigger
                badge={state.showBadges && supportsVariant ? "3" : undefined}
                disabled={state.disableMiddleTab && item.value === "activity"}
                icon={
                  state.showIcons && supportsVariant ? (
                    <Icon className="size-4" />
                  ) : undefined
                }
                key={item.value}
                value={item.value}
              >
                {supportsVariant ? item.label : triggerLabel}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {items.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            <div className="space-y-3 p-4">
              <p className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
                {item.heading}
              </p>
              <p className="text-[14px] text-secondary leading-6">
                {item.body}
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function cnTabsRoot(orientation: TabsPlaygroundState["orientation"]) {
  return orientation === "vertical"
    ? "flex w-full max-w-2xl gap-4"
    : "w-full max-w-2xl";
}

function TabsPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
  supportsVariant,
}: {
  onChange: (next: Partial<TabsPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: TabsPlaygroundState;
  supportsVariant: boolean;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Tabs"
    >
      {supportsVariant ? (
        <DocsPlaygroundSegmentedField
          label="Variant"
          onChange={(variant) => onChange({ variant })}
          options={VARIANT_OPTIONS}
          value={state.variant}
        />
      ) : null}
      {supportsVariant ? (
        <DocsPlaygroundSegmentedField
          label="Orientation"
          onChange={(orientation) => onChange({ orientation })}
          options={ORIENTATION_OPTIONS}
          value={state.orientation}
        />
      ) : null}
      <DocsPlaygroundSegmentedField
        label="Activation"
        onChange={(activationMode) => onChange({ activationMode })}
        options={ACTIVATION_OPTIONS}
        value={state.activationMode}
      />
      <DocsPlaygroundToggleField
        checked={state.controlled}
        label="Controlled"
        onChange={(controlled) => onChange({ controlled })}
      />
      {supportsVariant ? (
        <DocsPlaygroundToggleField
          checked={state.animateContent}
          label="Animate content"
          onChange={(animateContent) => onChange({ animateContent })}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.fullWidth}
        label="Full-width list"
        onChange={(fullWidth) => onChange({ fullWidth })}
      />
      <DocsPlaygroundToggleField
        checked={state.overflowTabs}
        label="Overflow tabs"
        onChange={(overflowTabs) => onChange({ overflowTabs })}
      />
      <DocsPlaygroundToggleField
        checked={state.showIcons}
        label="Icons"
        onChange={(showIcons) => onChange({ showIcons })}
      />
      {supportsVariant ? (
        <DocsPlaygroundToggleField
          checked={state.showBadges}
          label="Badges"
          onChange={(showBadges) => onChange({ showBadges })}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.disableMiddleTab}
        label="Disable middle tab"
        onChange={(disableMiddleTab) => onChange({ disableMiddleTab })}
      />
    </DocsPlaygroundPanel>
  );
}

type TabsPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function TabsPlaygroundProvider({
  children,
  importPath,
  supportsVariant = true,
  ui,
}: {
  children: (props: TabsPlaygroundRenderProps) => ReactNode;
  importPath: string;
  supportsVariant?: boolean;
  ui: TabsModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<TabsPlaygroundState>(TABS_DEFAULT_STATE);

  const updateState = (next: Partial<TabsPlaygroundState>) => {
    setState((current) => {
      const merged = { ...current, ...next };
      if (!supportsVariant) {
        merged.variant = "underline";
        merged.animateContent = false;
      }
      return merged;
    });
  };

  const resetState = () => {
    setState(
      supportsVariant
        ? TABS_DEFAULT_STATE
        : { ...TABS_DEFAULT_STATE, animateContent: false, variant: "underline" }
    );
  };

  useEffect(() => {
    setPlaygroundCode(generateTabsCode(state, importPath, supportsVariant));
  }, [importPath, setPlaygroundCode, state, supportsVariant]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <TabsPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
      supportsVariant={supportsVariant}
    />
  );

  return children({
    preview: (
      <TabsPlaygroundPreview
        state={state}
        supportsVariant={supportsVariant}
        ui={ui}
      />
    ),
    renderSettings,
  });
}
