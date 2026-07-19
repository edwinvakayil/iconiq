"use client";

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { WeekCalendarProps } from "@/registry/week-calendar";

type WeekCalendarModule = {
  WeekCalendar: ComponentType<WeekCalendarProps>;
};

type WeekCalendarPlaygroundState = {
  expanded: boolean;
  weekStartsOn: NonNullable<WeekCalendarProps["weekStartsOn"]>;
};

const DEFAULT_STATE: WeekCalendarPlaygroundState = {
  expanded: false,
  weekStartsOn: 0,
};

const WEEK_START_OPTIONS = [
  { label: "Sunday", value: "0" as const },
  { label: "Monday", value: "1" as const },
];

const WeekCalendarPlaygroundContext = createContext<{
  WeekCalendarModule: WeekCalendarModule;
  state: WeekCalendarPlaygroundState;
} | null>(null);

function useWeekCalendarPlayground() {
  const context = useContext(WeekCalendarPlaygroundContext);
  if (!context) {
    throw new Error(
      "WeekCalendarPlayground components must be used within WeekCalendarPlaygroundProvider."
    );
  }
  return context;
}

function generateWeekCalendarCode(
  state: WeekCalendarPlaygroundState,
  importPath: string
) {
  const props: string[] = [];

  if (state.expanded) {
    props.push("defaultExpanded");
  }

  if (state.weekStartsOn === 1) {
    props.push("weekStartsOn={1}");
  }

  const calendarProps =
    props.length > 0 ? `\n      ${props.join("\n      ")}\n    ` : "\n    ";

  return `"use client";

import { useState } from "react";
import { WeekCalendar } from "${importPath}";

export function WeekCalendarDemo() {
  const [selected, setSelected] = useState<Date | null>(new Date());

  return (
    <WeekCalendar${calendarProps}onSelect={setSelected}
      selected={selected}
    />
  );
}`;
}

function WeekCalendarPlaygroundPreview() {
  const { WeekCalendarModule, state } = useWeekCalendarPlayground();
  const { WeekCalendar: WeekCalendarComponent } = WeekCalendarModule;

  const [selected, setSelected] = useState<Date | null>(new Date());

  return (
    <div className="flex min-h-[22rem] w-full items-center justify-center px-4 py-6">
      <WeekCalendarComponent
        defaultExpanded={state.expanded}
        key={`${state.expanded}-${state.weekStartsOn}`}
        onSelect={setSelected}
        selected={selected}
        weekStartsOn={state.weekStartsOn}
      />
    </div>
  );
}

function WeekCalendarPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<WeekCalendarPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: WeekCalendarPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Week Calendar"
    >
      <DocsPlaygroundSelectField
        label="Week starts"
        onChange={(value) => onChange({ weekStartsOn: Number(value) as 0 | 1 })}
        options={WEEK_START_OPTIONS}
        value={String(state.weekStartsOn) as "0" | "1"}
      />
      <DocsPlaygroundToggleField
        checked={state.expanded}
        label="Expanded (month grid)"
        onChange={(expanded) => onChange({ expanded })}
      />
    </DocsPlaygroundPanel>
  );
}

type WeekCalendarPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function WeekCalendarPlaygroundProvider({
  WeekCalendarModule,
  importPath,
  children,
}: {
  WeekCalendarModule: WeekCalendarModule;
  importPath: string;
  children: (props: WeekCalendarPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<WeekCalendarPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<WeekCalendarPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateWeekCalendarCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <WeekCalendarPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <WeekCalendarPlaygroundContext.Provider
      value={{ WeekCalendarModule, state }}
    >
      {children({
        preview: <WeekCalendarPlaygroundPreview />,
        renderSettings,
      })}
    </WeekCalendarPlaygroundContext.Provider>
  );
}
