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
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";

type DrawerActionVariant = "default" | "destructive";
type DrawerDirection = "bottom" | "top" | "left" | "right";

type DrawerRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  direction?: DrawerDirection;
  dismissible?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

type DrawerButtonProps = {
  asChild?: boolean;
  children?: ReactNode;
  className?: string;
  closeOnClick?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: DrawerActionVariant;
};

type DrawerContentProps = {
  children?: ReactNode;
  className?: string;
  showCloseButton?: boolean;
};

type DrawerSlotProps = {
  children?: ReactNode;
  className?: string;
};

export type DrawerModule = {
  Drawer: ComponentType<DrawerRootProps>;
  DrawerAction: ComponentType<DrawerButtonProps>;
  DrawerBody: ComponentType<DrawerSlotProps>;
  DrawerCancel: ComponentType<DrawerButtonProps>;
  DrawerContent: ComponentType<DrawerContentProps>;
  DrawerDescription: ComponentType<DrawerSlotProps>;
  DrawerFooter: ComponentType<DrawerSlotProps>;
  DrawerHeader: ComponentType<DrawerSlotProps>;
  DrawerTitle: ComponentType<DrawerSlotProps>;
  DrawerTrigger: ComponentType<DrawerButtonProps>;
  drawerThemeClassName: string;
  drawerTriggerSmClassName: string;
};

type DrawerPlaygroundState = {
  actionVariant: DrawerActionVariant;
  asyncAction: boolean;
  controlled: boolean;
  direction: DrawerDirection;
  dismissible: boolean;
  longBody: boolean;
  showCloseButton: boolean;
};

const DRAWER_DEFAULT_STATE: DrawerPlaygroundState = {
  actionVariant: "default",
  asyncAction: false,
  controlled: true,
  direction: "bottom",
  dismissible: true,
  longBody: false,
  showCloseButton: true,
};

const ACTION_VARIANT_OPTIONS = [
  { label: "Default", value: "default" as const },
  { label: "Destructive", value: "destructive" as const },
];

const DIRECTION_OPTIONS = [
  { label: "Bottom", value: "bottom" as const },
  { label: "Top", value: "top" as const },
  { label: "Left", value: "left" as const },
  { label: "Right", value: "right" as const },
];

function getScenarioCopy(state: DrawerPlaygroundState) {
  if (state.actionVariant === "destructive") {
    return {
      actionLabel: state.asyncAction ? "Removing..." : "Remove",
      body: state.longBody
        ? "This permanently removes the item and every linked file, comment, and revision from your workspace. Team members will lose access immediately and the action cannot be reversed from the trash."
        : "This permanently removes the item from your workspace. You will not be able to recover it later.",
      title: "Remove this item?",
      trigger: "Remove",
    };
  }

  return {
    actionLabel: state.asyncAction ? "Saving..." : "Save",
    body: state.longBody
      ? "Review the checklist, confirm each step, and save your updates without leaving the page. Long forms stay scrollable while the header and footer remain visible."
      : "Review the checklist and save your updates without leaving the page.",
    title: "Review checklist",
    trigger: "Review",
  };
}

function buildTriggerCode(state: DrawerPlaygroundState) {
  const label = getScenarioCopy(state).trigger;

  return `      <DrawerTrigger asChild>
        <button className={drawerTriggerSmClassName} type="button">
          ${label}
        </button>
      </DrawerTrigger>`;
}

function buildDrawerImports(state: DrawerPlaygroundState) {
  return [
    "Drawer",
    "DrawerAction",
    ...(state.longBody ? ["DrawerBody"] : []),
    "DrawerCancel",
    "DrawerContent",
    "DrawerDescription",
    "DrawerFooter",
    "DrawerHeader",
    "DrawerTitle",
    "DrawerTrigger",
    "drawerTriggerSmClassName",
  ];
}

function buildStateHook(state: DrawerPlaygroundState) {
  const needsState = state.controlled || state.asyncAction;

  if (!needsState) {
    return "\n";
  }

  if (state.asyncAction) {
    return `\n  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
`;
  }

  return `\n  const [open, setOpen] = useState(false);
`;
}

function buildDrawerRootAttrs(state: DrawerPlaygroundState) {
  const needsState = state.controlled || state.asyncAction;
  const rootProps = [
    needsState ? "onOpenChange={setOpen} open={open}" : "",
    state.direction !== "bottom" ? `direction="${state.direction}"` : "",
    state.dismissible ? "" : "dismissible={false}",
  ]
    .filter(Boolean)
    .join(" ");

  return rootProps.length > 0 ? ` ${rootProps}` : "";
}

function buildContentAttrs(state: DrawerPlaygroundState) {
  if (state.showCloseButton) {
    return "";
  }

  return " showCloseButton={false}";
}

function buildBodySection(
  state: DrawerPlaygroundState,
  copy: ReturnType<typeof getScenarioCopy>
) {
  if (state.longBody) {
    return `        <DrawerBody>
          <p className="text-[14px] text-[color:var(--drw-muted-foreground)] leading-6">
            ${copy.body}
          </p>
        </DrawerBody>
`;
  }

  return `        <DrawerDescription>
          ${copy.body}
        </DrawerDescription>
`;
}

function buildActionAttrs(state: DrawerPlaygroundState) {
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

  return actionProps.length > 0 ? ` ${actionProps.join(" ")}` : "";
}

