"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const badgeColors = {
  gray: "#a3a3a3",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
} as const;

const badgeSemanticColors = {
  success: "green",
  warning: "amber",
  error: "red",
  info: "blue",
} as const;

type BadgeColor = keyof typeof badgeColors;
type BadgeSemanticColor = keyof typeof badgeSemanticColors;
type BadgeColorProp = BadgeColor | BadgeSemanticColor;
type BadgeSize = "sm" | "md" | "lg";

const badgePaletteSemanticAliases = Object.fromEntries(
  Object.entries(badgeSemanticColors).map(([semantic, palette]) => [
    palette,
    semantic,
  ])
) as Partial<Record<BadgeColor, BadgeSemanticColor>>;

function preferBadgeSemanticColor(color: BadgeColorProp): BadgeColorProp {
  if (color in badgeSemanticColors) {
    return color;
  }

  return badgePaletteSemanticAliases[color as BadgeColor] ?? color;
}

function getBadgePlaygroundColorOptions(paletteColors: BadgeColor[]) {
  const paletteOptions = paletteColors
    .filter((color) => !badgePaletteSemanticAliases[color])
    .map((color) => ({
      label: color.charAt(0).toUpperCase() + color.slice(1),
      value: color as BadgeColorProp,
    }));

  const semanticOptions = (
    Object.keys(badgeSemanticColors) as BadgeSemanticColor[]
  ).map((color) => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
  }));

  return [...paletteOptions, ...semanticOptions];
}

const badgeDotSizes = {
  sm: 6,
  md: 7,
  lg: 8,
} as const;

const badgeRowClassName = {
  sm: "gap-1 px-2",
  md: "gap-1.5 px-2.5",
  lg: "gap-1.5 px-3",
} as const;

const badgeDismissibleRowClassName = {
  sm: "gap-0.5 pl-2 pr-1",
  md: "gap-0.5 pl-2.5 pr-1",
  lg: "gap-0.5 pl-3 pr-1",
} as const;

const badgeDismissButtonSizes = {
  sm: "size-3.5 [&_svg]:size-2.5",
  md: "size-3.5 [&_svg]:size-3",
  lg: "size-4 [&_svg]:size-3",
} as const;

const badgeIconClassName = {
  sm: "[&_svg]:size-2.5",
  md: "[&_svg]:size-3",
  lg: "[&_svg]:size-3.5",
} as const;

type BadgeColorVars = CSSProperties & {
  "--badge-bg"?: string;
  "--badge-fg"?: string;
  "--badge-dot"?: string;
  "--badge-border"?: string;
};

function getBadgeColorVariables(color: BadgeColor): BadgeColorVars {
  if (color === "gray") {
    return {
      "--badge-bg": "var(--ic-accent)",
      "--badge-fg": "var(--ic-foreground)",
      "--badge-dot": "var(--ic-muted-foreground)",
      "--badge-border": "var(--ic-border)",
    };
  }

  const hex = badgeColors[color];

  return {
    "--badge-bg": `color-mix(in srgb, ${hex} 18%, var(--ic-background))`,
    "--badge-fg": `color-mix(in srgb, ${hex} 72%, var(--ic-foreground))`,
    "--badge-dot": hex,
    "--badge-border": `color-mix(in srgb, ${hex} 22%, var(--ic-border))`,
  };
}

