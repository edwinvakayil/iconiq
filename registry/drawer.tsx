"use client";

import { X } from "lucide-react";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const surfaceCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[12px]";

const drawerThemeClassName =
  "[--drw-surface:var(--popover,#ffffff)] [--drw-foreground:var(--popover-foreground,#111111)] [--drw-border:var(--border,#e3e7ec)] [--drw-ring:var(--ring,rgba(17,17,17,0.16))] [--drw-muted-foreground:var(--muted-foreground,#6d7480)] [--drw-muted:var(--muted,#f5f7fa)] [--drw-destructive:var(--destructive,#dc2626)] [--drw-destructive-foreground:var(--destructive-foreground,#ffffff)] [--color-accent:var(--drw-muted)] [--color-accent-foreground:var(--drw-foreground)] dark:[--drw-surface:var(--popover,#0a0a0a)] dark:[--drw-foreground:var(--popover-foreground,#f6f3ec)] dark:[--drw-border:var(--border,#2b2a25)] dark:[--drw-ring:var(--ring,rgba(246,243,236,0.18))] dark:[--drw-muted-foreground:var(--muted-foreground,#9a958a)] dark:[--drw-muted:var(--muted,#1a1a18)] dark:[--drw-destructive:var(--destructive,#f87171)] dark:[--drw-destructive-foreground:var(--destructive-foreground,#111111)]";

const drawerContentSizeClassNames = {
  sm: cn(
    "data-[vaul-drawer-direction=bottom]:max-h-[60vh]",
    "data-[vaul-drawer-direction=top]:max-h-[60vh]",
    "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm",
    "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm"
  ),
  default: cn(
    "data-[vaul-drawer-direction=bottom]:max-h-[min(80svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))]",
    "data-[vaul-drawer-direction=top]:max-h-[min(80svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))]",
    "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-md",
    "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-md"
  ),
  lg: cn(
    "data-[vaul-drawer-direction=bottom]:max-h-[min(90svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))]",
    "data-[vaul-drawer-direction=top]:max-h-[min(90svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))]",
    "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-lg",
    "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-lg"
  ),
  full: cn(
    "data-[vaul-drawer-direction=bottom]:max-h-[min(90svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))]",
    "data-[vaul-drawer-direction=top]:max-h-[min(90svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))]",
    "data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:max-w-none data-[vaul-drawer-direction=right]:sm:max-w-none",
    "data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:max-w-none data-[vaul-drawer-direction=left]:sm:max-w-none"
  ),
} as const;

type DrawerContentSize = keyof typeof drawerContentSizeClassNames;

const drawerCloseClassName = cn(
  controlCornerClassName,
  "absolute top-4 right-4 z-10 grid size-9 shrink-0 place-items-center text-[color:var(--drw-muted-foreground)] transition-colors hover:bg-accent/60 hover:text-[color:var(--drw-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--drw-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--drw-surface)] active:bg-accent/80 [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0"
);

const drawerTriggerClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--drw-foreground)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--drw-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--drw-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--drw-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--drw-surface)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--drw-foreground),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const drawerTriggerSmClassName = cn(
  controlCornerClassName,
  "inline-flex h-8 min-h-8 translate-y-px items-center bg-[color:var(--drw-foreground)] px-3 py-0 font-medium text-[13px] text-[color:var(--drw-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--drw-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--drw-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--drw-surface)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--drw-foreground),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const drawerCancelClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:color-mix(in_oklch,var(--drw-muted),transparent_45%)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--drw-muted-foreground)] tracking-[-0.01em] transition-colors duration-150 hover:bg-accent/60 hover:text-[color:var(--drw-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--drw-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--drw-surface)] active:bg-accent/80 disabled:pointer-events-none disabled:opacity-50"
);

const drawerActionClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--drw-foreground)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--drw-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--drw-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--drw-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--drw-surface)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--drw-foreground),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const drawerDestructiveActionClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--drw-destructive)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--drw-destructive-foreground)] tracking-[-0.01em] transition-[transform,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--drw-destructive),transparent_30%)] focus-visible:ring-offset-2 active:translate-y-0 active:brightness-90 disabled:pointer-events-none disabled:opacity-50"
);

const drawerContentBaseClassName = cn(
  surfaceCornerClassName,
  "group/drawer-content fixed z-50 flex h-auto min-h-0 flex-col overflow-hidden border border-[color:color-mix(in_oklch,var(--drw-border),transparent_25%)] bg-[color:color-mix(in_oklch,var(--drw-surface),transparent_4%)] text-[14px] text-[color:var(--drw-foreground)] shadow-[0_32px_120px_rgba(15,23,42,0.18)] outline-none supports-[backdrop-filter]:bg-[color:color-mix(in_oklch,var(--drw-surface),transparent_8%)]",
  "[--initial-transform:calc(100%+16px)] [animation-duration:520ms] [animation-timing-function:cubic-bezier(0.32,0.72,0,1)] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none motion-reduce:transition-none data-[state=closed]:[animation-duration:320ms]"
);

const drawerDirectionClassNames = cn(
  "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=bottom]:pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
  "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=top]:pt-[max(1rem,env(safe-area-inset-top,0px))]",
  "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:pr-[max(1rem,env(safe-area-inset-right,0px))]",
  "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:h-full data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:pl-[max(1rem,env(safe-area-inset-left,0px))]"
);

type DrawerRootProps = React.ComponentProps<typeof DrawerPrimitive.Root>;
type DrawerNestedProps = React.ComponentProps<
  typeof DrawerPrimitive.NestedRoot
>;

function Drawer({ ...props }: DrawerRootProps) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerNested({ ...props }: DrawerNestedProps) {
  return <DrawerPrimitive.NestedRoot data-slot="drawer-nested" {...props} />;
}

const DrawerTrigger = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
>(({ asChild, className, ...props }, ref) => (
  <DrawerPrimitive.Trigger
    asChild={asChild}
    className={cn(!asChild && drawerTriggerClassName, className)}
    data-slot="drawer-trigger"
    ref={ref}
    {...props}
  />
));
DrawerTrigger.displayName = "DrawerTrigger";

function DrawerPortal(
  props: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Portal>
) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

const DrawerClose = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Close
    className={className}
    data-slot="drawer-close"
    ref={ref}
    {...props}
  />
));
DrawerClose.displayName = "DrawerClose";

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=open]:animate-in supports-backdrop-filter:backdrop-blur-sm motion-reduce:animate-none dark:bg-black/55",
      "[animation-duration:420ms] [animation-timing-function:cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:[animation-duration:260ms]",
      className
    )}
    data-slot="drawer-overlay"
    ref={ref}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

type DrawerContentProps = React.ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
> & {
  overlayClassName?: string;
  showCloseButton?: boolean;
  showOverlay?: boolean;
  size?: DrawerContentSize;
};

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      children,
      className,
      overlayClassName,
      showCloseButton = false,
      showOverlay = true,
      size = "default",
      ...props
    },
    ref
  ) => (
    <DrawerPortal>
      {showOverlay ? <DrawerOverlay className={overlayClassName} /> : null}
      <DrawerPrimitive.Content
        className={cn(
          drawerThemeClassName,
          drawerContentBaseClassName,
          drawerDirectionClassNames,
          drawerContentSizeClassNames[size],
          className
        )}
        data-slot="drawer-content"
        ref={ref}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DrawerClose className={drawerCloseClassName} type="button">
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        ) : null}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex shrink-0 flex-col gap-2 p-4 pr-10 text-left group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left md:group-data-[vaul-drawer-direction=top]/drawer-content:text-left",
      className
    )}
    data-slot="drawer-header"
    ref={ref}
    {...props}
  />
));
DrawerHeader.displayName = "DrawerHeader";

const DrawerBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 [-webkit-overflow-scrolling:touch]",
      className
    )}
    data-slot="drawer-body"
    data-vaul-no-drag=""
    ref={ref}
    {...props}
  />
));
DrawerBody.displayName = "DrawerBody";

const DrawerMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "grid size-11 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklch,var(--drw-foreground),transparent_90%)] text-[color:var(--drw-foreground)] [&_svg]:block [&_svg]:size-5 [&_svg]:shrink-0",
      className
    )}
    data-slot="drawer-media"
    ref={ref}
    {...props}
  />
));
DrawerMedia.displayName = "DrawerMedia";

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "mt-auto flex shrink-0 flex-col-reverse gap-2 border-[color:color-mix(in_oklch,var(--drw-border),transparent_25%)] border-t p-4 sm:flex-row sm:justify-end",
      className
    )}
    data-slot="drawer-footer"
    ref={ref}
    {...props}
  />
));
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    className={cn(
      "font-semibold text-[1.15rem] text-[color:var(--drw-foreground)] leading-tight tracking-[-0.03em]",
      className
    )}
    data-slot="drawer-title"
    ref={ref}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    className={cn(
      "mx-auto max-w-[46ch] text-[14px] text-[color:var(--drw-muted-foreground)] leading-6 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:group-data-[vaul-drawer-direction=bottom]/drawer-content:mx-0 md:group-data-[vaul-drawer-direction=top]/drawer-content:mx-0 md:group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left md:group-data-[vaul-drawer-direction=top]/drawer-content:text-left",
      className
    )}
    data-slot="drawer-description"
    ref={ref}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

type DrawerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  closeOnClick?: boolean;
};

type DrawerActionVariant = "default" | "destructive";

interface DrawerActionProps extends DrawerButtonProps {
  variant?: DrawerActionVariant;
}

function handleDrawerButtonClick(
  event: React.MouseEvent<HTMLButtonElement>,
  closeOnClick: boolean,
  onClick?: React.MouseEventHandler<HTMLButtonElement>
) {
  onClick?.(event);

  if (!closeOnClick) {
    event.preventDefault();
  }
}

const DrawerCancel = React.forwardRef<HTMLElement, DrawerButtonProps>(
  (
    {
      asChild,
      children,
      className,
      closeOnClick = true,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => (
    <DrawerPrimitive.Close
      {...props}
      asChild={asChild}
      className={asChild ? className : cn(drawerCancelClassName, className)}
      onClick={(event) => handleDrawerButtonClick(event, closeOnClick, onClick)}
      ref={ref as React.Ref<HTMLButtonElement>}
      type={asChild ? undefined : type}
    >
      {children}
    </DrawerPrimitive.Close>
  )
);
DrawerCancel.displayName = "DrawerCancel";

const DrawerAction = React.forwardRef<HTMLElement, DrawerActionProps>(
  (
    {
      asChild,
      children,
      className,
      closeOnClick = true,
      onClick,
      type = "button",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const actionClassName =
      variant === "destructive"
        ? drawerDestructiveActionClassName
        : drawerActionClassName;

    return (
      <DrawerPrimitive.Close
        {...props}
        asChild={asChild}
        className={asChild ? className : cn(actionClassName, className)}
        onClick={(event) =>
          handleDrawerButtonClick(event, closeOnClick, onClick)
        }
        ref={ref as React.Ref<HTMLButtonElement>}
        type={asChild ? undefined : type}
      >
        {children}
      </DrawerPrimitive.Close>
    );
  }
);
DrawerAction.displayName = "DrawerAction";

export {
  Drawer,
  DrawerNested,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerMedia,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerAction,
  DrawerCancel,
  drawerActionClassName,
  drawerCancelClassName,
  drawerDestructiveActionClassName,
  drawerThemeClassName,
  drawerTriggerClassName,
  drawerTriggerSmClassName,
};

export type { DrawerContentSize, DrawerRootProps };
