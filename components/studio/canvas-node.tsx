"use client";

/**
 * Recursive tree renderer.
 *
 * Containers render as real flex/grid divs using the exact class list the
 * exporter emits; components render the live Iconiq component inside an
 * interaction shell that handles selection, hover and drag in edit mode.
 */

import { memo } from "react";
import {
  DIRECTION_ATTR,
  DROP_ATTR,
  NODE_ATTR,
  NODE_ROOT_ATTR,
} from "@/lib/studio/dnd";
import { getComponentDef } from "@/lib/studio/registry";
import { useStudioStore } from "@/lib/studio/store";
import {
  baseNodeClasses,
  containerClasses,
  containerFlow,
  type ParentFlow,
  textStyleClasses,
} from "@/lib/studio/tailwind";
import type {
  ComponentNode,
  ContainerNode,
  StudioNode,
  TextNode,
} from "@/lib/studio/types";
import { cn } from "@/lib/utils";

import { useStudioDrag } from "./use-studio-drag";

/** Shared interaction state, resolved per node via narrow selectors. */
function useNodeInteraction(id: string) {
  const isSelected = useStudioStore((state) => state.selection.includes(id));
  const isHovered = useStudioStore(
    (state) => state.hoveredId === id && state.drag === null
  );
  const isDropParent = useStudioStore(
    (state) => state.drag?.target?.parentId === id
  );
  const isEditing = useStudioStore((state) => state.mode === "edit");
  return { isSelected, isHovered, isDropParent, isEditing };
}

function useNodeHandlers(node: StudioNode) {
  const { beginDrag } = useStudioDrag();
  const isEditing = useStudioStore((state) => state.mode === "edit");

  const onPointerDown = (event: React.PointerEvent) => {
    if (!isEditing) {
      return;
    }
    event.stopPropagation();
    const store = useStudioStore.getState();
    const { selection } = store;
    if (event.shiftKey) {
      store.toggleSelect(node.id);
      return;
    }
    const nextSelection = selection.includes(node.id) ? selection : [node.id];
    store.select(nextSelection);
    beginDrag(event, { type: "node", nodeIds: nextSelection });
  };

  const onPointerEnter = (event: React.PointerEvent) => {
    if (!isEditing) {
      return;
    }
    event.stopPropagation();
    useStudioStore.getState().setHovered(node.id);
  };

  const onPointerLeave = () => {
    if (!isEditing) {
      return;
    }
    const store = useStudioStore.getState();
    if (store.hoveredId === node.id) {
      store.setHovered(null);
    }
  };

  return { onPointerDown, onPointerEnter, onPointerLeave };
}

function SelectionChrome({
  isDropParent,
  isHovered,
  isSelected,
  label,
}: {
  isDropParent: boolean;
  isHovered: boolean;
  isSelected: boolean;
  label: string;
}) {
  if (!(isSelected || isHovered || isDropParent)) {
    return null;
  }
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-20 rounded-[3px] transition-[box-shadow,background-color] duration-100",
          isDropParent &&
            "bg-sky-500/[0.06] shadow-[inset_0_0_0_2px_theme(colors.sky.500)]",
          !isDropParent &&
            isSelected &&
            "shadow-[inset_0_0_0_2px_theme(colors.sky.500)]",
          !(isDropParent || isSelected) &&
            isHovered &&
            "shadow-[inset_0_0_0_1.5px_theme(colors.sky.400/60%)]"
        )}
      />
      {isSelected ? (
        <span className="pointer-events-none absolute -top-5 left-0 z-30 select-none whitespace-nowrap rounded-t-sm bg-sky-500 px-1.5 py-0.5 font-medium text-[10px] text-white leading-none">
          {label}
        </span>
      ) : null}
    </>
  );
}

const ContainerView = memo(function ContainerView({
  node,
  isRoot,
  parentFlow,
}: {
  node: ContainerNode;
  isRoot?: boolean;
  parentFlow: ParentFlow;
}) {
  const { isSelected, isHovered, isDropParent, isEditing } = useNodeInteraction(
    node.id
  );
  const handlers = useNodeHandlers(node);
  const isEmpty = node.children.length === 0;

  const label =
    node.name ??
    (node.layout.mode === "grid"
      ? "Grid"
      : `${node.layout.direction === "row" ? "Row" : "Column"} stack`);

  return (
    <div
      className={cn(
        containerClasses(node, parentFlow).join(" "),
        "relative",
        isEditing && isEmpty && "min-h-16",
        isEditing && !isRoot && "rounded-[3px]",
        // tw-merge would drop the style's min-h-screen in favor of this
        // canvas-only fallback, so skip it for full-height pages.
        isRoot && !node.style.fullHeight && "min-h-full"
      )}
      {...{
        [NODE_ATTR]: node.id,
        [NODE_ROOT_ATTR]: "",
        [DROP_ATTR]: "",
        [DIRECTION_ATTR]:
          node.layout.mode === "grid" ? "grid" : node.layout.direction,
      }}
      onPointerDown={
        isRoot
          ? (event) => {
              // Clicking the page background (incl. the gap between children)
              // returns to the Page panel so gap/padding stay reachable.
              if (event.target === event.currentTarget) {
                useStudioStore.getState().clearSelection();
              }
            }
          : handlers.onPointerDown
      }
      onPointerEnter={isRoot ? undefined : handlers.onPointerEnter}
      onPointerLeave={isRoot ? undefined : handlers.onPointerLeave}
    >
      {isEditing && isEmpty ? (
        <span className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center rounded-[3px] border border-border/70 border-dashed text-muted-foreground/60 text-xs">
          Drop components here
        </span>
      ) : null}
      {node.children.map((child) => (
        <CanvasNode
          key={child.id}
          node={child}
          parentFlow={containerFlow(node)}
        />
      ))}
      {isRoot ? null : (
        <SelectionChrome
          isDropParent={isDropParent}
          isHovered={isHovered}
          isSelected={isSelected}
          label={label}
        />
      )}
      {isRoot && isDropParent ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_0_2px_theme(colors.sky.500)]"
        />
      ) : null}
    </div>
  );
});

