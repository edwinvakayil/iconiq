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
import type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "@/registry/b-collapsible";

type CollapsibleModule = {
  Collapsible: ComponentType<CollapsibleProps>;
  CollapsibleContent: ComponentType<CollapsibleContentProps>;
  CollapsibleTrigger: ComponentType<CollapsibleTriggerProps>;
};

type CollapsiblePlaygroundState = {
  controlled: boolean;
  defaultOpen: boolean;
  disabled: boolean;
  forceMount: boolean;
  iconPosition: NonNullable<CollapsibleTriggerProps["iconPosition"]>;
  open: boolean;
  showIcon: boolean;
};

const DEFAULT_STATE: CollapsiblePlaygroundState = {
  controlled: false,
  defaultOpen: false,
  disabled: false,
  forceMount: true,
  iconPosition: "end",
  open: false,
  showIcon: true,
};

const ICON_POSITION_OPTIONS = [
  { label: "End", value: "end" as const },
  { label: "Start", value: "start" as const },
];

export const COLLAPSIBLE_PREVIEW_TRIGGER = "How does shipping work?";

const previewContentBody = `<div className="space-y-4">
          <p>
            Orders leave our warehouse within one business day. Delivery timing
            depends on the service you choose at checkout.
          </p>
          <ul>
            <li>Standard shipping arrives in 3–5 business days.</li>
            <li>Express shipping is available in most metro areas.</li>
            <li>Tracking is emailed once the package is scanned by the carrier.</li>
          </ul>
          <p>
            International orders can take 7–14 days while customs reviews the
            shipment.
          </p>
        </div>`;

export function getCollapsibleDefaultUsageCode(importPath: string) {
  return `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "${importPath}";

export function ShippingDetails() {
  return (
    <Collapsible className="w-full max-w-xl">
      <CollapsibleTrigger>${COLLAPSIBLE_PREVIEW_TRIGGER}</CollapsibleTrigger>
      <CollapsibleContent>
        ${previewContentBody}
      </CollapsibleContent>
    </Collapsible>
  );
}`;
}

function CollapsiblePreviewContent() {
  return (
    <div className="space-y-4">
      <p>
        Orders leave our warehouse within one business day. Delivery timing
        depends on the service you choose at checkout.
      </p>
      <ul>
        <li>Standard shipping arrives in 3–5 business days.</li>
        <li>Express shipping is available in most metro areas.</li>
        <li>Tracking is emailed once the package is scanned by the carrier.</li>
      </ul>
      <p>
        International orders can take 7–14 days while customs reviews the
        shipment.
      </p>
    </div>
  );
}

const CollapsiblePlaygroundContext = createContext<{
  state: CollapsiblePlaygroundState;
  ui: CollapsibleModule;
} | null>(null);

function useCollapsiblePlayground() {
  const context = useContext(CollapsiblePlaygroundContext);

  if (!context) {
    throw new Error(
      "CollapsiblePlayground components must be used within CollapsiblePlaygroundProvider."
    );
  }

  return context;
}

function formatProp(name: string, value: string | boolean) {
  if (typeof value === "boolean") {
    return value ? ` ${name}` : "";
  }

  return ` ${name}="${value}"`;
}

function generateCollapsibleCode(
  state: CollapsiblePlaygroundState,
  importPath: string
) {
  const rootProps = [
    state.disabled ? formatProp("disabled", true) : "",
    state.controlled
      ? formatProp("open", `{${state.open ? "true" : "false"}}`)
      : state.defaultOpen
        ? formatProp("defaultOpen", true)
        : "",
  ]
    .filter(Boolean)
    .join("");

  const triggerProps = [
    state.showIcon ? "" : formatProp("showIcon", false),
    state.iconPosition !== "end"
      ? formatProp("iconPosition", state.iconPosition)
      : "",
  ]
    .filter(Boolean)
    .join("");

  const contentProps = state.forceMount ? "" : formatProp("forceMount", false);

  const body = previewContentBody;

  const controlledHook = state.controlled
    ? `import { useState } from "react";

`
    : "";

  const controlledSetup = state.controlled
    ? `
  const [open, setOpen] = useState(${state.open ? "true" : "false"});
`
    : "";

  const controlledHandlers = state.controlled
    ? `
      onOpenChange={setOpen}`
    : "";

  return `"use client";

${controlledHook}import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "${importPath}";

export function ShippingDetails() {${controlledSetup}
  return (
    <Collapsible className="w-full max-w-xl"${rootProps}${controlledHandlers}>
      <CollapsibleTrigger${triggerProps}>
        ${COLLAPSIBLE_PREVIEW_TRIGGER}
      </CollapsibleTrigger>
      <CollapsibleContent${contentProps}>
        ${body}
      </CollapsibleContent>
    </Collapsible>
  );
}`;
}

function CollapsiblePlaygroundPreview() {
  const { state, ui } = useCollapsiblePlayground();
  const { Collapsible, CollapsibleContent, CollapsibleTrigger } = ui;
  const [open, setOpen] = useState(state.open);

  useEffect(() => {
    if (state.controlled) {
      setOpen(state.open);
    }
  }, [state.controlled, state.open]);

  return (
    <div className="flex min-h-[18rem] w-full justify-center p-6">
      <div className="w-full max-w-xl pt-16">
        <Collapsible
          className="w-full max-w-xl"
          defaultOpen={state.controlled ? undefined : state.defaultOpen}
          disabled={state.disabled}
          onOpenChange={state.controlled ? setOpen : undefined}
          open={state.controlled ? open : undefined}
        >
          <CollapsibleTrigger
            iconPosition={state.iconPosition}
            showIcon={state.showIcon}
          >
            {COLLAPSIBLE_PREVIEW_TRIGGER}
          </CollapsibleTrigger>
          <CollapsibleContent forceMount={state.forceMount}>
            <CollapsiblePreviewContent />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

function CollapsiblePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<CollapsiblePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: CollapsiblePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Collapsible"
    >
      <DocsPlaygroundToggleField
        checked={state.defaultOpen}
        disabled={state.controlled}
        label="Default open"
        onChange={(defaultOpen) => onChange({ defaultOpen })}
      />
      <DocsPlaygroundToggleField
        checked={state.controlled}
        label="Controlled"
        onChange={(controlled) => onChange({ controlled })}
      />
      {state.controlled ? (
        <DocsPlaygroundToggleField
          checked={state.open}
          label="Open"
          onChange={(open) => onChange({ open })}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
      <DocsPlaygroundToggleField
        checked={state.showIcon}
        label="Show icon"
        onChange={(showIcon) => onChange({ showIcon })}
      />
      {state.showIcon ? (
        <DocsPlaygroundSelectField
          label="Icon position"
          onChange={(iconPosition) => onChange({ iconPosition })}
          options={ICON_POSITION_OPTIONS}
          value={state.iconPosition}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.forceMount}
        label="Force mount"
        onChange={(forceMount) => onChange({ forceMount })}
      />
    </DocsPlaygroundPanel>
  );
}

type CollapsiblePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function CollapsiblePlaygroundProvider({
  children,
  importPath,
  ui,
}: {
  children: (props: CollapsiblePlaygroundRenderProps) => ReactNode;
  importPath: string;
  ui: CollapsibleModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<CollapsiblePlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<CollapsiblePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateCollapsibleCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <CollapsiblePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <CollapsiblePlaygroundContext.Provider value={{ state, ui }}>
      {children({
        preview: <CollapsiblePlaygroundPreview />,
        renderSettings,
      })}
    </CollapsiblePlaygroundContext.Provider>
  );
}
