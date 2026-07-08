"use client";

import {
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  Info,
  OctagonAlert,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const DEFAULT_MORPH_DURATION_MS = 2400;

/** Bouncy-but-controlled spring driving the bar-to-pill layout morph. */
const MORPH_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
} as const;

/** Ease used for the entrance and dismiss height collapse. */
const COLLAPSE_TRANSITION = {
  duration: 0.45,
  ease: [0.32, 0.72, 0, 1],
} as const;

/**
 * Slow, constant-speed light sweep. The keyframes barely overshoot the
 * surface, so the band glides across at one steady pace and loops forever
 * without a fast off-screen catch-up.
 */
const SHEEN_KEYFRAMES = ["120% 0%", "-20% 0%"];

const SHEEN_TRANSITION = {
  duration: 6,
  ease: "linear",
  repeat: Number.POSITIVE_INFINITY,
} as const;

export type BannerVariant = "default" | "info" | "success" | "error";

type VariantStyle = {
  surface: string;
  ring: string;
  action: string;
  dismiss: string;
};

const VARIANT_STYLES: Record<BannerVariant, VariantStyle> = {
  default: {
    surface:
      "border-zinc-800/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 dark:border-zinc-300/70 dark:from-zinc-100 dark:via-white dark:to-zinc-100 dark:text-zinc-950",
    ring: "border-white/25 text-zinc-100 dark:border-zinc-900/25 dark:text-zinc-900",
    action:
      "border-white/40 text-white hover:bg-white/10 dark:border-zinc-900/30 dark:text-zinc-900 dark:hover:bg-zinc-900/[0.06]",
    dismiss:
      "text-zinc-400 hover:bg-white/10 hover:text-white dark:text-zinc-500 dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900",
  },
  info: {
    surface:
      "border-sky-800/60 bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-600 text-white",
    ring: "border-white/30 text-white",
    action: "border-white/45 text-white hover:bg-white/15",
    dismiss: "text-white/70 hover:bg-white/15 hover:text-white",
  },
  success: {
    surface:
      "border-emerald-800/60 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white",
    ring: "border-white/30 text-white",
    action: "border-white/45 text-white hover:bg-white/15",
    dismiss: "text-white/70 hover:bg-white/15 hover:text-white",
  },
  error: {
    surface:
      "border-rose-800/60 bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 text-white",
    ring: "border-white/30 text-white",
    action: "border-white/45 text-white hover:bg-white/15",
    dismiss: "text-white/70 hover:bg-white/15 hover:text-white",
  },
};

const VARIANT_ICONS: Record<BannerVariant, ReactNode> = {
  default: <CircleAlert className="size-4" />,
  info: <Info className="size-4" />,
  success: <CircleCheck className="size-4" />,
  error: <OctagonAlert className="size-4" />,
};

/** Crossfade-with-blur used when the bar content swaps to the pill content. */
const contentVariants = {
  initial: { opacity: 0, scale: 0.9, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.9, filter: "blur(4px)" },
};

/** Soft light sweep that loops across the gradient surface. */
function BannerSheen() {
  return (
    <motion.span
      animate={{ backgroundPosition: SHEEN_KEYFRAMES }}
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[length:250%_100%] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] dark:bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.22)_50%,transparent_70%)]"
      transition={SHEEN_TRANSITION}
    />
  );
}

function BannerAction({
  label,
  href,
  onClick,
  actionClass,
  reducedMotion,
}: {
  label: string;
  href?: string;
  onClick: () => void;
  actionClass: string;
  reducedMotion: boolean;
}) {
  const sharedClass = cn(
    "shrink-0 rounded-lg border bg-transparent px-3.5 py-1.5 font-medium text-xs outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/60",
    actionClass
  );
  const whileTap = reducedMotion ? undefined : { scale: 0.96 };

  if (href) {
    return (
      <motion.a
        className={cn(sharedClass, "group flex items-center gap-1.5")}
        href={href}
        onClick={onClick}
        whileTap={whileTap}
      >
        {label}
        <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
      </motion.a>
    );
  }

  return (
    <motion.button
      className={sharedClass}
      onClick={onClick}
      type="button"
      whileTap={whileTap}
    >
      {label}
    </motion.button>
  );
}