const TextView = memo(function TextView({
  node,
  parentFlow,
}: {
  node: TextNode;
  parentFlow: ParentFlow;
}) {
  const { isSelected, isHovered, isDropParent, isEditing } = useNodeInteraction(
    node.id
  );
  const handlers = useNodeHandlers(node);
  const Tag = node.tag;

  return (
    <div
      className={cn("relative", baseNodeClasses(node, parentFlow).join(" "))}
      {...{ [NODE_ATTR]: node.id, [NODE_ROOT_ATTR]: "" }}
      onPointerDown={handlers.onPointerDown}
      onPointerEnter={handlers.onPointerEnter}
      onPointerLeave={handlers.onPointerLeave}
    >
      <Tag
        className={cn(
          textStyleClasses(node).join(" "),
          isEditing && "cursor-default select-none"
        )}
      >
        {node.text || "Empty text"}
      </Tag>
      <SelectionChrome
        isDropParent={isDropParent}
        isHovered={isHovered}
        isSelected={isSelected}
        label={node.name ?? "Text"}
      />
    </div>
  );
});

const ComponentView = memo(function ComponentView({
  node,
  parentFlow,
}: {
  node: ComponentNode;
  parentFlow: ParentFlow;
}) {
  const { isSelected, isHovered, isDropParent, isEditing } = useNodeInteraction(
    node.id
  );
  const handlers = useNodeHandlers(node);
  const def = getComponentDef(node.component);

  if (!def) {
    return (
      <div className="rounded-md border border-red-300 border-dashed p-3 text-red-500 text-xs">
        Unknown component: {node.component}
      </div>
    );
  }

  const droppableChildren = def.acceptsChildren ? (
    <div
      className={cn(
        "relative flex min-w-0 flex-col gap-4",
        isEditing && "pointer-events-auto",
        isEditing && (node.children?.length ?? 0) === 0 && "min-h-12"
      )}
      {...{
        [NODE_ATTR]: node.id,
        [DROP_ATTR]: "",
        [DIRECTION_ATTR]: "column",
      }}
    >
      {isEditing && (node.children?.length ?? 0) === 0 ? (
        <span className="pointer-events-none absolute inset-0 flex select-none items-center justify-center rounded-[3px] border border-border/70 border-dashed text-muted-foreground/60 text-xs">
          Drop here
        </span>
      ) : null}
      {(node.children ?? []).map((child) => (
        <CanvasNode key={child.id} node={child} parentFlow="column" />
      ))}
    </div>
  ) : undefined;

  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col items-stretch",
        baseNodeClasses(node, parentFlow).join(" ")
      )}
      {...{ [NODE_ATTR]: node.id, [NODE_ROOT_ATTR]: "" }}
      onPointerDown={handlers.onPointerDown}
      onPointerEnter={handlers.onPointerEnter}
      onPointerLeave={handlers.onPointerLeave}
    >
      <div
        className={cn(
          "min-w-0",
          isEditing && !def.interactivePreview && "pointer-events-none"
        )}
      >
        {def.render(node.props, droppableChildren)}
      </div>
      <SelectionChrome
        isDropParent={isDropParent}
        isHovered={isHovered}
        isSelected={isSelected}
        label={node.name ?? def.label}
      />
    </div>
  );
});

export const CanvasNode = memo(function CanvasNode({
  node,
  isRoot,
  parentFlow = "column",
}: {
  node: StudioNode;
  isRoot?: boolean;
  parentFlow?: ParentFlow;
}) {
  if (node.hidden) {
    return null;
  }
  if (node.kind === "container") {
    return (
      <ContainerView isRoot={isRoot} node={node} parentFlow={parentFlow} />
    );
  }
  if (node.kind === "text") {
    return <TextView node={node} parentFlow={parentFlow} />;
  }
  return <ComponentView node={node} parentFlow={parentFlow} />;
});
