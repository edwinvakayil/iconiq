"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  cloneElement,
  type FocusEventHandler,
  forwardRef,
  isValidElement,
  type KeyboardEvent,
  type KeyboardEventHandler,
  memo,
  type PointerEvent,
  type PointerEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const buttonThemeClassName =
  "[--button-destructive:#dc2626] [--button-input:#e3e7ec] [--button-primary-foreground:#ffffff] [--button-ring:rgba(17,17,17,0.16)] [--button-ripple:color-mix(in_oklch,var(--foreground),transparent_52%)] [--button-secondary:#eceff3] [--button-secondary-foreground:#111111] dark:[--button-destructive:#f87171] dark:[--button-input:#2b2a25] dark:[--button-primary-foreground:#111111] dark:[--button-ring:rgba(246,243,236,0.18)] dark:[--button-ripple:color-mix(in_oklch,var(--foreground),transparent_30%)] dark:[--button-secondary:#2a2a27] dark:[--button-secondary-foreground:#f6f3ec]";

const buttonCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const buttonCornerXsClassName =
  "rounded-[min(var(--radius-md),10px)] supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[12px]";

const buttonCornerSmClassName =
  "rounded-[min(var(--radius-md),12px)] supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[14px]";

const buttonGroupCornerClassName =
  "in-data-[slot=button-group]:rounded-lg in-data-[slot=button-group]:supports-[corner-shape:squircle]:corner-squircle in-data-[slot=button-group]:supports-[corner-shape:squircle]:rounded-[11px]";