function BannerDismiss({
  dismissClass,
  onClick,
  reducedMotion,
}: {
  dismissClass: string;
  onClick: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      aria-label="Dismiss banner"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/60",
        dismissClass
      )}
      onClick={onClick}
      type="button"
      whileTap={reducedMotion ? undefined : { scale: 0.9 }}
    >
      <X className="size-4" />
    </motion.button>
  );
}

/**
 * Bar layout: ringed icon and message on the left, outlined action and
 * dismiss pinned to the right end.
 */
function BannerBarContent({
  children,
  leadingIcon,
  style,
  actionLabel,
  actionHref,
  onActionClick,
  dismissible,
  onClose,
  reducedMotion,
}: {
  children: ReactNode;
  leadingIcon: ReactNode;
  style: VariantStyle;
  actionLabel?: string;
  actionHref?: string;
  onActionClick: () => void;
  dismissible: boolean;
  onClose: () => void;
  reducedMotion: boolean;
}) {
  return (
    <>
      {leadingIcon ? (
        <span
          aria-hidden
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border",
            style.ring
          )}
        >
          {leadingIcon}
        </span>
      ) : null}

      <span className="min-w-0 flex-1 text-left font-medium leading-snug">
        {children}
      </span>

      {actionLabel ? (
        <BannerAction
          actionClass={style.action}
          href={actionHref}
          label={actionLabel}
          onClick={onActionClick}
          reducedMotion={reducedMotion}
        />
      ) : null}

      {dismissible ? (
        <BannerDismiss
          dismissClass={style.dismiss}
          onClick={onClose}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </>
  );
}

function BannerPillContent({
  icon,
  iconClass,
  message,
}: {
  icon: ReactNode;
  iconClass: string;
  message?: string;
}) {
  return (
    <>
      <span className={cn("shrink-0", iconClass)}>
        {icon ?? <Check className="size-4" strokeWidth={2.5} />}
      </span>
      <span className="whitespace-nowrap">{message}</span>
    </>
  );
}

/**
 * The morphing surface: a full-width bar that springs into a centered
 * confirmation pill via a single layout animation while its content
 * crossfades through a soft blur.
 */
