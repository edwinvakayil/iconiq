"use client";

import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import {
  docsPlaygroundRowClassName,
  docsPlaygroundTextInputClassName,
} from "@/components/docs/playground/docs-playground-styles";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import type { SkeletonProps } from "@/registry/skeleton";

type SkeletonModule = {
  Skeleton: ComponentType<SkeletonProps>;
  SkeletonAvatar: ComponentType<Omit<SkeletonProps, "rounded">>;
  SkeletonButton: ComponentType<Omit<SkeletonProps, "rounded">>;
  SkeletonText: ComponentType<SkeletonProps>;
};

type SkeletonPattern = "profile" | "list" | "table" | "media" | "single";
type SkeletonPreset = "none" | "avatar" | "text" | "button";

type SkeletonPlaygroundState = {
  animate: boolean;
  decorative: boolean;
  duration: number;
  label: string;
  pattern: SkeletonPattern;
  preset: SkeletonPreset;
  rounded: NonNullable<SkeletonProps["rounded"]>;
  variant: NonNullable<SkeletonProps["variant"]>;
};

const DEFAULT_STATE: SkeletonPlaygroundState = {
  animate: true,
  decorative: true,
  duration: 1.6,
  label: "Loading profile",
  pattern: "profile",
  preset: "none",
  rounded: "md",
  variant: "shimmer",
};

const PATTERN_OPTIONS: Array<{ label: string; value: SkeletonPattern }> = [
  { label: "Profile card", value: "profile" },
  { label: "List rows", value: "list" },
  { label: "Table rows", value: "table" },
  { label: "Media block", value: "media" },
  { label: "Single block", value: "single" },
];

const PRESET_OPTIONS: Array<{ label: string; value: SkeletonPreset }> = [
  { label: "Custom block", value: "none" },
  { label: "Avatar", value: "avatar" },
  { label: "Text line", value: "text" },
  { label: "Button", value: "button" },
];

const VARIANT_OPTIONS: Array<{
  label: string;
  value: NonNullable<SkeletonProps["variant"]>;
}> = [
  { label: "Shimmer", value: "shimmer" },
  { label: "Fade", value: "fade" },
];

const ROUNDED_OPTIONS: Array<{
  label: string;
  value: NonNullable<SkeletonProps["rounded"]>;
}> = [
  { label: "None", value: "none" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Full", value: "full" },
];

const DURATION_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "1.6s", value: "1.6" },
  { label: "2.4s", value: "2.4" },
  { label: "3s", value: "3" },
  { label: "3.6s", value: "3.6" },
];