const buttonVariants = cva(
  cn(
    componentThemeClassName,
    buttonThemeClassName,
    buttonCornerClassName,
    "group/button relative isolate inline-flex shrink-0 cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden whitespace-nowrap border border-transparent bg-clip-border font-medium text-sm no-underline outline-none transition-[background-color,border-color,color,box-shadow] focus-visible:border-[color:var(--button-ring)] focus-visible:ring-3 focus-visible:ring-[color:color-mix(in_oklch,var(--button-ring),transparent_50%)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[color:var(--button-destructive)] aria-invalid:ring-3 aria-invalid:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:aria-invalid:border-[color:color-mix(in_oklch,var(--button-destructive),transparent_50%)] dark:aria-invalid:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default:
          "visited:!text-primary-foreground hover:!text-primary-foreground focus-visible:!text-primary-foreground active:!text-primary-foreground bg-primary text-primary-foreground [--button-ripple:color-mix(in_oklch,var(--primary-foreground),transparent_45%)] hover:bg-primary dark:[--button-ripple:color-mix(in_oklch,#111111,transparent_10%)] [&_svg]:text-primary-foreground",
        outline:
          "visited:!text-foreground hover:!text-foreground focus-visible:!text-foreground active:!text-foreground aria-expanded:!text-foreground border-border bg-background text-foreground [--button-ripple:color-mix(in_oklch,var(--foreground),transparent_52%)] hover:bg-accent/60 aria-expanded:bg-muted dark:border-[color:var(--button-input)] dark:bg-[color-mix(in_oklch,var(--button-input),transparent_70%)] dark:hover:bg-[color-mix(in_oklch,var(--button-input),transparent_50%)] dark:[--button-ripple:color-mix(in_oklch,var(--foreground),transparent_28%)] [&_svg]:text-foreground",
        secondary:
          "visited:!text-[color:var(--button-secondary-foreground)] hover:!text-[color:var(--button-secondary-foreground)] focus-visible:!text-[color:var(--button-secondary-foreground)] active:!text-[color:var(--button-secondary-foreground)] aria-expanded:!text-[color:var(--button-secondary-foreground)] bg-[color:var(--button-secondary)] text-[color:var(--button-secondary-foreground)] [--button-ripple:color-mix(in_oklch,var(--button-secondary-foreground),transparent_52%)] hover:bg-[color-mix(in_oklch,var(--button-secondary),var(--foreground)_7%)] aria-expanded:bg-[color:var(--button-secondary)] dark:hover:bg-[color-mix(in_oklch,var(--button-secondary),var(--foreground)_11%)] dark:[--button-ripple:color-mix(in_oklch,var(--button-secondary-foreground),transparent_20%)] [&_svg]:text-[color:var(--button-secondary-foreground)]",
        ghost:
          "visited:!text-foreground hover:!text-foreground focus-visible:!text-foreground active:!text-foreground aria-expanded:!text-foreground text-foreground [--button-ripple:color-mix(in_oklch,var(--foreground),transparent_52%)] hover:bg-accent/60 aria-expanded:bg-muted dark:hover:bg-muted/50 dark:[--button-ripple:color-mix(in_oklch,var(--foreground),transparent_28%)] [&_svg]:text-foreground",
        destructive:
          "visited:!text-[color:var(--button-destructive)] hover:!text-[color:var(--button-destructive)] focus-visible:!text-[color:var(--button-destructive)] active:!text-[color:var(--button-destructive)] bg-[color-mix(in_oklch,var(--button-destructive),transparent_90%)] text-[color:var(--button-destructive)] [--button-ripple:color-mix(in_oklch,var(--button-destructive),transparent_40%)] hover:bg-[color-mix(in_oklch,var(--button-destructive),transparent_80%)] focus-visible:border-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] focus-visible:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:bg-[color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:focus-visible:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] dark:hover:bg-[color-mix(in_oklch,var(--button-destructive),transparent_70%)] dark:[--button-ripple:color-mix(in_oklch,var(--button-destructive),transparent_20%)] [&_svg]:text-[color:var(--button-destructive)]",
        link: "",
      },
      linkUnderline: {
        motion: "",
        static: "",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: cn(
          "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
          buttonGroupCornerClassName,
          buttonCornerXsClassName
        ),
        sm: cn(
          "h-7 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
          buttonGroupCornerClassName,
          buttonCornerSmClassName
        ),
        lg: "h-10 gap-1.5 px-4 text-base leading-5 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        icon: "size-8",
        "icon-xs": cn(
          "size-6 [&_svg:not([class*='size-'])]:size-3",
          buttonGroupCornerClassName,
          buttonCornerXsClassName
        ),
        "icon-sm": cn(
          "size-7",
          buttonGroupCornerClassName,
          buttonCornerSmClassName
        ),
        "icon-lg": "size-9",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        linkUnderline: "motion",
        class:
          "visited:!text-foreground hover:!text-foreground focus-visible:!text-foreground px-0 text-foreground shadow-none active:translate-y-0 [&_[data-link-label]]:font-medium [&_[data-link-label]]:text-[1em]",
      },
      {
        variant: "link",
        linkUnderline: "static",
        class:
          "visited:!text-foreground hover:!text-foreground focus-visible:!text-foreground px-0 text-foreground underline-offset-4 hover:underline [&_[data-link-label]]:font-medium [&_[data-link-label]]:text-[1em]",
      },
      {
        variant: "link",
        size: "default",
        class: "h-8 px-0 text-sm leading-5",
      },
      {
        variant: "link",
        size: "lg",
        class: "h-10 px-0 text-base leading-5",
      },
      {
        variant: "link",
        size: "sm",
        class: "h-7 px-0 text-[0.8rem]",
      },
      {
        variant: "link",
        size: "xs",
        class: "h-6 px-0 text-xs",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      linkUnderline: "motion",
    },
  }
);

const linkUnderlineFillTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.65,
};

const MAX_RIPPLES = 3;
const REL_TOKEN_SPLIT = /\s+/;

const LinkUnderlineLabel = memo(function LinkUnderlineLabel({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <span className="relative inline-block pb-px font-medium text-[1em] leading-[inherit]">
      <span className="relative z-10" data-link-label>
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-muted-foreground/50"
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-foreground"
        transition={linkUnderlineFillTransition}
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
      />
    </span>
  );
});

const buttonContentClassName =
  "relative z-10 inline-flex items-center justify-center [gap:inherit] whitespace-nowrap text-inherit";

type Ripple = { id: string; x: number; y: number; size: number };

type AnchorHTMLAttributesForMotion = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

