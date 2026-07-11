"use client";

import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";

import { cn } from "@/lib/utils";

type MessageAlign = "start" | "end";
type MessageBubbleVariant = "default" | "primary" | "ghost";

type MessageGroupProps = React.ComponentProps<"div">;

type MessageProps = React.ComponentProps<typeof motion.div> & {
  /** Which side the message belongs to. "end" reads as sent — row reversed,
   *  entrance from the right. "start" reads as received — entrance from
   *  the left. */
  align?: MessageAlign;
  /** Play the slide-in entrance. Set to false for history that is already
   *  on screen, so only newly arriving messages animate. */
  animated?: boolean;
};

type MessageBubbleProps = React.ComponentProps<"div"> & {
  /** "default" is a muted pill for received messages, "primary" a filled
   *  primary pill for sent messages, and "ghost" drops the pill entirely
   *  for bare text like streamed AI replies. */
  variant?: MessageBubbleVariant;
};

function MessageGroup({ className, ...props }: MessageGroupProps) {
  return (
    <div
      className={cn(
        // clip (not hidden) swallows the sideways entrance travel without
        // creating a scroll container, so a message sliding in can never
        // flash a horizontal scrollbar — while vertical overflow like the
        // avatar's footer lift stays visible.
        "flex min-w-0 flex-col gap-2 overflow-x-clip",
        className
      )}
      data-slot="message-group"
      {...props}
    />
  );
}

/** The slide distance in px. Small on purpose: the message should feel like
 *  it surfaces beside the composer, not like it crosses the screen. */
const ENTER_OFFSET = 24;

/** One spring drives x, scale, and the corner morph together, so the bubble
 *  arrives as a single fluid gesture. Damping is tuned to let it overshoot
 *  just slightly and settle in one soft bounce — noticeable, not springy. */
const ENTER_TRANSITION = {
  type: "spring",
  stiffness: 420,
  damping: 20,
  mass: 0.9,
  opacity: { duration: 0.25, ease: "easeOut" },
} as const;

/** The resting pose. Always passed to `animate`, so values resolve to their
 *  final state on mount no matter how the row was server-rendered. */
const ENTER_TARGET = { opacity: 1, scale: 1, x: 0 };

function Message({
  className,
  align = "start",
  animated = true,
  ...props
}: MessageProps) {
  // Reduced motion drops the entrance entirely — the message just appears.
  const reduceMotion = useReducedMotion() ?? false;
  const enter = animated && !reduceMotion;

  return (
    <motion.div
      animate={ENTER_TARGET}
      className={cn(
        // The transform origin sits at the bubble's tail corner, so the
        // slight scale-up reads as the bubble morphing out of that corner
        // rather than the whole row zooming.
        "group/message relative flex w-full min-w-0 origin-bottom-left gap-2 text-sm data-[align=end]:origin-bottom-right data-[align=end]:flex-row-reverse",
        className
      )}
      data-align={align}
      data-slot="message"
      // `false` is Motion's "mount already settled" — no entrance styles are
      // rendered at all, so static rows never flash or hydrate mismatched.
      initial={
        enter
          ? {
              opacity: 0,
              scale: 0.9,
              x: align === "end" ? ENTER_OFFSET : -ENTER_OFFSET,
            }
          : false
      }
      transition={ENTER_TRANSITION}
      {...props}
    />
  );
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
        className
      )}
      data-slot="message-avatar"
      {...props}
    />
  );
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "wrap-break-word flex w-full min-w-0 flex-col gap-2.5 group-data-[align=end]/message:*:data-slot:self-end",
        className
      )}
      data-slot="message-content"
      {...props}
    />
  );
}

function MessageBubble({
  className,
  variant = "default",
  ...props
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "wrap-break-word w-fit max-w-full rounded-3xl px-4 py-2.5",
        variant === "default" && "bg-muted text-foreground",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "ghost" && "rounded-none px-0 py-0",
        className
      )}
      data-slot="message-bubble"
      data-variant={variant}
      {...props}
    />
  );
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0",
        className
      )}
      data-slot="message-header"
      {...props}
    />
  );
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
        className
      )}
      data-slot="message-footer"
      {...props}
    />
  );
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageBubble,
  MessageContent,
  MessageFooter,
  MessageHeader,
};
export type {
  MessageAlign,
  MessageBubbleProps,
  MessageBubbleVariant,
  MessageGroupProps,
  MessageProps,
};
