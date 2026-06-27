"use client";

import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import type { StatusDotProps, StatusDotState } from "@/registry/status-dot";
import { statusDotStates } from "@/registry/status-dot";

type StatusDotModule = {
  StatusDot: ComponentType<StatusDotProps>;
};

type StatusDotPlaygroundState = {
  animate?: boolean;
  showLabel: boolean;
  size: NonNullable<StatusDotProps["size"]>;
  state: StatusDotState;
};

const DEFAULT_STATE: StatusDotPlaygroundState = {
  showLabel: false,
  size: "md",
  state: "BUILDING",
};

const STATE_OPTIONS = statusDotStates.map((value) => ({
  label: value.charAt(0) + value.slice(1).toLowerCase(),
  value,
}));

const SIZE_OPTIONS: Array<{
  label: string;
  value: NonNullable<StatusDotProps["size"]>;
}> = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const stateTail: Record<StatusDotState, string> = {
  QUEUED: "waiting in the deploy queue.",
  BUILDING: "actively building on main.",
  READY: "live for every region.",
  ERROR: "blocked after a failed build.",
  CANCELED: "stopped before rollout.",
};

function statusDotPropsFromState(
  state: StatusDotPlaygroundState
): StatusDotProps {
  const props: StatusDotProps = { state: state.state };

  if (state.size !== "md") {
    props.size = state.size;
  }

  if (state.showLabel) {
    props.showLabel = true;
  }

  if (state.animate !== undefined) {
    props.animate = state.animate;
  }

  return props;
}

function statusDotPropLines(props: StatusDotProps) {
  const lines: string[] = [`state="${props.state}"`];

  if (props.size && props.size !== "md") {
    lines.push(`size="${props.size}"`);
  }

  if (props.showLabel) {
    lines.push("showLabel");
  }

  if (props.animate !== undefined) {
    lines.push(`animate={${props.animate}}`);
  }

  return lines;
}

function generateStatusDotCode(
  state: StatusDotPlaygroundState,
  importPath: string
): string {
  const sharedProps = statusDotPropsFromState(state);
  const propLines = statusDotPropLines(sharedProps);
  const propsBlock = propLines.length > 0 ? ` ${propLines.join(" ")}` : "";

  return `"use client";

import { StatusDot } from "${importPath}";

export function StatusDotDemo() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-lg leading-snug dark:text-neutral-100">
      <span>Right now, production is</span>
      <StatusDot className="translate-y-px"${propsBlock} />
      <span>live for every region.</span>
    </p>
  );
}`;
}

function StatusDotSentencePreview({
  StatusDot,
  state,
}: {
  StatusDot: StatusDotModule["StatusDot"];
  state: StatusDotPlaygroundState;
}) {
  return (
    <p
      className={cn(
        "flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-2",
        "text-balance text-center font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl",
        "dark:text-neutral-100"
      )}
    >
      <span>Right now, production is</span>
      <StatusDot
        className="translate-y-px"
        {...statusDotPropsFromState(state)}
      />
      <span>{stateTail[state.state]}</span>
    </p>
  );
}

function StatusDotPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<StatusDotPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: StatusDotPlaygroundState;
}) {
  const defaultAnimate = state.state === "BUILDING";
  const animateOverride = state.animate !== undefined;

  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Status Dot"
    >
      <DocsPlaygroundSelectField
        label="State"
        onChange={(nextState) => onChange({ state: nextState })}
        options={STATE_OPTIONS}
        value={state.state}
      />
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundToggleField
        checked={state.showLabel}
        label="Show label"
        onChange={(showLabel) => onChange({ showLabel })}
      />
      <DocsPlaygroundToggleField
        checked={animateOverride ? Boolean(state.animate) : defaultAnimate}
        label="Animate"
        onChange={(animate) => onChange({ animate })}
      />
    </DocsPlaygroundPanel>
  );
}

type StatusDotPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function StatusDotPlaygroundProvider({
  StatusDotModule,
  importPath,
  children,
}: {
  StatusDotModule: StatusDotModule;
  importPath: string;
  children: (props: StatusDotPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<StatusDotPlaygroundState>(DEFAULT_STATE);
  const { StatusDot } = StatusDotModule;

  const updateState = (next: Partial<StatusDotPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateStatusDotCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <StatusDotPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-8">
        <StatusDotSentencePreview StatusDot={StatusDot} state={state} />
      </div>
    ),
    renderSettings,
  });
}