type ButtonHTMLAttributesForMotion = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

type ButtonRenderProps = React.HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function useMeasure<T extends HTMLElement = HTMLElement>(
  enabled: boolean
): [(node: T | null) => void, { width: number; height: number }] {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!(enabled && element && typeof ResizeObserver !== "undefined")) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setBounds((current) => {
        const next = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };

        if (current.width === next.width && current.height === next.height) {
          return current;
        }

        return next;
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, enabled]);

  return [ref, enabled ? bounds : { width: 0, height: 0 }];
}

const MotionAnchor = motion.create("a");

const buttonTransition = {
  scale: {
    type: "spring",
    stiffness: 640,
    damping: 38,
    mass: 0.85,
  },
  width: {
    type: "spring",
    stiffness: 420,
    damping: 34,
    mass: 0.9,
  },
  opacity: {
    type: "spring",
    stiffness: 380,
    damping: 32,
    mass: 0.8,
  },
  y: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
} as const;

const loadingIconTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 0.76,
};

const loadingLabelExitTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 38,
  mass: 0.84,
};

const loadingLabelEnterTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.98,
};

const loadingLayoutTransition = {
  type: "spring" as const,
  stiffness: 360,
  damping: 36,
  mass: 0.94,
};

const loadingLabelVariants = {
  animate: {
    filter: "blur(0px)",
    opacity: 1,
    scale: 1,
    transition: loadingLabelEnterTransition,
    y: 0,
  },
  exit: {
    filter: "blur(3px)",
    opacity: 0,
    scale: 0.96,
    transition: loadingLabelExitTransition,
    y: -4,
  },
  initial: {
    filter: "blur(3px)",
    opacity: 0,
    scale: 0.96,
    y: 4,
  },
} as const;

function getLabelMotionKey(children: ReactNode, loading: boolean) {
  if (typeof children === "string" || typeof children === "number") {
    return `${loading ? "busy" : "idle"}:${children}`;
  }

  return loading ? "busy" : "idle";
}

function withLoadingSpin(node: ReactNode, spinning: boolean) {
  if (!(spinning && isValidElement<{ className?: string }>(node))) {
    return node;
  }

  return cloneElement(node, {
    className: cn(node.props.className, "animate-spin"),
  });
}

function getButtonAnimate(
  canAnimate: boolean,
  isPressed: boolean,
  animatedWidth: number | undefined,
  reduceMotion: boolean | null
) {
  const shouldReduceMotion = reduceMotion === true;
  const pressScale = canAnimate && isPressed && !shouldReduceMotion ? 0.96 : 1;

  if (animatedWidth) {
    return {
      scale: pressScale,
      width: animatedWidth,
    };
  }

  return {
    scale: pressScale,
  };
}

function omitLinkMotionConflicts<T extends Record<string, unknown>>(props: T) {
  const {
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
    ...rest
  } = props;

  return rest;
}

function resolvePrimitiveButtonProps(buttonProps: ButtonRenderProps) {
  const {
    children: _buttonChildren,
    className: primitiveClassName,
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
    ref: primitiveRef,
    style: primitiveStyle,
    ...resolvedButtonProps
  } = buttonProps;

  return {
    primitiveClassName,
    primitiveRef,
    primitiveStyle,
    resolvedButtonProps,
  };
}

function resolveAnchorRel(target?: string, rel?: string) {
  if (!target?.includes("_blank")) {
    return rel;
  }

  const tokens = new Set((rel ?? "").split(REL_TOKEN_SPLIT).filter(Boolean));
  tokens.add("noopener");
  tokens.add("noreferrer");
  return [...tokens].join(" ");
}

function isIconOnlySize(
  size:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined
) {
  return (
    size === "icon" ||
    size === "icon-xs" ||
    size === "icon-sm" ||
    size === "icon-lg"
  );
}

