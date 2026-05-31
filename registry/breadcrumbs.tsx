"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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
      className={cn(componentThemeClassName, className)}
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
