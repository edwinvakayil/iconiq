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
import type { CalendarProps, CalendarRange } from "@/registry/calendar";

type CalendarModule = {
  Calendar: ComponentType<CalendarProps>;
};

type CalendarPlaygroundState = {
  boundedDates: boolean;
  disableWeekends: boolean;
  fixedWeeks: boolean;
  localePreset: "en" | "fr";
  mode: "single" | "range";
  showModifiers: boolean;
  showOutsideDays: boolean;
  size: NonNullable<CalendarProps["size"]>;
  weekStartsOn: NonNullable<CalendarProps["weekStartsOn"]>;
};

const DEFAULT_STATE: CalendarPlaygroundState = {
  boundedDates: false,
  disableWeekends: false,
  fixedWeeks: false,
  localePreset: "en",
  mode: "single",
  showModifiers: false,
  showOutsideDays: true,
  size: "md",
  weekStartsOn: 0,
};

const MODE_OPTIONS = [
  { label: "Single", value: "single" as const },
  { label: "Range", value: "range" as const },
];

const SIZE_OPTIONS = [
  { label: "Small", value: "sm" as const },
  { label: "Medium", value: "md" as const },
  { label: "Large", value: "lg" as const },
];

const LOCALE_OPTIONS = [
  { label: "English", value: "en" as const },
  { label: "French", value: "fr" as const },
];

const WEEK_START_OPTIONS = [
  { label: "Sunday", value: "0" as const },
  { label: "Monday", value: "1" as const },
];

const CalendarPlaygroundContext = createContext<{
  CalendarModule: CalendarModule;
  state: CalendarPlaygroundState;
} | null>(null);

function useCalendarPlayground() {
  const context = useContext(CalendarPlaygroundContext);
  if (!context) {
    throw new Error(
      "CalendarPlayground components must be used within CalendarPlaygroundProvider."
    );
  }
  return context;
}

function generateCalendarCode(
  state: CalendarPlaygroundState,
  importPath: string
) {
  const props: string[] = [];

  if (state.mode === "range") {
    props.push('mode="range"');
  }

  if (state.size !== "sm") {
    props.push(`size="${state.size}"`);
  }

  if (!state.showOutsideDays) {
    props.push("showOutsideDays={false}");
  }

  if (state.showOutsideDays && state.fixedWeeks) {
    props.push("fixedWeeks");
  }

  if (state.weekStartsOn === 1) {
    props.push("weekStartsOn={1}");
  }

  if (state.localePreset === "fr") {
    props.push("locale={fr}");
  }

  const extraBlocks: string[] = [];

  if (state.disableWeekends || state.boundedDates || state.showModifiers) {
    extraBlocks.push("const today = startOfDay(new Date());");
  }

  if (state.boundedDates) {
    props.push("minDate={today}");
    props.push("maxDate={addDays(today, 30)}");
    extraBlocks.push(`import { addDays, startOfDay } from "date-fns";`);
  }

  if (state.disableWeekends) {
    props.push("disabled={(date) => isWeekend(date)}");
    extraBlocks.push(`import { isWeekend } from "date-fns";`);
  }

  if (state.showModifiers) {
    props.push(`modifiers={{
    booked: (date) => date.getDate() % 7 === 0,
  }}`);
    props.push(`modifierLabels={{
    booked: "Booked",
  }}`);
  }

  const dateFnsImports = [
    ...new Set(
      extraBlocks
        .filter((line) => line.startsWith("import"))
        .map((line) =>
          line.replace("import ", "").replace(' from "date-fns";', "")
        )
    ),
  ];

  const dateFnsImportLine =
    dateFnsImports.length > 0
      ? `import { ${dateFnsImports.join(", ")} } from "date-fns";\n`
      : "";

  const localeImport =
    state.localePreset === "fr"
      ? `import { fr } from "date-fns/locale";\n`
      : "";

  const calendarProps =
    props.length > 0 ? `\n      ${props.join("\n      ")}\n    ` : "\n    ";

  if (state.mode === "range") {
    return `"use client";

import { useState } from "react";
${dateFnsImportLine}${localeImport}import { Calendar, type CalendarRange } from "${importPath}";

export function CalendarRangeDemo() {
  const [range, setRange] = useState<CalendarRange>({});
${state.boundedDates ? "  const today = startOfDay(new Date());\n" : ""}
  return (
    <Calendar${calendarProps}onRangeSelect={setRange}
      range={range}
    />
  );
}`;
  }

  return `"use client";

import { useState } from "react";
${dateFnsImportLine}${localeImport}import { Calendar } from "${importPath}";

export function CalendarDemo() {
  const [selected, setSelected] = useState<Date | null>(new Date());
${state.boundedDates ? "  const today = startOfDay(new Date());\n" : ""}
  return (
    <Calendar${calendarProps}onSelect={setSelected}
      selected={selected}
    />
  );
}`;
}

