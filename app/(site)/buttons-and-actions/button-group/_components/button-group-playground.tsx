"use client";

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
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
import {
  Button,
  ButtonGroup,
  ButtonGroupItems,
  ButtonGroupSeparator,
  type ButtonGroupSize,
  ButtonGroupText,
  type ButtonVariant,
  IconButton,
  SegmentedControl,
} from "@/registry/button-group";

type ButtonGroupPattern =
  | "connected"
  | "segmented"
  | "items"
  | "label"
  | "vertical"
  | "icon-segments"
  | "destructive";

type ButtonGroupPlaygroundState = {
  pattern: ButtonGroupPattern;
  size: ButtonGroupSize;
  orientation: "horizontal" | "vertical";
  variant: ButtonVariant;
  showDividers: boolean;
  disableRipple: boolean;
  disabledSegment: boolean;
};

const DEFAULT_STATE: ButtonGroupPlaygroundState = {
  pattern: "connected",
  size: "sm",
  orientation: "horizontal",
  variant: "default",
  showDividers: true,
  disableRipple: false,
  disabledSegment: true,
};

const PATTERN_OPTIONS: Array<{ label: string; value: ButtonGroupPattern }> = [
  { label: "Connected actions", value: "connected" },
  { label: "Segmented control", value: "segmented" },
  { label: "Shared hover items", value: "items" },
  { label: "Label + separator", value: "label" },
  { label: "Vertical stack", value: "vertical" },
  { label: "Icon segments", value: "icon-segments" },
  { label: "Destructive action", value: "destructive" },
];

const SIZE_OPTIONS: Array<{ label: string; value: ButtonGroupSize }> = [
  { label: "sm", value: "sm" },
  { label: "md", value: "md" },
  { label: "lg", value: "lg" },
];

const ORIENTATION_OPTIONS = [
  { label: "Horizontal", value: "horizontal" as const },
  { label: "Vertical", value: "vertical" as const },
];

const VARIANT_OPTIONS: Array<{ label: string; value: ButtonVariant }> = [
  { label: "Default", value: "default" },
  { label: "Destructive", value: "destructive" },
  { label: "Ghost", value: "ghost" },
  { label: "Outline", value: "outline" },
];

const ButtonGroupPlaygroundContext =
  createContext<ButtonGroupPlaygroundState | null>(null);

function useButtonGroupPlaygroundState() {
  const context = useContext(ButtonGroupPlaygroundContext);

  if (!context) {
    throw new Error(
      "ButtonGroupPlayground components must be used within ButtonGroupPlaygroundProvider."
    );
  }

  return context;
}

