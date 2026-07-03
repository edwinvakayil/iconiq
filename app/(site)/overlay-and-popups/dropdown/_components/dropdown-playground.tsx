"use client";

import { LogOut, Settings, UserRound } from "lucide-react";
import Image from "next/image";
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
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";

type DropdownVariant = "action" | "select";
type DropdownAlign = "center" | "end" | "start";
type DropdownSide = "bottom" | "left" | "right" | "top";
type TriggerShape = "avatar" | "default";

type DropdownRootProps = {
  children?: ReactNode;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | undefined) => void;
  open?: boolean;
  value?: string;
  variant?: DropdownVariant;
};

type DropdownTriggerProps = {
  "aria-label"?: string;
  children?: ReactNode;
  className?: string;
  showChevron?: boolean;
  triggerShape?: TriggerShape;
};

type DropdownContentProps = {
  align?: DropdownAlign;
  children?: ReactNode;
  className?: string;
  side?: DropdownSide;
};

type DropdownItemProps = {
  children?: ReactNode;
  onClick?: () => void;
  value?: string;
};

type DropdownGroupProps = {
  children?: ReactNode;
  label?: string;
};

export type DropdownModule = {
  Dropdown: ComponentType<DropdownRootProps>;
  DropdownContent: ComponentType<DropdownContentProps>;
  DropdownGroup: ComponentType<DropdownGroupProps>;
  DropdownItem: ComponentType<DropdownItemProps>;
  DropdownTrigger: ComponentType<DropdownTriggerProps>;
  DropdownValue: ComponentType<{ placeholder?: string }>;
};

type DropdownPlaygroundState = {
  align: DropdownAlign;
  controlled: boolean;
  disabled: boolean;
  longList: boolean;
  modal: boolean;
  showChevron: boolean;
  showGroups: boolean;
  side: DropdownSide;
  triggerShape: TriggerShape;
  variant: DropdownVariant;
};

const DROPDOWN_DEFAULT_STATE: DropdownPlaygroundState = {
  align: "start",
  controlled: true,
  disabled: false,
  longList: false,
  modal: false,
  showChevron: true,
  showGroups: false,
  side: "bottom",
  triggerShape: "default",
  variant: "select",
};

const VARIANT_OPTIONS = [
  { label: "Select", value: "select" as const },
  { label: "Action", value: "action" as const },
];

const ALIGN_OPTIONS = [
  { label: "Start", value: "start" as const },
  { label: "Center", value: "center" as const },
  { label: "End", value: "end" as const },
];

const SIDE_OPTIONS = [
  { label: "Bottom", value: "bottom" as const },
  { label: "Top", value: "top" as const },
  { label: "Left", value: "left" as const },
  { label: "Right", value: "right" as const },
];

const TRIGGER_SHAPE_OPTIONS = [
  { label: "Default", value: "default" as const },
  { label: "Avatar", value: "avatar" as const },
];

const AVATAR_TRIGGER_CLASSNAME =
  "mx-auto h-11 w-11 overflow-hidden rounded-full border-border/80 p-0 shadow-none [&>span]:block [&>span]:size-full";

const AVATAR_TRIGGER_CHILDREN = `        <Image
          alt=""
          className="h-full w-full object-cover"
          height={44}
          src="/assets/av1.png"
          width={44}
        />
        <span className="sr-only">Open profile menu</span>`;

function buildDropdownImports(state: DropdownPlaygroundState) {
  return [
    "Dropdown",
    "DropdownContent",
    state.showGroups ? "DropdownGroup" : null,
    "DropdownItem",
    "DropdownTrigger",
    state.variant === "select" ? "DropdownValue" : null,
    state.variant === "action" ? "LogOut" : null,
    state.variant === "action" ? "Settings" : null,
    state.variant === "action" ? "UserRound" : null,
  ].filter(Boolean);
}

function buildRootProps(state: DropdownPlaygroundState, needsState: boolean) {
  return [
    state.variant !== "select" ? 'variant="action"' : "",
    state.modal ? "modal" : "",
    state.disabled ? "disabled" : "",
    needsState ? "onOpenChange={setOpen} open={open}" : "",
    state.variant === "select" ? "onValueChange={setTeam} value={team}" : "",
    state.variant === "select" ? 'className="w-[220px]"' : 'className="w-14"',
  ]
    .filter(Boolean)
    .join(" ");
}

