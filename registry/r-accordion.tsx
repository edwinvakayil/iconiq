"use client";

import type {
  AccordionContentProps as RadixAccordionContentPrimitiveProps,
  AccordionItemProps as RadixAccordionItemPrimitiveProps,
  AccordionSingleProps as RadixAccordionRootPrimitiveProps,
  AccordionTriggerProps as RadixAccordionTriggerPrimitiveProps,
} from "@radix-ui/react-accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion, type Transition } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export type AccordionVariant = "default" | "quiet";

type AccordionValue = string[];

type AccordionRootPropsBase = Omit<
  RadixAccordionRootPrimitiveProps,
  | "children"
  | "className"
  | "collapsible"
  | "defaultValue"
  | "onValueChange"
  | "type"
  | "value"
>;

export interface AccordionProps
  extends AccordionRootPropsBase,
    ReducedMotionProp {
  children?: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultValue?: AccordionValue;
  items?: AccordionItem[];
  multiple?: boolean;
  onValueChange?: (value: AccordionValue) => void;
  value?: AccordionValue;
  variant?: AccordionVariant;
}

interface AccordionItemProps
  extends Omit<RadixAccordionItemPrimitiveProps, "className"> {
  __index?: number;
  className?: string;
}

interface AccordionTriggerProps
  extends Omit<RadixAccordionTriggerPrimitiveProps, "className"> {
  className?: string;
}

interface AccordionContentProps
  extends Omit<RadixAccordionContentPrimitiveProps, "className"> {
  className?: string;
}

type AccordionRootContextValue = {
  openItems: AccordionValue;
  reduceMotion: boolean;
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
  reduceMotion,
  wrapClassName,
}: {
  children: React.ReactNode;
  copyClassName: string;
  isOpen: boolean;
  maskClassName: string;
  reduceMotion: boolean;
  wrapClassName: string;
}) {
  if (reduceMotion) {
    return (
      <div className={wrapClassName}>
        <div className={maskClassName}>
          <div className={copyClassName}>{children}</div>
        </div>
      </div>
    );
  }

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

function AccordionTriggerLabel({
  children,
  reduceMotion,
}: {
  children: React.ReactNode;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return (
      <span className="pr-4 font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base">
        {children}
      </span>
    );
  }

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

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, className, ...props }, ref) => {
  const { reduceMotion, variant } = useAccordionRootContext("AccordionTrigger");
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
        <AccordionTriggerLabel reduceMotion={reduceMotion}>
          {children}
        </AccordionTriggerLabel>
        <AccordionTriggerIndicator isOpen={isOpen} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, forceMount, ...props }, ref) => {
  const { reduceMotion, variant } = useAccordionRootContext("AccordionContent");
  const { isOpen } = useAccordionItemContext("AccordionContent");
  const isQuiet = variant === "quiet";

  return (
    <AccordionPrimitive.Content
      forceMount={forceMount || !reduceMotion ? true : undefined}
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
        reduceMotion={reduceMotion}
        wrapClassName={
          isQuiet ? getQuietContentWrapClassName() : getContentWrapClassName()
        }
      >
        {children}
      </AccordionPanelBody>
    </AccordionPrimitive.Content>
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
      reducedMotion,
      value,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const reduceMotion = useResolvedReducedMotion(reducedMotion);
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
      () => ({ openItems, reduceMotion, variant }),
      [openItems, reduceMotion, variant]
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
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <AccordionRootContext.Provider value={rootContext}>
          {multiple ? (
            <AccordionPrimitive.Root
              className={cn(
                registryTheme,
                "mx-auto w-full max-w-2xl",
                className
              )}
              onValueChange={handleValueChange}
              ref={ref}
              type="multiple"
              value={openItems}
              {...props}
            >
              {accordionChildren}
            </AccordionPrimitive.Root>
          ) : (
            <AccordionPrimitive.Root
              className={cn(
                registryTheme,
                "mx-auto w-full max-w-2xl",
                className
              )}
              collapsible={collapsible}
              onValueChange={(nextValue) =>
                handleValueChange(nextValue ? [nextValue] : [])
              }
              ref={ref}
              type="single"
              value={openItems[0] ?? ""}
              {...props}
            >
              {accordionChildren}
            </AccordionPrimitive.Root>
          )}
        </AccordionRootContext.Provider>
      </ReducedMotionConfig>
    );
  }
);

Accordion.displayName = "Accordion";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