function generateButtonGroupCode(state: ButtonGroupPlaygroundState) {
  const sizeAttr = state.size === "md" ? "" : `\n      size="${state.size}"`;
  const rippleAttr = state.disableRipple ? "\n      disableRipple" : "";
  const dividersAttr = state.showDividers ? "" : "\n      showDividers={false}";

  switch (state.pattern) {
    case "segmented":
      return `"use client";

import { useState } from "react";

import { SegmentedControl } from "@/components/ui/button-group";

export function ViewModeControl() {
  const [view, setView] = useState("list");

  return (
    <SegmentedControl
      ariaLabel="View mode"
      name="view-mode"${sizeAttr}
      onChange={setView}
      options={[
        { value: "list", label: "List" },
        { value: "board", label: "Board" },${
          state.disabledSegment
            ? '\n        { value: "calendar", label: "Calendar", disabled: true },'
            : ""
        }
      ]}
      value={view}
    />
  );
}`;

    case "items":
      return `"use client";

import { ButtonGroupItems } from "@/components/ui/button-group";

export function SharedHoverItems() {
  return (
    <ButtonGroupItems${sizeAttr}${dividersAttr}${rippleAttr}>
      <button type="button">Day</button>
      <button type="button">Week</button>
      <button type="button">Month</button>
    </ButtonGroupItems>
  );
}`;

    case "label":
      return `"use client";

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";

export function LabeledAmountGroup() {
  return (
    <ButtonGroup aria-label="Amount controls"${sizeAttr}>
      <ButtonGroupText>$</ButtonGroupText>
      <Button>10</Button>
      <Button>25</Button>
      <Button>50</Button>
      <ButtonGroupSeparator />
      <Button variant="destructive">Clear</Button>
    </ButtonGroup>
  );
}`;

    case "vertical":
      return `"use client";

import { Button, ButtonGroup } from "@/components/ui/button-group";

export function VerticalButtonGroup() {
  return (
    <ButtonGroup
      aria-label="Stacked actions"
      orientation="vertical"${sizeAttr}
    >
      <Button>Move up</Button>
      <Button>Move down</Button>
      <Button variant="destructive">Remove</Button>
    </ButtonGroup>
  );
}`;

    case "icon-segments":
      return `"use client";

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";
import { useState } from "react";

import { SegmentedControl } from "@/components/ui/button-group";

export function AlignmentControl() {
  const [align, setAlign] = useState("left");

  return (
    <SegmentedControl
      ariaLabel="Text alignment"
      layoutId="align-indicator"${sizeAttr}
      onChange={setAlign}
      options={[
        {
          value: "left",
          label: "Align left",
          icon: <AlignLeftIcon className="size-3.5" />,
        },
        {
          value: "center",
          label: "Align center",
          icon: <AlignCenterIcon className="size-3.5" />,
        },
        {
          value: "right",
          label: "Align right",
          icon: <AlignRightIcon className="size-3.5" />,
        },
      ]}
      value={align}
    />
  );
}`;

    case "destructive":
      return `"use client";

import { Trash2Icon } from "lucide-react";

import { Button, ButtonGroup, IconButton } from "@/components/ui/button-group";

export function RowActions() {
  return (
    <ButtonGroup aria-label="Row actions"${sizeAttr}>
      <Button>Edit</Button>
      <Button>Duplicate</Button>
      <IconButton aria-label="Delete row" variant="destructive">
        <Trash2Icon />
      </IconButton>
    </ButtonGroup>
  );
}`;

    default:
      return `"use client";

import { MoreHorizontalIcon } from "lucide-react";

import {
  Button,
  ButtonGroup,
  IconButton,
} from "@/components/ui/button-group";

export function ButtonGroupDemo() {
  return (
    <ButtonGroup aria-label="Project actions"${sizeAttr}>
      <Button${state.variant !== "default" ? ` variant="${state.variant}"` : ""}${state.disableRipple ? " disableRipple" : ""}>Edit</Button>
      <Button${state.disableRipple ? " disableRipple" : ""}>Preview</Button>
      <Button${state.disableRipple ? " disableRipple" : ""}>Publish</Button>
      <IconButton aria-label="More project actions"${state.disableRipple ? " disableRipple" : ""}>
        <MoreHorizontalIcon />
      </IconButton>
    </ButtonGroup>
  );
}`;
  }
}

