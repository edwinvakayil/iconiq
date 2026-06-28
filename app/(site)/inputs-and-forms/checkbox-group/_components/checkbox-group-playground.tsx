"use client";

import { type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import {
  CheckboxGroup,
  CheckboxGroupItem,
  type CheckboxGroupProps,
  CheckboxGroupSection,
  type CheckboxGroupSize,
} from "@/registry/b-checkbox-group";

type CheckboxGroupPattern = "default" | "grouped" | "invalid" | "readonly";

type GroupedSectionName = "Account" | "Community" | "Product";

type CheckboxGroupPlaygroundState = {
  collapseGroups: boolean;
  disabledOptions: string[];
  disabledSections: GroupedSectionName[];
  pattern: CheckboxGroupPattern;
  readonlyOptions: string[];
  showDescriptions: boolean;
  size: CheckboxGroupSize;
};

const DISABLED_OPTION_REASON =
  "This notification channel is managed by your admin.";

const GROUPED_SECTION_NAMES: GroupedSectionName[] = [
  "Product",
  "Account",
  "Community",
];

const DEFAULT_STATE: CheckboxGroupPlaygroundState = {
  collapseGroups: true,
  disabledOptions: [],
  disabledSections: [],
  pattern: "default",
  readonlyOptions: [],
  showDescriptions: true,
  size: "default",
};

const SIZE_OPTIONS: Array<{ label: string; value: CheckboxGroupSize }> = [
  { label: "Small", value: "sm" },
  { label: "Default", value: "default" },
  { label: "Large", value: "lg" },
];

const PATTERN_OPTIONS: Array<{
  label: string;
  value: CheckboxGroupPattern;
}> = [
  { label: "Default", value: "default" },
  { label: "Grouped", value: "grouped" },
  { label: "Read only", value: "readonly" },
  { label: "Invalid", value: "invalid" },
];

const BASE_ITEMS = [
  {
    label: "Email updates",
    value: "email",
    description: "Release notes and changelog digests.",
  },
  {
    label: "Product news",
    value: "news",
    description: "Feature launches and roadmap highlights.",
  },
  {
    label: "Security alerts",
    value: "security",
    description: "Critical patches and account notices.",
  },
  {
    label: "Billing reminders",
    value: "billing",
    description: "Invoices, renewals, and payment notices.",
  },
  {
    label: "Community invites",
    value: "community",
    description: "Workshops, AMAs, and contributor calls.",
  },
] as const;

const READONLY_VALUES = BASE_ITEMS.map((item) => item.value);

const GROUPED_ITEMS = [
  {
    group: "Product" as const,
    label: "Release notes",
    value: "releases",
    description: "Ship logs and changelog digests.",
  },
  {
    group: "Product" as const,
    label: "Roadmap updates",
    value: "roadmap",
    description: "Milestones and beta invitations.",
  },
  {
    group: "Account" as const,
    label: "Security alerts",
    value: "security",
    description: "Critical patches and sign-in notices.",
  },
  {
    group: "Account" as const,
    label: "Billing reminders",
    value: "billing",
    description: "Invoices and renewal reminders.",
  },
  {
    group: "Community" as const,
    label: "Events",
    value: "events",
    description: "Workshops and contributor calls.",
  },
] as const;

function formatSizeAttr(size: CheckboxGroupSize) {
  return size === "default" ? "" : `\n      size="${size}"`;
}

function formatGroupedAttrs(state: CheckboxGroupPlaygroundState) {
  if (state.pattern !== "grouped" || !state.collapseGroups) {
    return "";
  }

  return "\n      maxVisible={2}";
}

function formatOptionalFlags(state: CheckboxGroupPlaygroundState) {
  if (state.pattern !== "invalid") {
    return "";
  }

  return "\n      invalid";
}

function formatItemBlock(
  item: {
    label: string;
    value: string;
    description: string;
  },
  disabledOptions: string[],
  readonlyOptions: string[],
  indent = "      ",
  forceReadOnly = false
) {
  const lines = [
    `${indent}<CheckboxGroupItem`,
    `${indent}  label="${item.label}"`,
    `${indent}  value="${item.value}"`,
  ];

  if (forceReadOnly || readonlyOptions.includes(item.value)) {
    lines.push(`${indent}  readOnly`);
  }

  if (disabledOptions.includes(item.value)) {
    lines.push(`${indent}  disabled`);
    lines.push(`${indent}  disabledReason="${DISABLED_OPTION_REASON}"`);
  }

  if (item.description) {
    lines.push(`${indent}  description="${item.description}"`);
  }

  lines.push(`${indent}/>`);

  return lines.join("\n");
}

function formatReadonlyChildren(state: CheckboxGroupPlaygroundState) {
  return BASE_ITEMS.map((item) =>
    formatItemBlock(
      {
        ...item,
        description: state.showDescriptions ? item.description : "",
      },
      [],
      [],
      "      ",
      true
    )
  ).join("\n");
}

function formatDefaultChildren(state: CheckboxGroupPlaygroundState) {
  return BASE_ITEMS.slice(0, 3)
    .map((item) =>
      formatItemBlock(
        {
          ...item,
          description: state.showDescriptions ? item.description : "",
        },
        state.disabledOptions,
        state.readonlyOptions
      )
    )
    .join("\n");
}

function formatGroupedChildren(state: CheckboxGroupPlaygroundState) {
  return GROUPED_SECTION_NAMES.map((sectionName) => {
    const sectionItems = GROUPED_ITEMS.filter(
      (item) => item.group === sectionName
    );

    return `      <CheckboxGroupSection label="${sectionName}"${state.disabledSections.includes(sectionName) ? " disabled" : ""}>
${sectionItems
  .map((item) =>
    formatItemBlock(
      {
        label: item.label,
        value: item.value,
        description: state.showDescriptions ? item.description : "",
      },
      state.disabledOptions,
      state.readonlyOptions,
      "        "
    )
  )
  .join("\n")}
      </CheckboxGroupSection>`;
  }).join("\n");
}

function formatInitialValue(state: CheckboxGroupPlaygroundState) {
  const baseValue = state.pattern === "grouped" ? ["releases"] : ["email"];
  const readonlyValues = state.readonlyOptions.filter((value) => {
    const items = state.pattern === "grouped" ? GROUPED_ITEMS : BASE_ITEMS;
    return items.some((item) => item.value === value);
  });

  return `[${[...new Set([...baseValue, ...readonlyValues])]
    .map((value) => `"${value}"`)
    .join(", ")}]`;
}

function formatReadonlyValue(selections: string[]) {
  return `[${selections.map((value) => `"${value}"`).join(", ")}]`;
}

function generateCheckboxGroupCode(
  state: CheckboxGroupPlaygroundState,
  importPath: string
) {
  const children =
    state.pattern === "grouped"
      ? formatGroupedChildren(state)
      : formatDefaultChildren(state);

  if (state.pattern === "readonly") {
    return `"use client";

import {
  CheckboxGroup,
  CheckboxGroupItem,
} from "${importPath}";

export function CheckboxGroupReadOnlyExample() {
  return (
    <CheckboxGroup
      aria-label="Notification preferences"
      className="w-[min(100%,28rem)]"
      name="notifications"
      value={${formatReadonlyValue(READONLY_VALUES)}}${formatSizeAttr(state.size)}
    >
${formatReadonlyChildren({ ...state, showDescriptions: true })}
    </CheckboxGroup>
  );
}`;
  }

  return `"use client";

import { useState } from "react";
import {
  CheckboxGroup,
  CheckboxGroupItem,${state.pattern === "grouped" ? "\n  CheckboxGroupSection," : ""}
} from "${importPath}";

export function CheckboxGroupPreview() {
  const [value, setValue] = useState<string[]>(${formatInitialValue(state)});

  return (
    <CheckboxGroup
      aria-label="Notification preferences"
      className="w-[min(100%,28rem)]"
      name="notifications"
      onChange={setValue}
      value={value}${formatSizeAttr(state.size)}${formatGroupedAttrs(state)}${formatOptionalFlags(state)}
    >
${children}
    </CheckboxGroup>
  );
}`;
}

function CheckboxGroupPlaygroundPreview({
  state,
}: {
  state: CheckboxGroupPlaygroundState;
}) {
  const [value, setValue] = useState<string[]>(["email", "news"]);

  useEffect(() => {
    if (state.pattern === "readonly") {
      return;
    }

    setValue(state.pattern === "grouped" ? ["releases"] : ["email", "news"]);
  }, [state.pattern]);

  const sharedProps = {
    "aria-label": "Notification preferences",
    className: "w-[min(100%,28rem)]",
    name: "notifications",
    size: state.size,
  } satisfies Partial<CheckboxGroupProps>;

  const renderItem = (item: {
    label: string;
    value: string;
    description: string;
  }) => (
    <CheckboxGroupItem
      description={state.showDescriptions ? item.description : undefined}
      disabled={state.disabledOptions.includes(item.value)}
      disabledReason={
        state.disabledOptions.includes(item.value)
          ? DISABLED_OPTION_REASON
          : undefined
      }
      key={item.value}
      label={item.label}
      readOnly={state.readonlyOptions.includes(item.value)}
      value={item.value}
    />
  );

  if (state.pattern === "readonly") {
    return (
      <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-6">
        <CheckboxGroup {...sharedProps} value={READONLY_VALUES}>
          {BASE_ITEMS.map((item) => (
            <CheckboxGroupItem
              description={
                state.showDescriptions ? item.description : undefined
              }
              key={item.value}
              label={item.label}
              readOnly
              value={item.value}
            />
          ))}
        </CheckboxGroup>
      </div>
    );
  }

  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-6">
      <CheckboxGroup
        {...sharedProps}
        invalid={state.pattern === "invalid"}
        maxVisible={
          state.pattern === "grouped" && state.collapseGroups ? 2 : undefined
        }
        onChange={setValue}
        value={value}
      >
        {state.pattern === "grouped"
          ? GROUPED_SECTION_NAMES.map((sectionName) => (
              <CheckboxGroupSection
                disabled={state.disabledSections.includes(sectionName)}
                key={sectionName}
                label={sectionName}
              >
                {GROUPED_ITEMS.filter((item) => item.group === sectionName).map(
                  (item) => renderItem(item)
                )}
              </CheckboxGroupSection>
            ))
          : BASE_ITEMS.map((item) => renderItem(item))}
      </CheckboxGroup>
    </div>
  );
}

function CheckboxGroupPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<CheckboxGroupPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: CheckboxGroupPlaygroundState;
}) {
  const toggleDisabledSection = (
    section: GroupedSectionName,
    checked: boolean
  ) => {
    const nextSections = checked
      ? [...state.disabledSections, section]
      : state.disabledSections.filter((value) => value !== section);

    onChange({ disabledSections: nextSections });
  };

  const toggleDisabledOption = (optionValue: string, checked: boolean) => {
    const nextOptions = checked
      ? [...state.disabledOptions, optionValue]
      : state.disabledOptions.filter((value) => value !== optionValue);

    onChange({ disabledOptions: nextOptions });
  };

  const toggleReadonlyOption = (optionValue: string, checked: boolean) => {
    const nextOptions = checked
      ? [...state.readonlyOptions, optionValue]
      : state.readonlyOptions.filter((value) => value !== optionValue);

    onChange({ readonlyOptions: nextOptions });
  };

  const optionItems = state.pattern === "grouped" ? GROUPED_ITEMS : BASE_ITEMS;

  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Checkbox Group"
    >
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "default" ||
      state.pattern === "grouped" ||
      state.pattern === "invalid" ? (
        <DocsPlaygroundToggleField
          checked={state.showDescriptions}
          label="Show descriptions"
          onChange={(showDescriptions) => onChange({ showDescriptions })}
        />
      ) : null}
      {state.pattern === "grouped" ? (
        <>
          <DocsPlaygroundToggleField
            checked={state.collapseGroups}
            label="Collapse extra groups"
            onChange={(collapseGroups) => onChange({ collapseGroups })}
          />
          {GROUPED_SECTION_NAMES.map((section) => (
            <DocsPlaygroundToggleField
              checked={state.disabledSections.includes(section)}
              key={section}
              label={`Disabled section: ${section}`}
              onChange={(checked) => toggleDisabledSection(section, checked)}
            />
          ))}
        </>
      ) : null}
      {state.pattern === "default" || state.pattern === "grouped"
        ? optionItems.map((option) => (
            <DocsPlaygroundToggleField
              checked={state.disabledOptions.includes(option.value)}
              key={`disabled-${option.value}`}
              label={`Disabled: ${option.label}`}
              onChange={(checked) =>
                toggleDisabledOption(option.value, checked)
              }
            />
          ))
        : null}
      {state.pattern === "default" || state.pattern === "grouped"
        ? optionItems.map((option) => (
            <DocsPlaygroundToggleField
              checked={state.readonlyOptions.includes(option.value)}
              key={`readonly-${option.value}`}
              label={`Read only: ${option.label}`}
              onChange={(checked) =>
                toggleReadonlyOption(option.value, checked)
              }
            />
          ))
        : null}
      {state.pattern === "readonly" ? (
        <DocsPlaygroundToggleField
          checked={state.showDescriptions}
          label="Show descriptions"
          onChange={(showDescriptions) => onChange({ showDescriptions })}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type CheckboxGroupPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function CheckboxGroupPlaygroundProvider({
  importPath,
  children,
}: {
  importPath: string;
  children: (props: CheckboxGroupPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<CheckboxGroupPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<CheckboxGroupPlaygroundState>) => {
    setState((current) => {
      const merged = { ...current, ...next };

      const validOptionValues = new Set<string>(
        (merged.pattern === "grouped" ? GROUPED_ITEMS : BASE_ITEMS).map(
          (option) => option.value
        )
      );
      merged.disabledOptions = merged.disabledOptions.filter((value) =>
        validOptionValues.has(value)
      );
      merged.readonlyOptions = merged.readonlyOptions.filter((value) =>
        validOptionValues.has(value)
      );

      return merged;
    });
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateCheckboxGroupCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <CheckboxGroupPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <CheckboxGroupPlaygroundPreview state={state} />,
    renderSettings,
  });
}
