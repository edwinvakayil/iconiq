"use client";

import type {
  AccordionItem as BaseAccordionItemPrimitive,
  AccordionRoot as BaseAccordionRootPrimitive,
  AccordionTrigger as BaseAccordionTriggerPrimitive,
} from "@base-ui/react/accordion";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { motion, type Transition, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

/** Legacy alias for the `items` shortcut shape. Prefer `AccordionItemData`. */
export type AccordionItem = AccordionItemData;

export type AccordionVariant = "default" | "quiet";

type AccordionValue = string[];

type AccordionRootPrimitiveProps = Omit<
  BaseAccordionRootPrimitive.Props<string>,
  | "children"
  | "className"
  | "defaultValue"
  | "multiple"
  | "onValueChange"
  | "ref"
  | "value"
>;

export interface AccordionProps extends AccordionRootPrimitiveProps {
  children?: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultValue?: AccordionValue;
  items?: AccordionItemData[];
  multiple?: boolean;
  onValueChange?: (value: AccordionValue) => void;
  value?: AccordionValue;
  variant?: AccordionVariant;
}

type AccordionItemPrimitiveProps = Omit<
  BaseAccordionItemPrimitive.Props,
  "className" | "ref" | "value"
>;

export interface AccordionItemProps extends AccordionItemPrimitiveProps {
  children?: React.ReactNode;
  className?: string;
  value: string;
}

type AccordionTriggerPrimitiveProps = Omit<
  BaseAccordionTriggerPrimitive.Props,
  "className" | "ref"
>;

export interface AccordionTriggerProps extends AccordionTriggerPrimitiveProps {
  children?: React.ReactNode;
  className?: string;
}

type AccordionContentBodyProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export interface AccordionContentProps extends AccordionContentBodyProps {
  children?: React.ReactNode;
  className?: string;
  /** Keep panel content mounted while closed so height animation can finish cleanly. */
  forceMount?: boolean;
  /** Alias for `forceMount`. */
  keepMounted?: boolean;
}

type PanelRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  hidden?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

function sanitizePanelStyle(style?: React.CSSProperties) {
  if (!style) {
    return undefined;
  }

  const {
    height: _height,
    maxHeight: _maxHeight,
    minHeight: _minHeight,
    overflow: _overflow,
    ...rest
  } = style;

  return Object.keys(rest).length > 0 ? rest : undefined;
}

function resolvePanelProps(panelProps: PanelRenderProps) {
  const {
    children: _panelChildren,
    className: panelClassName,
    hidden: _panelHidden,
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
    ref: panelRef,
    style: panelStyle,
    ...resolvedPanelProps
  } = panelProps;

  return {
    panelClassName,
    panelRef,
    panelStyle,
    resolvedPanelProps,
  };
}

type AccordionRootContextValue = {
  openItems: AccordionValue;
  reduceMotion: boolean;
  variant: AccordionVariant;
};

type AccordionItemContextValue = {
  isOpen: boolean;
  value: string;
};

const AccordionRootContext =
  React.createContext<AccordionRootContextValue | null>(null);

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

const contentShellTransition: Transition = {
  height: {
    type: "spring",
    stiffness: 138,
    damping: 27,
    mass: 0.98,
  },
  opacity: { duration: 0.22, ease: [0.18, 1, 0.32, 1] },
};

const contentCopyTransition: Transition = {
  opacity: { duration: 0.2, ease: [0.18, 1, 0.32, 1] },
  y: { duration: 0.24, ease: [0.18, 1, 0.32, 1] },
};

const instantTransition: Transition = { duration: 0 };

const triggerBaseClassName =
  "flex w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

function normalizeAccordionValue(value: AccordionValue | undefined) {
  const items = (value ?? []).filter((item) => item.length > 0);

  return items.filter((item, index) => items.indexOf(item) === index);
}

function getSingleOrMultipleValue(value: AccordionValue, multiple: boolean) {
  return multiple ? value : value.slice(0, 1);
}

function getShellTransition(reduceMotion: boolean): Transition {
  return reduceMotion ? instantTransition : contentShellTransition;
}

function getCopyTransition(reduceMotion: boolean): Transition {
  return reduceMotion ? instantTransition : contentCopyTransition;
}

function useAccordionRootContext(componentName: string) {
  const context = React.useContext(AccordionRootContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Accordion.`);
  }

  return context;
}

function useAccordionItemContext(componentName: string) {
  const context = React.useContext(AccordionItemContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside AccordionItem.`);
  }

  return context;
}

