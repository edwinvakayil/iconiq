"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const tooltipThemeClassName =
  "[--tt-surface:#111111] [--tt-foreground:#ffffff] dark:[--tt-surface:#f6f3ec] dark:[--tt-foreground:#111111]";

const tooltipContentClassName =
  "group/tooltip pointer-events-none relative z-50 max-w-60 whitespace-normal rounded-lg bg-[color:var(--tt-surface)] px-3 py-1.5 font-medium text-[color:var(--tt-foreground)] text-xs leading-snug shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]";

const tooltipArrowClassName =
  "absolute h-2 w-2 rotate-45 bg-[color:var(--tt-surface)] group-data-[side=bottom]/tooltip:-top-1 group-data-[side=left]/tooltip:top-1/2 group-data-[side=right]/tooltip:top-1/2 group-data-[side=left]/tooltip:-right-1 group-data-[side=top]/tooltip:-bottom-1 group-data-[side=bottom]/tooltip:left-1/2 group-data-[side=right]/tooltip:-left-1 group-data-[side=top]/tooltip:left-1/2 group-data-[side=bottom]/tooltip:-translate-x-1/2 group-data-[side=top]/tooltip:-translate-x-1/2 group-data-[side=left]/tooltip:-translate-y-1/2 group-data-[side=right]/tooltip:-translate-y-1/2";

type Side = "top" | "bottom" | "left" | "right";
type TooltipTriggerElement = React.ReactElement<{
  "aria-describedby"?: string;
}>;

type PopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

export interface TooltipProps {
  children: TooltipTriggerElement;
  content: string;
  side?: Side;
  delay?: number;
  className?: string;
}

const MAX_TOOLTIP_CHARACTERS = 80;

function isTooltipTriggerElement(
  node: React.ReactNode
): node is TooltipTriggerElement {
  return React.isValidElement(node) && node.type !== React.Fragment;
}

function mergeDescribedBy(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(" ");

  return merged.length > 0 ? merged : undefined;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function resolvePopupProps(popupProps: PopupRenderProps) {
  const {
    children: _popupChildren,
    className: popupClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: popupRef,
    style: popupStyle,
    ...resolvedPopupProps
  } = popupProps;

  return {
    popupClassName,
    popupRef,
    popupStyle,
    resolvedPopupProps,
  };
}

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 0.15,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [present, setPresent] = React.useState(false);
  const actionsRef = React.useRef<TooltipPrimitive.Root.Actions | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipId = React.useId();
  const triggerId = React.useId();
  const normalizedContent = content.trim();

  if (!isTooltipTriggerElement(children)) {
    throw new Error(
      "Tooltip expects a single element child so it can forward hover, focus, and accessibility props."
    );
  }

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      (normalizedContent.length > MAX_TOOLTIP_CHARACTERS ||
        normalizedContent.includes("\n"))
    ) {
      console.warn(
        "Tooltip content should stay short, single-line, and non-interactive. Use Popover for longer or multiline content."
      );
    }
  }, [normalizedContent]);

  const childAriaDescribedBy = children.props["aria-describedby"];
  const triggerDescription = open
    ? mergeDescribedBy(childAriaDescribedBy, tooltipId)
    : childAriaDescribedBy;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      clearTimeout(timeoutRef.current);

      if (nextOpen) {
        if (open) {
          return;
        }

        timeoutRef.current = setTimeout(() => {
          setPresent(true);
          setOpen(true);
        }, delay * 1000);
        return;
      }

      setOpen(false);
    },
    [delay, open]
  );

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (normalizedContent.length === 0) {
    return children;
  }

  return (
    <TooltipPrimitive.Root
      actionsRef={actionsRef}
      disableHoverablePopup
      onOpenChange={(nextOpen) => {
        handleOpenChange(nextOpen);
      }}
      open={open}
      triggerId={triggerId}
    >
      <TooltipPrimitive.Trigger
        closeDelay={0}
        delay={0}
        id={triggerId}
        render={React.cloneElement(children, {
          "aria-describedby": triggerDescription,
        })}
      />

      {present ? (
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner
            align="center"
            className="z-50 outline-none"
            collisionPadding={12}
            side={side}
            sideOffset={10}
          >
            <TooltipPrimitive.Popup
              render={(popupProps, popupState) => {
                const {
                  popupClassName,
                  popupRef,
                  popupStyle,
                  resolvedPopupProps,
                } = resolvePopupProps(popupProps as PopupRenderProps);
                const resolvedSide = (popupState.side as Side) ?? side;

                return (
                  <motion.div
                    {...resolvedPopupProps}
                    animate={
                      open
                        ? {
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                          }
                        : {
                            opacity: 0,
                            scale: 0.92,
                            filter: "blur(4px)",
                          }
                    }
                    className={cn(
                      tooltipThemeClassName,
                      tooltipContentClassName,
                      popupClassName,
                      className
                    )}
                    data-side={resolvedSide}
                    id={tooltipId}
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                      filter: "blur(4px)",
                    }}
                    onAnimationComplete={() => {
                      if (!open) {
                        actionsRef.current?.unmount();
                        setPresent(false);
                      }
                    }}
                    ref={(node: HTMLDivElement | null) => {
                      setRef(popupRef, node);
                    }}
                    role="tooltip"
                    style={
                      {
                        transformOrigin: "var(--transform-origin)",
                        ...popupStyle,
                      } as React.CSSProperties
                    }
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 24,
                      mass: 0.6,
                    }}
                  >
                    <motion.span
                      animate={{ scale: 1 }}
                      className={tooltipArrowClassName}
                      exit={{ scale: 0 }}
                      initial={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 28,
                        delay: 0.03,
                      }}
                    />
                    {normalizedContent}
                  </motion.div>
                );
              }}
            />
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      ) : null}
    </TooltipPrimitive.Root>
  );
}

export { Tooltip as tooltip };
