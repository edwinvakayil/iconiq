"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const hoverCardThemeClassName =
  "[--hc-surface:#ffffff] [--hc-foreground:#111111] [--hc-border:#e3e7ec] [--hc-ring:rgba(17,17,17,0.16)] dark:[--hc-surface:#111111] dark:[--hc-foreground:#f6f3ec] dark:[--hc-border:#2b2a25] dark:[--hc-ring:rgba(246,243,236,0.18)]";

const hoverCardPanelClassName =
  "relative z-50 w-72 transform-gpu rounded-lg border border-[color:var(--hc-border)] bg-[color:var(--hc-surface)] p-4 text-[color:var(--hc-foreground)] shadow-none outline-none";

const hoverCardTriggerClassName =
  "inline-flex min-h-9 cursor-pointer items-center rounded-md px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--hc-ring),transparent_40%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--hc-surface)]";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type CollisionPadding = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Positioner
>["collisionPadding"];

type HoverCardContextValue = {
  actionsRef: React.RefObject<PopoverPrimitive.Root.Actions | null>;
  open: boolean;
  contentId: string;
  triggerId: string;
  getTriggerNode: () => HTMLElement | null;
  setContentNode: (node: HTMLDivElement | null) => void;
  setTriggerNode: (node: HTMLElement | null) => void;
  handleFocusEnd: (event: React.FocusEvent<HTMLElement>) => void;
  handleFocusStart: () => void;
  handleHoverEnd: (event: React.PointerEvent<HTMLElement>) => void;
  handleHoverStart: (event: React.PointerEvent<HTMLElement>) => void;
};

type PopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

const HoverCardContext = React.createContext<HoverCardContextValue | null>(
  null
);

const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const HOVER_CARD_EXIT_EASE = [0.4, 0, 0.6, 1] as const;

const HOVER_CARD_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 30,
  mass: 0.72,
};

function getSideMotionOffset(side: Side) {
  switch (side) {
    case "top":
      return { x: 0, y: 4 };
    case "right":
      return { x: -4, y: 0 };
    case "left":
      return { x: 4, y: 0 };
    default:
      return { x: 0, y: -4 };
  }
}

function getHoverCardMotion(side: Side) {
  const offset = getSideMotionOffset(side);

  return {
    animate: { opacity: 1, scale: 1, x: 0, y: 0 },
    closed: { opacity: 0, scale: 0.988, ...offset },
    initial: { opacity: 0, scale: 0.988, ...offset },
    openTransition: {
      opacity: { duration: 0.26, ease: FLUID_EASE },
      scale: HOVER_CARD_SPRING,
      x: HOVER_CARD_SPRING,
      y: HOVER_CARD_SPRING,
    },
    closedTransition: {
      opacity: { duration: 0.16, ease: HOVER_CARD_EXIT_EASE },
      scale: { duration: 0.16, ease: HOVER_CARD_EXIT_EASE },
      x: { duration: 0.16, ease: HOVER_CARD_EXIT_EASE },
      y: { duration: 0.16, ease: HOVER_CARD_EXIT_EASE },
    },
  };
}

const hoverBridgeStyles: Record<Side, string> = {
  top: "before:pointer-events-auto before:absolute before:right-0 before:bottom-[calc(var(--hover-card-bridge-size)*-1)] before:left-0 before:h-[var(--hover-card-bridge-size)] before:bg-transparent before:content-['']",
  right:
    "before:pointer-events-auto before:absolute before:top-0 before:bottom-0 before:left-[calc(var(--hover-card-bridge-size)*-1)] before:w-[var(--hover-card-bridge-size)] before:bg-transparent before:content-['']",
  bottom:
    "before:pointer-events-auto before:absolute before:top-[calc(var(--hover-card-bridge-size)*-1)] before:right-0 before:left-0 before:h-[var(--hover-card-bridge-size)] before:bg-transparent before:content-['']",
  left: "before:pointer-events-auto before:absolute before:top-0 before:right-[calc(var(--hover-card-bridge-size)*-1)] before:bottom-0 before:w-[var(--hover-card-bridge-size)] before:bg-transparent before:content-['']",
};