function generateDrawerCode(state: DrawerPlaygroundState, importPath: string) {
  const needsState = state.controlled || state.asyncAction;
  const copy = getScenarioCopy(state);
  const imports = buildDrawerImports(state);
  const trigger = buildTriggerCode(state);
  const stateHook = buildStateHook(state);
  const rootAttrs = buildDrawerRootAttrs(state);
  const contentAttrs = buildContentAttrs(state);
  const body = buildBodySection(state, copy);
  const actionAttrs = buildActionAttrs(state);
  const cancelAttrs = state.asyncAction ? " disabled={pending}" : "";
  const headerBody = state.longBody ? "" : body;
  const scrollBody = state.longBody ? body : "";

  return `"use client";${needsState ? '\n\nimport { useState } from "react";' : ""}
import {
  ${imports.join(",\n  ")},
} from "${importPath}";

export function DrawerPreview() {${stateHook}
  return (
    <Drawer${rootAttrs}>
${trigger}
      <DrawerContent${contentAttrs}>
        <DrawerHeader>
          <DrawerTitle>${copy.title}</DrawerTitle>
${headerBody}        </DrawerHeader>
${scrollBody}        <DrawerFooter>
          <DrawerCancel${cancelAttrs}>Cancel</DrawerCancel>
          <DrawerAction${actionAttrs}>
            ${copy.actionLabel}
          </DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}`;
}

export function getDrawerDefaultUsageCode(importPath: string) {
  return generateDrawerCode(DRAWER_DEFAULT_STATE, importPath);
}

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

function DrawerPlaygroundPreview({
  state,
  ui,
}: {
  state: DrawerPlaygroundState;
  ui: DrawerModule;
}) {
  const {
    Drawer,
    DrawerAction,
    DrawerBody,
    DrawerCancel,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    drawerThemeClassName,
    drawerTriggerSmClassName,
  } = ui;
  const copy = useMemo(() => getScenarioCopy(state), [state]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const controlled = state.controlled || state.asyncAction;
  const trigger = (
    <DrawerTrigger asChild>
      <button className={drawerTriggerSmClassName} type="button">
        {state.actionVariant === "destructive" ? (
          <Trash2 className="mr-1.5 inline size-3.5" />
        ) : null}
        {copy.trigger}
      </button>
    </DrawerTrigger>
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
    <div className={drawerThemeClassName}>
      <div className="flex min-h-[18rem] items-center justify-center p-6">
        <Drawer
          direction={state.direction}
          dismissible={state.dismissible}
          onOpenChange={controlled ? setOpen : undefined}
          open={controlled ? open : undefined}
        >
          <p className={previewSentenceClassName}>
            <span>
              {state.actionVariant === "destructive"
                ? "This cannot be undone."
                : "Stay on the page while you review."}
            </span>
            <span>Tap</span>
            {trigger}
            <span>to continue.</span>
          </p>
          <DrawerContent showCloseButton={state.showCloseButton}>
            <DrawerHeader>
              <DrawerTitle>{copy.title}</DrawerTitle>
              {state.longBody ? null : (
                <DrawerDescription>{copy.body}</DrawerDescription>
              )}
            </DrawerHeader>
            {state.longBody ? (
              <DrawerBody>
                <p className="text-[14px] text-[color:var(--drw-muted-foreground)] leading-6">
                  {copy.body}
                </p>
              </DrawerBody>
            ) : null}
            <DrawerFooter>
              <DrawerCancel disabled={pending}>Cancel</DrawerCancel>
              <DrawerAction
                closeOnClick={!state.asyncAction}
                disabled={pending}
                onClick={handleAction}
                variant={state.actionVariant}
              >
                {pending ? copy.actionLabel : copy.trigger}
              </DrawerAction>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

function DrawerPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<DrawerPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: DrawerPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Drawer"
    >
      <DocsPlaygroundSelectField
        label="Direction"
        onChange={(direction) => onChange({ direction })}
        options={DIRECTION_OPTIONS}
        value={state.direction}
      />
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
        checked={state.dismissible}
        label="Dismissible"
        onChange={(dismissible) => onChange({ dismissible })}
      />
      <DocsPlaygroundToggleField
        checked={state.showCloseButton}
        label="Close button"
        onChange={(showCloseButton) => onChange({ showCloseButton })}
      />
      <DocsPlaygroundToggleField
        checked={state.longBody}
        label="Scrollable body"
        onChange={(longBody) => onChange({ longBody })}
      />
    </DocsPlaygroundPanel>
  );
}

type DrawerPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function DrawerPlaygroundProvider({
  children,
  importPath,
  ui,
}: {
  children: (props: DrawerPlaygroundRenderProps) => ReactNode;
  importPath: string;
  ui: DrawerModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<DrawerPlaygroundState>(DRAWER_DEFAULT_STATE);

  const updateState = (next: Partial<DrawerPlaygroundState>) => {
    setState((current) => {
      const merged = { ...current, ...next };

      if (merged.asyncAction) {
        merged.controlled = true;
      }

      return merged;
    });
  };

  const resetState = () => setState(DRAWER_DEFAULT_STATE);

  useEffect(() => {
    setPlaygroundCode(generateDrawerCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <DrawerPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <DrawerPlaygroundPreview state={state} ui={ui} />,
    renderSettings,
  });
}
