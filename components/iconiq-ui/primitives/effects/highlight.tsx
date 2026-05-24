"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type HighlightMode = "children" | "parent";

type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type HighlightContextType<T extends string> = {
  mode: HighlightMode;
  activeValue: T | null;
  setActiveValue: (value: T | null) => void;
  setBounds: (bounds: DOMRect) => void;
  clearBounds: () => void;
  id: string;
  hover: boolean;
  className?: string;
  activeClassName?: string;
  setActiveClassName: (className: string) => void;
  transition?: Transition;
  disabled?: boolean;
  enabled?: boolean;
  exitDelay?: number;
  forceUpdateBounds?: boolean;
};

const HighlightContext = React.createContext<
  HighlightContextType<string> | undefined
>(undefined);

function useHighlight<T extends string>(): HighlightContextType<T> {
  const context = React.useContext(HighlightContext);
  if (!context) {
    throw new Error("useHighlight must be used within a HighlightProvider");
  }
  return context as unknown as HighlightContextType<T>;
}

type BaseHighlightProps<T extends string> = {
  mode?: HighlightMode;
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
  className?: string;
  transition?: Transition;
  hover?: boolean;
  disabled?: boolean;
  enabled?: boolean;
  exitDelay?: number;
};

type ParentModeHighlightProps = {
  boundsOffset?: Partial<Bounds>;
  containerClassName?: string;
  forceUpdateBounds?: boolean;
};

type ControlledParentModeHighlightProps<T extends string> =
  BaseHighlightProps<T> &
    ParentModeHighlightProps & {
      mode: "parent";
      controlledItems: true;
      children: React.ReactNode;
    };

type ControlledChildrenModeHighlightProps<T extends string> =
  BaseHighlightProps<T> & {
    mode?: "children" | undefined;
    controlledItems: true;
    children: React.ReactNode;
  };

type UncontrolledParentModeHighlightProps<T extends string> =
  BaseHighlightProps<T> &
    ParentModeHighlightProps & {
      mode: "parent";
      controlledItems?: false;
      itemsClassName?: string;
      children: React.ReactElement | React.ReactElement[];
    };

type UncontrolledChildrenModeHighlightProps<T extends string> =
  BaseHighlightProps<T> & {
    mode?: "children";
    controlledItems?: false;
    itemsClassName?: string;
    children: React.ReactElement | React.ReactElement[];
  };

type HighlightProps<T extends string> = React.ComponentProps<"div"> &
  (
    | ControlledParentModeHighlightProps<T>
    | ControlledChildrenModeHighlightProps<T>
    | UncontrolledParentModeHighlightProps<T>
    | UncontrolledChildrenModeHighlightProps<T>
  );