const assignRef = <T,>(ref: React.ForwardedRef<T>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
};

const getElementRef = <T,>(element: React.ReactElement) =>
  (
    element as React.ReactElement & {
      ref?: React.Ref<T>;
      props: { ref?: React.Ref<T> };
    }
  ).ref ??
  (
    element as React.ReactElement & {
      ref?: React.Ref<T>;
      props: { ref?: React.Ref<T> };
    }
  ).props.ref;

const composeRefs =
  <T,>(...refs: Array<React.Ref<T> | undefined>) =>
  (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
        continue;
      }

      if (ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };

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

const useHoverCard = () => {
  const context = React.useContext(HoverCardContext);

  if (!context) {
    throw new Error("HoverCard components must be used inside HoverCard");
  }

  return context;
};

type HoverCardProps = {
  className?: string;
  openDelay?: number;
  closeDelay?: number;
  children?: React.ReactNode;
};

const HoverCard = ({
  className,
  openDelay = 80,
  closeDelay = 120,
  children,
}: HoverCardProps) => {
  const actionsRef = React.useRef<PopoverPrimitive.Root.Actions | null>(null);
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const reactId = React.useId();

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const containsInteractiveNode = React.useCallback((node: Node | null) => {
    return Boolean(
      node &&
        (triggerRef.current?.contains(node) ||
          contentRef.current?.contains(node))
    );
  }, []);

  const hasFocusWithin = React.useCallback(() => {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof Node && containsInteractiveNode(activeElement)
    );
  }, [containsInteractiveNode]);

  const scheduleOpen = React.useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => setOpen(true), openDelay);
  }, [clearTimer, openDelay]);

  const scheduleClose = React.useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => setOpen(false), closeDelay);
  }, [clearTimer, closeDelay]);

  const handleHoverStart = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;

      if (open) {
        clearTimer();
        return;
      }

      scheduleOpen();
    },
    [clearTimer, open, scheduleOpen]
  );

  const handleHoverEnd = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;

      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && containsInteractiveNode(nextTarget)) {
        return;
      }

      if (hasFocusWithin()) return;

      scheduleClose();
    },
    [containsInteractiveNode, hasFocusWithin, scheduleClose]
  );

  const handleFocusStart = React.useCallback(() => {
    clearTimer();
    setOpen(true);
  }, [clearTimer]);

  const handleFocusEnd = React.useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && containsInteractiveNode(nextTarget)) {
        return;
      }

      clearTimer();
      setOpen(false);
    },
    [clearTimer, containsInteractiveNode]
  );

  React.useEffect(() => clearTimer, [clearTimer]);

  return (
    <HoverCardContext.Provider
      value={{
        actionsRef,
        open,
        contentId: `${reactId}-content`,
        triggerId: `${reactId}-trigger`,
        getTriggerNode: () => triggerRef.current,
        setContentNode: (node) => {
          contentRef.current = node;
        },
        setTriggerNode: (node) => {
          triggerRef.current = node;
        },
        handleFocusEnd,
        handleFocusStart,
        handleHoverEnd,
        handleHoverStart,
      }}
    >
      <PopoverPrimitive.Root
        actionsRef={actionsRef}
        modal={false}
        onOpenChange={(nextOpen, eventDetails) => {
          clearTimer();

          if (!eventDetails.isCanceled) {
            setOpen(nextOpen);
          }
        }}
        open={open}
      >
        <span
          className={cn(
            hoverCardThemeClassName,
            "inline-flex w-fit",
            className
          )}
        >
          {children}
        </span>
      </PopoverPrimitive.Root>
    </HoverCardContext.Provider>
  );
};

type HoverCardTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

type HoverCardTriggerElementProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
  "data-state"?: "closed" | "open";
};

type HoverCardTriggerChildElement = React.ReactElement<
  HoverCardTriggerElementProps & React.RefAttributes<HTMLElement>
>;

const HoverCardTrigger = React.forwardRef<
  HTMLButtonElement,
  HoverCardTriggerProps
