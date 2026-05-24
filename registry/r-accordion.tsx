"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { AnimatePresence, motion, type Transition } from "motion/react";
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

export interface AccordionProps extends ReducedMotionProp {
  items: AccordionItem[];
  className?: string;
  multiple?: boolean;
  variant?: AccordionVariant;
}

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

type AccordionRowProps = {
  item: AccordionItem;
  index: number;
  isOpen: boolean;
  reduceMotion: boolean;
};

function getRowClassName(index: number) {
  return cn("group", index !== 0 && "border-border/80 border-t");
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

function AccordionContent({
  contentCopy,
  isOpen,
  maskClassName,
  reduceMotion,
  wrapClassName,
}: {
  contentCopy: React.ReactNode;
  isOpen: boolean;
  maskClassName: string;
  reduceMotion: boolean;
  wrapClassName: string;
}) {
  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        reduceMotion ? (
          <AccordionPrimitive.Content forceMount>
            <div className={wrapClassName}>
              <div className={maskClassName}>{contentCopy}</div>
            </div>
          </AccordionPrimitive.Content>
        ) : (
          <AccordionPrimitive.Content asChild forceMount>
            <motion.div
              animate={{
                height: "auto",
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0%)",
              }}
              className="overflow-hidden"
              exit={{
                height: 0,
                opacity: 0,
                clipPath: "inset(0% 0% 100% 0%)",
              }}
              initial={{
                height: 0,
                opacity: 0,
                clipPath: "inset(0% 0% 100% 0%)",
              }}
              transition={contentShellTransition}
            >
              <div className={wrapClassName}>
                <motion.div
                  animate={{
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                  }}
                  className={maskClassName}
                  exit={{
                    clipPath: "inset(0% 100% 0% 0%)",
                    opacity: 0.68,
                  }}
                  initial={{
                    clipPath: "inset(0% 100% 0% 0%)",
                    opacity: 0.68,
                  }}
                  transition={contentMaskTransition}
                >
                  {contentCopy}
                </motion.div>
              </div>
            </motion.div>
          </AccordionPrimitive.Content>
        )
      ) : null}
    </AnimatePresence>
  );
}

function AccordionTriggerLabel({
  reduceMotion,
  title,
}: {
  reduceMotion: boolean;
  title: string;
}) {
  if (reduceMotion) {
    return (
      <span className="pr-4 font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base">
        {title}
      </span>
    );
  }

  return (
    <motion.span
      animate={{ x: 0 }}
      className="pr-4 font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base"
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {title}
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

function AccordionRow({
  item,
  index,
  isOpen,
  reduceMotion,
}: AccordionRowProps) {
  const contentCopy = reduceMotion ? (
    <div className={getContentCopyClassName()}>{item.content}</div>
  ) : (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      className={getContentCopyClassName()}
      exit={{
        opacity: 0,
        y: -2,
        scale: 0.996,
        filter: "blur(1.5px)",
      }}
      initial={{
        opacity: 0,
        y: 7,
        scale: 0.998,
        filter: "blur(3px)",
      }}
      transition={contentCopyTransition}
    >
      {item.content}
    </motion.div>
  );

  return (
    <AccordionPrimitive.Item className={getRowClassName(index)} value={item.id}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 12 }}
        transition={{
          delay: index * 0.05,
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              "flex w-full cursor-pointer items-start justify-between gap-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              getTriggerClassName(isOpen)
            )}
          >
            <AccordionTriggerLabel
              reduceMotion={reduceMotion}
              title={item.title}
            />
            <AccordionTriggerIndicator isOpen={isOpen} />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        <AccordionContent
          contentCopy={contentCopy}
          isOpen={isOpen}
          maskClassName={getContentMaskClassName()}
          reduceMotion={reduceMotion}
          wrapClassName={getContentWrapClassName()}
        />
      </motion.div>
    </AccordionPrimitive.Item>
  );
}

function AccordionQuietRow({
  index,
  item,
  isOpen,
  reduceMotion,
}: {
  index: number;
  item: AccordionItem;
  isOpen: boolean;
  reduceMotion: boolean;
}) {
  const contentCopy = reduceMotion ? (
    <div className={getQuietContentClassName()}>{item.content}</div>
  ) : (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      className={getQuietContentClassName()}
      exit={{
        opacity: 0,
        y: -2,
        scale: 0.996,
        filter: "blur(1.5px)",
      }}
      initial={{
        opacity: 0,
        y: 7,
        scale: 0.998,
        filter: "blur(3px)",
      }}
      transition={contentCopyTransition}
    >
      {item.content}
    </motion.div>
  );

  return (
    <AccordionPrimitive.Item className="py-3.5" value={item.id}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 12 }}
        transition={{
          delay: index * 0.05,
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger className="flex w-full cursor-pointer items-baseline gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
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
              {item.title}
            </span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        <AccordionContent
          contentCopy={contentCopy}
          isOpen={isOpen}
          maskClassName={getQuietContentMaskClassName()}
          reduceMotion={reduceMotion}
          wrapClassName={getQuietContentWrapClassName()}
        />
      </motion.div>
    </AccordionPrimitive.Item>
  );
}

export function Accordion({
  items,
  className,
  multiple = false,
  reducedMotion,
  variant = "default",
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const isQuiet = variant === "quiet";
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const rows = items.map((item, index) =>
    isQuiet ? (
      <AccordionQuietRow
        index={index}
        isOpen={openItems.includes(item.id)}
        item={item}
        key={item.id}
        reduceMotion={reduceMotion}
      />
    ) : (
      <AccordionRow
        index={index}
        isOpen={openItems.includes(item.id)}
        item={item}
        key={item.id}
        reduceMotion={reduceMotion}
      />
    )
  );

  if (multiple) {
    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <AccordionPrimitive.Root
          className={cn(registryTheme, "mx-auto w-full max-w-2xl", className)}
          onValueChange={setOpenItems}
          type="multiple"
          value={openItems}
        >
          {rows}
        </AccordionPrimitive.Root>
      </ReducedMotionConfig>
    );
  }

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <AccordionPrimitive.Root
        className={cn(registryTheme, "mx-auto w-full max-w-2xl", className)}
        collapsible
        onValueChange={(value) => setOpenItems(value ? [value] : [])}
        type="single"
        value={openItems[0]}
      >
        {rows}
      </AccordionPrimitive.Root>
    </ReducedMotionConfig>
  );
}
