"use client";

import { Trash2 } from "lucide-react";
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
  DocsPlaygroundSegmentedField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";

type AlertDialogActionVariant = "default" | "destructive";

type AlertDialogRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

type AlertDialogButtonProps = {
  asChild?: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
};

type AlertDialogActionProps = AlertDialogButtonProps & {
  closeOnClick?: boolean;
  variant?: AlertDialogActionVariant;
};

type AlertDialogContentProps = {
  children?: ReactNode;
  className?: string;
  open?: boolean;
};

type AlertDialogSlotProps = {
  children?: ReactNode;
  className?: string;
};

export type AlertDialogModule = {
  AlertDialog: ComponentType<AlertDialogRootProps>;
  AlertDialogAction: ComponentType<AlertDialogActionProps>;
  AlertDialogCancel: ComponentType<AlertDialogActionProps>;
  AlertDialogContent: ComponentType<AlertDialogContentProps>;
  AlertDialogDescription: ComponentType<AlertDialogSlotProps>;
  AlertDialogFooter: ComponentType<AlertDialogSlotProps>;
  AlertDialogHeader: ComponentType<AlertDialogSlotProps>;
  AlertDialogTitle: ComponentType<AlertDialogSlotProps>;
  AlertDialogTrigger: ComponentType<AlertDialogButtonProps>;
  alertDialogTriggerClassName: string;
  alertDialogTriggerSmClassName: string;
};

type AlertDialogPlaygroundState = {
  actionVariant: AlertDialogActionVariant;
  asyncAction: boolean;
  controlled: boolean;
  customTrigger: boolean;
  smallTrigger: boolean;
};

const ALERT_DIALOG_DEFAULT_STATE: AlertDialogPlaygroundState = {
  actionVariant: "destructive",
  asyncAction: false,
  controlled: true,
  customTrigger: true,
  smallTrigger: true,
};

const ACTION_VARIANT_OPTIONS = [
  { label: "Destructive", value: "destructive" as const },
  { label: "Default", value: "default" as const },
];

function getScenarioCopy(state: AlertDialogPlaygroundState) {
  if (state.actionVariant === "default") {
    return {
      actionLabel: state.asyncAction ? "Publishing..." : "Publish",
      body: "This makes the draft visible to everyone on the team. You can still roll back from history afterward.",
      title: "Publish this draft?",
      trigger: "Publish",
    };
  }

  return {
    actionLabel: state.asyncAction ? "Deleting..." : "Delete",
    body: "This action permanently removes the item from your workspace. You will not be able to recover it later.",
    title: "Delete this item?",
    trigger: "Delete",
  };
}

function buildTriggerCode(state: AlertDialogPlaygroundState) {
  const label = getScenarioCopy(state).trigger;

  if (state.customTrigger) {
    const className = state.smallTrigger
      ? "alertDialogTriggerSmClassName"
      : "alertDialogTriggerClassName";

    return `      <AlertDialogTrigger asChild>
        <button className={${className}} type="button">
          ${label}
        </button>
      </AlertDialogTrigger>`;
  }

  const className = state.smallTrigger
    ? "alertDialogTriggerSmClassName"
    : "alertDialogTriggerClassName";

  return `      <AlertDialogTrigger className={${className}}>${label}</AlertDialogTrigger>`;
}

function generateAlertDialogCode(
  state: AlertDialogPlaygroundState,
  importPath: string
) {
  const needsState = state.controlled || state.asyncAction;
  const triggerClassImport = state.smallTrigger
    ? "alertDialogTriggerSmClassName"
    : "alertDialogTriggerClassName";
  const imports = [
    "AlertDialog",
    "AlertDialogAction",
    "AlertDialogCancel",
    "AlertDialogContent",
    "AlertDialogDescription",
    "AlertDialogFooter",
    "AlertDialogHeader",
    "AlertDialogTitle",
    "AlertDialogTrigger",
    triggerClassImport,
  ];
  const trigger = buildTriggerCode(state);
  const copy = getScenarioCopy(state);
  const stateHook = needsState
    ? state.asyncAction
      ? `\n  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
`
      : `\n  const [open, setOpen] = useState(false);
`
    : "\n";
  const rootProps = needsState ? " onOpenChange={setOpen} open={open}" : "";
  const contentProps = needsState ? " open={open}" : "";
  const actionProps = [
    state.actionVariant === "default" ? 'variant="default"' : "",
    state.asyncAction ? "closeOnClick={false}" : "",
    state.asyncAction ? "disabled={pending}" : "",
    state.asyncAction
      ? `onClick={() => {
              setPending(true);
              window.setTimeout(() => {
                setPending(false);
                setOpen(false);
              }, 900);
            }}`
      : "",
  ].filter(Boolean);
  const actionAttrs = actionProps.length > 0 ? ` ${actionProps.join(" ")}` : "";

  return `"use client";${needsState ? '\n\nimport { useState } from "react";' : ""}
import {
  ${imports.join(",\n  ")},
} from "${importPath}";

export function AlertDialogPreview() {${stateHook}
  return (
    <AlertDialog${rootProps}>
${trigger}
      <AlertDialogContent${contentProps}>
        <AlertDialogHeader>
          <AlertDialogTitle>${copy.title}</AlertDialogTitle>
          <AlertDialogDescription>
            ${copy.body}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel${state.asyncAction ? " disabled={pending}" : ""}>Cancel</AlertDialogCancel>
          <AlertDialogAction${actionAttrs}>
            ${copy.actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`;
}

