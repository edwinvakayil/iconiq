"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const subtleEase = [0.22, 1, 0.36, 1] as const;

const itemVariants = {
  initial: { opacity: 0, x: -6 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 6 },
};

const separatorVariants = {
  initial: { opacity: 0, x: -4 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 4 },
};

type MotionOlProps = React.ComponentProps<typeof motion.ol>;
type MotionLiProps = React.ComponentProps<typeof motion.li>;
type MotionSpanProps = React.ComponentProps<typeof motion.span>;

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(className)}
      data-slot="breadcrumb"
      {...props}
    />
  );
}

function BreadcrumbList({
  children,
  className,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <motion.ol
      className={cn(
        "wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm",
        className
      )}
      data-slot="breadcrumb-list"
      layout
      transition={{ duration: 0.18, ease: subtleEase }}
      {...(props as MotionOlProps)}
    >
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </motion.ol>
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <motion.li
      animate="animate"
      className={cn("inline-flex items-center gap-1", className)}
      data-slot="breadcrumb-item"
      exit="exit"
      initial="initial"
      layout
      transition={{ duration: 0.18, ease: subtleEase }}
      variants={itemVariants}
      {...(props as MotionLiProps)}
    />
  );
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn("transition-colors hover:text-foreground", className),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  });
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn("font-medium text-foreground", className)}
      data-slot="breadcrumb-page"
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <motion.li
      animate="animate"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      data-slot="breadcrumb-separator"
      exit="exit"
      initial="initial"
      layout
      role="presentation"
      transition={{ duration: 0.18, ease: subtleEase }}
      variants={separatorVariants}
      {...(props as MotionLiProps)}
    >
      {children ?? <ChevronRightIcon className="cn-rtl-flip" />}
    </motion.li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <motion.span
      animate="animate"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      data-slot="breadcrumb-ellipsis"
      exit="exit"
      initial="initial"
      layout
      role="presentation"
      transition={{ duration: 0.18, ease: subtleEase }}
      variants={separatorVariants}
      {...(props as MotionSpanProps)}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </motion.span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
