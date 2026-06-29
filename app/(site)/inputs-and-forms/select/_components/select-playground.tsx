"use client";

import {
  CalendarDays,
  MessageSquareText,
  Palette,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";

type WorkflowOption = {
  value: string;
  label: string;
  icon: ReactNode;
};

import type * as BaseSelect from "@/registry/b-select";
import type * as RadixSelect from "@/registry/r-select";

type SelectModule = typeof BaseSelect | typeof RadixSelect;

const FIELD_LABEL = "Workflow step";
const FIELD_DESCRIPTION =
  "Choose the next workflow step from one compact select.";

type SelectPlaygroundState = {
  disabled: boolean;
  disabledOption: boolean;
  showCaption: boolean;
  showIcons: boolean;
  showItemLabels: boolean;
  showLabel: boolean;
  side: "bottom" | "top";
};

const PLAYGROUND_OPTIONS: WorkflowOption[] = [
  {
    value: "launch",
    label: "Launch plan",
    icon: <Rocket className="size-4 text-muted-foreground" />,
  },
  {
    value: "design",
    label: "Design pass",
    icon: <Palette className="size-4 text-muted-foreground" />,
  },
  {
    value: "review",
    label: "Review notes",
    icon: <MessageSquareText className="size-4 text-muted-foreground" />,
  },
  {
    value: "schedule",
    label: "Schedule",
    icon: <CalendarDays className="size-4 text-muted-foreground" />,
  },
  {
    value: "approve",
    label: "Approvals",
    icon: <ShieldCheck className="size-4 text-muted-foreground" />,
  },
];

const DEFAULT_STATE: SelectPlaygroundState = {
  disabled: false,
  disabledOption: false,
  showCaption: true,
  showIcons: true,
  showItemLabels: true,
  showLabel: false,
  side: "bottom",
};

const SIDE_OPTIONS: Array<{
  label: string;
  value: SelectPlaygroundState["side"];
}> = [
  { label: "Bottom", value: "bottom" },
  { label: "Top", value: "top" },
];

function getOptionDisabled(
  option: WorkflowOption,
  state: SelectPlaygroundState
) {
  return state.disabledOption && option.value === "design";
}

function getOptionDisplay(
  option: WorkflowOption,
  state: SelectPlaygroundState
) {
  return state.showItemLabels ? option.label : option.value;
}

function generateIconHelperCode() {
  return `function getOptionIcon(value: string) {
  switch (value) {
    case "launch":
      return <Rocket className="size-4 text-muted-foreground" />;
    case "design":
      return <Palette className="size-4 text-muted-foreground" />;
    case "review":
      return <MessageSquareText className="size-4 text-muted-foreground" />;
    case "schedule":
      return <CalendarDays className="size-4 text-muted-foreground" />;
    case "approve":
      return <ShieldCheck className="size-4 text-muted-foreground" />;
    default:
      return null;
  }
}`;
}

function generateItemsMapCode(state: SelectPlaygroundState) {
  const itemLines = [
    state.showIcons ? "icon={getOptionIcon(option.value)}" : null,
    state.showItemLabels ? "label={option.label}" : null,
    "key={option.value}",
    "value={option.value}",
    state.disabledOption ? 'disabled={option.value === "design"}' : null,
  ].filter(Boolean);

  return `options.map((option) => (
                  <SelectItem
                    ${itemLines.join("\n                    ")}
                  />
                ))`;
}

function generateSelectCode(
  state: SelectPlaygroundState,
  importPath: string
): string {
  const lucideImport = state.showIcons
    ? `import {
  CalendarDays,
  MessageSquareText,
  Palette,
  Rocket,
  ShieldCheck,
} from "lucide-react";

`
    : "";

  const triggerLines = [
    'className="w-full"',
    state.showLabel ? `label="${FIELD_LABEL}"` : null,
    state.showCaption ? `description="${FIELD_DESCRIPTION}"` : null,
    state.disabled ? "disabled" : null,
  ].filter(Boolean);

  const contentProps =
    state.side !== "bottom" ? `\n          side="${state.side}"` : "";

  const rootProps = `\n          onValueChange={(nextValue) => setValue(nextValue ?? "")}\n          value={value}`;

  const selectValueCode =
    state.showIcons || state.showItemLabels
      ? `<SelectValue placeholder={loading ? "Loading..." : "Choose workflow"}>
              {(currentValue) => {
                const option = options.find((entry) => entry.value === currentValue);
                if (!option) {
                  return currentValue ?? null;
                }

                return (
                  <>
                    ${state.showIcons ? "{getOptionIcon(option.value)}" : ""}
                    ${state.showItemLabels ? "option.label ?? option.value" : "option.value"}
                  </>
                );
              }}
            </SelectValue>`
      : `<SelectValue placeholder={loading ? "Loading..." : "Choose workflow"} />`;

  const componentImports = [
    "Select",
    "SelectContent",
    "SelectGroup",
    "SelectItem",
    "SelectTrigger",
    "SelectValue",
  ];

  const iconHelper = state.showIcons ? `\n${generateIconHelperCode()}\n` : "";

  return `"use client";

import { useEffect, useState } from "react";
${lucideImport}import {
  ${componentImports.join(",\n  ")},
} from "${importPath}";

type WorkflowOption = {
  value: string;
  label?: string;
};
${iconHelper}
export function SelectDemo() {
  const [options, setOptions] = useState<WorkflowOption[]>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      const response = await fetch("/api/workflows");
      const data: WorkflowOption[] = await response.json();

      if (!cancelled) {
        setOptions(data);
        setLoading(false);
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-72 flex-col gap-2.5">
        <Select${rootProps}>
          <SelectTrigger
            ${triggerLines.join("\n            ")}
          >
            ${selectValueCode}
          </SelectTrigger>
          <SelectContent${contentProps}>
            <SelectGroup>
              {loading ? (
                <SelectItem disabled label="Loading..." value="__loading" />
              ) : options.length === 0 ? (
                <SelectItem disabled label="No options" value="__empty" />
              ) : (
                ${generateItemsMapCode(state)}
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}`;
}

export function getSelectUsageCode(importPath: string) {
  return generateSelectCode(DEFAULT_STATE, importPath);
}

function SelectPlaygroundPreview({
  SelectModule,
  state,
}: {
  SelectModule: SelectModule;
  state: SelectPlaygroundState;
}) {
  const {
    Select: SelectRoot,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } = SelectModule;
  const [value, setValue] = useState("");

  const renderItem = (option: WorkflowOption) => (
    <SelectItem
      disabled={getOptionDisabled(option, state)}
      icon={state.showIcons ? option.icon : undefined}
      key={option.value}
      label={state.showItemLabels ? option.label : undefined}
      value={option.value}
    />
  );

  const renderSelectValue = () => {
    if (!(state.showIcons || state.showItemLabels)) {
      return <SelectValue placeholder="Choose workflow" />;
    }

    return (
      <SelectValue placeholder="Choose workflow">
        {(currentValue) => {
          const option = PLAYGROUND_OPTIONS.find(
            (entry) => entry.value === currentValue
          );

          if (!option) {
            return currentValue ?? null;
          }

          return (
            <>
              {state.showIcons ? option.icon : null}
              {getOptionDisplay(option, state)}
            </>
          );
        }}
      </SelectValue>
    );
  };

  const content = (
    <SelectGroup>{PLAYGROUND_OPTIONS.map(renderItem)}</SelectGroup>
  );

  const selectBody = (
    <>
      <SelectTrigger
        className="w-full"
        description={state.showCaption ? FIELD_DESCRIPTION : undefined}
        disabled={state.disabled}
        label={state.showLabel ? FIELD_LABEL : undefined}
      >
        {renderSelectValue()}
      </SelectTrigger>
      <SelectContent side={state.side}>{content}</SelectContent>
    </>
  );

  const selectedOption = PLAYGROUND_OPTIONS.find(
    (option) => option.value === value
  );

  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-72 flex-col gap-2.5">
        <SelectRoot
          onValueChange={(nextValue) => {
            setValue(nextValue ?? "");
          }}
          value={value}
        >
          {selectBody}
        </SelectRoot>
        <p
          className={cn(
            "text-center text-muted-foreground text-xs",
            !value && "opacity-60"
          )}
        >
          {value
            ? `Selected: ${
                selectedOption ? getOptionDisplay(selectedOption, state) : value
              }`
            : "Pick a workflow step to continue"}
        </p>
      </div>
    </div>
  );
}

function SelectPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<SelectPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: SelectPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Select"
    >
      <DocsPlaygroundSelectField
        label="Popup side"
        onChange={(side) =>
          onChange({ side: side as SelectPlaygroundState["side"] })
        }
        options={SIDE_OPTIONS}
        value={state.side}
      />
      <DocsPlaygroundToggleField
        checked={state.showLabel}
        label="Show label"
        onChange={(showLabel) => onChange({ showLabel })}
      />
      <DocsPlaygroundToggleField
        checked={state.showCaption}
        label="Show caption"
        onChange={(showCaption) => onChange({ showCaption })}
      />
      <DocsPlaygroundToggleField
        checked={state.showIcons}
        label="Show item icons"
        onChange={(showIcons) => onChange({ showIcons })}
      />
      <DocsPlaygroundToggleField
        checked={state.showItemLabels}
        label="Show item labels"
        onChange={(showItemLabels) => onChange({ showItemLabels })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled trigger"
        onChange={(disabled) => onChange({ disabled })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabledOption}
        label="Disabled option"
        onChange={(disabledOption) => onChange({ disabledOption })}
      />
    </DocsPlaygroundPanel>
  );
}

type SelectPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function SelectPlaygroundProvider({
  SelectModule,
  importPath,
  children,
}: {
  SelectModule: SelectModule;
  importPath: string;
  children: (props: SelectPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<SelectPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<SelectPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateSelectCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <SelectPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <SelectPlaygroundPreview SelectModule={SelectModule} state={state} />
    ),
    renderSettings,
  });
}