>(
  (
    {
      asChild,
      children,
      className,
      onBlur,
      onFocus,
      onPointerEnter,
      onPointerLeave,
      type,
      ...props
    },
    ref
  ) => {
    const {
      open,
      contentId,
      triggerId,
      setTriggerNode,
      handleFocusEnd,
      handleFocusStart,
      handleHoverEnd,
      handleHoverStart,
    } = useHoverCard();
    const triggerClassName = cn(
      asChild
        ? "inline-flex cursor-pointer items-center focus-visible:outline-none"
        : hoverCardTriggerClassName,
      className
    );

    const handleBlurEvent = (event: React.FocusEvent<HTMLElement>) => {
      onBlur?.(event as React.FocusEvent<HTMLButtonElement>);

      if (event.defaultPrevented) {
        return;
      }

      handleFocusEnd(event);
    };

    const handleFocusEvent = (event: React.FocusEvent<HTMLElement>) => {
      onFocus?.(event as React.FocusEvent<HTMLButtonElement>);

      if (event.defaultPrevented) {
        return;
      }

      handleFocusStart();
    };

    const handlePointerEnterEvent = (
      event: React.PointerEvent<HTMLElement>
    ) => {
      onPointerEnter?.(event as React.PointerEvent<HTMLButtonElement>);

      if (event.defaultPrevented) {
        return;
      }

      handleHoverStart(event);
    };

    const handlePointerLeaveEvent = (
      event: React.PointerEvent<HTMLElement>
    ) => {
      onPointerLeave?.(event as React.PointerEvent<HTMLButtonElement>);

      if (event.defaultPrevented) {
        return;
      }

      handleHoverEnd(event);
    };

    if (asChild) {
      if (!React.isValidElement<HoverCardTriggerElementProps>(children)) {
        throw new Error(
          "HoverCardTrigger with asChild expects a single React element child."
        );
      }

      const child = React.Children.only(
        children
      ) as HoverCardTriggerChildElement;
      const childRef = getElementRef<HTMLElement>(child);

      return React.cloneElement(child, {
        ...props,
        "aria-controls": contentId,
        "aria-expanded": open,
        "aria-haspopup": "dialog",
        className: cn(triggerClassName, child.props.className),
        "data-state": open ? "open" : "closed",
        id: triggerId,
        onBlur: (event: React.FocusEvent<HTMLElement>) => {
          child.props.onBlur?.(event);
          handleBlurEvent(event);
        },
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          child.props.onFocus?.(event);
          handleFocusEvent(event);
        },
        onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
          child.props.onPointerEnter?.(event);
          handlePointerEnterEvent(event);
        },
        onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
          child.props.onPointerLeave?.(event);
          handlePointerLeaveEvent(event);
        },
        ref: composeRefs<HTMLElement>(
          childRef,
          (node) => {
            setTriggerNode(node);
          },
          ref as React.Ref<HTMLElement>
        ),
      } as HoverCardTriggerElementProps & React.RefAttributes<HTMLElement>);
    }

    return (
      <button
        aria-controls={contentId}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={triggerClassName}
        data-state={open ? "open" : "closed"}
        id={triggerId}
        onBlur={handleBlurEvent}
        onFocus={handleFocusEvent}
        onPointerEnter={handlePointerEnterEvent}
        onPointerLeave={handlePointerLeaveEvent}
        ref={(node) => {
          setTriggerNode(node);
          assignRef(ref, node);
        }}
        type={type ?? "button"}
        {...props}
      >
        {children}
      </button>
    );
  }
);
HoverCardTrigger.displayName = "HoverCardTrigger";

type HoverCardContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.div>,
  "initial" | "animate" | "exit" | "transition"
> & {
  align?: Align;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: CollisionPadding;
  side?: Side;
  sideOffset?: number;
};

const HoverCardContentBody = React.forwardRef<
  HTMLDivElement,
  HoverCardContentProps