function BannerSurface({
  children,
  isPill,
  style,
  leadingIcon,
  actionLabel,
  actionHref,
  onActionClick,
  morphIcon,
  morphMessage,
  dismissible,
  onClose,
  reducedMotion,
}: {
  children: ReactNode;
  isPill: boolean;
  style: VariantStyle;
  leadingIcon: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onActionClick: () => void;
  morphIcon?: ReactNode;
  morphMessage?: string;
  dismissible: boolean;
  onClose: () => void;
  reducedMotion: boolean;
}) {
  const morphTransition = reducedMotion ? { duration: 0 } : MORPH_SPRING;

  return (
    <div className={cn("flex justify-center", isPill && "py-2.5")}>
      <motion.div
        className={cn(
          "relative overflow-hidden border text-sm",
          isPill ? "w-auto border shadow-lg" : "w-full border-x-0 border-t-0",
          style.surface
        )}
        data-phase={isPill ? "pill" : "bar"}
        layout={!reducedMotion}
        style={{ borderRadius: isPill ? 9999 : 0 }}
        transition={morphTransition}
      >
        {reducedMotion || isPill ? null : <BannerSheen />}

        <AnimatePresence initial={false} mode="popLayout">
          {isPill ? (
            <motion.div
              animate="animate"
              className="flex items-center gap-2 px-4 py-2 font-medium"
              exit="exit"
              initial="initial"
              key="pill"
              layout="position"
              role="status"
              transition={morphTransition}
              variants={contentVariants}
            >
              <BannerPillContent
                icon={morphIcon}
                iconClass={style.ring}
                message={morphMessage}
              />
            </motion.div>
          ) : (
            <motion.div
              animate="animate"
              className="flex items-center gap-3 px-4 py-2.5 sm:px-6"
              exit="exit"
              initial="initial"
              key="bar"
              layout="position"
              transition={morphTransition}
              variants={contentVariants}
            >
              <BannerBarContent
                actionHref={actionHref}
                actionLabel={actionLabel}
                dismissible={dismissible}
                leadingIcon={leadingIcon}
                onActionClick={onActionClick}
                onClose={onClose}
                reducedMotion={reducedMotion}
                style={style}
              >
                {children}
              </BannerBarContent>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export type BannerProps = {
  /** Announcement message, left-aligned next to the icon. */
  children: ReactNode;
  /** Visual tone of the gradient surface. */
  variant?: BannerVariant;
  /** Icon inside the leading ring. Each variant ships a default; pass null to hide. */
  icon?: ReactNode;
  /** Label for the outlined action button on the right end. */
  actionLabel?: string;
  /** Renders the action as a link and appends an arrow that nudges on hover. */
  actionHref?: string;
  /** Called when the action is clicked. */
  onAction?: () => void;
  /**
   * Enables the fluid morph: after the action is clicked the full-width bar
   * melts into a centered confirmation pill showing this message.
   */
  morphMessage?: string;
  /** Icon inside the confirmation pill. Defaults to a check. */
  morphIcon?: ReactNode;
  /**
   * How long the confirmation pill stays before the banner dismisses itself,
   * in milliseconds. Pass 0 to keep the pill on screen.
   */
  morphDuration?: number;
  /** Show the dismiss button on the right end. */
  dismissible?: boolean;
  /** Called after the banner is dismissed — by the X or after a morph. */
  onDismiss?: () => void;
  /** Controlled visibility. The banner animates out when this turns false. */
  open?: boolean;
  /** Pin the banner to the top of the viewport instead of rendering in flow. */
  fixed?: boolean;
  /** Extra classes for the positioning wrapper. */
  className?: string;
};

export function Banner({
  children,
  variant = "default",
  icon,
  actionLabel,
  actionHref,
  onAction,
  morphMessage,
  morphIcon,
  morphDuration = DEFAULT_MORPH_DURATION_MS,
  dismissible = true,
  onDismiss,
  open,
  fixed = false,
  className,
}: BannerProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [internalOpen, setInternalOpen] = useState(true);
  const [phase, setPhase] = useState<"bar" | "pill">("bar");
  const dismissTimer = useRef<number | null>(null);

  const isOpen = open ?? internalOpen;
  const style = VARIANT_STYLES[variant];
  const leadingIcon = icon === undefined ? VARIANT_ICONS[variant] : icon;

  const close = useCallback(() => {
    setInternalOpen(false);
    onDismiss?.();
  }, [onDismiss]);

  const handleAction = useCallback(() => {
    onAction?.();

    if (morphMessage) {
      setPhase("pill");
    }
  }, [onAction, morphMessage]);

  // The pill lingers for morphDuration, then the banner dismisses itself.
  useEffect(() => {
    if (phase !== "pill" || morphDuration <= 0) {
      return;
    }

    dismissTimer.current = window.setTimeout(close, morphDuration);

    return () => {
      if (dismissTimer.current !== null) {
        window.clearTimeout(dismissTimer.current);
      }
    };
  }, [phase, morphDuration, close]);

  return (
    <div
      className={cn(
        fixed ? "fixed inset-x-0 top-0 z-50" : "relative w-full",
        className
      )}
      data-slot="banner"
      data-variant={variant}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : COLLAPSE_TRANSITION}
          >
            <BannerSurface
              actionHref={actionHref}
              actionLabel={actionLabel}
              dismissible={dismissible}
              isPill={phase === "pill"}
              leadingIcon={leadingIcon}
              morphIcon={morphIcon}
              morphMessage={morphMessage}
              onActionClick={handleAction}
              onClose={close}
              reducedMotion={reducedMotion}
              style={style}
            >
              {children}
            </BannerSurface>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
