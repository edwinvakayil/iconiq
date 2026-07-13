"use client";

import { type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSegmentedField,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { WheelPicker, WheelPickerColumn } from "@/registry/wheel-picker";

type WheelPickerPreset = "date" | "time" | "list";
type WheelPickerVisibleCount = "3" | "5" | "7";

type WheelPickerPlaygroundState = {
  preset: WheelPickerPreset;
  visibleCount: WheelPickerVisibleCount;
  loop: boolean;
  lens: boolean;
  disabled: boolean;
};

const DEFAULT_STATE: WheelPickerPlaygroundState = {
  preset: "date",
  visibleCount: "5",
  loop: true,
  lens: true,
  disabled: false,
};

const PRESET_OPTIONS: Array<{ label: string; value: WheelPickerPreset }> = [
  { label: "Date", value: "date" },
  { label: "Time", value: "time" },
  { label: "Single list", value: "list" },
];

const VISIBLE_COUNT_OPTIONS: Array<{
  label: string;
  value: WheelPickerVisibleCount;
}> = [
  { label: "3", value: "3" },
  { label: "5", value: "5" },
  { label: "7", value: "7" },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = Array.from({ length: 106 }, (_, index) => String(1945 + index));

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1));

const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);

const REPEAT_OPTIONS = [
  "Never",
  "Hourly",
  "Daily",
  "Weekdays",
  "Weekends",
  "Weekly",
  "Monthly",
  "Yearly",
];

function daysInMonth(month: string, year: string) {
  return new Date(Number(year), MONTHS.indexOf(month) + 1, 0).getDate();
}

function generateWheelPickerCode(
  state: WheelPickerPlaygroundState,
  importPath: string
) {
  const rootProps: string[] = [];

  if (state.visibleCount !== "5") {
    rootProps.push(`visibleCount={${state.visibleCount}}`);
  }

  if (!state.lens) {
    rootProps.push("lens={false}");
  }

  const rootPropsCode =
    rootProps.length > 0 ? `\n        ${rootProps.join("\n        ")}` : "";
  const loopAttr = state.loop ? "\n          loop" : "";
  const disabledAttr = state.disabled ? "\n          disabled" : "";

  if (state.preset === "time") {
    return `"use client";

import { useState } from "react";
import { WheelPicker, WheelPickerColumn } from "${importPath}";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

export function AlarmTimePicker() {
  const [hour, setHour] = useState("9");
  const [minute, setMinute] = useState("41");
  const [meridiem, setMeridiem] = useState("AM");

  return (
    <div className="w-full max-w-[280px]">
      <WheelPicker aria-label="Alarm time"${rootPropsCode}>
        <WheelPickerColumn
          aria-label="Hour"${loopAttr}${disabledAttr}
          onChange={setHour}
          options={HOURS}
          value={hour}
        />
        <WheelPickerColumn
          aria-label="Minute"${loopAttr}${disabledAttr}
          onChange={setMinute}
          options={MINUTES}
          value={minute}
        />
        <WheelPickerColumn
          aria-label="AM or PM"${disabledAttr}
          onChange={setMeridiem}
          options={["AM", "PM"]}
          value={meridiem}
        />
      </WheelPicker>
    </div>
  );
}`;
  }

  if (state.preset === "list") {
    return `"use client";

import { useState } from "react";
import { WheelPicker, WheelPickerColumn } from "${importPath}";

const REPEAT_OPTIONS = [
  "Never",
  "Hourly",
  "Daily",
  "Weekdays",
  "Weekends",
  "Weekly",
  "Monthly",
  "Yearly",
];

export function RepeatPicker() {
  const [repeat, setRepeat] = useState("Daily");

  return (
    <div className="w-full max-w-[220px]">
      <WheelPicker aria-label="Repeat"${rootPropsCode}>
        <WheelPickerColumn
          aria-label="Repeat"${loopAttr}${disabledAttr}
          onChange={setRepeat}
          options={REPEAT_OPTIONS}
          value={repeat}
        />
      </WheelPicker>
    </div>
  );
}`;
  }

  return `"use client";

import { useState } from "react";
import { WheelPicker, WheelPickerColumn } from "${importPath}";

const MONTHS = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December",
];
const YEARS = Array.from({ length: 106 }, (_, i) => String(1945 + i));

export function DateWheelPicker() {
  const [month, setMonth] = useState("October");
  const [day, setDay] = useState("9");
  const [year, setYear] = useState("2037");

  const dayCount = new Date(
    Number(year),
    MONTHS.indexOf(month) + 1,
    0
  ).getDate();
  const days = Array.from({ length: dayCount }, (_, i) => String(i + 1));

  return (
    <div className="w-full max-w-[340px]">
      <WheelPicker aria-label="Date"${rootPropsCode}>
        <WheelPickerColumn
          aria-label="Month"
          className="flex-[1.6]"${loopAttr}${disabledAttr}
          onChange={setMonth}
          options={MONTHS}
          value={month}
        />
        <WheelPickerColumn
          aria-label="Day"${loopAttr}${disabledAttr}
          onChange={setDay}
          options={days}
          value={days.includes(day) ? day : days[days.length - 1]}
        />
        <WheelPickerColumn
          aria-label="Year"${disabledAttr}
          onChange={setYear}
          options={YEARS}
          value={year}
        />
      </WheelPicker>
    </div>
  );
}`;
}