>(
  (
    {
      className,
      children,
      onAnimationComplete,
      style,
      onBlur,
      onFocus,
      onPointerEnter,
      onPointerLeave,
      align = "center",
      alignOffset = 0,
      avoidCollisions = true,
      collisionPadding = 12,
      side = "bottom",
      sideOffset = 12,
      ...props
    },
    ref
  ) => {
    const {
      actionsRef,
      contentId,
      triggerId,
      open,
      getTriggerNode,
      setContentNode,
      handleFocusEnd,
      handleFocusStart,
      handleHoverEnd,
      handleHoverStart,
    } = useHoverCard();

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          anchor={getTriggerNode()}
          className="z-50 outline-none"
          collisionAvoidance={
            avoidCollisions
              ? undefined
              : { side: "none", align: "none", fallbackAxisSide: "none" }
          }
          collisionPadding={collisionPadding}
          side={side}
          sideOffset={sideOffset}
        >
          <PopoverPrimitive.Popup
            finalFocus={false}
            initialFocus={false}
            render={(popupProps, popupState) => {
              const {
                popupClassName,
                popupRef,
                popupStyle,
                resolvedPopupProps,
              } = resolvePopupProps(popupProps);
              const resolvedSide = (popupState.side as Side) ?? side;
              const cardMotion = getHoverCardMotion(resolvedSide);

              return (
                <div
                  {...resolvedPopupProps}
                  aria-labelledby={triggerId}
                  id={contentId}
                  onBlur={(event) => {
                    onBlur?.(event);

                    if (event.defaultPrevented) {
                      return;
                    }

                    handleFocusEnd(event);
                  }}
                  onFocus={(event) => {
                    onFocus?.(event);

                    if (event.defaultPrevented) {
                      return;
                    }

                    handleFocusStart();
                  }}
                  onPointerEnter={(event) => {
                    onPointerEnter?.(event);

                    if (event.defaultPrevented) {
                      return;
                    }

                    handleHoverStart(event);
                  }}
                  onPointerLeave={(event) => {
                    onPointerLeave?.(event);

                    if (event.defaultPrevented) {
                      return;
                    }

                    handleHoverEnd(event);
                  }}
                  ref={(node: HTMLDivElement | null) => {
                    setRef(popupRef, node);
                    assignRef(ref, node);
                  }}
                  role="presentation"
                  style={
                    {
                      "--hover-card-bridge-size": `${sideOffset}px`,
                      transformOrigin: "var(--transform-origin)",
                      ...popupStyle,
                      ...style,
                    } as React.CSSProperties
                  }
                >
                  <motion.div
                    {...props}
                    animate={open ? cardMotion.animate : cardMotion.closed}
                    className={cn(
                      hoverCardThemeClassName,
                      hoverCardPanelClassName,
                      hoverBridgeStyles[resolvedSide],
                      "transform-gpu",
                      popupClassName,
                      className
                    )}
                    data-side={resolvedSide}
                    data-state={open ? "open" : "closed"}
                    initial={
                      popupState.transitionStatus === "starting"
                        ? cardMotion.initial
                        : false
                    }
                    onAnimationComplete={(definition) => {
                      onAnimationComplete?.(definition);

                      if (!open) {
                        actionsRef.current?.unmount();
                      }
                    }}
                    ref={(node: HTMLDivElement | null) => {
                      setContentNode(node);
                    }}
                    style={{
                      pointerEvents: open ? undefined : "none",
                      transformOrigin: "var(--transform-origin)",
                    }}
                    transition={
                      open
                        ? cardMotion.openTransition
                        : cardMotion.closedTransition
                    }
                  >
                    {children}
                  </motion.div>
                </div>
              );
            }}
          />
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    );
  }
);
HoverCardContentBody.displayName = "HoverCardContentBody";

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  HoverCardContentProps
>((props, ref) => {
  const { open } = useHoverCard();
  const [present, setPresent] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setPresent(true);
    }
  }, [open]);

  if (!present) {
    return null;
  }

  return (
    <HoverCardContentBody
      {...props}
      onAnimationComplete={(definition) => {
        props.onAnimationComplete?.(definition);

        if (!open) {
          setPresent(false);
        }
      }}
      ref={ref}
    />
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