const badgeVariants = cva(
  "relative inline-flex items-center whitespace-nowrap rounded-full px-0 font-medium leading-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--badge-bg)] text-[var(--badge-fg)]",
        dot: "border border-[var(--badge-border,var(--ic-border))] bg-background text-[var(--badge-fg,var(--ic-foreground))]",
      },
      size: {
        sm: "h-5 text-[11px]",
        md: "h-6 text-[12px]",
        lg: "h-7 text-[13px]",
      },
      interactive: {
        true: "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

type SpanHTMLAttributesForMotion = Omit<
  HTMLAttributes<HTMLSpanElement>,
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
  | "color"
>;

interface BadgeProps
  extends Omit<SpanHTMLAttributesForMotion, "color">,
    Omit<VariantProps<typeof badgeVariants>, "interactive"> {
  animate?: boolean;
  asChild?: boolean;
  color?: BadgeColorProp;
  dismissLabel?: string;
  icon?: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  shimmer?: boolean;
  waveColor?: string;
}

function resolveBadgeColor(color: BadgeColorProp): BadgeColor {
  if (color in badgeSemanticColors) {
    return badgeSemanticColors[color as BadgeSemanticColor];
  }

  if (color in badgeColors) {
    return color as BadgeColor;
  }

  return "gray";
}

function BadgeDismissButton({
  dismissLabel,
  onDismiss,
  size,
}: {
  dismissLabel?: string;
  onDismiss: MouseEventHandler<HTMLButtonElement>;
  size: BadgeSize;
}) {
  return (
    <button
      aria-label={dismissLabel ?? "Remove"}
      className={cn(
        "relative z-20 inline-flex shrink-0 items-center justify-center rounded-full text-current/70 transition-colors hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)] hover:text-current focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        badgeDismissButtonSizes[size]
      )}
      onClick={(event) => {
        event.stopPropagation();
        onDismiss(event);
      }}
      type="button"
    >
      <svg aria-hidden fill="none" viewBox="0 0 12 12">
        <path
          d="M3 3l6 6M9 3 3 9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.75"
        />
      </svg>
    </button>
  );
}

function BadgeStatusDot({
  animate,
  size,
}: {
  animate: boolean;
  size: BadgeSize;
}) {
  const dotSize = badgeDotSizes[size];
  const Dot = animate ? motion.span : "span";

  return (
    <Dot
      {...(animate
        ? {
            animate: {
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1, 0.9],
            },
            transition: {
              duration: 1.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }
        : {})}
      aria-hidden
      className="shrink-0 rounded-full"
      style={{
        width: dotSize,
        height: dotSize,
        backgroundColor: "var(--badge-dot)",
      }}
    />
  );
}

type BadgeBehavior = {
  hasIcon: boolean;
  isClickable: boolean;
  isDefault: boolean;
  mergedStyle: CSSProperties;
  resolvedSize: BadgeSize;
  rootClassName: string;
  rowClassName: string;
  shouldBlinkDot: boolean;
  shouldEntrance: boolean;
  shouldShimmer: boolean;
  showDismiss: boolean;
  useMotionRoot: boolean;
};

function getBadgeBehavior({
  animate,
  asChild,
  className,
  color,
  icon,
  onClick,
  onDismiss,
  reduceMotion,
  shimmer,
  size,
  style,
  variant,
}: {
  animate: boolean;
  asChild: boolean;
  className?: string;
  color: BadgeColorProp;
  icon?: ReactNode;
  onClick?: HTMLAttributes<HTMLSpanElement>["onClick"];
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  reduceMotion: boolean | null;
  shimmer: boolean;
  size: BadgeProps["size"];
  style?: CSSProperties;
  variant: BadgeProps["variant"];
}): BadgeBehavior {
  const resolvedSize = size ?? "md";
  const isDefault = variant === "default";
  const hasIcon = icon != null;
  const showDismiss = Boolean(onDismiss) && isDefault && !asChild && !hasIcon;
  const isClickable = Boolean(onClick);
  const shouldEntrance = animate && !reduceMotion && isDefault && !asChild;
  const shouldShimmer = shimmer && !reduceMotion && isDefault && !asChild;
  const shouldBlinkDot = animate && !isDefault && !reduceMotion && !asChild;
  const colorVariables = getBadgeColorVariables(resolveBadgeColor(color));

  return {
    resolvedSize,
    isDefault,
    hasIcon,
    showDismiss,
    isClickable,
    shouldEntrance,
    shouldShimmer,
    shouldBlinkDot,
    useMotionRoot: shouldEntrance,
    mergedStyle: { ...colorVariables, ...style },
    rootClassName: cn(
      componentThemeClassName,
      badgeVariants({
        variant,
        size: resolvedSize,
        interactive: isClickable,
      }),
      shouldShimmer && "overflow-hidden",
      className
    ),
    rowClassName: showDismiss
      ? badgeDismissibleRowClassName[resolvedSize]
      : badgeRowClassName[resolvedSize],
  };
}

function createBadgeRootKeyDownHandler({
  isClickable,
  onClick,
  onKeyDown,
}: {
  isClickable: boolean;
  onClick?: HTMLAttributes<HTMLSpanElement>["onClick"];
  onKeyDown?: KeyboardEventHandler<HTMLSpanElement>;
}): KeyboardEventHandler<HTMLSpanElement> {
  return (event) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isClickable) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event as unknown as React.MouseEvent<HTMLSpanElement>);
    }
  };
}

