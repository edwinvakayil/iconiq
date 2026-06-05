"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const popoverThemeClassName =
  "[--po-surface:#ffffff] [--po-foreground:#111111] [--po-border:#e3e7ec] [--po-ring:rgba(17,17,17,0.16)] dark:[--po-surface:#111111] dark:[--po-foreground:#f6f3ec] dark:[--po-border:#2b2a25] dark:[--po-ring:rgba(246,243,236,0.18)]";

const popoverPanelClassName =
  "z-50 w-72 transform-gpu rounded-lg border border-[color:var(--po-border)] bg-[color:var(--po-surface)] p-4 text-[color:var(--po-foreground)] shadow-none outline-none";

const popoverTriggerClassName =
  "inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--po-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--po-surface)]";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type CollisionPadding = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Positioner
>["collisionPadding"];

type PopoverContextValue = {
  actionsRef: React.RefObject<PopoverPrimitive.Root.Actions | null>;
  open: boolean;
  contentId: string;
  triggerId: string;
  getAnchorNode: () => HTMLElement | null;
  setAnchorNode: (node: HTMLElement | null) => void;
  setTriggerNode: (node: HTMLElement | null) => void;
};

type PopoverTriggerElementProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
};

type PopoverTriggerChildElement = React.ReactElement<
  PopoverTriggerElementProps & React.RefAttributes<HTMLElement>
>;

type PopoverAnchorElementProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
};

type PopoverAnchorChildElement = React.ReactElement<
  PopoverAnchorElementProps & React.RefAttributes<HTMLElement>
>;

type PopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const POPOVER_EXIT_EASE = [0.4, 0, 0.6, 1] as const;