function useIconOnlyA11yWarning(
  size:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined,
  children: ReactNode,
  iconLabel: string | undefined,
  ariaLabel: string | undefined,
  loading: boolean
) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const hasVisibleLabel =
      children != null && children !== false && children !== "";
    const needsAccessibleName =
      isIconOnlySize(size) || (loading && !hasVisibleLabel);

    if (!needsAccessibleName || iconLabel || ariaLabel) {
      return;
    }

    console.warn(
      "[Button] Icon-only and loading-only buttons need `iconLabel` or `aria-label` for accessibility."
    );
  }, [ariaLabel, children, iconLabel, loading, size]);
}

function getIconIdleAnimate(showSpinner: boolean, noMotion: boolean) {
  if (noMotion) {
    return { opacity: showSpinner ? 0 : 1 };
  }

  return {
    filter: showSpinner ? "blur(3px)" : "blur(0px)",
    opacity: showSpinner ? 0 : 1,
    rotate: showSpinner ? -56 : 0,
    scale: showSpinner ? 0.82 : 1,
  };
}

function getIconSpinnerAnimate(showSpinner: boolean, noMotion: boolean) {
  if (noMotion) {
    return { opacity: showSpinner ? 1 : 0 };
  }

  return {
    filter: showSpinner ? "blur(0px)" : "blur(3px)",
    opacity: showSpinner ? 1 : 0,
    rotate: showSpinner ? 0 : 56,
    scale: showSpinner ? 1 : 0.82,
  };
}

function buildMotionSurfaceProps({
  canAnimate,
  isPressed,
  motionAnimate,
  reduceMotion,
  useLinkMotionUnderline,
  variant,
}: {
  canAnimate: boolean;
  isPressed: boolean;
  motionAnimate: ReturnType<typeof getButtonAnimate>;
  reduceMotion: boolean | null;
  useLinkMotionUnderline: boolean;
  variant: VariantProps<typeof buttonVariants>["variant"];
}) {
  const shouldReduceMotion = reduceMotion === true;
  const surfaceTransition = shouldReduceMotion
    ? { duration: 0 }
    : buttonTransition;
  const shared = {
    animate: motionAnimate,
    "data-pressed": isPressed ? "true" : "false",
    transition: surfaceTransition,
  };

  if (useLinkMotionUnderline) {
    return {
      ...shared,
      initial: shouldReduceMotion ? (false as const) : ("rest" as const),
      variants: shouldReduceMotion ? undefined : { rest: {}, hover: {} },
      whileHover: shouldReduceMotion ? undefined : ("hover" as const),
    };
  }

  const hoverLift =
    canAnimate && variant !== "link" && !shouldReduceMotion
      ? { y: -1 }
      : undefined;

  return {
    ...shared,
    initial: false as const,
    whileHover: hoverLift,
  };
}

const ButtonIconSlot = memo(function ButtonIconSlot({
  accessibleName,
  dataIcon,
  hasIcon,
  hasLabel,
  icon,
  iconTransition,
  layoutTransition,
  noMotion,
  showSpinner,
  spinner,
}: {
  accessibleName?: string;
  dataIcon: "inline-start" | "inline-end";
  hasIcon: boolean;
  hasLabel: boolean;
  icon?: ReactNode;
  iconTransition: { duration: number } | typeof loadingIconTransition;
  layoutTransition: { duration: number } | typeof loadingLayoutTransition;
  noMotion: boolean;
  showSpinner: boolean;
  spinner: ReactNode;
}) {
  return (
    <motion.span
      aria-hidden={hasLabel || accessibleName ? true : undefined}
      className="relative inline-flex size-[1em] shrink-0 items-center justify-center"
      data-icon={dataIcon}
      layout={noMotion ? false : "position"}
      transition={layoutTransition}
    >
      {hasIcon ? (
        <motion.span
          animate={getIconIdleAnimate(showSpinner, noMotion)}
          className="absolute inset-0 inline-flex items-center justify-center"
          initial={false}
          transition={iconTransition}
        >
          {icon}
        </motion.span>
      ) : null}
      <motion.span
        animate={getIconSpinnerAnimate(showSpinner, noMotion)}
        className="absolute inset-0 inline-flex items-center justify-center"
        initial={false}
        transition={iconTransition}
      >
        {withLoadingSpin(spinner, showSpinner && !noMotion)}
      </motion.span>
    </motion.span>
  );
});

