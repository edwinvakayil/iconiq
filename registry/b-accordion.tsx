"use client";

import type {
  AccordionItem as BaseAccordionItemPrimitive,
  AccordionPanel as BaseAccordionPanelPrimitive,
  AccordionRoot as BaseAccordionRootPrimitive,
  AccordionTrigger as BaseAccordionTriggerPrimitive,
} from "@base-ui/react/accordion";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { motion, type Transition } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

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
  defaultValue?: AccordionValue;
  items?: AccordionItem[];
  multiple?: boolean;
  onValueChange?: (value: AccordionValue) => void;
  value?: AccordionValue;
  variant?: AccordionVariant;
}

type AccordionItemPrimitiveProps = Omit<
  BaseAccordionItemPrimitive.Props,
  "className" | "ref" | "value"
>;

interface AccordionItemProps extends AccordionItemPrimitiveProps {
  __index?: number;
  children?: React.ReactNode;
  className?: string;
  value: string;
}

type AccordionTriggerPrimitiveProps = Omit<
  BaseAccordionTriggerPrimitive.Props,
  "className" | "ref"
>;

interface AccordionTriggerProps extends AccordionTriggerPrimitiveProps {
  children?: React.ReactNode;
  className?: string;
}

type AccordionContentPrimitiveProps = Omit<
  BaseAccordionPanelPrimitive.Props,
  "className" | "ref"
>;

interface AccordionContentProps extends AccordionContentPrimitiveProps {
  children?: React.ReactNode;
  className?: string;
}

type AccordionRootContextValue = {
  openItems: AccordionValue;
  variant: AccordionVariant;
};

type AccordionItemContextValue = {
  index: number;
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
  opacity: { duration: 0.26, ease: [0.18, 1, 0.32, 1] },
};

const contentMaskTransition: Transition = {
  duration: 0.38,
  ease: [0.16, 1, 0.3, 1],
};

const contentCopyTransition: Transition = {
  y: {
    type: "spring",
    stiffness: 146,
    damping: 23,
    mass: 0.98,
  },
  scale: {
    duration: 0.32,
    ease: [0.18, 1, 0.32, 1],
  },
  opacity: {
    duration: 0.22,
    ease: [0.18, 1, 0.32, 1],
    delay: 0.05,
  },
  filter: {
    duration: 0.28,
    ease: [0.18, 1, 0.32, 1],
    delay: 0.05,
  },
};

function normalizeAccordionValue(value: AccordionValue | undefined) {
  return value ?? [];
}

function getSingleOrMultipleValue(value: AccordionValue, multiple: boolean) {
  return multiple ? value : value.slice(0, 1);
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

function getContentMaskClassName() {
  return "overflow-hidden";
}

function getContentCopyClassName() {
  return "space-y-3 text-sm leading-relaxed text-muted-foreground will-change-transform [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_li+li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5";
}

function getQuietContentClassName() {
  return "max-w-2xl pl-7 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_li+li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5";
}

function getQuietContentWrapClassName() {
  return "pt-1.5";
}

function getQuietContentMaskClassName() {
  return "overflow-hidden";
}

function AccordionPanelBody({
  children,
  copyClassName,
  isOpen,
  maskClassName,
  wrapClassName,
}: {
  children: React.ReactNode;
  copyClassName: string;
  isOpen: boolean;
  maskClassName: string;
  wrapClassName: string;
}) {
  return (
    <motion.div
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        clipPath: isOpen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      }}
      className="overflow-hidden"
      initial={false}
      transition={contentShellTransition}
    >
      <div className={wrapClassName}>
        <motion.div
          animate={{
            clipPath: isOpen ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
            opacity: isOpen ? 1 : 0.68,
          }}
          className={maskClassName}
          initial={false}
          transition={contentMaskTransition}
        >
          <motion.div
            animate={{
              opacity: isOpen ? 1 : 0,
              y: isOpen ? 0 : -2,
              scale: isOpen ? 1 : 0.996,
              filter: isOpen ? "blur(0px)" : "blur(1.5px)",
            }}
            className={copyClassName}
            initial={false}
            transition={contentCopyTransition}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AccordionTriggerLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      animate={{ x: 0 }}
      className="pr-4 font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base"
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {children}
    </motion.span>
  );
}