function CalendarPlaygroundPreview() {
  const { CalendarModule, state } = useCalendarPlayground();
  const { Calendar: CalendarComponent } = CalendarModule;

  const [selected, setSelected] = useState<Date | null>(new Date());
  const [range, setRange] = useState<CalendarRange>({});

  const today = useMemo(() => startOfDay(new Date()), []);
  const locale = state.localePreset === "fr" ? fr : undefined;

  const disabled = state.disableWeekends
    ? (date: Date) => isWeekend(date)
    : undefined;

  const modifiers = state.showModifiers
    ? {
        booked: (date: Date) => date.getDate() % 7 === 0,
      }
    : undefined;

  const sharedProps = {
    disabled,
    fixedWeeks: state.showOutsideDays && state.fixedWeeks,
    locale,
    maxDate: state.boundedDates ? addDays(today, 30) : undefined,
    minDate: state.boundedDates ? today : undefined,
    modifierLabels: state.showModifiers ? { booked: "Booked" } : undefined,
    modifiers,
    showOutsideDays: state.showOutsideDays,
    size: state.size,
    weekStartsOn: state.weekStartsOn,
  } satisfies Partial<CalendarProps>;

  return (
    <div className="flex min-h-[22rem] w-full items-center justify-center px-4 py-6">
      <CalendarComponent
        {...sharedProps}
        mode={state.mode}
        onRangeSelect={state.mode === "range" ? setRange : undefined}
        onSelect={state.mode === "single" ? setSelected : undefined}
        range={state.mode === "range" ? range : undefined}
        selected={state.mode === "single" ? selected : undefined}
      />
    </div>
  );
}

function CalendarPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<CalendarPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: CalendarPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Calendar"
    >
      <DocsPlaygroundSelectField
        label="Mode"
        onChange={(mode) => onChange({ mode })}
        options={MODE_OPTIONS}
        value={state.mode}
      />
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
        label="Week starts"
        onChange={(value) => onChange({ weekStartsOn: Number(value) as 0 | 1 })}
        options={WEEK_START_OPTIONS}
        value={String(state.weekStartsOn) as "0" | "1"}
      />
      <DocsPlaygroundToggleField
        checked={state.showOutsideDays}
        label="Outside days"
        onChange={(showOutsideDays) =>
          onChange({
            showOutsideDays,
            fixedWeeks: showOutsideDays ? state.fixedWeeks : false,
          })
        }
      />
      <DocsPlaygroundToggleField
        checked={state.fixedWeeks}
        disabled={!state.showOutsideDays}
        label="Fixed weeks"
        onChange={(fixedWeeks) => onChange({ fixedWeeks })}
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
      <DocsPlaygroundToggleField
        checked={state.showModifiers}
        label="Booked markers"
        onChange={(showModifiers) => onChange({ showModifiers })}
      />
    </DocsPlaygroundPanel>
  );
}

type CalendarPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function CalendarPlaygroundProvider({
  CalendarModule,
  importPath,
  children,
}: {
  CalendarModule: CalendarModule;
  importPath: string;
  children: (props: CalendarPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<CalendarPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<CalendarPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateCalendarCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <CalendarPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <CalendarPlaygroundContext.Provider value={{ CalendarModule, state }}>
      {children({
        preview: <CalendarPlaygroundPreview />,
        renderSettings,
      })}
    </CalendarPlaygroundContext.Provider>
  );
}