function escapeCodeString(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function skeletonPropsFromState(state: SkeletonPlaygroundState) {
  const props: SkeletonProps = {
    animate: state.animate,
    decorative: state.decorative,
    duration: state.duration,
    rounded: state.rounded,
    variant: state.variant,
  };

  if (!state.decorative) {
    props.label = state.label;
  }

  return props;
}

function generateSkeletonCode(
  state: SkeletonPlaygroundState,
  importPath: string
): string {
  const sharedProps = skeletonPropsFromState(state);
  const propLines: string[] = [];

  if (!sharedProps.animate) {
    propLines.push("animate={false}");
  }

  if (sharedProps.variant !== "shimmer") {
    propLines.push(`variant="${sharedProps.variant}"`);
  }

  if (sharedProps.rounded !== "md") {
    propLines.push(`rounded="${sharedProps.rounded}"`);
  }

  if (sharedProps.duration !== 1.6) {
    propLines.push(`duration={${sharedProps.duration}}`);
  }

  if (!sharedProps.decorative) {
    propLines.push("decorative={false}");
    if (sharedProps.label) {
      propLines.push(`label="${escapeCodeString(sharedProps.label)}"`);
    }
  }

  const propsBlock =
    propLines.length > 0
      ? `\n        ${propLines.join("\n        ")}\n      `
      : " ";

  if (state.pattern === "profile") {
    return `"use client";

import { Skeleton } from "${importPath}";

export function SkeletonProfileDemo() {
  return (
    <output
      aria-busy="true"
      aria-label="Loading profile"
      className="block w-full max-w-sm rounded-lg bg-card p-4"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11" rounded="full"${propsBlock}/>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32"${propsBlock}/>
          <Skeleton className="h-3 w-24" rounded="sm"${propsBlock}/>
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        <Skeleton className="h-3 w-full"${propsBlock}/>
        <Skeleton className="h-3 w-[92%]"${propsBlock}/>
        <Skeleton className="h-3 w-[78%]"${propsBlock}/>
      </div>
    </output>
  );
}`;
  }

  if (state.pattern === "list") {
    return `"use client";

import { Skeleton } from "${importPath}";

export function SkeletonListDemo() {
  return (
    <output aria-busy="true" aria-label="Loading notifications" className="block w-full max-w-md space-y-3">
      {[0, 1, 2].map((row) => (
        <div className="flex items-center gap-3 rounded-lg p-3" key={row}>
          <Skeleton className="size-10" rounded="full"${propsBlock}/>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40"${propsBlock}/>
            <Skeleton className="h-3 w-28"${propsBlock}/>
          </div>
        </div>
      ))}
    </output>
  );
}`;
  }

  if (state.pattern === "table") {
    return `"use client";

import { Skeleton } from "${importPath}";

export function SkeletonTableDemo() {
  return (
    <output aria-busy="true" aria-label="Loading table" className="block w-full max-w-2xl overflow-hidden rounded-lg">
      {[0, 1, 2, 3].map((row) => (
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr] gap-4 px-4 py-3" key={row}>
          <Skeleton className="h-3.5 w-36"${propsBlock}/>
          <Skeleton className="h-3.5 w-24"${propsBlock}/>
          <Skeleton className="h-3.5 w-16 justify-self-end"${propsBlock}/>
        </div>
      ))}
    </output>
  );
}`;
  }

  if (state.pattern === "media") {
    return `"use client";

import { Skeleton } from "${importPath}";

export function SkeletonMediaDemo() {
  return (
    <output aria-busy="true" aria-label="Loading article" className="block w-full max-w-lg space-y-4">
      <Skeleton className="aspect-[16/9] w-full" rounded="lg"${propsBlock}/>
      <Skeleton className="h-5 w-2/3"${propsBlock}/>
      <Skeleton className="h-3 w-full"${propsBlock}/>
      <Skeleton className="h-3 w-[88%]"${propsBlock}/>
    </output>
  );
}`;
  }

  if (state.pattern === "single") {
    if (state.preset === "avatar") {
      return `"use client";

import { SkeletonAvatar } from "${importPath}";

export function SkeletonAvatarDemo() {
  return <SkeletonAvatar${propsBlock}/>;
}`;
    }

    if (state.preset === "text") {
      return `"use client";

import { SkeletonText } from "${importPath}";

export function SkeletonTextDemo() {
  return <SkeletonText className="w-48"${propsBlock}/>;
}`;
    }

    if (state.preset === "button") {
      return `"use client";

import { SkeletonButton } from "${importPath}";

export function SkeletonButtonDemo() {
  return <SkeletonButton${propsBlock}/>;
}`;
    }

    return `"use client";

import { Skeleton } from "${importPath}";

export function SkeletonDemo() {
  return <Skeleton className="h-8 w-48"${propsBlock}/>;
}`;
  }

  return `"use client";

import { Skeleton } from "${importPath}";

export function SkeletonDemo() {
  return <Skeleton className="h-8 w-48"${propsBlock}/>;
}`;
}

function DocsPlaygroundTextField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <div className={cn(docsPlaygroundRowClassName, "gap-3 px-3")}>
      <span className="shrink-0 whitespace-nowrap font-medium text-[#5c5c61] text-[13px] dark:text-[#a1a1a6]">
        {label}
      </span>
      <input
        className={docsPlaygroundTextInputClassName}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        type="text"
        value={value}
      />
    </div>
  );
}

function SkeletonPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<SkeletonPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: SkeletonPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Skeleton"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "single" ? (
        <DocsPlaygroundSelectField
          label="Preset"
          onChange={(preset) => onChange({ preset })}
          options={PRESET_OPTIONS}
          value={state.preset}
        />
      ) : null}
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundToggleField
        checked={state.animate}
        label="Animate"
        onChange={(animate) => onChange({ animate })}
      />
      {state.animate ? (
        <DocsPlaygroundSelectField
          label="Duration"
          onChange={(duration) => onChange({ duration: Number(duration) })}
          options={DURATION_OPTIONS}
          value={String(state.duration)}
        />
      ) : null}
      <DocsPlaygroundSelectField
        label="Rounded"
        onChange={(rounded) => onChange({ rounded })}
        options={ROUNDED_OPTIONS}
        value={state.rounded}
      />
      <DocsPlaygroundToggleField
        checked={state.decorative}
        label="Decorative"
        onChange={(decorative) => onChange({ decorative })}
      />
      {state.decorative ? null : (
        <DocsPlaygroundTextField
          label="Label"
          onChange={(label) => onChange({ label })}
          placeholder="Loading profile"
          value={state.label}
        />
      )}
    </DocsPlaygroundPanel>
  );
}