const ButtonLoadingLabel = memo(function ButtonLoadingLabel({
  children,
  layoutTransition,
  linkUnderlineEnabled,
  loading,
  noMotion,
}: {
  children: ReactNode;
  layoutTransition: { duration: number } | typeof loadingLayoutTransition;
  linkUnderlineEnabled: boolean;
  loading: boolean;
  noMotion: boolean;
}) {
  return (
    <motion.span
      className="relative inline-grid min-w-0 items-center leading-[inherit] [grid-template-columns:max-content] [grid-template-rows:minmax(0,1.25em)]"
      layout="position"
      transition={layoutTransition}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={noMotion ? { opacity: 1 } : "animate"}
          className="col-start-1 row-start-1 inline-flex min-w-0 items-center whitespace-nowrap"
          exit={noMotion ? { opacity: 0 } : "exit"}
          initial={noMotion ? false : "initial"}
          key={getLabelMotionKey(children, loading)}
          layout="position"
          transition={{ layout: layoutTransition }}
          variants={noMotion ? undefined : loadingLabelVariants}
        >
          <LinkUnderlineLabel enabled={linkUnderlineEnabled}>
            {children}
          </LinkUnderlineLabel>
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

const ButtonSpinnerPresence = memo(function ButtonSpinnerPresence({
  iconSlot,
  layoutTransition,
  noMotion,
  visible,
}: {
  iconSlot: ReactNode;
  layoutTransition: { duration: number } | typeof loadingLayoutTransition;
  noMotion: boolean;
  visible: boolean;
}) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {visible ? (
        <motion.span
          animate={noMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          className="inline-flex shrink-0"
          exit={
            noMotion
              ? { opacity: 0 }
              : {
                  filter: "blur(2px)",
                  opacity: 0,
                  scale: 0.86,
                  transition: loadingLabelExitTransition,
                }
          }
          initial={noMotion ? false : { opacity: 0, scale: 0.86 }}
          key="loading-spinner"
          layout="position"
          transition={layoutTransition}
        >
          {iconSlot}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
});

const defaultLoadingIcon = <Loader2 aria-hidden strokeWidth={2.25} />;

const ButtonLoadingContent = memo(function ButtonLoadingContent({
  accessibleName,
  children,
  contentRef,
  icon,
  iconPosition,
  linkUnderlineEnabled,
  loading,
  loadingIcon,
  reduceMotion,
}: {
  accessibleName?: string;
  children: ReactNode;
  contentRef?: React.Ref<HTMLSpanElement>;
  icon?: ReactNode;
  iconPosition: "start" | "end";
  linkUnderlineEnabled: boolean;
  loading: boolean;
  loadingIcon?: ReactNode;
  reduceMotion: boolean | null;
}) {
  const hasIcon = Boolean(icon);
  const hasLabel = children != null && children !== false && children !== "";
  const noMotion = reduceMotion === true;
  const iconTransition = noMotion ? { duration: 0 } : loadingIconTransition;
  const layoutTransition = noMotion ? { duration: 0 } : loadingLayoutTransition;
  const spinner = loadingIcon ?? defaultLoadingIcon;

  const iconAtStart = loading || (hasIcon && iconPosition === "start");
  const iconAtEnd = hasIcon && !loading && iconPosition === "end";
  const spinnerOnlyAtStart = loading && !hasIcon;

  const iconSlotProps = {
    accessibleName,
    hasLabel,
    iconTransition,
    layoutTransition,
    noMotion,
    spinner,
  };

  return (
    <motion.span
      animate={loading && !noMotion ? { opacity: 0.96 } : { opacity: 1 }}
      className={buttonContentClassName}
      initial={false}
      layout={!noMotion}
      ref={contentRef}
      transition={layoutTransition}
    >
      <ButtonSpinnerPresence
        iconSlot={
          <ButtonIconSlot
            {...iconSlotProps}
            dataIcon="inline-start"
            hasIcon={hasIcon}
            icon={icon}
            showSpinner
          />
        }
        layoutTransition={layoutTransition}
        noMotion={noMotion}
        visible={spinnerOnlyAtStart}
      />
      {hasIcon && iconAtStart ? (
        <ButtonIconSlot
          {...iconSlotProps}
          dataIcon="inline-start"
          hasIcon={hasIcon}
          icon={icon}
          showSpinner={loading}
        />
      ) : null}
      {hasLabel ? (
        <ButtonLoadingLabel
          layoutTransition={layoutTransition}
          linkUnderlineEnabled={linkUnderlineEnabled}
          loading={loading}
          noMotion={noMotion}
        >
          {children}
        </ButtonLoadingLabel>
      ) : null}
      {hasIcon && iconAtEnd ? (
        <ButtonIconSlot
          {...iconSlotProps}
          dataIcon="inline-end"
          hasIcon={hasIcon}
          icon={icon}
          showSpinner={loading}
        />
      ) : null}
    </motion.span>
  );
});

const rippleTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
  opacity: {
    duration: 0.65,
    ease: [0.4, 0, 0.2, 1] as const,
    times: [0, 0.2, 1] as const,
  },
} as const;

const RippleLayer = memo(function RippleLayer({
  onRippleComplete,
  ripples,
}: {
  ripples: Ripple[];
  onRippleComplete: (id: string) => void;
}) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      {ripples.map((ripple) => (
        <motion.span
          animate={{ opacity: [0.36, 0.2, 0], scale: 1 }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--button-ripple)]"
          initial={{ opacity: 0.36, scale: 0 }}
          key={ripple.id}
          onAnimationComplete={() => onRippleComplete(ripple.id)}
          style={{
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
          }}
          transition={rippleTransition}
        />
      ))}
    </span>
  );
});

type ButtonInteractionElement = HTMLButtonElement | HTMLAnchorElement;

type ButtonInteractionHandlers = {
  onBlur?: FocusEventHandler<ButtonInteractionElement>;
  onKeyDown?: KeyboardEventHandler<ButtonInteractionElement>;
  onKeyUp?: KeyboardEventHandler<ButtonInteractionElement>;
  onPointerCancel?: PointerEventHandler<ButtonInteractionElement>;
  onPointerDown?: PointerEventHandler<ButtonInteractionElement>;
  onPointerLeave?: PointerEventHandler<ButtonInteractionElement>;
  onPointerUp?: PointerEventHandler<ButtonInteractionElement>;
};

export type ButtonProps = Omit<
  ButtonHTMLAttributesForMotion,
  keyof ButtonInteractionHandlers
> &
  ButtonInteractionHandlers &
  VariantProps<typeof buttonVariants> & {
    animateSize?: boolean;
    children?: ReactNode;
    disableRipple?: boolean;
    href?: string;
    icon?: ReactNode;
    iconLabel?: string;
    iconPosition?: "start" | "end";
    loading?: boolean;
    loadingIcon?: ReactNode;
  } & Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    | "download"
    | "hrefLang"
    | "media"
    | "ping"
    | "referrerPolicy"
    | "rel"
    | "target"
  >;

const ButtonInner = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      animateSize = false,
      "aria-label": ariaLabel,
      children,
      className,
      disabled,
      disableRipple = false,
      href,
      icon,
      iconLabel,
      iconPosition = "start",
      linkUnderline,
      loading = false,
      loadingIcon,
      onBlur,
      onKeyDown,
      onKeyUp,
      onPointerCancel,
      onPointerDown,
      onPointerLeave,
      onPointerUp,
      rel,
      size,
      style,
      target,
      type = "button",
      variant,
      ...props
    },
    ref
  ) => {
    const isLocked = Boolean(disabled || loading);
    const accessibleName = iconLabel ?? ariaLabel;
    const reduceMotion = useReducedMotion();

    useIconOnlyA11yWarning(size, children, iconLabel, ariaLabel, loading);
    const buttonNodeRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(
      null
    );
    const rippleIdRef = useRef(0);
    const wasLoadingRef = useRef(loading);
    const [horizontalInset, setHorizontalInset] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const shouldAnimateSize = animateSize && style?.width == null;
    const [contentRef, bounds] = useMeasure<HTMLSpanElement>(shouldAnimateSize);
    const lastContentWidthRef = useRef(0);
    const resolvedLinkUnderline =
      variant === "link" ? (linkUnderline ?? "motion") : undefined;
    const useLinkMotionUnderline = resolvedLinkUnderline === "motion";

    const canAnimate = !isLocked && reduceMotion !== true;
    const allowsRipple =
      !(disableRipple || loading) &&
      variant !== "link" &&
      !isLocked &&
      reduceMotion !== true;
    useLayoutEffect(() => {
      if (bounds.width > 0) {
        lastContentWidthRef.current = bounds.width;
      }
    }, [bounds.width]);

    const contentWidth =
      bounds.width > 0 ? bounds.width : lastContentWidthRef.current;
    const animatedWidth =
      shouldAnimateSize && contentWidth > 0
        ? Math.ceil(contentWidth + horizontalInset)
        : undefined;

    const setButtonRef = useCallback(
      (node: HTMLButtonElement | HTMLAnchorElement | null) => {
        buttonNodeRef.current = node;
        setRef(ref, node);
      },
      [ref]
    );

    const measureHorizontalInset = useCallback(
      (measuredContentWidth: number) => {
        if (!(measuredContentWidth > 0)) {
          return;
        }

        const buttonNode = buttonNodeRef.current;
        if (!(buttonNode && animateSize)) {
          return;
        }

        const styles = window.getComputedStyle(buttonNode);
        const next =
          (Number.parseFloat(styles.borderLeftWidth) || 0) +
          (Number.parseFloat(styles.borderRightWidth) || 0) +
          (Number.parseFloat(styles.paddingLeft) || 0) +
          (Number.parseFloat(styles.paddingRight) || 0);

        setHorizontalInset((current) => (current === next ? current : next));
      },
      [animateSize]
    );

    useLayoutEffect(() => {
      measureHorizontalInset(contentWidth);
    }, [contentWidth, measureHorizontalInset]);

    const handleRippleComplete = useCallback((id: string) => {
      setRipples((current) => {
        if (!current.some((item) => item.id === id)) {
          return current;
        }

        return current.filter((item) => item.id !== id);
      });
    }, []);

    useEffect(() => {
      if (isLocked) {
        setIsPressed(false);
      }
    }, [isLocked]);

    useLayoutEffect(() => {
      const wasLoading = wasLoadingRef.current;
      if (loading || wasLoading) {
        setRipples([]);
      }
      if (loading) {
        setIsPressed(false);
      }
      wasLoadingRef.current = loading;
    }, [loading]);

    const handlePointerDown = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      onPointerDown?.(e);

      if (e.defaultPrevented || isLocked) {
        return;
      }

      setIsPressed(true);

      if (!(allowsRipple && e.button === 0)) {
        return;
      }

      if (e.pointerType === "mouse" && e.buttons !== 1) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleSize =
        2 *
        Math.max(
          Math.hypot(x, y),
          Math.hypot(rect.width - x, y),
          Math.hypot(x, rect.height - y),
          Math.hypot(rect.width - x, rect.height - y)
        );
      rippleIdRef.current += 1;
      const id = `ripple-${rippleIdRef.current}`;

      setRipples((current) => {
        const next = [...current, { id, x, y, size: rippleSize }];
        return next.length > MAX_RIPPLES
          ? next.slice(next.length - MAX_RIPPLES)
          : next;
      });
    };

    const handlePointerUp = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      onPointerUp?.(e);
      setIsPressed(false);
    };

    const handlePointerLeave = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      onPointerLeave?.(e);
      setIsPressed(false);
    };

    const handlePointerCancel = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      onPointerCancel?.(e);
      setIsPressed(false);
    };

    const handleKeyDown = (e: KeyboardEvent<ButtonInteractionElement>) => {
      onKeyDown?.(e);

      if (
        e.defaultPrevented ||
        isLocked ||
        e.repeat ||
        (e.key !== " " && e.key !== "Enter")
      ) {
        return;
      }

      setIsPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent<ButtonInteractionElement>) => {
      onKeyUp?.(e);

      if (e.key === " " || e.key === "Enter") {
        setIsPressed(false);
      }
    };

    const rootClassName = cn(
      buttonVariants({
        className,
        linkUnderline: resolvedLinkUnderline,
        size,
        variant,
      }),
      isLocked && "pointer-events-none",
      disabled && "opacity-50"
    );

    const buildButtonSurface = (labelContent: ReactNode) => (
      <>
        {allowsRipple ? (
          <RippleLayer
            onRippleComplete={handleRippleComplete}
            ripples={ripples}
          />
        ) : null}
        <ButtonLoadingContent
          accessibleName={accessibleName}
          contentRef={shouldAnimateSize ? contentRef : undefined}
          icon={icon}
          iconPosition={iconPosition}
          linkUnderlineEnabled={resolvedLinkUnderline === "motion"}
          loading={loading}
          loadingIcon={loadingIcon}
          reduceMotion={reduceMotion}
        >
          {labelContent}
        </ButtonLoadingContent>
      </>
    );

    const buttonSurface = buildButtonSurface(children);

    const motionAnimate = useMemo(
      () =>
        getButtonAnimate(canAnimate, isPressed, animatedWidth, reduceMotion),
      [animatedWidth, canAnimate, isPressed, reduceMotion]
    );

    const motionSurfaceProps = useMemo(
      () =>
        buildMotionSurfaceProps({
          canAnimate,
          isPressed,
          motionAnimate,
          reduceMotion,
          useLinkMotionUnderline,
          variant,
        }),
      [
        canAnimate,
        isPressed,
        motionAnimate,
        reduceMotion,
        useLinkMotionUnderline,
        variant,
      ]
    );

    const sharedRootProps = {
      "aria-busy": loading || undefined,
      "aria-label": accessibleName,
      className: rootClassName,
      "data-slot": "button" as const,
    };

    if (href?.trim()) {
      const safeHref = href.trim();
      const {
        onClick,
        type: _type,
        ...anchorProps
      } = omitLinkMotionConflicts(props as AnchorHTMLAttributesForMotion);
      const safeRel = resolveAnchorRel(target, rel);

      return (
        <MotionAnchor
          {...motionSurfaceProps}
          {...anchorProps}
          {...sharedRootProps}
          aria-disabled={isLocked || undefined}
          href={safeHref}
          onBlur={(e) => {
            onBlur?.(e);
            setIsPressed(false);
          }}
          onClick={(e) => {
            if (isLocked) {
              e.preventDefault();
            }
            onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);

            if (
              e.defaultPrevented ||
              isLocked ||
              e.repeat ||
              e.key !== "Enter"
            ) {
              return;
            }

            setIsPressed(true);
          }}
          onKeyUp={(e) => {
            onKeyUp?.(e);

            if (e.key === "Enter") {
              setIsPressed(false);
            }
          }}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onPointerUp={handlePointerUp}
          ref={setButtonRef}
          rel={safeRel}
          style={style}
          tabIndex={isLocked ? -1 : undefined}
          target={target}
        >
          {buttonSurface}
        </MotionAnchor>
      );
    }

    return (
      <ButtonPrimitive
        {...sharedRootProps}
        disabled={isLocked}
        onBlur={(e) => {
          onBlur?.(e);
          setIsPressed(false);
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
        render={(buttonProps) => {
          const {
            primitiveClassName,
            primitiveRef,
            primitiveStyle,
            resolvedButtonProps,
          } = resolvePrimitiveButtonProps(buttonProps);

          return (
            <motion.button
              {...resolvedButtonProps}
              {...motionSurfaceProps}
              className={primitiveClassName}
              ref={(node) => {
                setButtonRef(node);
                setRef(primitiveRef, node);
              }}
              style={primitiveStyle}
              type={type}
            >
              {buttonSurface}
            </motion.button>
          );
        }}
        style={style}
        type={type}
        {...props}
      />
    );
  }
);

ButtonInner.displayName = "Button";

const Button = memo(ButtonInner);

export { Button, buttonVariants };