function ButtonGroupPlaygroundPreview() {
  const state = useButtonGroupPlaygroundState();
  const [view, setView] = useState("list");
  const [align, setAlign] = useState("left");

  const previewStackClassName =
    "mx-auto flex max-w-full flex-col items-center gap-3";
  const previewWrapClassName =
    "mx-auto flex max-w-full flex-wrap justify-center gap-2";

  switch (state.pattern) {
    case "segmented":
      return (
        <SegmentedControl
          ariaLabel="View mode"
          onChange={setView}
          options={[
            { value: "list", label: "List" },
            { value: "board", label: "Board" },
            {
              value: "calendar",
              label: "Calendar",
              disabled: state.disabledSegment,
            },
          ]}
          size={state.size}
          value={view}
        />
      );

    case "items":
      return (
        <ButtonGroupItems
          disableRipple={state.disableRipple}
          showDividers={state.showDividers}
          size={state.size}
        >
          <button type="button">Day</button>
          <button type="button">Week</button>
          <button type="button">Month</button>
        </ButtonGroupItems>
      );

    case "label":
      return (
        <ButtonGroup aria-label="Amount controls" size={state.size}>
          <ButtonGroupText>$</ButtonGroupText>
          <Button disableRipple={state.disableRipple}>10</Button>
          <Button disableRipple={state.disableRipple}>25</Button>
          <Button disableRipple={state.disableRipple}>50</Button>
          <ButtonGroupSeparator />
          <Button disableRipple={state.disableRipple} variant="destructive">
            Clear
          </Button>
        </ButtonGroup>
      );

    case "vertical":
      return (
        <ButtonGroup
          aria-label="Stacked actions"
          orientation="vertical"
          size={state.size}
        >
          <Button disableRipple={state.disableRipple}>Move up</Button>
          <Button disableRipple={state.disableRipple}>Move down</Button>
          <Button disableRipple={state.disableRipple} variant="destructive">
            Remove
          </Button>
        </ButtonGroup>
      );

    case "icon-segments":
      return (
        <SegmentedControl
          ariaLabel="Text alignment"
          layoutId="align-indicator"
          onChange={setAlign}
          options={[
            {
              value: "left",
              label: "Align left",
              icon: <AlignLeftIcon className="size-3.5" />,
            },
            {
              value: "center",
              label: "Align center",
              icon: <AlignCenterIcon className="size-3.5" />,
            },
            {
              value: "right",
              label: "Align right",
              icon: <AlignRightIcon className="size-3.5" />,
            },
          ]}
          size={state.size}
          value={align}
        />
      );

    case "destructive":
      return (
        <ButtonGroup aria-label="Row actions" size={state.size}>
          <Button disableRipple={state.disableRipple}>Edit</Button>
          <Button disableRipple={state.disableRipple}>Duplicate</Button>
          <IconButton
            aria-label="Delete row"
            disableRipple={state.disableRipple}
            variant="destructive"
          >
            <Trash2Icon />
          </IconButton>
        </ButtonGroup>
      );

    default:
      return (
        <div className={previewStackClassName}>
          <p className="text-center text-muted-foreground text-sm">
            Review the latest project changes before sharing them with your
            team.
          </p>
          <div className={previewWrapClassName}>
            <ButtonGroup
              aria-label="Project actions"
              orientation={state.orientation}
              size={state.size}
            >
              <Button
                disableRipple={state.disableRipple}
                variant={state.variant}
              >
                Edit
              </Button>
              <Button disableRipple={state.disableRipple}>Preview</Button>
              <Button disableRipple={state.disableRipple}>Publish</Button>
              <IconButton
                aria-label="More project actions"
                disableRipple={state.disableRipple}
              >
                <MoreHorizontalIcon />
              </IconButton>
            </ButtonGroup>
          </div>
        </div>
      );
  }
}

function ButtonGroupPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ButtonGroupPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ButtonGroupPlaygroundState;
}) {
  const showOrientation =
    state.pattern === "connected" || state.pattern === "vertical";
  const showVariant = state.pattern === "connected";
  const showDividers = state.pattern === "items";
  const showDisabledSegment = state.pattern === "segmented";

  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Button Group"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      <DocsPlaygroundSegmentedField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      {showOrientation ? (
        <DocsPlaygroundSelectField
          label="Orientation"
          onChange={(orientation) => onChange({ orientation })}
          options={ORIENTATION_OPTIONS}
          value={state.orientation}
        />
      ) : null}
      {showVariant ? (
        <DocsPlaygroundSelectField
          label="Variant"
          onChange={(variant) => onChange({ variant })}
          options={VARIANT_OPTIONS}
          value={state.variant}
        />
      ) : null}
      {showDividers ? (
        <DocsPlaygroundToggleField
          checked={state.showDividers}
          label="Dividers"
          onChange={(showDividers) => onChange({ showDividers })}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={!state.disableRipple}
        label="Ripple"
        onChange={(enabled) => onChange({ disableRipple: !enabled })}
      />
      {showDisabledSegment ? (
        <DocsPlaygroundToggleField
          checked={state.disabledSegment}
          label="Disabled"
          onChange={(disabledSegment) => onChange({ disabledSegment })}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type ButtonGroupPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ButtonGroupPlaygroundProvider({
  children,
}: {
  children: (props: ButtonGroupPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ButtonGroupPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<ButtonGroupPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateButtonGroupCode(state));
  }, [setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ButtonGroupPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <ButtonGroupPlaygroundContext.Provider value={state}>
      {children({
        preview: <ButtonGroupPlaygroundPreview />,
        renderSettings,
      })}
    </ButtonGroupPlaygroundContext.Provider>
  );
}
