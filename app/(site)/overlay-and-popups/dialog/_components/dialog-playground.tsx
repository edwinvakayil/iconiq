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

type DialogActionVariant = "default" | "destructive";
type DialogContentSize = "sm" | "default" | "lg" | "full";

type DialogRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

type DialogButtonProps = {
  asChild?: boolean;
  children?: ReactNode;
  className?: string;
  closeOnClick?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: DialogActionVariant;
};

type DialogContentProps = {
  children?: ReactNode;
  className?: string;
  open?: boolean;
  showCloseButton?: boolean;
  size?: DialogContentSize;
};

type DialogSlotProps = {
  children?: ReactNode;
  className?: string;
};

export type DialogModule = {
  Dialog: ComponentType<DialogRootProps>;
  DialogAction: ComponentType<DialogButtonProps>;
  DialogBody: ComponentType<DialogSlotProps>;
  DialogCancel: ComponentType<DialogButtonProps>;
  DialogContent: ComponentType<DialogContentProps>;
  DialogDescription: ComponentType<DialogSlotProps>;
  DialogFooter: ComponentType<DialogSlotProps>;
  DialogHeader: ComponentType<DialogSlotProps>;
  DialogTitle: ComponentType<DialogSlotProps>;
  DialogTrigger: ComponentType<DialogButtonProps>;
  dialogThemeClassName: string;
  dialogTriggerClassName: string;
  dialogTriggerSmClassName: string;
};

type DialogPlaygroundState = {
  actionVariant: DialogActionVariant;
  asyncAction: boolean;
  controlled: boolean;
  customTrigger: boolean;
  longBody: boolean;
  showCloseButton: boolean;
  size: DialogContentSize;
  smallTrigger: boolean;
};

const DIALOG_DEFAULT_STATE: DialogPlaygroundState = {
  actionVariant: "default",
  asyncAction: false,
  controlled: true,
  customTrigger: true,
  longBody: false,
  showCloseButton: true,
  size: "default",
  smallTrigger: true,
};

const ACTION_VARIANT_OPTIONS = [
  { label: "Default", value: "default" as const },
  { label: "Destructive", value: "destructive" as const },
];

const SIZE_OPTIONS = [
  { label: "SM", value: "sm" as const },
  { label: "MD", value: "default" as const },
  { label: "LG", value: "lg" as const },
  { label: "Full", value: "full" as const },
];

function getScenarioCopy(state: DialogPlaygroundState) {
  if (state.actionVariant === "destructive") {
    return {
      actionLabel: state.asyncAction ? "Deleting..." : "Delete",
      body: state.longBody
        ? "This permanently removes the item and every linked file, comment, and revision from your workspace. Team members will lose access immediately and the action cannot be reversed from the trash."
        : "This permanently removes the item from your workspace. You will not be able to recover it later.",
      title: "Delete this item?",
      trigger: "Delete",
    };
  }

  return {
    actionLabel: state.asyncAction ? "Publishing..." : "Publish",
    body: state.longBody
      ? "This sends the draft live for everyone on the team, updates the public page immediately, and notifies subscribers. You can still roll back from history afterward if something looks off."
      : "This sends the draft live for everyone on the team. You can still roll back from history afterward.",
    title: "Confirm publish",
    trigger: "Publish",
  };
}

function buildTriggerCode(state: DialogPlaygroundState) {
  const label = getScenarioCopy(state).trigger;

  if (state.customTrigger) {
    const className = state.smallTrigger
      ? "dialogTriggerSmClassName"
      : "dialogTriggerClassName";

    return `      <DialogTrigger asChild>
        <button className={${className}} type="button">
          ${label}
        </button>
      </DialogTrigger>`;
  }

  const className = state.smallTrigger
    ? "dialogTriggerSmClassName"
    : "dialogTriggerClassName";

  return `      <DialogTrigger className={${className}}>${label}</DialogTrigger>`;
}

