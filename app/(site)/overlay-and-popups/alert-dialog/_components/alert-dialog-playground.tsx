"use client";

import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
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
  AlertDialogMedia: ComponentType<AlertDialogSlotProps>;
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
  showMedia: boolean;
  smallTrigger: boolean;
};

const ALERT_DIALOG_DEFAULT_STATE: AlertDialogPlaygroundState = {
  actionVariant: "destructive",
  asyncAction: false,
  controlled: true,
  customTrigger: true,
  showMedia: true,
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
      icon: CheckCircle2,
      title: "Publish this draft?",
      trigger: "Publish",
    };
  }

  return {
    actionLabel: state.asyncAction ? "Deleting..." : "Delete",
    body: "This action permanently removes the item from your workspace. You will not be able to recover it later.",
    icon: AlertTriangle,
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
    ? ' className="h-8 min-h-8 px-3 py-0 text-[13px]"'
    : "";

  return `      <AlertDialogTrigger${className}>${label}</AlertDialogTrigger>`;
}

function generateAlertDialogCode(
  state: AlertDialogPlaygroundState,
  importPath: string
) {
  const needsState = state.controlled || state.asyncAction;
  const needsMedia = state.showMedia;
  const triggerImports = state.customTrigger
    ? [
        state.smallTrigger
          ? "alertDialogTriggerSmClassName"
          : "alertDialogTriggerClassName",
      ]
    : [];
  const imports = [
    "AlertDialog",
    "AlertDialogAction",
    "AlertDialogCancel",
    "AlertDialogContent",
    "AlertDialogDescription",
    "AlertDialogFooter",
    "AlertDialogHeader",
    ...(needsMedia ? ["AlertDialogMedia"] : []),
    "AlertDialogTitle",
    "AlertDialogTrigger",
    ...triggerImports,
  ];
  const iconImport =
    needsMedia && state.actionVariant === "destructive"
      ? '\nimport { AlertTriangle } from "lucide-react";'
      : needsMedia
        ? '\nimport { CheckCircle2 } from "lucide-react";'
        : "";
  const trigger = buildTriggerCode(state);
  const copy = getScenarioCopy(state);
  const icon =
    state.actionVariant === "destructive" ? "AlertTriangle" : "CheckCircle2";
  const stateHook = needsState
    ? `\n  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
`
    : "\n";
  const rootProps = needsState ? " onOpenChange={setOpen} open={open}" : "";
  const contentProps = needsState ? " open={open}" : "";
  const media = needsMedia
    ? `          <AlertDialogMedia>
            <${icon} className="size-5" />
          </AlertDialogMedia>
`
    : "";
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

  return `"use client";${needsState ? '\n\nimport { useState } from "react";' : ""}${iconImport}
import {
  ${imports.join(",\n  ")},
} from "${importPath}";

export function AlertDialogPreview() {${stateHook}
  return (
    <AlertDialog${rootProps}>
${trigger}
      <AlertDialogContent${contentProps}>
        <div className="flex items-start gap-4">
${media}          <AlertDialogHeader>
            <AlertDialogTitle>${copy.title}</AlertDialogTitle>
            <AlertDialogDescription>
              ${copy.body}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
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
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
    alertDialogTriggerClassName,
    alertDialogTriggerSmClassName,
  } = ui;
  const copy = useMemo(() => getScenarioCopy(state), [state]);
  const Icon = copy.icon;
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
    <AlertDialogTrigger
      className={
        state.smallTrigger ? "h-8 min-h-8 px-3 py-0 text-[13px]" : undefined
      }
    >
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
    <div className="flex min-h-[320px] items-center justify-center p-6">
      <AlertDialog
        onOpenChange={controlled ? setOpen : undefined}
        open={controlled ? open : undefined}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm">
          <span>
            {state.actionVariant === "destructive"
              ? "This cannot be undone."
              : "This goes live for the team."}
          </span>
          <span>Tap</span>
          {trigger}
          <span>to continue.</span>
        </div>
        <AlertDialogContent open={controlled ? open : undefined}>
          <div className="flex items-start gap-4">
            {state.showMedia ? (
              <AlertDialogMedia
                className={
                  state.actionVariant === "default"
                    ? "bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_90%)] text-[color:var(--adlg-action-surface)]"
                    : undefined
                }
              >
                <Icon className="size-5" />
              </AlertDialogMedia>
            ) : null}
            <AlertDialogHeader>
              <AlertDialogTitle>{copy.title}</AlertDialogTitle>
              <AlertDialogDescription>{copy.body}</AlertDialogDescription>
            </AlertDialogHeader>
          </div>
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
      <DocsPlaygroundToggleField
        checked={state.showMedia}
        label="Media slot"
        onChange={(showMedia) => onChange({ showMedia })}
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
