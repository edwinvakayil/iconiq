"use client";

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
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { TimezoneProps } from "@/registry/timezone";

type TimezoneModule = {
  Timezone: ComponentType<TimezoneProps>;
};

type TimezonePlaygroundState = {
  animate: boolean;
  ariaLive: boolean;
  format: NonNullable<TimezoneProps["format"]>;
  live: boolean;
  locale: "en-US" | "de-DE" | "ja-JP";
  showZoneLabel: boolean;
  zone: string;
  zoneName: NonNullable<TimezoneProps["zoneName"]>;
};

const sentenceClassName =
  "flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-sm text-neutral-800 leading-snug tracking-tight sm:text-base dark:text-neutral-100";

const DEFAULT_STATE: TimezonePlaygroundState = {
  animate: true,
  ariaLive: false,
  format: "12h",
  live: true,
  locale: "en-US",
  showZoneLabel: true,
  zone: "San Francisco",
  zoneName: "abbreviation",
};

const ZONE_OPTIONS = [
  { value: "San Francisco", label: "San Francisco" },
  { value: "New York", label: "New York" },
  { value: "London", label: "London" },
  { value: "India", label: "India" },
  { value: "Tokyo", label: "Tokyo" },
  { value: "Sydney", label: "Sydney" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "Africa/Cairo", label: "Africa/Cairo" },
  { value: "Not/A_Real_Zone", label: "Invalid zone" },
] as const;

const FORMAT_OPTIONS = [
  { label: "12-hour", value: "12h" },
  { label: "24-hour", value: "24h" },
] as const;

const ZONE_NAME_OPTIONS = [
  { label: "Abbreviation", value: "abbreviation" },
  { label: "Offset", value: "offset" },
] as const;

const LOCALE_OPTIONS = [
  { label: "en-US", value: "en-US" },
  { label: "de-DE", value: "de-DE" },
  { label: "ja-JP", value: "ja-JP" },
] as const;

function timezonePropsFromState(state: TimezonePlaygroundState): TimezoneProps {
  const props: TimezoneProps = {
    format: state.format,
    live: state.live,
    locale: state.locale,
    showZoneLabel: state.showZoneLabel,
    zone: state.zone,
    zoneName: state.zoneName,
  };

  if (!state.animate) {
    props.animate = false;
  }

  if (state.ariaLive) {
    props.ariaLive = true;
  } else if (state.live) {
    props.ariaLive = false;
  }

  return props;
}

function generateTimezoneCode(
  state: TimezonePlaygroundState,
  importPath: string
) {
  const lines = [`zone="${state.zone}"`];

  if (state.live) {
    lines.push("live");
  }

  if (state.format !== "12h") {
    lines.push(`format="${state.format}"`);
  }

  if (!state.showZoneLabel) {
    lines.push("showZoneLabel={false}");
  } else if (state.zoneName !== "abbreviation") {
    lines.push(`zoneName="${state.zoneName}"`);
  }

  if (state.locale !== "en-US") {
    lines.push(`locale="${state.locale}"`);
  }

  if (!state.animate) {
    lines.push("animate={false}");
  }

  if (state.ariaLive) {
    lines.push("ariaLive");
  }

  const propsBlock = `\n        ${lines.join("\n        ")}\n      `;

  return `"use client";

import { Timezone } from "${importPath}";

export function TimezoneDemo() {
  return (
    <div className="flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-sm leading-snug tracking-tight sm:text-base dark:text-neutral-100">
      <span>Right now in</span>
      <span>${state.zone}</span>
      <span>it is</span>
      <Timezone${propsBlock}/>
      <span>for the distributed team.</span>
    </div>
  );
}`;
}

function TimezonePlaygroundPreview({
  TimezoneComponent,
  state,
}: {
  TimezoneComponent: ComponentType<TimezoneProps>;
  state: TimezonePlaygroundState;
}) {
  const props = useMemo(() => timezonePropsFromState(state), [state]);

  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className={sentenceClassName}>
          <span>Right now in</span>
          <span>{state.zone}</span>
          <span>it is</span>
          <TimezoneComponent {...props} />
          <span>for the distributed team.</span>
        </div>
      </div>
    </div>
  );
}

function TimezonePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<TimezonePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: TimezonePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Timezone"
    >
      <DocsPlaygroundSelectField
        label="Zone"
        onChange={(zone) => onChange({ zone })}
        options={ZONE_OPTIONS.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        value={state.zone}
      />
      <DocsPlaygroundSelectField
        label="Format"
        onChange={(format) =>
          onChange({ format: format as TimezonePlaygroundState["format"] })
        }
        options={FORMAT_OPTIONS.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        value={state.format}
      />
      <DocsPlaygroundSelectField
        label="Zone label"
        onChange={(zoneName) =>
          onChange({
            zoneName: zoneName as TimezonePlaygroundState["zoneName"],
          })
        }
        options={ZONE_NAME_OPTIONS.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        value={state.zoneName}
      />
      <DocsPlaygroundSelectField
        label="Locale"
        onChange={(locale) =>
          onChange({ locale: locale as TimezonePlaygroundState["locale"] })
        }
        options={LOCALE_OPTIONS.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        value={state.locale}
      />
      <DocsPlaygroundToggleField
        checked={state.live}
        label="Live seconds"
        onChange={(live) => onChange({ live })}
      />
      <DocsPlaygroundToggleField
        checked={state.showZoneLabel}
        label="Show zone label"
        onChange={(showZoneLabel) => onChange({ showZoneLabel })}
      />
      <DocsPlaygroundToggleField
        checked={state.animate}
        label="Animate"
        onChange={(animate) => onChange({ animate })}
      />
      <DocsPlaygroundToggleField
        checked={state.ariaLive}
        label="Aria live"
        onChange={(ariaLive) => onChange({ ariaLive })}
      />
    </DocsPlaygroundPanel>
  );
}

type TimezonePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function TimezonePlaygroundProvider({
  TimezoneModule,
  importPath,
  children,
}: {
  TimezoneModule: TimezoneModule;
  importPath: string;
  children: (props: TimezonePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<TimezonePlaygroundState>(DEFAULT_STATE);
  const { Timezone: TimezoneComponent } = TimezoneModule;

  const updateState = (next: Partial<TimezonePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateTimezoneCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <TimezonePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <TimezonePlaygroundPreview
        state={state}
        TimezoneComponent={TimezoneComponent}
      />
    ),
    renderSettings,
  });
}