function getItemClassName(variant: AccordionVariant) {
  if (variant === "quiet") {
    return "py-3.5";
  }

  return "group [&:not(:first-child)]:border-border/80 [&:not(:first-child)]:border-t";
}

function getTriggerClassName(isOpen: boolean) {
  return isOpen ? "px-1 pt-5 pb-3" : "px-1 py-5";
}

function getContentWrapClassName() {
  return "px-1 pr-12 pb-5";
}

function getContentCopyClassName() {
  return "space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_li+li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5";
}

function getQuietContentClassName() {
  return "max-w-2xl pl-7 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_li+li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5";
}

function getQuietContentWrapClassName() {
  return "pt-1.5";
}

function AccordionPanelBody({
  children,
  contentProps,
  contentRef,
  copyClassName,
  isOpen,
  reduceMotion,
  wrapClassName,
}: {
  children: React.ReactNode;
  contentProps?: Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  >;
  contentRef?: React.Ref<HTMLDivElement>;
  copyClassName: string;
  isOpen: boolean;
  reduceMotion: boolean;
  wrapClassName: string;
}) {
  if (reduceMotion) {
    if (!isOpen) {
      return null;
    }

    return (
      <div className="overflow-hidden">
        <div {...contentProps} className={wrapClassName} ref={contentRef}>
          <div className={copyClassName}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      className="overflow-hidden"
      initial={false}
      transition={getShellTransition(reduceMotion)}
    >
      <div {...contentProps} className={wrapClassName} ref={contentRef}>
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -4 }}
          aria-hidden={!isOpen}
          className={copyClassName}
          inert={isOpen ? undefined : true}
          initial={false}
          transition={getCopyTransition(reduceMotion)}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

function AccordionTriggerLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="pr-4 font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base">
      {children}
    </span>
  );
}