function Highlight<T extends string>({ ref, ...props }: HighlightProps<T>) {
  const {
    children,
    value,
    defaultValue,
    onValueChange,
    className,
    transition = { type: "spring", stiffness: 350, damping: 35 },
    hover = false,
    enabled = true,
    controlledItems,
    disabled = false,
    exitDelay = 0.2,
    mode = "children",
  } = props;
  const {
    boundsOffset = { top: 0, left: 0, width: 0, height: 0 },
    containerClassName,
    forceUpdateBounds,
  } = props as ParentModeHighlightProps;
  const { itemsClassName } = props as {
    itemsClassName?: string;
  };

  const localRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  const [activeValue, setActiveValue] = React.useState<T | null>(
    value ?? defaultValue ?? null
  );
  const [boundsState, setBoundsState] = React.useState<Bounds | null>(null);
  const [activeClassNameState, setActiveClassNameState] =
    React.useState<string>("");

  function safeSetActiveValue(id: T | null) {
    setActiveValue((prev) => {
      if (prev !== id) onValueChange?.(id);
      return prev === id ? prev : id;
    });
  }

  function safeSetBounds(bounds: DOMRect) {
    if (!localRef.current) return;

    const containerRect = localRef.current.getBoundingClientRect();
    const newBounds: Bounds = {
      top: bounds.top - containerRect.top + (boundsOffset.top ?? 0),
      left: bounds.left - containerRect.left + (boundsOffset.left ?? 0),
      width: bounds.width + (boundsOffset.width ?? 0),
      height: bounds.height + (boundsOffset.height ?? 0),
    };

    setBoundsState((prev) => {
      if (
        prev &&
        prev.top === newBounds.top &&
        prev.left === newBounds.left &&
        prev.width === newBounds.width &&
        prev.height === newBounds.height
      ) {
        return prev;
      }
      return newBounds;
    });
  }

  function clearBounds() {
    setBoundsState((prev) => (prev === null ? prev : null));
  }

  React.useEffect(() => {
    if (value !== undefined) setActiveValue(value);
    else if (defaultValue !== undefined) setActiveValue(defaultValue);
  }, [value, defaultValue]);

  const id = React.useId();

  React.useEffect(() => {
    if (mode !== "parent") return;
    const container = localRef.current;
    if (!container) return;

    const onScroll = () => {
      if (!activeValue) return;
      const activeEl = container.querySelector<HTMLElement>(
        `[data-value="${activeValue}"][data-highlight="true"]`
      );
      if (activeEl) safeSetBounds(activeEl.getBoundingClientRect());
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  });

  function render(children: React.ReactNode) {
    if (mode === "parent") {
      return (
        <div
          className={cn("relative", containerClassName)}
          data-slot="motion-highlight-container"
          ref={localRef}
        >
          <AnimatePresence initial={false}>
            {boundsState && (
              <motion.div
                animate={{
                  top: boundsState.top,
                  left: boundsState.left,
                  width: boundsState.width,
                  height: boundsState.height,
                  opacity: 1,
                }}
                className={cn(
                  "absolute z-0 bg-muted",
                  className,
                  activeClassNameState
                )}
                data-slot="motion-highlight"
                exit={{
                  opacity: 0,
                  transition: {
                    ...transition,
                    delay: (transition?.delay ?? 0) + (exitDelay ?? 0),
                  },
                }}
                initial={{
                  top: boundsState.top,
                  left: boundsState.left,
                  width: boundsState.width,
                  height: boundsState.height,
                  opacity: 0,
                }}
                transition={transition}
              />
            )}
          </AnimatePresence>
          {children}
        </div>
      );
    }

    return children;
  }

  return (
    <HighlightContext.Provider
      value={{
        mode,
        activeValue: activeValue as string | null,
        setActiveValue: safeSetActiveValue as (value: string | null) => void,
        id,
        hover,
        className,
        transition,
        disabled,
        enabled,
        exitDelay,
        setBounds: safeSetBounds,
        clearBounds,
        activeClassName: activeClassNameState,
        setActiveClassName: setActiveClassNameState,
        forceUpdateBounds,
      }}
    >
      {enabled
        ? controlledItems
          ? render(children)
          : render(
              React.Children.map(children, (child, index) =>
                React.isValidElement(child) ? (
                  <HighlightItem className={itemsClassName} key={index}>
                    {child}
                  </HighlightItem>
                ) : (
                  child
                )
              )
            )
        : children}
    </HighlightContext.Provider>
  );
}

function getNonOverridingDataAttributes(
  element: React.ReactElement,
  dataAttributes: Record<string, unknown>
): Record<string, unknown> {
  return Object.keys(dataAttributes).reduce<Record<string, unknown>>(
    (acc, key) => {
      if ((element.props as Record<string, unknown>)[key] === undefined) {
        acc[key] = dataAttributes[key];
      }
      return acc;
    },
    {}
  );
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(node);
    return;
  }
  (ref as React.RefObject<T | null>).current = node;
}

function useComposedRefs<T>(
  childRef: React.Ref<T> | undefined,
  localRef: React.Ref<T> | undefined,
  forwardedRef: React.Ref<T> | undefined
): React.RefCallback<T> {
  return React.useCallback(
    (node) => {
      assignRef(childRef, node);
      assignRef(localRef, node);
      assignRef(forwardedRef, node);
    },
    [childRef, localRef, forwardedRef]
  );
}

type ExtendedChildProps = React.ComponentProps<"div"> & {
  id?: string;
  ref?: React.Ref<HTMLElement>;
  "data-active"?: string;
  "data-value"?: string;
  "data-disabled"?: boolean;
  "data-highlight"?: boolean;
  "data-slot"?: string;
};

type HighlightItemProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
  id?: string;
  value?: string;
  className?: string;
  transition?: Transition;
  activeClassName?: string;
  disabled?: boolean;
  exitDelay?: number;
  asChild?: boolean;
  forceUpdateBounds?: boolean;
};

