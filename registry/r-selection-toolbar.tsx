"use client";

import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import * as React from "react";
import { createPortal } from "react-dom";

import {
  getSelectionToolbarButtonClassName,
  getSelectionToolbarShortcutLabel,
  isSelectionToolbarCommandActive,
  type SelectionToolbarItem,
  type SelectionToolbarProps,
  selectionToolbarStyles,
  useSelectionToolbar,
} from "./selectiontoolbar";

export type {
  SelectionToolbarCommand,
  SelectionToolbarItem,
  SelectionToolbarProps,
} from "./selectiontoolbar";

type ToolbarButtonProps = {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  shortcut?: string;
  tabIndex?: number;
};

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(
    {
      active = false,
      children,
      className,
      disabled = false,
      label,
      onMouseDown,
      shortcut,
      tabIndex = -1,
    },
    ref
  ) {
    return (
      <ToolbarPrimitive.Button
        aria-keyshortcuts={shortcut}
        aria-label={shortcut ? `${label} (${shortcut})` : label}
        aria-pressed={active}
        className={getSelectionToolbarButtonClassName({ active, className })}
        disabled={disabled}
        onMouseDown={onMouseDown}
        ref={ref}
        tabIndex={tabIndex}
        title={shortcut ? `${label} (${shortcut})` : label}
        type="button"
      >
        <span className={selectionToolbarStyles.toolbarButtonIconClassName}>
          {children}
        </span>
      </ToolbarPrimitive.Button>
    );
  }
);

ToolbarButton.displayName = "SelectionToolbarButton";

function renderToolbarItems({
  active,
  buttonRefs,
  disabled,
  focusedIndex,
  handleItemAction,
  items,
}: {
  active: ReturnType<typeof useSelectionToolbar>["active"];
  buttonRefs: ReturnType<typeof useSelectionToolbar>["buttonRefs"];
  disabled: boolean;
  focusedIndex: number;
  handleItemAction: (item: SelectionToolbarItem) => void;
  items: SelectionToolbarItem[];
}) {
  return items.map((item, index) => (
    <ToolbarButton
      active={
        item.command
          ? isSelectionToolbarCommandActive(item.command, active)
          : false
      }
      disabled={disabled || item.disabled}
      key={item.id}
      label={item.label}
      onMouseDown={(event) => {
        event.preventDefault();
        handleItemAction(item);
      }}
      ref={(node) => {
        buttonRefs.current[index] = node;
      }}
      shortcut={
        item.command
          ? getSelectionToolbarShortcutLabel(item.command)
          : undefined
      }
      tabIndex={focusedIndex === index ? 0 : -1}
    >
      {item.icon}
    </ToolbarButton>
  ));
}

export function SelectionToolbar(props: SelectionToolbarProps) {
  const toolbar = useSelectionToolbar(props);

  if (!(toolbar.mounted && toolbar.portalTarget)) {
    return null;
  }

  return createPortal(
    <ToolbarPrimitive.Root
      aria-controls={toolbar.ariaControls}
      aria-hidden={!toolbar.visible}
      aria-label="Text formatting"
      className={toolbar.shellClassName}
      onKeyDown={toolbar.handleToolbarKeyDown}
      onMouseDown={(event) => event.preventDefault()}
      orientation="horizontal"
      ref={toolbar.setToolbarNode}
      style={toolbar.toolbarStyle}
    >
      {renderToolbarItems({
        active: toolbar.active,
        buttonRefs: toolbar.buttonRefs,
        disabled: toolbar.disabled,
        focusedIndex: toolbar.focusedIndex,
        handleItemAction: toolbar.handleItemAction,
        items: toolbar.resolvedItems,
      })}
      {toolbar.children}
    </ToolbarPrimitive.Root>,
    toolbar.portalTarget
  );
}

SelectionToolbar.displayName = "SelectionToolbar";

export { ToolbarButton };