function buildBadgeRootProps({
  behavior,
  onClick,
  onKeyDown,
  props,
  ref,
}: {
  behavior: BadgeBehavior;
  onClick?: HTMLAttributes<HTMLSpanElement>["onClick"];
  onKeyDown?: KeyboardEventHandler<HTMLSpanElement>;
  props: SpanHTMLAttributesForMotion;
  ref: ForwardedRef<HTMLSpanElement>;
}) {
  const handleRootKeyDown = createBadgeRootKeyDownHandler({
    isClickable: behavior.isClickable,
    onClick,
    onKeyDown,
  });

  return {
    ...props,
    className: behavior.rootClassName,
    "data-slot": "badge",
    ref,
    style: behavior.mergedStyle,
    ...(behavior.useMotionRoot
      ? {
          animate: { opacity: 1, scale: 1 },
          initial: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.3 },
        }
      : {}),
    ...(behavior.isClickable
      ? {
          role: props.role ?? "button",
          tabIndex: props.tabIndex ?? 0,
        }
      : {}),
    onClick: behavior.isClickable ? onClick : undefined,
    onKeyDown:
      behavior.isClickable || onKeyDown ? handleRootKeyDown : onKeyDown,
  };
}

function BadgeShimmer({ waveColor }: { waveColor?: string }) {
  return (
    <motion.span
      animate={{ x: ["-100%", "200%"] }}
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${
          waveColor ?? "color-mix(in srgb, currentColor 18%, transparent)"
        } 50%, transparent 100%)`,
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
    />
  );
}

function BadgeContentRow({
  behavior,
  children,
  dismissLabel,
  icon,
  onDismiss,
}: {
  behavior: BadgeBehavior;
  children: ReactNode;
  dismissLabel?: string;
  icon?: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <span
      className={cn(
        "relative z-10 inline-flex h-full min-w-0 items-center",
        behavior.rowClassName
      )}
    >
      {behavior.isDefault ? null : (
        <BadgeStatusDot
          animate={behavior.shouldBlinkDot}
          size={behavior.resolvedSize}
        />
      )}
      {behavior.isDefault && behavior.hasIcon ? (
        <span
          aria-hidden
          className={cn(
            "inline-flex shrink-0",
            badgeIconClassName[behavior.resolvedSize]
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className={cn("min-w-0", behavior.showDismiss && "truncate")}>
        {children}
      </span>
      {behavior.showDismiss && onDismiss ? (
        <BadgeDismissButton
          dismissLabel={dismissLabel}
          onDismiss={onDismiss}
          size={behavior.resolvedSize}
        />
      ) : null}
    </span>
  );
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      animate = true,
      asChild = false,
      className,
      color = "gray",
      dismissLabel,
      icon,
      onClick,
      onDismiss,
      onKeyDown,
      shimmer = true,
      size = "md",
      style,
      variant = "default",
      waveColor,
      children,
      ...props
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion();
    const behavior = getBadgeBehavior({
      animate,
      asChild,
      className,
      color,
      icon,
      onClick,
      onDismiss,
      reduceMotion,
      shimmer,
      size,
      style,
      variant,
    });

    if (asChild) {
      return (
        <Slot
          className={behavior.rootClassName}
          data-slot="badge"
          onClick={onClick}
          ref={ref}
          style={behavior.mergedStyle}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const Root = behavior.useMotionRoot ? motion.span : "span";
    const rootProps = buildBadgeRootProps({
      behavior,
      onClick,
      onKeyDown,
      props,
      ref,
    });

    return (
      <Root {...rootProps}>
        {behavior.shouldShimmer ? <BadgeShimmer waveColor={waveColor} /> : null}
        <BadgeContentRow
          behavior={behavior}
          dismissLabel={dismissLabel}
          icon={icon}
          onDismiss={onDismiss}
        >
          {children}
        </BadgeContentRow>
      </Root>
    );
  }
);

Badge.displayName = "Badge";

export {
  Badge,
  badgeColors,
  badgeSemanticColors,
  badgeVariants,
  getBadgeColorVariables,
  getBadgePlaygroundColorOptions,
  preferBadgeSemanticColor,
  resolveBadgeColor,
};
export type { BadgeColor, BadgeColorProp, BadgeProps, BadgeSemanticColor };
export default Badge;
