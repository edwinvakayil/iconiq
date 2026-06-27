"use client";

import {
  CheckCircle2Icon,
  CircleAlert,
  InfoIcon,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";
import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import type {
  AlertAppearance,
  AlertPosition,
  AlertProps,
  AlertSize,
  AlertTitleLines,
  AlertVariant,
} from "@/registry/alert";

type AlertModule = {
  Alert: ComponentType<AlertProps>;
  AlertAction: ComponentType<import("@/registry/alert").AlertActionProps>;
  AlertDescription: ComponentType<
    import("@/registry/alert").AlertDescriptionProps
  >;
  AlertTitle: ComponentType<import("@/registry/alert").AlertTitleProps>;
};

type AlertPlaygroundState = {
  appearance: AlertAppearance;
  dismissible: boolean;
  position: AlertPosition;
  showAction: boolean;
  size: AlertSize;
  timeout: number;
  titleLines: AlertTitleLines;
  variant: AlertVariant;
};

const DEFAULT_STATE: AlertPlaygroundState = {
  appearance: "default",
  dismissible: false,
  position: "top-right",
  showAction: false,
  size: "md",
  timeout: 5000,
  titleLines: 1,
  variant: "inline",
};

const APPEARANCE_OPTIONS: Array<{
  label: string;
  value: AlertAppearance;
}> = [
  { label: "Default", value: "default" },
  { label: "Success", value: "success" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Destructive", value: "destructive" },
];

const VARIANT_OPTIONS: Array<{ label: string; value: AlertVariant }> = [
  { label: "Inline", value: "inline" },
  { label: "Toast", value: "toast" },
];

const SIZE_OPTIONS: Array<{ label: string; value: AlertSize }> = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Extra large", value: "xl" },
];

const POSITION_OPTIONS: Array<{ label: string; value: AlertPosition }> = [
  { label: "Top left", value: "top-left" },
  { label: "Top center", value: "top-center" },
  { label: "Top right", value: "top-right" },
  { label: "Bottom left", value: "bottom-left" },
  { label: "Bottom center", value: "bottom-center" },
  { label: "Bottom right", value: "bottom-right" },
];

type TitleLineOption = "1" | "2" | "3" | "none";

const TITLE_LINE_OPTIONS: Array<{ label: string; value: TitleLineOption }> = [
  { label: "1 line", value: "1" },
  { label: "2 lines", value: "2" },
  { label: "3 lines", value: "3" },
  { label: "No clamp", value: "none" },
];

function titleLinesToOption(value: AlertTitleLines): TitleLineOption {
  return value === "none" ? "none" : (String(value) as TitleLineOption);
}

function optionToTitleLines(value: TitleLineOption): AlertTitleLines {
  if (value === "none") {
    return "none";
  }

  return Number(value) as 1 | 2 | 3;
}

const appearanceContent: Record<
  AlertAppearance,
  { description: string; Icon: LucideIcon; title: string }
> = {
  default: {
    Icon: CheckCircle2Icon,
    title: "Changes saved",
    description: "The latest version is live for your team.",
  },
  success: {
    Icon: CheckCircle2Icon,
    title: "Payment received",
    description: "Your subscription renews automatically next month.",
  },
  info: {
    Icon: InfoIcon,
    title: "Maintenance tonight",
    description: "Expect a short read-only window from 11 PM to midnight.",
  },
  warning: {
    Icon: TriangleAlert,
    title: "Unsaved changes detected",
    description: "Save now or recent edits may be lost.",
  },
  destructive: {
    Icon: CircleAlert,
    title: "Upload failed",
    description: "Try again in a moment.",
  },
};

function alertPropsFromState(state: AlertPlaygroundState): AlertProps {
  const props: AlertProps = {
    appearance: state.appearance,
    size: state.size,
    titleLines: state.titleLines,
  };

  if (state.variant === "toast") {
    props.variant = "toast";
    props.position = state.position;
    props.dismissible = state.dismissible;
    props.timeout = state.timeout;
  } else if (state.dismissible) {
    props.dismissible = true;
  }

  if (state.timeout > 0 && state.variant === "inline" && state.dismissible) {
    props.timeout = state.timeout;
  }

  if (state.timeout === 0 && state.dismissible) {
    props.timeout = 0;
  }

  return props;
}

function alertPropLines(state: AlertPlaygroundState) {
  const lines: string[] = [`appearance="${state.appearance}"`];

  if (state.size !== "md") {
    lines.push(`size="${state.size}"`);
  }

  if (state.titleLines !== 1) {
    lines.push(
      typeof state.titleLines === "number"
        ? `titleLines={${state.titleLines}}`
        : 'titleLines="none"'
    );
  }

  if (state.variant === "toast") {
    lines.push('variant="toast"');
    if (state.position !== "top-right") {
      lines.push(`position="${state.position}"`);
    }
    if (state.dismissible) {
      lines.push("dismissible");
    }
    if (state.timeout !== 5000) {
      lines.push(`timeout={${state.timeout}}`);
    }
  } else if (state.dismissible) {
    lines.push("dismissible");
    if (state.timeout > 0 && state.timeout !== 5000) {
      lines.push(`timeout={${state.timeout}}`);
    }
    if (state.timeout === 0) {
      lines.push("timeout={0}");
    }
  }

  return lines;
}

function generateAlertCode(
  state: AlertPlaygroundState,
  importPath: string
): string {
  const { description, Icon, title } = appearanceContent[state.appearance];
  const propLines = alertPropLines(state);
  const propsBlock = propLines.length > 0 ? ` ${propLines.join(" ")}` : "";
  const actionBlock = state.showAction
    ? `
      <AlertAction>
        <button
          className="font-medium text-sm underline-offset-4 hover:underline"
          type="button"
        >
          View details
        </button>
      </AlertAction>`
    : "";

  if (state.variant === "toast") {
    return `"use client";

import { useState } from "react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "${importPath}";
import { ${Icon.name} } from "lucide-react";

export function AlertToastDemo() {
  const [toastKey, setToastKey] = useState(0);

  return (
    <button
      className="rounded-lg border border-border px-3 py-2 text-sm"
      onClick={() => setToastKey((current) => current + 1)}
      type="button"
    >
      Show toast
      {toastKey > 0 ? (
        <Alert key={toastKey}${propsBlock}>
          <${Icon.name} />
          <AlertTitle>${title}</AlertTitle>
          <AlertDescription>${description}</AlertDescription>${actionBlock}
        </Alert>
      ) : null}
    </button>
  );
}`;
  }

  return `"use client";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "${importPath}";
import { ${Icon.name} } from "lucide-react";

export function AlertDemo() {
  return (
    <Alert className="w-full max-w-xl"${propsBlock}>
      <${Icon.name} />
      <AlertTitle>${title}</AlertTitle>
      <AlertDescription>${description}</AlertDescription>${actionBlock}
    </Alert>
  );
}`;
}

function AlertPreviewCard({
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  onToastDismiss,
  state,
  toastKey,
}: {
  Alert: AlertModule["Alert"];
  AlertAction: AlertModule["AlertAction"];
  AlertDescription: AlertModule["AlertDescription"];
  AlertTitle: AlertModule["AlertTitle"];
  onToastDismiss: () => void;
  state: AlertPlaygroundState;
  toastKey: number;
}) {
  const { description, Icon, title } = appearanceContent[state.appearance];
  const sharedProps = alertPropsFromState(state);

  if (state.variant === "toast") {
    if (toastKey === 0) {
      return (
        <p className="text-center text-muted-foreground text-sm">
          Use Show toast below to preview viewport placement, stacking, and
          dismissal.
        </p>
      );
    }

    return (
      <Alert key={toastKey} {...sharedProps} onDismiss={onToastDismiss}>
        <Icon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        {state.showAction ? (
          <AlertAction>
            <button
              className="font-medium text-sm underline-offset-4 hover:underline"
              type="button"
            >
              View details
            </button>
          </AlertAction>
        ) : null}
      </Alert>
    );
  }

  return (
    <Alert className="w-full max-w-xl" {...sharedProps}>
      <Icon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {state.showAction ? (
        <AlertAction>
          <button
            className="font-medium text-sm underline-offset-4 hover:underline"
            type="button"
          >
            View details
          </button>
        </AlertAction>
      ) : null}
    </Alert>
  );
}

function AlertPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<AlertPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: AlertPlaygroundState;
}) {
  const isToast = state.variant === "toast";

  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Alert"
    >
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Appearance"
        onChange={(appearance) => onChange({ appearance })}
        options={APPEARANCE_OPTIONS}
        value={state.appearance}
      />
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundSelectField
        label="Title lines"
        onChange={(titleLines) =>
          onChange({ titleLines: optionToTitleLines(titleLines) })
        }
        options={TITLE_LINE_OPTIONS}
        value={titleLinesToOption(state.titleLines)}
      />
      <DocsPlaygroundToggleField
        checked={state.showAction}
        label="Action row"
        onChange={(showAction) => onChange({ showAction })}
      />
      <DocsPlaygroundToggleField
        checked={isToast ? true : state.dismissible}
        disabled={isToast}
        label="Dismissible"
        onChange={(dismissible) => onChange({ dismissible })}
      />
      {isToast ? (
        <DocsPlaygroundSelectField
          label="Position"
          onChange={(position) => onChange({ position })}
          options={POSITION_OPTIONS}
          value={state.position}
        />
      ) : null}
      <DocsPlaygroundSelectField
        label="Timeout"
        onChange={(timeout) =>
          onChange({
            timeout: timeout === "off" ? 0 : Number(timeout),
          })
        }
        options={[
          { label: "Off", value: "off" },
          { label: "3s", value: "3000" },
          { label: "5s", value: "5000" },
          { label: "8s", value: "8000" },
        ]}
        value={state.timeout === 0 ? "off" : String(state.timeout)}
      />
    </DocsPlaygroundPanel>
  );
}

type AlertPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function AlertPlaygroundProvider({
  AlertModule,
  importPath,
  children,
}: {
  AlertModule: AlertModule;
  importPath: string;
  children: (props: AlertPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<AlertPlaygroundState>(DEFAULT_STATE);
  const [toastKey, setToastKey] = useState(0);
  const { Alert, AlertAction, AlertDescription, AlertTitle } = AlertModule;

  const updateState = (next: Partial<AlertPlaygroundState>) => {
    setState((current) => {
      const merged = { ...current, ...next };

      if (merged.variant === "toast") {
        merged.dismissible = true;
      }

      return merged;
    });
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
    setToastKey(0);
  };

  useEffect(() => {
    setPlaygroundCode(generateAlertCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <AlertPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <div className="flex w-full flex-col items-center gap-6 px-4 py-8 sm:px-8">
        {state.variant === "toast" ? (
          <button
            className={cn(
              "rounded-lg border border-border/80 bg-background px-3.5 py-2",
              "font-medium text-foreground text-sm transition-colors hover:bg-muted"
            )}
            onClick={() => setToastKey((current) => current + 1)}
            type="button"
          >
            Show toast
          </button>
        ) : null}
        <AlertPreviewCard
          Alert={Alert}
          AlertAction={AlertAction}
          AlertDescription={AlertDescription}
          AlertTitle={AlertTitle}
          onToastDismiss={() => setToastKey(0)}
          state={state}
          toastKey={toastKey}
        />
      </div>
    ),
    renderSettings,
  });
}