function AccordionTriggerIndicator({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.div
      animate={{ opacity: isOpen ? 1 : 0.72 }}
      aria-hidden
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-foreground"
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
          transition={{
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </span>
    </motion.div>
  );
}

function withIndexedAccordionChildren(children: React.ReactNode) {
  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    return React.cloneElement(
      child as React.ReactElement<{ __index?: number }>,
      { __index: index }
    );
  });
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ __index = 0, children, className, value, ...props }, ref) => {
    const { openItems, variant } = useAccordionRootContext("AccordionItem");
    const isOpen = openItems.includes(value);
    const itemContext = React.useMemo(
      () => ({ index: __index, isOpen, value }),
      [__index, isOpen, value]
    );

    return (
      <AccordionItemContext.Provider value={itemContext}>
        <AccordionPrimitive.Item
          className={cn(getItemClassName(variant), className)}
          ref={ref}
          value={value}
          {...props}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{
              delay: __index * 0.05,
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {children}
          </motion.div>
        </AccordionPrimitive.Item>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { variant } = useAccordionRootContext("AccordionTrigger");
    const { isOpen } = useAccordionItemContext("AccordionTrigger");

    if (variant === "quiet") {
      return (
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              "flex w-full cursor-pointer items-baseline gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              className
            )}
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
            "flex w-full cursor-pointer items-start justify-between gap-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            getTriggerClassName(isOpen),
            className
          )}
          ref={ref}
          {...props}
        >
          <AccordionTriggerLabel>{children}</AccordionTriggerLabel>
          <AccordionTriggerIndicator isOpen={isOpen} />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, keepMounted, ...props }, ref) => {
  const { variant } = useAccordionRootContext("AccordionContent");
  const { isOpen } = useAccordionItemContext("AccordionContent");
  const isQuiet = variant === "quiet";

  return (
    <AccordionPrimitive.Panel
      className={cn(
        "overflow-hidden",
        "opacity-100 transition-[opacity] duration-[560ms] will-change-[opacity] data-closed:opacity-[0.999] data-ending-style:opacity-[0.999] data-starting-style:opacity-[0.999]"
      )}
      keepMounted={keepMounted ?? false}
      ref={ref}
      {...props}
    >
      <AccordionPanelBody
        copyClassName={cn(
          isQuiet ? getQuietContentClassName() : getContentCopyClassName(),
          className
        )}
        isOpen={isOpen}
        maskClassName={
          isQuiet ? getQuietContentMaskClassName() : getContentMaskClassName()
        }
        wrapClassName={
          isQuiet ? getQuietContentWrapClassName() : getContentWrapClassName()
        }
      >
        {children}
      </AccordionPanelBody>
    </AccordionPrimitive.Panel>
  );
});

AccordionContent.displayName = "AccordionContent";

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      className,
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
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState<AccordionValue>(() =>
        getSingleOrMultipleValue(
          normalizeAccordionValue(defaultValue),
          multiple
        )
      );
    const openItems = getSingleOrMultipleValue(
      normalizeAccordionValue(value ?? uncontrolledValue),
      multiple
    );

    const handleValueChange = React.useCallback(
      (nextValue: AccordionValue) => {
        const normalizedValue = getSingleOrMultipleValue(nextValue, multiple);

        if (value === undefined) {
          setUncontrolledValue(normalizedValue);
        }

        onValueChange?.(normalizedValue);
      },
      [multiple, onValueChange, value]
    );

    const rootContext = React.useMemo(
      () => ({ openItems, variant }),
      [openItems, variant]
    );

    const accordionChildren = items
      ? items.map((item, index) => (
          <AccordionItem __index={index} key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))
      : withIndexedAccordionChildren(children);

    return (
      <AccordionRootContext.Provider value={rootContext}>
        <AccordionPrimitive.Root
          className={cn(
            componentThemeClassName,
            "mx-auto w-full max-w-2xl",
            className
          )}
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
