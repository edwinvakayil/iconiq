"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

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

const initialOffset: Record<Side, { x: number; y: number }> = {
  top: { x: 0, y: 10 },
  right: { x: -10, y: 0 },
  bottom: { x: 0, y: -10 },
  left: { x: 10, y: 0 },
};

const PANEL_SPRING = {
  type: "spring",
  stiffness: 240,
  damping: 22,
  mass: 0.78,
} as const;

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
} & ReducedMotionProp;

const Popover = ({
  children,
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  reducedMotion,
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
    <ReducedMotionConfig reducedMotion={reducedMotion}>
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
    </ReducedMotionConfig>
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
          componentThemeClassName,
          "inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

type PopoverContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.div>,
  "animate" | "exit" | "initial" | "transition"
> & {
  align?: Align;
  avoidCollisions?: boolean;
  collisionPadding?: CollisionPadding;
  open?: boolean;
  side?: Side;
  sideOffset?: number;
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
      ...props
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

              return (
                <motion.div
                  {...resolvedPopupProps}
                  {...props}
                  animate={
                    open
                      ? {
                          opacity: 1,
                          scale: 1,
                          x: 0,
                          y: 0,
                          filter: "blur(0px)",
                        }
                      : {
                          opacity: 0,
                          scale: 0.985,
                          filter: "blur(4px)",
                          ...initialOffset[resolvedSide],
                          transition: { duration: 0.2, ease: "easeIn" },
                        }
                  }
                  aria-labelledby={triggerId}
                  className={cn(
                    componentThemeClassName,
                    "z-50 w-72 transform-gpu rounded-lg border border-border bg-white p-4 text-foreground shadow-lg outline-none will-change-[transform,opacity,filter] dark:bg-black",
                    popupClassName,
                    className
                  )}
                  data-side={resolvedSide}
                  id={contentId}
                  initial={{
                    opacity: 0,
                    scale: 0.955,
                    filter: "blur(8px)",
                    ...initialOffset[resolvedSide],
                  }}
                  layout="size"
                  onAnimationComplete={(definition) => {
                    onAnimationComplete?.(definition);

                    if (!open) {
                      actionsRef.current?.unmount();
                    }
                  }}
                  ref={(node) => {
                    setRef(popupRef, node);
                    assignRef(ref, node);
                  }}
                  style={{
                    transformOrigin: "var(--transform-origin)",
                    ...popupStyle,
                    ...style,
                  }}
                  transition={PANEL_SPRING}
                >
                  {children}
                </motion.div>
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