function HighlightItem({
  ref,
  children,
  id,
  value,
  className,
  transition,
  disabled = false,
  activeClassName,
  exitDelay,
  asChild = false,
  forceUpdateBounds,
  ...props
}: HighlightItemProps) {
  const itemId = React.useId();
  const {
    activeValue,
    setActiveValue,
    mode,
    setBounds,
    clearBounds,
    hover,
    enabled,
    className: contextClassName,
    transition: contextTransition,
    id: contextId,
    disabled: contextDisabled,
    exitDelay: contextExitDelay,
    forceUpdateBounds: contextForceUpdateBounds,
    setActiveClassName,
  } = useHighlight();

  const isValidChild = React.isValidElement<ExtendedChildProps>(children);
  const element = isValidChild ? children : null;
  const childValue =
    id ??
    value ??
    element?.props?.["data-value"] ??
    element?.props?.id ??
    itemId;
  const isActive = activeValue === childValue;
  const isDisabled = disabled === undefined ? contextDisabled : disabled;
  const itemTransition = transition ?? contextTransition;

  const localRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);
  const childRef = element?.props.ref;
  const composedRef = useComposedRefs<HTMLElement>(
    childRef,
    localRef as React.RefObject<HTMLElement | null>,
    ref as React.Ref<HTMLElement>
  );

  React.useEffect(() => {
    if (mode !== "parent") return;
    let rafId: number;
    let previousBounds: Bounds | null = null;
    const shouldUpdateBounds =
      forceUpdateBounds === true ||
      (contextForceUpdateBounds && forceUpdateBounds !== false);

    const updateBounds = () => {
      if (!localRef.current) return;

      const bounds = localRef.current.getBoundingClientRect();

      if (shouldUpdateBounds) {
        if (
          previousBounds &&
          previousBounds.top === bounds.top &&
          previousBounds.left === bounds.left &&
          previousBounds.width === bounds.width &&
          previousBounds.height === bounds.height
        ) {
          rafId = requestAnimationFrame(updateBounds);
          return;
        }
        previousBounds = bounds;
        rafId = requestAnimationFrame(updateBounds);
      }

      setBounds(bounds);
    };

    if (isActive) {
      updateBounds();
      setActiveClassName(activeClassName ?? "");
    } else if (!activeValue) clearBounds();

    if (shouldUpdateBounds) return () => cancelAnimationFrame(rafId);
  }, [
    mode,
    isActive,
    activeValue,
    setBounds,
    clearBounds,
    activeClassName,
    setActiveClassName,
    forceUpdateBounds,
    contextForceUpdateBounds,
  ]);

  if (!(isValidChild && element)) return children;

  const dataAttributes = {
    "data-active": isActive ? "true" : "false",
    "aria-selected": isActive,
    "data-disabled": isDisabled,
    "data-value": childValue,
    "data-highlight": true,
  };

  const commonHandlers = hover
    ? {
        onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
          setActiveValue(childValue);
          element.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
          setActiveValue(null);
          element.props.onMouseLeave?.(e);
        },
      }
    : {
        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
          setActiveValue(childValue);
          element.props.onClick?.(e);
        },
      };

  if (asChild) {
    const { ref: _childRef, ...childProps } =
      element.props as ExtendedChildProps;

    if (mode === "children") {
      return React.createElement(
        element.type,
        {
          ...childProps,
          key: childValue,
          ref: composedRef,
          className: cn("relative", element.props.className),
          ...getNonOverridingDataAttributes(element, {
            ...dataAttributes,
            "data-slot": "motion-highlight-item-container",
          }),
          ...commonHandlers,
          ...props,
        },
        <>
          <AnimatePresence initial={false}>
            {isActive && !isDisabled && (
              <motion.div
                animate={{ opacity: 1 }}
                className={cn(
                  "absolute inset-0 z-0 bg-muted",
                  contextClassName,
                  activeClassName
                )}
                data-slot="motion-highlight"
                exit={{
                  opacity: 0,
                  transition: {
                    ...itemTransition,
                    delay:
                      (itemTransition?.delay ?? 0) +
                      (exitDelay ?? contextExitDelay ?? 0),
                  },
                }}
                initial={{ opacity: 0 }}
                layoutId={`transition-background-${contextId}`}
                transition={itemTransition}
                {...dataAttributes}
              />
            )}
          </AnimatePresence>

          <div
            className={cn("relative z-1", className)}
            data-slot="motion-highlight-item"
            {...dataAttributes}
          >
            {children}
          </div>
        </>
      );
    }

    return React.createElement(element.type, {
      ...childProps,
      ref: composedRef,
      ...getNonOverridingDataAttributes(element, {
        ...dataAttributes,
        "data-slot": "motion-highlight-item",
      }),
      ...commonHandlers,
    });
  }

  return enabled ? (
    <div
      className={cn(mode === "children" && "relative", className)}
      data-slot="motion-highlight-item-container"
      key={childValue}
      ref={localRef}
      {...dataAttributes}
      {...props}
      {...commonHandlers}
    >
      {mode === "children" && (
        <AnimatePresence initial={false}>
          {isActive && !isDisabled && (
            <motion.div
              animate={{ opacity: 1 }}
              className={cn(
                "absolute inset-0 z-0 bg-muted",
                contextClassName,
                activeClassName
              )}
              data-slot="motion-highlight"
              exit={{
                opacity: 0,
                transition: {
                  ...itemTransition,
                  delay:
                    (itemTransition?.delay ?? 0) +
                    (exitDelay ?? contextExitDelay ?? 0),
                },
              }}
              initial={{ opacity: 0 }}
              layoutId={`transition-background-${contextId}`}
              transition={itemTransition}
              {...dataAttributes}
            />
          )}
        </AnimatePresence>
      )}

      {React.cloneElement(element, {
        className: cn("relative z-1", element.props.className),
        ...getNonOverridingDataAttributes(element, {
          ...dataAttributes,
          "data-slot": "motion-highlight-item",
        }),
      })}
    </div>
  ) : (
    children
  );
}

export { Highlight, HighlightItem };