const POPOVER_SPRING = {
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

function getPopoverMotion(side: Side) {
  const offset = getSideMotionOffset(side);

  return {
    animate: { opacity: 1, scale: 1, x: 0, y: 0 },
    closed: { opacity: 0, scale: 0.988, ...offset },
    initial: { opacity: 0, scale: 0.988, ...offset },
    openTransition: {
      opacity: { duration: 0.26, ease: FLUID_EASE },
      scale: POPOVER_SPRING,
      x: POPOVER_SPRING,
      y: POPOVER_SPRING,
    },
    closedTransition: {
      opacity: { duration: 0.16, ease: POPOVER_EXIT_EASE },
      scale: { duration: 0.16, ease: POPOVER_EXIT_EASE },
      x: { duration: 0.16, ease: POPOVER_EXIT_EASE },
      y: { duration: 0.16, ease: POPOVER_EXIT_EASE },
    },
  };
}

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

const usePopover = () => {
  const context = React.useContext(PopoverContext);

  if (!context) {
    throw new Error("Popover components must be used inside Popover");
  }

  return context;
};

type BasePopoverRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>,
  "children" | "defaultOpen" | "onOpenChange" | "open"
>;

type PopoverProps = BasePopoverRootProps & {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

const Popover = ({
  children,
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  ...props
}: PopoverProps) => {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const actionsRef = React.useRef<PopoverPrimitive.Root.Actions | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const reactId = React.useId();

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <PopoverContext.Provider
      value={{
        actionsRef,
        open,
        contentId: `${reactId}-content`,
        triggerId: `${reactId}-trigger`,
        getAnchorNode: () => anchorRef.current ?? triggerRef.current,
        setAnchorNode: (node) => {
          anchorRef.current = node;
        },
        setTriggerNode: (node) => {
          triggerRef.current = node;
        },
      }}
    >
      <PopoverPrimitive.Root
        {...props}
        actionsRef={actionsRef}
        onOpenChange={(nextOpen) => {
          handleOpenChange(nextOpen);
        }}
        open={open}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopoverContext.Provider>
  );
};
Popover.displayName = "Popover";

type PopoverTriggerProps = Omit<
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
  "children" | "className" | "id" | "render"
> & {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
};

const PopoverTrigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(
  ({ asChild, children, className, nativeButton, ...props }, ref) => {
    const { triggerId, setTriggerNode } = usePopover();

    if (asChild) {
      if (!React.isValidElement<PopoverTriggerElementProps>(children)) {
        throw new Error(
          "PopoverTrigger with asChild expects a single React element child."
        );
      }

      const child = React.Children.only(children) as PopoverTriggerChildElement;
      const childNativeButton =
        typeof child.type === "string" ? child.type === "button" : false;

      return (
        <PopoverPrimitive.Trigger
          {...props}
          className={className}
          id={triggerId}
          nativeButton={nativeButton ?? childNativeButton}
          ref={(node: HTMLElement | null) => {
            setTriggerNode(node);
            assignRef(ref, node);
          }}
          render={
            className
              ? React.cloneElement(child, {
                  className: cn(className, child.props.className),
                })
              : child
          }
        />
      );
    }

    return (
      <PopoverPrimitive.Trigger
        {...props}
        className={cn(
          popoverThemeClassName,
          popoverTriggerClassName,
          className
        )}
        id={triggerId}
        nativeButton={nativeButton}
        ref={(node: HTMLElement | null) => {
          setTriggerNode(node);
          assignRef(ref, node);
        }}
      >
        {children}
      </PopoverPrimitive.Trigger>
    );
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

type PopoverAnchorProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

const PopoverAnchor = React.forwardRef<HTMLElement, PopoverAnchorProps>(
  ({ asChild, children, ...props }, ref) => {
    const { setAnchorNode } = usePopover();

    if (asChild) {
      if (!React.isValidElement<PopoverAnchorElementProps>(children)) {
        throw new Error(
          "PopoverAnchor with asChild expects a single React element child."
        );
      }

      const child = React.Children.only(children) as PopoverAnchorChildElement;
      const childRef = getElementRef<HTMLElement>(child);

      return React.cloneElement(child, {
        ...props,
        ref: composeRefs<HTMLElement>(
          childRef,
          (node: HTMLElement | null) => {
            setAnchorNode(node);
          },
          ref
        ),
      } as PopoverAnchorElementProps & React.RefAttributes<HTMLElement>);
    }

    return (
      <div
        {...props}
        ref={(node: HTMLDivElement | null) => {
          setAnchorNode(node);
          assignRef(ref, node);
        }}
      >
        {children}
      </div>
    );
  }
);
PopoverAnchor.displayName = "PopoverAnchor";

type PopoverContentProps = {
  align?: Align;
  avoidCollisions?: boolean;
  children?: React.ReactNode;
  className?: string;
  collisionPadding?: CollisionPadding;
  onAnimationComplete?: (definition: unknown) => void;
  open?: boolean;
  side?: Side;
  sideOffset?: number;
  style?: React.CSSProperties;
};

const PopoverContentBody = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(
  (
    {
      align = "center",
      avoidCollisions = true,
      children,
      className,
      collisionPadding = 12,
      onAnimationComplete,
      side = "bottom",
      sideOffset = 8,
      style,
    },
    ref
  ) => {
    const { actionsRef, contentId, triggerId, open, getAnchorNode } =
      usePopover();

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          align={align}
          anchor={getAnchorNode()}
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
              } = resolvePopupProps(popupProps as PopupRenderProps);
              const resolvedSide = (popupState.side as Side) ?? side;
              const popoverMotion = getPopoverMotion(resolvedSide);

              return (
                <div
                  {...resolvedPopupProps}
                  aria-labelledby={triggerId}
                  id={contentId}
                  ref={(node) => {
                    setRef(popupRef, node);
                    assignRef(ref, node);
                  }}
                  role="presentation"
                  style={{
                    transformOrigin: "var(--transform-origin)",
                    ...popupStyle,
                  }}
                >
                  <motion.div
                    animate={
                      open ? popoverMotion.animate : popoverMotion.closed
                    }
                    className={cn(
                      popoverThemeClassName,
                      popoverPanelClassName,
                      popupClassName,
                      className
                    )}
                    data-side={resolvedSide}
                    data-state={open ? "open" : "closed"}
                    initial={
                      popupState.transitionStatus === "starting"
                        ? popoverMotion.initial
                        : false
                    }
                    layout="size"
                    onAnimationComplete={(definition) => {
                      onAnimationComplete?.(definition);

                      if (!open) {
                        actionsRef.current?.unmount();
                      }
                    }}
                    style={{
                      pointerEvents: open ? undefined : "none",
                      transformOrigin: "var(--transform-origin)",
                      ...style,
                    }}
                    transition={
                      open
                        ? popoverMotion.openTransition
                        : popoverMotion.closedTransition
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
PopoverContentBody.displayName = "PopoverContentBody";

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ open: _open, ...props }, ref) => {
    const { open } = usePopover();
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
      <PopoverContentBody
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
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