function buildTriggerProps(state: DropdownPlaygroundState) {
  return [
    state.triggerShape === "avatar" ? 'aria-label="Open profile menu"' : "",
    state.triggerShape === "avatar"
      ? `className="${AVATAR_TRIGGER_CLASSNAME}"`
      : 'className="border-neutral-200 shadow-none hover:border-neutral-200 dark:border-neutral-800 dark:hover:border-neutral-800"',
    state.showChevron ? "" : "showChevron={false}",
    state.triggerShape === "avatar" ? 'triggerShape="avatar"' : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildContentProps(state: DropdownPlaygroundState) {
  return [
    state.align !== "start" ? `align="${state.align}"` : "",
    state.side !== "bottom" ? `side="${state.side}"` : "",
    state.variant === "select" ? 'className="w-full"' : 'className="w-56"',
  ]
    .filter(Boolean)
    .join(" ");
}

function buildSelectBody(state: DropdownPlaygroundState) {
  const teams = getSelectTeams(state.longList);

  if (!state.showGroups) {
    return teams
      .map(
        (item) =>
          `          <DropdownItem value="${item.value}">${item.label}</DropdownItem>`
      )
      .join("\n");
  }

  const grouped = teams.reduce<Record<string, typeof teams>>((groups, team) => {
    groups[team.group] ??= [];
    groups[team.group].push(team);
    return groups;
  }, {});

  return Object.entries(grouped)
    .map(
      ([group, items]) => `          <DropdownGroup label="${group}">
${items.map((item) => `            <DropdownItem value="${item.value}">${item.label}</DropdownItem>`).join("\n")}
          </DropdownGroup>`
    )
    .join("\n");
}

const ACTION_BODY = `          <DropdownGroup label="Account">
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
            <DropdownItem onClick={() => setLastAction("Logout")}>
              <LogOut className="size-4" />
              Logout
            </DropdownItem>
          </DropdownGroup>`;

function buildTriggerChildren(state: DropdownPlaygroundState) {
  if (state.variant === "select") {
    return '        <DropdownValue placeholder="Choose a team" />';
  }

  if (state.triggerShape === "avatar") {
    return AVATAR_TRIGGER_CHILDREN;
  }

  return '        <span className="sr-only">Open profile menu</span>';
}

function buildStateHooks(state: DropdownPlaygroundState, needsState: boolean) {
  const openState = needsState
    ? "  const [open, setOpen] = useState(false);\n"
    : "";
  const valueState =
    state.variant === "select"
      ? '  const [team, setTeam] = useState<string | undefined>("design");\n'
      : '  const [, setLastAction] = useState("No action yet");\n';

  return `${openState}${valueState}`;
}

function generateDropdownCode(
  state: DropdownPlaygroundState,
  importPath: string
) {
  const imports = buildDropdownImports(state);
  const needsState = state.controlled || state.variant === "select";
  const rootProps = buildRootProps(state, needsState);
  const triggerProps = buildTriggerProps(state);
  const contentProps = buildContentProps(state);
  const body =
    state.variant === "select" ? buildSelectBody(state) : ACTION_BODY;
  const extraImports =
    state.variant === "action" ? '\nimport Image from "next/image";' : "";

  return `"use client";

import { ${imports.join(", ")} } from "${importPath}";${extraImports}
import { useState } from "react";

export function DropdownPreview() {
${buildStateHooks(state, needsState)}  return (
    <Dropdown ${rootProps}>
      <DropdownTrigger${triggerProps ? ` ${triggerProps}` : ""}>
${buildTriggerChildren(state)}
      </DropdownTrigger>
      <DropdownContent${contentProps ? ` ${contentProps}` : ""}>
${body}
      </DropdownContent>
    </Dropdown>
  );
}`;
}

const SELECT_TEAMS = [
  { label: "Design", value: "design", group: "Product" },
  { label: "Product", value: "product", group: "Product" },
  { label: "Engineering", value: "engineering", group: "Product" },
  { label: "Finance", value: "finance", group: "Operations" },
  { label: "People Ops", value: "people", group: "Operations" },
  { label: "Legal", value: "legal", group: "Operations" },
  { label: "Security", value: "security", group: "Platform" },
  { label: "IT", value: "it", group: "Platform" },
  { label: "Data", value: "data", group: "Platform" },
  { label: "Research", value: "research", group: "Platform" },
  { label: "Support", value: "support", group: "Platform" },
  { label: "Growth", value: "growth", group: "Platform" },
];

function getSelectTeams(longList: boolean) {
  return longList ? SELECT_TEAMS : SELECT_TEAMS.slice(0, 6);
}

export function getDropdownDefaultUsageCode(importPath: string) {
  return generateDropdownCode(DROPDOWN_DEFAULT_STATE, importPath);
}

function DropdownPlaygroundPreview({
  state,
  ui,
}: {
  state: DropdownPlaygroundState;
  ui: DropdownModule;
}) {
  const {
    Dropdown,
    DropdownContent,
    DropdownGroup,
    DropdownItem,
    DropdownTrigger,
    DropdownValue,
  } = ui;
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState<string | undefined>("design");
  const [, setLastAction] = useState("No action yet");

  const teams = useMemo(() => getSelectTeams(state.longList), [state.longList]);

  const groupedTeams = useMemo(() => {
    return teams.reduce<Record<string, typeof teams>>((groups, item) => {
      groups[item.group] ??= [];
      groups[item.group].push(item);
      return groups;
    }, {});
  }, [teams]);

  const rootProps = {
    className: state.variant === "select" ? "w-[220px]" : "w-14",
    disabled: state.disabled,
    modal: state.modal,
    onOpenChange: state.controlled ? setOpen : undefined,
    open: state.controlled ? open : undefined,
    ...(state.variant === "select"
      ? { onValueChange: setTeam, value: team }
      : { variant: "action" as const }),
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <p className="max-w-xs text-balance text-center text-[13px] text-muted-foreground leading-snug tracking-tight sm:max-w-sm sm:text-sm">
          {state.variant === "select"
            ? "Pick a team from grouped rows with keyboard, scroll, and selection feedback."
            : "Open account actions from a compact avatar trigger."}
        </p>
        <Dropdown {...rootProps}>
          <DropdownTrigger
            aria-label={
              state.triggerShape === "avatar" ? "Open profile menu" : undefined
            }
            className={
              state.triggerShape === "avatar"
                ? AVATAR_TRIGGER_CLASSNAME
                : "border-neutral-200 shadow-none hover:border-neutral-200 dark:border-neutral-800 dark:hover:border-neutral-800"
            }
            showChevron={state.showChevron}
            triggerShape={state.triggerShape}
          >
            {state.variant === "select" ? (
              <DropdownValue placeholder="Choose a team" />
            ) : (
              <>
                <Image
                  alt=""
                  className="h-full w-full object-cover"
                  height={44}
                  src="/assets/av1.png"
                  width={44}
                />
                <span className="sr-only">Open profile menu</span>
              </>
            )}
          </DropdownTrigger>
          <DropdownContent
            align={state.align}
            className={state.variant === "select" ? "w-full" : "w-56"}
            side={state.side}
          >
            {state.variant === "select" ? (
              state.showGroups ? (
                Object.entries(groupedTeams).map(([group, items]) => (
                  <DropdownGroup key={group} label={group}>
                    {items.map((item) => (
                      <DropdownItem key={item.value} value={item.value}>
                        {item.label}
                      </DropdownItem>
                    ))}
                  </DropdownGroup>
                ))
              ) : (
                teams.map((item) => (
                  <DropdownItem key={item.value} value={item.value}>
                    {item.label}
                  </DropdownItem>
                ))
              )
            ) : (
              <>
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
                  <DropdownItem onClick={() => setLastAction("Logout")}>
                    <LogOut className="size-4" />
                    Logout
                  </DropdownItem>
                </DropdownGroup>
              </>
            )}
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
}

function DropdownPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<DropdownPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: DropdownPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Dropdown"
    >
      <DocsPlaygroundSegmentedField
        label="Variant"
        onChange={(variant) =>
          onChange({
            variant,
            triggerShape: variant === "action" ? "avatar" : "default",
            showChevron: variant === "select",
          })
        }
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Side"
        onChange={(side) => onChange({ side })}
        options={SIDE_OPTIONS}
        value={state.side}
      />
      <DocsPlaygroundSelectField
        label="Align"
        onChange={(align) => onChange({ align })}
        options={ALIGN_OPTIONS}
        value={state.align}
      />
      <DocsPlaygroundSegmentedField
        label="Trigger"
        onChange={(triggerShape) => {
          if (state.variant === "action") {
            onChange({ triggerShape });
          }
        }}
        options={TRIGGER_SHAPE_OPTIONS}
        value={state.variant === "select" ? "default" : state.triggerShape}
      />
      <DocsPlaygroundToggleField
        checked={state.controlled}
        label="Controlled"
        onChange={(controlled) => onChange({ controlled })}
      />
      <DocsPlaygroundToggleField
        checked={state.modal}
        label="Modal"
        onChange={(modal) => onChange({ modal })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
      <DocsPlaygroundToggleField
        checked={state.showChevron}
        disabled={state.variant === "action"}
        label="Chevron"
        onChange={(showChevron) => onChange({ showChevron })}
      />
      <DocsPlaygroundToggleField
        checked={state.showGroups}
        disabled={state.variant === "action"}
        label="Grouped rows"
        onChange={(showGroups) => onChange({ showGroups })}
      />
      <DocsPlaygroundToggleField
        checked={state.longList}
        disabled={state.variant === "action"}
        label="Long list"
        onChange={(longList) => onChange({ longList })}
      />
    </DocsPlaygroundPanel>
  );
}

type DropdownPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function DropdownPlaygroundProvider({
  children,
  importPath,
  ui,
}: {
  children: (props: DropdownPlaygroundRenderProps) => ReactNode;
  importPath: string;
  ui: DropdownModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<DropdownPlaygroundState>(
    DROPDOWN_DEFAULT_STATE
  );

  const updateState = (next: Partial<DropdownPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => setState(DROPDOWN_DEFAULT_STATE);

  useEffect(() => {
    setPlaygroundCode(generateDropdownCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <DropdownPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <DropdownPlaygroundPreview state={state} ui={ui} />,
    renderSettings,
  });
}