function SkeletonPatternPreview({
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonText,
  state,
}: {
  Skeleton: SkeletonModule["Skeleton"];
  SkeletonAvatar: SkeletonModule["SkeletonAvatar"];
  SkeletonButton: SkeletonModule["SkeletonButton"];
  SkeletonText: SkeletonModule["SkeletonText"];
  state: SkeletonPlaygroundState;
}) {
  const sharedProps = skeletonPropsFromState(state);

  if (state.pattern === "list") {
    return (
      <output
        aria-busy="true"
        aria-label="Loading notifications"
        className="block w-full max-w-md space-y-3"
      >
        {[0, 1, 2].map((row) => (
          <div className="flex items-center gap-3 rounded-lg p-3" key={row}>
            <Skeleton className="size-10" rounded="full" {...sharedProps} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-40" {...sharedProps} />
              <Skeleton className="h-3 w-28" {...sharedProps} />
            </div>
          </div>
        ))}
      </output>
    );
  }

  if (state.pattern === "table") {
    return (
      <output
        aria-busy="true"
        aria-label="Loading table"
        className="block w-full max-w-2xl overflow-hidden rounded-lg"
      >
        {[0, 1, 2, 3].map((row) => (
          <div
            className="grid grid-cols-[1.4fr_1fr_0.8fr] gap-4 px-4 py-3"
            key={row}
          >
            <Skeleton className="h-3.5 w-36" {...sharedProps} />
            <Skeleton className="h-3.5 w-24" {...sharedProps} />
            <Skeleton
              className="h-3.5 w-16 justify-self-end"
              {...sharedProps}
            />
          </div>
        ))}
      </output>
    );
  }

  if (state.pattern === "media") {
    return (
      <output
        aria-busy="true"
        aria-label="Loading article"
        className="block w-full max-w-lg space-y-4"
      >
        <Skeleton
          className="aspect-[16/9] w-full"
          rounded="lg"
          {...sharedProps}
        />
        <Skeleton className="h-5 w-2/3" {...sharedProps} />
        <Skeleton className="h-3 w-full" {...sharedProps} />
        <Skeleton className="h-3 w-[88%]" {...sharedProps} />
      </output>
    );
  }

  if (state.pattern === "single") {
    if (state.preset === "avatar") {
      return <SkeletonAvatar {...sharedProps} />;
    }

    if (state.preset === "text") {
      return <SkeletonText className="w-48" {...sharedProps} />;
    }

    if (state.preset === "button") {
      return <SkeletonButton {...sharedProps} />;
    }

    return <Skeleton className="h-8 w-48" {...sharedProps} />;
  }

  return (
    <output
      aria-busy="true"
      aria-label="Loading profile"
      className="block w-full max-w-sm rounded-lg bg-card p-4"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11" rounded="full" {...sharedProps} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" {...sharedProps} />
          <Skeleton className="h-3 w-24" rounded="sm" {...sharedProps} />
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        <Skeleton className="h-3 w-full" {...sharedProps} />
        <Skeleton className="h-3 w-[92%]" {...sharedProps} />
        <Skeleton className="h-3 w-[78%]" {...sharedProps} />
      </div>
    </output>
  );
}

type SkeletonPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function SkeletonPlaygroundProvider({
  SkeletonModule,
  importPath,
  children,
}: {
  SkeletonModule: SkeletonModule;
  importPath: string;
  children: (props: SkeletonPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<SkeletonPlaygroundState>(DEFAULT_STATE);
  const { Skeleton, SkeletonAvatar, SkeletonButton, SkeletonText } =
    SkeletonModule;

  const updateState = (next: Partial<SkeletonPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateSkeletonCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <SkeletonPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-8">
        <SkeletonPatternPreview
          Skeleton={Skeleton}
          SkeletonAvatar={SkeletonAvatar}
          SkeletonButton={SkeletonButton}
          SkeletonText={SkeletonText}
          state={state}
        />
      </div>
    ),
    renderSettings,
  });
}