function generateDialogCode(state: DialogPlaygroundState, importPath: string) {
  const needsState = state.controlled || state.asyncAction;
  const copy = getScenarioCopy(state);
  const triggerClassImport = state.smallTrigger
    ? "dialogTriggerSmClassName"
    : "dialogTriggerClassName";
  const imports = [
    "Dialog",
    "DialogAction",
    ...(state.longBody ? ["DialogBody"] : []),
    "DialogCancel",
    "DialogContent",
    "DialogDescription",
    "DialogFooter",
    "DialogHeader",
    "DialogTitle",
    "DialogTrigger",
    triggerClassImport,
  ];
  const trigger = buildTriggerCode(state);
  const stateHook = needsState
    ? state.asyncAction
      ? `\n  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
`
      : `\n  const [open, setOpen] = useState(false);
`
    : "\n";
  const rootProps = needsState ? " onOpenChange={setOpen} open={open}" : "";
  const contentProps = [
    state.size !== "default" ? `size="${state.size}"` : "",
    state.showCloseButton ? "" : "showCloseButton={false}",
  ]
    .filter(Boolean)
    .join(" ");
  const contentAttrs = contentProps.length > 0 ? ` ${contentProps}` : "";
  const body = state.longBody
    ? `          <DialogBody>
            <p className="text-[15px] text-[color:var(--dlg-muted-foreground)] leading-6">
              ${copy.body}
            </p>
          </DialogBody>
`
    : `          <DialogDescription>
            ${copy.body}
          </DialogDescription>
`;
  const actionProps = [
    state.actionVariant === "destructive" ? 'variant="destructive"' : "",
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

export function DialogPreview() {${stateHook}
  return (
    <Dialog${rootProps}>
${trigger}
      <DialogContent${contentAttrs}>
        <DialogHeader>
          <DialogTitle>${copy.title}</DialogTitle>
${state.longBody ? "" : body}        </DialogHeader>
${state.longBody ? body : ""}        <DialogFooter>
          <DialogCancel${state.asyncAction ? " disabled={pending}" : ""}>Cancel</DialogCancel>
          <DialogAction${actionAttrs}>
            ${copy.actionLabel}
          </DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`;
}

export function getDialogDefaultUsageCode(importPath: string) {
  return generateDialogCode(DIALOG_DEFAULT_STATE, importPath);
}

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

function DialogPlaygroundPreview({
  state,
  ui,
}: {
  state: DialogPlaygroundState;
  ui: DialogModule;
}) {
  const {
    Dialog,
    DialogAction,
    DialogBody,
    DialogCancel,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    dialogThemeClassName,
    dialogTriggerClassName,
    dialogTriggerSmClassName,
  } = ui;
  const copy = useMemo(() => getScenarioCopy(state), [state]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const controlled = state.controlled || state.asyncAction;
  const triggerClassName = state.smallTrigger
    ? dialogTriggerSmClassName
    : dialogTriggerClassName;
  const trigger = state.customTrigger ? (
    <DialogTrigger asChild>
      <button className={triggerClassName} type="button">
        {state.actionVariant === "destructive" ? (
          <Trash2 className="mr-1.5 inline size-3.5" />
        ) : null}
        {copy.trigger}
      </button>
    </DialogTrigger>
  ) : (
    <DialogTrigger className={triggerClassName}>{copy.trigger}</DialogTrigger>
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
    <div className={dialogThemeClassName}>
      <div className="flex min-h-[18rem] items-center justify-center p-6">
        <Dialog
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
          <DialogContent
            showCloseButton={state.showCloseButton}
            size={state.size}
          >
            <DialogHeader>
              <DialogTitle>{copy.title}</DialogTitle>
              {state.longBody ? null : (
                <DialogDescription>{copy.body}</DialogDescription>
              )}
            </DialogHeader>
            {state.longBody ? (
              <DialogBody>
                <p className="text-[15px] text-[color:var(--dlg-muted-foreground)] leading-6">
                  {copy.body}
                </p>
              </DialogBody>
            ) : null}
            <DialogFooter>
              <DialogCancel disabled={pending}>Cancel</DialogCancel>
              <DialogAction
                closeOnClick={!state.asyncAction}
                disabled={pending}
                onClick={handleAction}
                variant={state.actionVariant}
              >
                {pending ? copy.actionLabel : copy.trigger}
              </DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function DialogPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<DialogPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: DialogPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Dialog"
    >
      <DocsPlaygroundSegmentedField
        label="Action"
        onChange={(actionVariant) => onChange({ actionVariant })}
        options={ACTION_VARIANT_OPTIONS}
        value={state.actionVariant}
      />
      <DocsPlaygroundSegmentedField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
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
        checked={state.showCloseButton}
        label="Close button"
        onChange={(showCloseButton) => onChange({ showCloseButton })}
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
        checked={state.longBody}
        label="Scrollable body"
        onChange={(longBody) => onChange({ longBody })}
      />
    </DocsPlaygroundPanel>
  );
}

type DialogPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function DialogPlaygroundProvider({
  children,
  importPath,
  ui,
}: {
  children: (props: DialogPlaygroundRenderProps) => ReactNode;
  importPath: string;
  ui: DialogModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<DialogPlaygroundState>(DIALOG_DEFAULT_STATE);

  const updateState = (next: Partial<DialogPlaygroundState>) => {
    setState((current) => {
      const merged = { ...current, ...next };

      if (merged.asyncAction) {
        merged.controlled = true;
      }

      return merged;
    });
  };

  const resetState = () => setState(DIALOG_DEFAULT_STATE);

  useEffect(() => {
    setPlaygroundCode(generateDialogCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <DialogPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <DialogPlaygroundPreview state={state} ui={ui} />,
    renderSettings,
  });
}