export function getAlertDialogDefaultUsageCode(importPath: string) {
  return generateAlertDialogCode(ALERT_DIALOG_DEFAULT_STATE, importPath);
}

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

function AlertDialogPlaygroundPreview({
  state,
  ui,
}: {
  state: AlertDialogPlaygroundState;
  ui: AlertDialogModule;
}) {
  const {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    alertDialogTriggerClassName,
    alertDialogTriggerSmClassName,
  } = ui;
  const copy = useMemo(() => getScenarioCopy(state), [state]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const controlled = state.controlled || state.asyncAction;
  const triggerClassName = state.smallTrigger
    ? alertDialogTriggerSmClassName
    : alertDialogTriggerClassName;
  const trigger = state.customTrigger ? (
    <AlertDialogTrigger asChild>
      <button className={triggerClassName} type="button">
        {state.actionVariant === "destructive" ? (
          <Trash2 className="mr-1.5 inline size-3.5" />
        ) : null}
        {copy.trigger}
      </button>
    </AlertDialogTrigger>
  ) : (
    <AlertDialogTrigger className={triggerClassName}>
      {copy.trigger}
    </AlertDialogTrigger>
  );

  const handleAction = () => {
    if (!state.asyncAction) {
      return;
    }

    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setOpen(false);
    }, 900);
  };

  return (
    <div className="flex min-h-[18rem] items-center justify-center p-6">
      <AlertDialog
        onOpenChange={controlled ? setOpen : undefined}
        open={controlled ? open : undefined}
      >
        <p className={previewSentenceClassName}>
          <span>
            {state.actionVariant === "destructive"
              ? "This cannot be undone."
              : "This goes live for the team."}
          </span>
          <span>Tap</span>
          {trigger}
          <span>to continue.</span>
        </p>
        <AlertDialogContent open={controlled ? open : undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.title}</AlertDialogTitle>
            <AlertDialogDescription>{copy.body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              closeOnClick={!state.asyncAction}
              disabled={pending}
              onClick={handleAction}
              variant={state.actionVariant}
            >
              {pending ? copy.actionLabel : copy.trigger}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AlertDialogPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<AlertDialogPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: AlertDialogPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Alert Dialog"
    >
      <DocsPlaygroundSegmentedField
        label="Action"
        onChange={(actionVariant) => onChange({ actionVariant })}
        options={ACTION_VARIANT_OPTIONS}
        value={state.actionVariant}
      />
      <DocsPlaygroundToggleField
        checked={state.controlled}
        disabled={state.asyncAction}
        label="Controlled"
        onChange={(controlled) => onChange({ controlled })}
      />
      <DocsPlaygroundToggleField
        checked={state.asyncAction}
        label="Async action"
        onChange={(asyncAction) => onChange({ asyncAction })}
      />
      <DocsPlaygroundToggleField
        checked={state.customTrigger}
        label="Custom trigger"
        onChange={(customTrigger) => onChange({ customTrigger })}
      />
      <DocsPlaygroundToggleField
        checked={state.smallTrigger}
        label="Small trigger"
        onChange={(smallTrigger) => onChange({ smallTrigger })}
      />
    </DocsPlaygroundPanel>
  );
}

type AlertDialogPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function AlertDialogPlaygroundProvider({
  children,
  importPath,
  ui,
}: {
  children: (props: AlertDialogPlaygroundRenderProps) => ReactNode;
  importPath: string;
  ui: AlertDialogModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<AlertDialogPlaygroundState>(
    ALERT_DIALOG_DEFAULT_STATE
  );

  const updateState = (next: Partial<AlertDialogPlaygroundState>) => {
    setState((current) => {
      const merged = { ...current, ...next };

      if (merged.asyncAction) {
        merged.controlled = true;
      }

      return merged;
    });
  };

  const resetState = () => setState(ALERT_DIALOG_DEFAULT_STATE);

  useEffect(() => {
    setPlaygroundCode(generateAlertDialogCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <AlertDialogPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <AlertDialogPlaygroundPreview state={state} ui={ui} />,
    renderSettings,
  });
}