function AccordionTriggerIndicator({
  isOpen,
  reduceMotion,
}: {
  isOpen: boolean;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return (
      <span
        aria-hidden
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-foreground opacity-80"
      >
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className="absolute h-px w-3 rounded-full bg-current" />
          {isOpen ? null : (
            <span className="absolute h-3 w-px rounded-full bg-current" />
          )}
        </span>
      </span>
    );
  }

  return (
    <motion.div
      animate={{ opacity: isOpen ? 1 : 0.72 }}
      aria-hidden
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-foreground"
      initial={false}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        <span className="absolute h-px w-3 rounded-full bg-current" />
        <motion.span
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleY: isOpen ? 0 : 1,
          }}
          className="absolute h-3 w-px origin-center rounded-full bg-current"
          initial={false}
          transition={{
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </span>
    </motion.div>
  );
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, value, ...props }, ref) => {
    const { openItems, variant } = useAccordionRootContext("AccordionItem");
    const isOpen = openItems.includes(value);
    const itemContext = React.useMemo(
      () => ({ isOpen, value }),
      [isOpen, value]
    );

    return (
      <AccordionItemContext.Provider value={itemContext}>
        <AccordionPrimitive.Item
          className={cn(getItemClassName(variant), className)}
          data-slot="accordion-item"
          ref={ref}
          value={value}
          {...props}
        >
          {children}
        </AccordionPrimitive.Item>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { reduceMotion, variant } =
      useAccordionRootContext("AccordionTrigger");
    const { isOpen } = useAccordionItemContext("AccordionTrigger");

    if (variant === "quiet") {
      return (
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              triggerBaseClassName,
              "items-baseline gap-4",
              className
            )}
            data-slot="accordion-trigger"
            ref={ref}
            {...props}
          >
            <span
              aria-hidden
              className={cn(
                "text-[15px] leading-none transition-colors",
                isOpen ? "text-foreground" : "text-muted-foreground/60"
              )}
            >
              {isOpen ? "−" : "+"}
            </span>
            <span className="font-normal text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base">
              {children}
            </span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
      );
    }

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            triggerBaseClassName,
            "items-start justify-between gap-6",
            getTriggerClassName(isOpen),
            className
          )}
          data-slot="accordion-trigger"
          ref={ref}
          {...props}
        >
          <AccordionTriggerLabel>{children}</AccordionTriggerLabel>
          <AccordionTriggerIndicator
            isOpen={isOpen}
            reduceMotion={reduceMotion}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, forceMount, keepMounted, ...props }, ref) => {
  const { reduceMotion, variant } = useAccordionRootContext("AccordionContent");
  const isQuiet = variant === "quiet";
  const shouldKeepMounted = keepMounted ?? forceMount ?? true;
  const copyClassNameBase = isQuiet
    ? getQuietContentClassName()
    : getContentCopyClassName();
  const wrapClassName = isQuiet
    ? getQuietContentWrapClassName()
    : getContentWrapClassName();

  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      keepMounted={shouldKeepMounted}
      render={(panelProps, state) => {
        const isOpen = state.open;
        const { panelClassName, panelRef, panelStyle, resolvedPanelProps } =
          resolvePanelProps(panelProps);

        return (
          <div
            {...resolvedPanelProps}
            className={cn("overflow-hidden", panelClassName)}
            ref={panelRef}
            style={sanitizePanelStyle(panelStyle)}
          >
            <AccordionPanelBody
              contentProps={props}
              contentRef={ref}
              copyClassName={cn(copyClassNameBase, className)}
              isOpen={isOpen}
              reduceMotion={reduceMotion}
              wrapClassName={wrapClassName}
            >
              {children}
            </AccordionPanelBody>
          </div>
        );
      }}
    />
  );
});

AccordionContent.displayName = "AccordionContent";

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      className,
      collapsible = true,
      defaultValue,
      items,
      multiple = false,
      onValueChange,
      value,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion() === true;
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState<AccordionValue>(() =>
        getSingleOrMultipleValue(
          normalizeAccordionValue(defaultValue),
          multiple
        )
      );
    const openItems = getSingleOrMultipleValue(
      normalizeAccordionValue(isControlled ? value : uncontrolledValue),
      multiple
    );

    React.useEffect(() => {
      if (isControlled) {
        return;
      }

      setUncontrolledValue((current) =>
        getSingleOrMultipleValue(normalizeAccordionValue(current), multiple)
      );
    }, [isControlled, multiple]);

    const handleValueChange = React.useCallback(
      (nextValue: AccordionValue) => {
        const normalizedValue = getSingleOrMultipleValue(
          normalizeAccordionValue(nextValue),
          multiple
        );

        if (
          !(multiple || collapsible) &&
          normalizedValue.length === 0 &&
          openItems.length > 0
        ) {
          return;
        }

        if (!isControlled) {
          setUncontrolledValue(normalizedValue);
        }

        onValueChange?.(normalizedValue);
      },
      [collapsible, isControlled, multiple, onValueChange, openItems.length]
    );

    const rootContext = React.useMemo(
      () => ({ openItems, reduceMotion, variant }),
      [openItems, reduceMotion, variant]
    );

    const accordionChildren = items
      ? items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))
      : children;

    return (
      <AccordionRootContext.Provider value={rootContext}>
        <AccordionPrimitive.Root
          className={cn(
            componentThemeClassName,
            "mx-auto w-full max-w-2xl",
            className
          )}
          data-slot="accordion"
          multiple={multiple}
          onValueChange={(nextValue) => handleValueChange(nextValue)}
          ref={ref}
          value={openItems}
          {...props}
        >
          {accordionChildren}
        </AccordionPrimitive.Root>
      </AccordionRootContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