function WheelPickerPlaygroundPreview({
  state,
}: {
  state: WheelPickerPlaygroundState;
}) {
  const [month, setMonth] = useState("October");
  const [day, setDay] = useState("9");
  const [year, setYear] = useState("2037");
  const [hour, setHour] = useState("9");
  const [minute, setMinute] = useState("41");
  const [meridiem, setMeridiem] = useState("AM");
  const [repeat, setRepeat] = useState("Daily");

  const visibleCount = Number(state.visibleCount) as 3 | 5 | 7;
  const dayCount = daysInMonth(month, year);
  const days = Array.from({ length: dayCount }, (_, index) =>
    String(index + 1)
  );
  const safeDay = days.includes(day) ? day : days.at(-1);

  return (
    <div className="flex w-full items-center justify-center px-2 py-6 sm:px-4 sm:py-10">
      <div className="flex w-full flex-col items-center">
        <div
          className={
            state.preset === "date"
              ? "w-full max-w-[360px]"
              : state.preset === "time"
                ? "w-full max-w-[300px]"
                : "w-full max-w-[240px]"
          }
        >
          <div className="w-full rounded-[24px] border border-border/50 bg-card p-1 shadow-[0_1px_1px_rgba(15,23,42,0.03),0_4px_12px_-12px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-1.5 dark:shadow-[0_1px_1px_rgba(0,0,0,0.18)]">
            <div>
              {state.preset === "date" ? (
                <WheelPicker
                  aria-label="Date"
                  lens={state.lens}
                  visibleCount={visibleCount}
                >
                  <WheelPickerColumn
                    aria-label="Month"
                    className="flex-[1.6]"
                    disabled={state.disabled}
                    key={`month-${state.loop}`}
                    loop={state.loop}
                    onChange={setMonth}
                    options={MONTHS}
                    value={month}
                  />
                  <WheelPickerColumn
                    aria-label="Day"
                    disabled={state.disabled}
                    key={`day-${state.loop}-${dayCount}`}
                    loop={state.loop}
                    onChange={setDay}
                    options={days}
                    value={safeDay}
                  />
                  <WheelPickerColumn
                    aria-label="Year"
                    disabled={state.disabled}
                    onChange={setYear}
                    options={YEARS}
                    value={year}
                  />
                </WheelPicker>
              ) : state.preset === "time" ? (
                <WheelPicker
                  aria-label="Alarm time"
                  lens={state.lens}
                  visibleCount={visibleCount}
                >
                  <WheelPickerColumn
                    aria-label="Hour"
                    disabled={state.disabled}
                    key={`hour-${state.loop}`}
                    loop={state.loop}
                    onChange={setHour}
                    options={HOURS}
                    value={hour}
                  />
                  <WheelPickerColumn
                    aria-label="Minute"
                    disabled={state.disabled}
                    key={`minute-${state.loop}`}
                    loop={state.loop}
                    onChange={setMinute}
                    options={MINUTES}
                    value={minute}
                  />
                  <WheelPickerColumn
                    aria-label="AM or PM"
                    disabled={state.disabled}
                    onChange={setMeridiem}
                    options={["AM", "PM"]}
                    value={meridiem}
                  />
                </WheelPicker>
              ) : (
                <WheelPicker
                  aria-label="Repeat"
                  lens={state.lens}
                  visibleCount={visibleCount}
                >
                  <WheelPickerColumn
                    aria-label="Repeat"
                    disabled={state.disabled}
                    key={`repeat-${state.loop}`}
                    loop={state.loop}
                    onChange={setRepeat}
                    options={REPEAT_OPTIONS}
                    value={repeat}
                  />
                </WheelPicker>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WheelPickerPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<WheelPickerPlaygroundState>) => void;
  onClose: () => void;
  onReset: () => void;
  state: WheelPickerPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Wheel Picker"
    >
      <DocsPlaygroundSelectField
        label="Preset"
        onChange={(preset) => onChange({ preset })}
        options={PRESET_OPTIONS}
        value={state.preset}
      />
      <DocsPlaygroundSegmentedField
        label="Visible rows"
        onChange={(visibleCount) => onChange({ visibleCount })}
        options={VISIBLE_COUNT_OPTIONS}
        value={state.visibleCount}
      />
      <DocsPlaygroundToggleField
        checked={state.loop}
        label="Loop columns"
        onChange={(loop) => onChange({ loop })}
      />
      <DocsPlaygroundToggleField
        checked={state.lens}
        label="Selection lens"
        onChange={(lens) => onChange({ lens })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
    </DocsPlaygroundPanel>
  );
}

type WheelPickerPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function getWheelPickerUsageCode(importPath: string) {
  return generateWheelPickerCode(DEFAULT_STATE, importPath);
}

export function WheelPickerPlaygroundProvider({
  importPath,
  children,
}: {
  importPath: string;
  children: (props: WheelPickerPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<WheelPickerPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<WheelPickerPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateWheelPickerCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <WheelPickerPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <WheelPickerPlaygroundPreview state={state} />,
    renderSettings,
  });
}
