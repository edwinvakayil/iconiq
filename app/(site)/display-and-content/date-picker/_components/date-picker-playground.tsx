"use client";

import { addDays, isWeekend, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { CalendarProps } from "@/registry/calendar";
import type { DatePickerProps } from "@/registry/date-picker";

type DatePickerModule = {
  DatePicker: ComponentType<DatePickerProps>;
};

type DatePickerPlaygroundState = {
  align: NonNullable<DatePickerProps["align"]>;
  boundedDates: boolean;
  clearable: boolean;
  closeOnSelect: boolean;
  controlledOpen: boolean;
  disableWeekends: boolean;
  disabled: boolean;
  localePreset: "en" | "fr";
  side: NonNullable<DatePickerProps["side"]>;
  size: NonNullable<CalendarProps["size"]>;
};

const DEFAULT_STATE: DatePickerPlaygroundState = {
  align: "start",
  boundedDates: false,
  clearable: false,
  closeOnSelect: true,
  controlledOpen: false,
  disableWeekends: false,
  disabled: false,
  localePreset: "en",
  side: "bottom",
  size: "md",
};

const SIZE_OPTIONS = [
  { label: "Small", value: "sm" as const },
  { label: "Medium", value: "md" as const },
  { label: "Large", value: "lg" as const },
];

const LOCALE_OPTIONS = [
  { label: "English", value: "en" as const },
  { label: "French", value: "fr" as const },
];

const SIDE_OPTIONS = [
  { label: "Bottom", value: "bottom" as const },
  { label: "Top", value: "top" as const },
];

const ALIGN_OPTIONS = [
  { label: "Start", value: "start" as const },
  { label: "End", value: "end" as const },
];

const DatePickerPlaygroundContext = createContext<{
  DatePickerModule: DatePickerModule;
  state: DatePickerPlaygroundState;
} | null>(null);

function useDatePickerPlayground() {
  const context = useContext(DatePickerPlaygroundContext);

  if (!context) {
    throw new Error(
      "DatePickerPlayground components must be used within DatePickerPlaygroundProvider."
    );
  }

  return context;
}

function generateDatePickerCode(
  state: DatePickerPlaygroundState,
  importPath: string
) {
  const props: string[] = [];
  const calendarProps: string[] = [];

  if (state.size !== "md") {
    calendarProps.push(`size: "${state.size}"`);
  }

  if (state.localePreset === "fr") {
    calendarProps.push("locale: fr");
  }

  if (state.disableWeekends) {
    calendarProps.push("disabled: (date) => isWeekend(date)");
  }

  if (state.boundedDates) {
    calendarProps.push("minDate: today");
    calendarProps.push("maxDate: addDays(today, 30)");
  }

  if (state.clearable) {
    props.push("clearable");
  }

  if (!state.closeOnSelect) {
    props.push("closeOnSelect={false}");
  }

  if (state.disabled) {
    props.push("disabled");
  }

  if (state.side !== "bottom") {
    props.push(`side="${state.side}"`);
  }

  if (state.align !== "start") {
    props.push(`align="${state.align}"`);
  }

  if (state.controlledOpen) {
    props.push("open={open}");
    props.push("onOpenChange={setOpen}");
  }

  const dateFnsImports: string[] = [];
  if (state.boundedDates) {
    dateFnsImports.push("addDays", "startOfDay");
  }
  if (state.disableWeekends) {
    dateFnsImports.push("isWeekend");
  }

  const dateFnsImportLine =
    dateFnsImports.length > 0
      ? `import { ${[...new Set(dateFnsImports)].join(", ")} } from "date-fns";\n`
      : "";

  const localeImport =
    state.localePreset === "fr"
      ? `import { fr } from "date-fns/locale";\n`
      : "";

  const calendarPropsBlock =
    calendarProps.length > 0
      ? `calendarProps={{\n        ${calendarProps.join(",\n        ")},\n      }}`
      : null;

  const openStateBlock = state.controlledOpen
    ? "  const [open, setOpen] = useState(false);\n"
    : "";

  const boundedBlock = state.boundedDates
    ? "  const today = startOfDay(new Date());\n"
    : "";

  const pickerProps = [
    ...props,
    "onChange={setValue}",
    "value={value}",
    calendarPropsBlock,
  ]
    .filter(Boolean)
    .join("\n      ");

  return `"use client";

import { useState } from "react";
${dateFnsImportLine}${localeImport}import { DatePicker } from "${importPath}";

export function DatePickerDemo() {
  const [value, setValue] = useState<Date | null>(new Date());
${openStateBlock}${boundedBlock}
  return (
    <DatePicker
      ${pickerProps}
    />
  );
}`;
}

function DatePickerPlaygroundPreview() {
  const { DatePickerModule, state } = useDatePickerPlayground();
  const { DatePicker: DatePickerComponent } = DatePickerModule;

  const [value, setValue] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const locale = state.localePreset === "fr" ? fr : undefined;

  const disabled = state.disableWeekends
    ? (date: Date) => isWeekend(date)
    : undefined;

  return (
    <div className="flex min-h-[28rem] w-full items-center justify-center px-4 py-10">
      <DatePickerComponent
        align={state.align}
        calendarProps={{
          disabled,
          locale,
          maxDate: state.boundedDates ? addDays(today, 30) : undefined,
          minDate: state.boundedDates ? today : undefined,
          size: state.size,
        }}
        clearable={state.clearable}
        closeOnSelect={state.closeOnSelect}
        disabled={state.disabled}
        onChange={setValue}
        onOpenChange={state.controlledOpen ? setOpen : undefined}
        open={state.controlledOpen ? open : undefined}
        side={state.side}
        value={value}
      />
    </div>
  );
}

function DatePickerPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<DatePickerPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: DatePickerPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Date Picker"
    >
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundSelectField
        label="Locale"
        onChange={(localePreset) => onChange({ localePreset })}
        options={LOCALE_OPTIONS}
        value={state.localePreset}
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
      <DocsPlaygroundToggleField
        checked={state.clearable}
        label="Clearable"
        onChange={(clearable) => onChange({ clearable })}
      />
      <DocsPlaygroundToggleField
        checked={state.closeOnSelect}
        label="Close on select"
        onChange={(closeOnSelect) => onChange({ closeOnSelect })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
      <DocsPlaygroundToggleField
        checked={state.controlledOpen}
        label="Controlled open"
        onChange={(controlledOpen) => onChange({ controlledOpen })}
      />
      <DocsPlaygroundToggleField
        checked={state.disableWeekends}
        label="Disable weekends"
        onChange={(disableWeekends) => onChange({ disableWeekends })}
      />
      <DocsPlaygroundToggleField
        checked={state.boundedDates}
        label="30-day window"
        onChange={(boundedDates) => onChange({ boundedDates })}
      />
    </DocsPlaygroundPanel>
  );
}

type DatePickerPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function DatePickerPlaygroundProvider({
  DatePickerModule,
  importPath,
  children,
}: {
  DatePickerModule: DatePickerModule;
  importPath: string;
  children: (props: DatePickerPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<DatePickerPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<DatePickerPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateDatePickerCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <DatePickerPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <DatePickerPlaygroundContext.Provider value={{ DatePickerModule, state }}>
      {children({
        preview: <DatePickerPlaygroundPreview />,
        renderSettings,
      })}
    </DatePickerPlaygroundContext.Provider>
  );
}
