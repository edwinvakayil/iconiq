"use client";

import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import {
  Highlight,
  HighlightItem,
} from "@/components/iconiq-ui/primitives/effects/highlight";
import { cn } from "@/lib/utils";

type Spring = {
  type: "spring";
  stiffness?: number;
  damping?: number;
  bounce: number;
};

type ContentRecord = {
  children: React.ReactNode;
  className?: string;
  highlightClassName?: string;
  innerClassName?: string;
};

type MotionNavigationMenuContextValue = {
  activeValue: string;
  direction: number;
  spring: Spring;
  viewport: boolean;
  viewportX: number | null;
  openValue: (value: string) => void;
  closeMenu: () => void;
  registerContent: (value: string, content: ContentRecord) => () => void;
  updateViewportPosition: () => void;
};

type MotionNavigationMenuItemContextValue = {
  value?: string;
};

const MotionNavigationMenuContext =
  React.createContext<MotionNavigationMenuContextValue | null>(null);

const MotionNavigationMenuItemContext =
  React.createContext<MotionNavigationMenuItemContextValue | null>(null);

const OVERFLOW_CLIP_REGEX = /hidden|clip|scroll|auto/;

const contentVariants = {
  initial: (direction: number) => ({ x: `${100 * direction}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: `${-100 * direction}%`, opacity: 0 }),
};

type MotionNavigationMenuProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "onValueChange"
> & {
  viewport?: boolean;
  viewportClassName?: string;
  springBounce?: number;
  springStiffness?: number;
  springDamping?: number;
  value?: string;
  onValueChange?: (value: string) => void;
};

function MotionNavigationMenu({
  className,
  children,
  viewport = true,
  viewportClassName,
  springBounce = 0,
  springStiffness = 350,
  springDamping = 32,
  value,
  onValueChange,
  onPointerLeave,
  onKeyDown,
  ref,
  ...props
}: MotionNavigationMenuProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const lastActiveValueRef = React.useRef(value ?? "");
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState("");
  const [direction, setDirection] = React.useState(1);
  const [viewportX, setViewportX] = React.useState<number | null>(null);
  const [contentByValue, setContentByValue] = React.useState<
    Record<string, ContentRecord>
  >({});

  const activeValue = value ?? internalValue;

  const spring = React.useMemo(
    () => ({
      type: "spring" as const,
      bounce: springBounce,
      stiffness: springStiffness,
      damping: springDamping,
    }),
    [springBounce, springStiffness, springDamping]
  );

  const getItemValues = React.useCallback(() => {
    const root = rootRef.current;

    if (!root) {
      return [];
    }

    return Array.from(
      root.querySelectorAll<HTMLElement>(
        '[data-slot="navigation-menu-item"][data-value]'
      ),
      (item) => item.dataset.value ?? ""
    ).filter(Boolean);
  }, []);

  const updateViewportPosition = React.useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: viewport clamping requires ancestor walk
    frameRef.current = requestAnimationFrame(() => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const activeTrigger = root.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-trigger"][data-state="open"]'
      );

      if (!activeTrigger) {
        setViewportX(rootRect.width / 2);
        return;
      }

      const triggerRect = activeTrigger.getBoundingClientRect();
      const idealX = triggerRect.left - rootRect.left + triggerRect.width / 2;

      const measureEl = root.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-measure"]'
      );
      const viewportEl = root.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-viewport"]'
      );
      const contentWidth =
        (measureEl ? measureEl.offsetWidth : 0) ||
        (viewportEl ? viewportEl.offsetWidth : 0);
      const half = contentWidth / 2;

      if (contentWidth > 0) {
        let boundary: DOMRect | null = null;
        let ancestor = root.parentElement;
        while (ancestor && ancestor !== document.body) {
          const style = window.getComputedStyle(ancestor);
          const overflow = style.overflow + style.overflowX;
          if (OVERFLOW_CLIP_REGEX.test(overflow)) {
            boundary = ancestor.getBoundingClientRect();
            break;
          }
          ancestor = ancestor.parentElement;
        }
        if (!boundary) {
          boundary = document.documentElement.getBoundingClientRect();
        }

        const margin = 8;
        const dropLeft = rootRect.left + idealX - half;
        const dropRight = rootRect.left + idealX + half;

        let adjustment = 0;
        if (dropLeft < boundary.left + margin) {
          adjustment = boundary.left + margin - dropLeft;
        } else if (dropRight > boundary.right - margin) {
          adjustment = boundary.right - margin - dropRight;
        }

        setViewportX(idealX + adjustment);
      } else {
        setViewportX(idealX);
      }
    });
  }, []);

  const setRootRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  const setActiveValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const openValue = React.useCallback(
    (nextValue: string) => {
      if (!nextValue) {
        return;
      }

      if (nextValue === lastActiveValueRef.current) {
        return;
      }

      const itemValues = getItemValues();
      const previousIndex = itemValues.indexOf(lastActiveValueRef.current);
      const nextIndex = itemValues.indexOf(nextValue);

      if (previousIndex !== -1 && nextIndex !== -1) {
        setDirection(nextIndex > previousIndex ? 1 : -1);
      }

      lastActiveValueRef.current = nextValue;
      setActiveValue(nextValue);
      updateViewportPosition();
    },
    [getItemValues, setActiveValue, updateViewportPosition]
  );

  const closeMenu = React.useCallback(() => {
    lastActiveValueRef.current = "";
    setActiveValue("");
    updateViewportPosition();
  }, [setActiveValue, updateViewportPosition]);

  const registerContent = React.useCallback(
    (itemValue: string, content: ContentRecord) => {
      setContentByValue((current) => {
        const previous = current[itemValue];

        if (
          previous?.children === content.children &&
          previous?.className === content.className &&
          previous?.innerClassName === content.innerClassName
        ) {
          return current;
        }

        return { ...current, [itemValue]: content };
      });

      return () => {
        setContentByValue((current) => {
          if (!current[itemValue]) {
            return current;
          }

          const next = { ...current };
          delete next[itemValue];
          return next;
        });
      };
    },
    []
  );

  React.useEffect(() => {
    if (value === undefined) {
      return;
    }

    if (!value) {
      lastActiveValueRef.current = "";
      return;
    }

    openValue(value);
  }, [openValue, value]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: viewport position tracks active panel changes
  React.useLayoutEffect(() => {
    updateViewportPosition();
  }, [activeValue, updateViewportPosition]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || typeof ResizeObserver === "undefined") {
      return () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }

    const observer = new ResizeObserver(updateViewportPosition);
    observer.observe(root);

    return () => {
      observer.disconnect();

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateViewportPosition]);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeMenu]);

  const contextValue = React.useMemo(
    () => ({
      activeValue,
      direction,
      spring,
      viewport,
      viewportX,
      openValue,
      closeMenu,
      registerContent,
      updateViewportPosition,
    }),
    [
      activeValue,
      closeMenu,
      direction,
      openValue,
      registerContent,
      spring,
      updateViewportPosition,
      viewport,
      viewportX,
    ]
  );

  return (
    <MotionNavigationMenuContext.Provider value={contextValue}>
      <nav
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className
        )}
        data-slot="navigation-menu"
        data-viewport={viewport}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.key === "Escape") {
            closeMenu();
          }
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);

          const related = event.relatedTarget;
          if (related instanceof Node && rootRef.current?.contains(related)) {
            return;
          }

          closeMenu();
        }}
        ref={setRootRef}
        {...props}
      >
        {children}
        {viewport && (
          <MotionNavigationMenuViewport
            className={viewportClassName}
            contentByValue={contentByValue}
          />
        )}
      </nav>
    </MotionNavigationMenuContext.Provider>
  );
}

function MotionNavigationMenuList({
  className,
  highlightClassName,
  ...props
}: React.ComponentPropsWithRef<"ul"> & {
  highlightClassName?: string;
}) {
  return (
    <Highlight
      boundsOffset={{ top: 3, left: 2, width: -4, height: -6 }}
      className={cn(
        "pointer-events-none rounded-lg bg-nav-menu-surface",
        highlightClassName
      )}
      containerClassName="relative"
      controlledItems
      hover
      mode="parent"
      style={{ zIndex: -1 }}
    >
      <ul
        className={cn(
          "group relative z-10 flex flex-1 list-none items-center justify-center gap-1",
          className
        )}
        data-slot="navigation-menu-list"
        {...props}
      />
    </Highlight>
  );
}

function MotionNavigationMenuItemContextBridge({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const itemContextValue = React.useMemo(() => ({ value }), [value]);

  return (
    <MotionNavigationMenuItemContext.Provider value={itemContextValue}>
      {children}
    </MotionNavigationMenuItemContext.Provider>
  );
}

function MotionNavigationMenuItem({
  className,
  value,
  onPointerEnter,
  ...props
}: React.ComponentPropsWithRef<"li"> & {
  value?: string;
}) {
  const context = React.useContext(MotionNavigationMenuContext);
  const itemContextValue = React.useMemo(() => ({ value }), [value]);

  return (
    <MotionNavigationMenuItemContext.Provider value={itemContextValue}>
      <li
        className={cn("relative", className)}
        data-slot="navigation-menu-item"
        data-value={value}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);

          if (!value) {
            context?.closeMenu();
          }
        }}
        {...props}
      />
    </MotionNavigationMenuItemContext.Provider>
  );
}

const motionNavigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-3.5 py-2 font-medium text-foreground text-sm outline-none transition-colors hover:text-accent-foreground focus:text-accent-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground"
);

function MotionNavigationMenuTrigger({
  className,
  children,
  onPointerEnter,
  onFocus,
  onClick,
  ...props
}: React.ComponentPropsWithRef<"button">) {
  const context = React.useContext(MotionNavigationMenuContext);
  const itemContext = React.useContext(MotionNavigationMenuItemContext);
  const itemValue = itemContext?.value;
  const isOpen = !!itemValue && context?.activeValue === itemValue;

  return (
    <HighlightItem asChild>
      <button
        aria-expanded={isOpen}
        className={cn(motionNavigationMenuTriggerStyle(), "group", className)}
        data-slot="navigation-menu-trigger"
        data-state={isOpen ? "open" : "closed"}
        onClick={(event) => {
          onClick?.(event);

          if (itemValue) {
            context?.openValue(itemValue);
          }
        }}
        onFocus={(event) => {
          onFocus?.(event);

          if (itemValue) {
            context?.openValue(itemValue);
          }
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);

          if (itemValue) {
            context?.openValue(itemValue);
          }
        }}
        type="button"
        {...props}
      >
        {children}{" "}
        <motion.span
          animate={{
            rotate: isOpen ? 180 : 0,
            y: isOpen ? 1 : 0,
          }}
          aria-hidden="true"
          className="relative top-0 ml-1.5 inline-flex"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
        >
          <ChevronDownIcon aria-hidden="true" className="size-3.5 stroke-2.5" />
        </motion.span>
      </button>
    </HighlightItem>
  );
}

function MotionNavigationMenuContent({
  className,
  highlightClassName,
  innerClassName,
  children,
}: React.ComponentPropsWithRef<"div"> & {
  highlightClassName?: string;
  innerClassName?: string;
}) {
  const context = React.useContext(MotionNavigationMenuContext);
  const itemContext = React.useContext(MotionNavigationMenuItemContext);
  const itemValue = itemContext?.value;
  const isOpen = !!itemValue && context?.activeValue === itemValue;

  React.useLayoutEffect(() => {
    if (!(context && itemValue && context.viewport)) {
      return;
    }

    return context.registerContent(itemValue, {
      children,
      className,
      highlightClassName,
      innerClassName,
    });
  }, [
    children,
    className,
    context,
    highlightClassName,
    innerClassName,
    itemValue,
  ]);

  if (!(context && itemValue) || context.viewport) {
    return null;
  }

  return (
    <AnimatePresence custom={context.direction} initial={false}>
      {isOpen && (
        <motion.div
          animate="active"
          className={cn(
            "absolute top-full left-0 z-50 mt-2 overflow-hidden rounded-2xl bg-nav-menu-surface p-2 text-foreground shadow-[0_2px_8px_rgb(15,23,42,0.04)]",
            className
          )}
          custom={context.direction}
          data-slot="navigation-menu-content"
          exit="exit"
          initial="initial"
          key={itemValue}
          transition={context.spring}
          variants={contentVariants}
        >
          <MotionNavigationMenuContentInner
            highlightClassName={highlightClassName}
            innerClassName={innerClassName}
          >
            {children}
          </MotionNavigationMenuContentInner>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MotionNavigationMenuContentInner({
  highlightClassName,
  innerClassName,
  children,
}: {
  highlightClassName?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Highlight
      className={cn(
        "pointer-events-none rounded-lg bg-nav-menu-item-hover",
        highlightClassName
      )}
      containerClassName="relative"
      controlledItems
      hover
      mode="parent"
      style={{ zIndex: -1 }}
    >
      <div className={cn("relative z-10", innerClassName)}>{children}</div>
    </Highlight>
  );
}

function MotionNavigationMenuViewport({
  className,
  contentByValue,
}: React.ComponentPropsWithRef<"div"> & {
  contentByValue?: Record<string, ContentRecord>;
}) {
  const context = React.useContext(MotionNavigationMenuContext);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [lastSize, setLastSize] = React.useState({ width: 0, height: 0 });
  const activeContent =
    context?.activeValue && contentByValue
      ? contentByValue[context.activeValue]
      : undefined;

  React.useLayoutEffect(() => {
    const node = measureRef.current;

    if (!(node && activeContent)) {
      return;
    }

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      const nextSize = {
        width: rect.width,
        height: rect.height,
      };

      setSize(nextSize);

      if (nextSize.width > 0 || nextSize.height > 0) {
        setLastSize(nextSize);
      }

      context?.updateViewportPosition();
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, [activeContent, context]);

  const width = size.width > 0 ? size.width : lastSize.width;
  const height = size.height > 0 ? size.height : lastSize.height;

  return (
    <motion.div
      animate={{ left: context?.viewportX ?? "50%" }}
      className="absolute top-full isolate z-50 flex -translate-x-1/2 justify-center pt-2"
      initial={false}
      transition={context?.spring}
    >
      <motion.div
        animate={{
          width: activeContent ? width : 0,
          height: activeContent ? height : 0,
          opacity: activeContent ? 1 : 0,
          scale: activeContent ? 1 : 0.95,
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl bg-nav-menu-surface text-foreground shadow-[0_2px_8px_rgb(15,23,42,0.04)]",
          className
        )}
        data-slot="navigation-menu-viewport"
        initial={false}
        transition={context?.spring}
      >
        <AnimatePresence
          custom={context?.direction ?? 1}
          initial={false}
          mode="popLayout"
        >
          {activeContent && context?.activeValue && (
            <MotionNavigationMenuItemContextBridge value={context.activeValue}>
              <motion.div
                animate="active"
                className={cn("p-2", activeContent.className)}
                custom={context.direction}
                data-slot="navigation-menu-content"
                exit="exit"
                initial="initial"
                key={context.activeValue}
                transition={context.spring}
                variants={contentVariants}
              >
                <MotionNavigationMenuContentInner
                  highlightClassName={activeContent.highlightClassName}
                  innerClassName={activeContent.innerClassName}
                >
                  {activeContent.children}
                </MotionNavigationMenuContentInner>
              </motion.div>
            </MotionNavigationMenuItemContextBridge>
          )}
        </AnimatePresence>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-1.5 left-0 w-max"
        data-slot="navigation-menu-measure"
        ref={measureRef}
      >
        {activeContent && context?.activeValue && (
          <MotionNavigationMenuItemContextBridge value={context.activeValue}>
            <div className={cn("p-2 pr-2.5", activeContent.className)}>
              <MotionNavigationMenuContentInner
                highlightClassName={activeContent.highlightClassName}
                innerClassName={activeContent.innerClassName}
              >
                {activeContent.children}
              </MotionNavigationMenuContentInner>
            </div>
          </MotionNavigationMenuItemContextBridge>
        )}
      </div>
    </motion.div>
  );
}

const motionNavigationMenuLinkClassName =
  "flex min-h-11 w-full items-center rounded-xl px-4 py-2.5 text-left text-sm outline-none transition-colors hover:text-foreground focus:text-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[active=true]:text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";

function MotionNavigationMenuNextLink({
  className,
  href,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <HighlightItem asChild>
      <Link
        className={cn(motionNavigationMenuLinkClassName, className)}
        data-slot="navigation-menu-link"
        href={href}
        {...props}
      />
    </HighlightItem>
  );
}

function MotionNavigationMenuTopLink({
  className,
  href,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <HighlightItem asChild>
      <Link
        className={cn(motionNavigationMenuTriggerStyle(), className)}
        data-slot="navigation-menu-top-link"
        href={href}
        {...props}
      />
    </HighlightItem>
  );
}

export {
  MotionNavigationMenu,
  MotionNavigationMenuList,
  MotionNavigationMenuItem,
  MotionNavigationMenuContent,
  MotionNavigationMenuTrigger,
  MotionNavigationMenuNextLink,
  MotionNavigationMenuTopLink,
};
