"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { Check } from "lucide-react";
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import {
  type CSSProperties,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

// SSR-safe layout effect: "use client" still server-renders on first paint,
// and useLayoutEffect warns when it runs there.
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type ReasoningStepStatus = "pending" | "active" | "done";

type StepRegistration = {
  id: string;
  label: ReactNode;
  status: ReasoningStepStatus;
};

type ReasoningStepsContextValue = {
  activeStep: StepRegistration | undefined;
  open: boolean;
  reduceMotion: boolean;
  registerStep: (id: string, info: StepRegistration) => void;
  shownDuration: number;
  unregisterStep: (id: string) => void;
};

const ReasoningStepsContext = createContext<ReasoningStepsContextValue | null>(
  null
);

function useReasoningStepsContext(component: string) {
  const context = useContext(ReasoningStepsContext);

  if (!context) {
    throw new Error(`${component} must be used within <ReasoningSteps>.`);
  }

  return context;
}

const TRIGGER_PRESS: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.7,
};

const GLYPH_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.6,
};

const EXPAND_SPRING: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 26,
  mass: 1.05,
};

const COLLAPSE_SPRING: Transition = {
  type: "spring",
  stiffness: 190,
  damping: 30,
  mass: 1.1,
};

const PREVIEW_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
};

const CONTENT_EASE = [0.16, 1, 0.3, 1] as const;
const PREVIEW_EASE = [0.4, 0, 0.2, 1] as const;
const INSTANT: Transition = { duration: 0.01 };

/**
 * Measures a panel's natural content height with ResizeObserver and returns a
 * concrete pixel value instead of relying on Motion's `height: "auto"`, which
 * resolves against the element's *visual* size — under a scaled ancestor
 * that overshoots and snaps back. `needsSnap` stays true until the first
 * measurement lands, so a panel that's already open on mount doesn't play a
 * grow-from-zero animation.
 */
function useMeasuredPanelHeight(open: boolean) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const needsSnap = useRef(open);

  const measureRef = useCallback((el: HTMLDivElement | null) => {
    roRef.current?.disconnect();
    roRef.current = null;
    innerRef.current = el;

    if (!el) {
      return;
    }

    if (el.offsetHeight > 0) {
      setHeight(el.offsetHeight);
    }

    const ro = new ResizeObserver(() => {
      if (el.offsetHeight > 0) {
        setHeight(el.offsetHeight);
      }
    });
    ro.observe(el);
    roRef.current = ro;
  }, []);

  useIsoLayoutEffect(() => {
    if (open && innerRef.current && innerRef.current.offsetHeight > 0) {
      setHeight(innerRef.current.offsetHeight);
    }
  }, [open]);

  useEffect(() => {
    if (height !== null) {
      needsSnap.current = false;
    }
  }, [height]);

  return { height, measureRef, needsSnap };
}

type PanelRenderProps = HTMLAttributes<HTMLDivElement> & {
  hidden?: boolean;
  ref?: Ref<HTMLDivElement>;
};

/**
 * Shared collapsible panel for both the main disclosure and nested step
 * details. Base UI's own `hidden` would apply the instant the panel closes —
 * it can't see the Motion exit still animating — so it's dropped in favor of
 * a `hidden` we only set once the collapse has visually finished.
 */
function MorphPanel({
  children,
  className,
  contentClassName,
  open,
  reduceMotion,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  open: boolean;
  reduceMotion: boolean;
}) {
  const { height, measureRef, needsSnap } = useMeasuredPanelHeight(open);
  const [exitComplete, setExitComplete] = useState(!open);

  if (open && exitComplete) {
    setExitComplete(false);
  }

  return (
    <CollapsiblePrimitive.Panel
      keepMounted
      render={(panelProps) => {
        const { hidden: _hidden, ...restPanelProps } =
          panelProps as PanelRenderProps;

        return (
          <div
            {...restPanelProps}
            className={cn("overflow-hidden", className)}
            hidden={!open && exitComplete}
          >
            <motion.div
              animate={{
                height: open ? (height ?? "auto") : 0,
                opacity: open ? 1 : 0,
              }}
              className="overflow-hidden"
              initial={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              onAnimationComplete={() => {
                if (!open) {
                  setExitComplete(true);
                }
              }}
              transition={
                reduceMotion || needsSnap.current
                  ? INSTANT
                  : open
                    ? EXPAND_SPRING
                    : COLLAPSE_SPRING
              }
            >
              <div className={contentClassName} ref={measureRef}>
                {children}
              </div>
            </motion.div>
          </div>
        );
      }}
    />
  );
}

/**
 * Only two states reach this — pending steps never render — so it's a plain
 * dot for "active" that pops into a check icon for "done", no border, no
 * loop.
 */
function StepGlyph({
  reduceMotion,
  status,
}: {
  reduceMotion: boolean;
  status: "active" | "done";
}) {
  return (
    <span className="flex size-3 shrink-0 items-center justify-center">
      <AnimatePresence initial={false} mode="wait">
        {status === "done" ? (
          <motion.span
            animate={{ scale: 1, opacity: 1 }}
            initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
            key="done"
            transition={GLYPH_SPRING}
          >
            <Check className="size-3 text-foreground" strokeWidth={3} />
          </motion.span>
        ) : (
          <motion.span
            animate={{ scale: 1, opacity: 1 }}
            className="size-1.5 rounded-full bg-foreground"
            initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
            key="active"
            transition={GLYPH_SPRING}
          />
        )}
      </AnimatePresence>
    </span>
  );
}

const SHIMMER_TRANSITION: Transition = {
  duration: 1.6,
  ease: "linear",
  repeat: Number.POSITIVE_INFINITY,
};

/**
 * Plain label when idle; a looping gradient sweep clipped to the text while
 * a step is active, instead of a separate status icon next to the word.
 */
function ShimmerLabel({
  active,
  children,
  reduceMotion,
}: {
  active: boolean;
  children: ReactNode;
  reduceMotion: boolean;
}) {
  if (!(active && !reduceMotion)) {
    return (
      <span className="font-medium text-[13px] text-foreground">
        {children}
      </span>
    );
  }

  return (
    <motion.span
      animate={{ backgroundPosition: "0% center" }}
      className="bg-[length:250%_100%,auto] bg-clip-text font-medium text-[13px] text-transparent [--rs-base:var(--muted-foreground)] [--rs-sheen:var(--foreground)] [background-repeat:no-repeat,padding-box]"
      initial={{ backgroundPosition: "100% center" }}
      style={
        {
          backgroundImage:
            "linear-gradient(90deg,#0000 calc(50% - 28px),var(--rs-sheen),#0000 calc(50% + 28px)), linear-gradient(var(--rs-base),var(--rs-base))",
        } as CSSProperties
      }
      transition={{ backgroundPosition: SHIMMER_TRANSITION }}
    >
      {children}
    </motion.span>
  );
}

function TriggerPreview({
  activeStep,
  reduceMotion,
}: {
  activeStep: StepRegistration | undefined;
  reduceMotion: boolean;
}) {
  if (!activeStep) {
    return null;
  }

  return (
    <span className="mt-0.5 block overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          className="block truncate text-[12px] text-muted-foreground"
          exit={
            reduceMotion
              ? undefined
              : { y: -8, opacity: 0, filter: "blur(3px)" }
          }
          initial={
            reduceMotion ? false : { y: 8, opacity: 0, filter: "blur(3px)" }
          }
          key={activeStep.id}
          transition={
            reduceMotion
              ? INSTANT
              : {
                  y: PREVIEW_SPRING,
                  opacity: { duration: 0.22, ease: PREVIEW_EASE },
                  filter: { duration: 0.22, ease: PREVIEW_EASE },
                }
          }
        >
          {activeStep.label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TriggerLabel({
  activeStep,
  isOpen,
  reduceMotion,
  shownDuration,
  title,
}: {
  activeStep: StepRegistration | undefined;
  isOpen: boolean;
  reduceMotion: boolean;
  shownDuration: number;
  title: ReactNode;
}) {
  return (
    <span className="min-w-0 flex-1">
      <span className="flex items-baseline gap-1.5">
        <ShimmerLabel
          active={activeStep !== undefined}
          reduceMotion={reduceMotion}
        >
          {title}
        </ShimmerLabel>
        {shownDuration > 0 ? (
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {shownDuration}s
          </span>
        ) : null}
      </span>
      {isOpen ? null : (
        <TriggerPreview activeStep={activeStep} reduceMotion={reduceMotion} />
      )}
    </span>
  );
}

interface ReasoningStepsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  /** Elapsed reasoning time in seconds. Omit to let the component time itself while a step is active. */
  duration?: number;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ReasoningSteps = forwardRef<HTMLDivElement, ReasoningStepsProps>(
  function ReasoningSteps(
    {
      children,
      className,
      defaultOpen = false,
      duration,
      onOpenChange,
      open: openProp,
      ...props
    },
    ref
  ) {
    const reduceMotion = useReducedMotion() === true;
    const isControlled = openProp !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = isControlled ? openProp : uncontrolledOpen;

    const handleOpenChange = useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(next);
        }
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const [registry, setRegistry] = useState<Map<string, StepRegistration>>(
      () => new Map()
    );

    const registerStep = useCallback((id: string, info: StepRegistration) => {
      setRegistry((prev) => {
        const existing = prev.get(id);
        if (
          existing &&
          existing.status === info.status &&
          existing.label === info.label
        ) {
          return prev;
        }
        const next = new Map(prev);
        next.set(id, info);
        return next;
      });
    }, []);

    const unregisterStep = useCallback((id: string) => {
      setRegistry((prev) => {
        if (!prev.has(id)) {
          return prev;
        }
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    }, []);

    const steps = useMemo(() => Array.from(registry.values()), [registry]);
    const activeStep = steps.find((step) => step.status === "active");
    const hasActive = activeStep !== undefined;

    const startTimeRef = useRef<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
      if (duration !== undefined || !hasActive) {
        return;
      }

      // Keeps a running total across separate active bursts instead of
      // restarting the clock each time.
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      const startTime = startTimeRef.current;
      const tick = () => {
        setElapsedSeconds(Math.round((Date.now() - startTime) / 1000));
      };

      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, [duration, hasActive]);

    const shownDuration = duration ?? elapsedSeconds;

    const contextValue = useMemo<ReasoningStepsContextValue>(
      () => ({
        activeStep,
        open,
        reduceMotion,
        registerStep,
        shownDuration,
        unregisterStep,
      }),
      [
        activeStep,
        open,
        reduceMotion,
        registerStep,
        shownDuration,
        unregisterStep,
      ]
    );

    return (
      <CollapsiblePrimitive.Root
        className={cn(
          "w-full max-w-md overflow-hidden rounded-2xl bg-card",
          className
        )}
        onOpenChange={handleOpenChange}
        open={open}
        ref={ref}
        {...props}
      >
        <ReasoningStepsContext.Provider value={contextValue}>
          {children}
        </ReasoningStepsContext.Provider>
      </CollapsiblePrimitive.Root>
    );
  }
);

ReasoningSteps.displayName = "ReasoningSteps";

interface ReasoningStepsTriggerProps {
  children?: ReactNode;
  className?: string;
}

function ReasoningStepsTrigger({
  children = "Reasoning",
  className,
}: ReasoningStepsTriggerProps) {
  const { activeStep, reduceMotion, shownDuration } = useReasoningStepsContext(
    "ReasoningStepsTrigger"
  );

  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      render={(triggerProps, state) => {
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
          ...restTriggerProps
        } = triggerProps;

        return (
          <motion.button
            {...restTriggerProps}
            transition={TRIGGER_PRESS}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          >
            <TriggerLabel
              activeStep={activeStep}
              isOpen={state.open}
              reduceMotion={reduceMotion}
              shownDuration={shownDuration}
              title={children}
            />
          </motion.button>
        );
      }}
    />
  );
}

interface ReasoningStepsContentProps {
  children: ReactNode;
  className?: string;
}

function ReasoningStepsContent({
  children,
  className,
}: ReasoningStepsContentProps) {
  const { open, reduceMotion } = useReasoningStepsContext(
    "ReasoningStepsContent"
  );

  return (
    <MorphPanel
      className={className}
      contentClassName="px-4 pt-1"
      open={open}
      reduceMotion={reduceMotion}
    >
      {/* The "reasoning-step-connector" class name here must match the one
          on each row's connector line below verbatim — Tailwind's scanner
          needs both as static string literals, so it can't be shared via a
          JS constant. */}
      <ul className="flex flex-col [&>li:last-child_.reasoning-step-connector]:hidden">
        {children}
      </ul>
    </MorphPanel>
  );
}

interface ReasoningStepProps {
  /** Stable identity; auto-generated when omitted. */
  id?: string;
  /** Defaults to "done". Steps marked "pending" render nothing until they flip to "active" or "done". */
  status?: ReasoningStepStatus;
  label: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

function ReasoningStep({
  children,
  className,
  description,
  id: idProp,
  label,
  status = "done",
}: ReasoningStepProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const { reduceMotion, registerStep, unregisterStep } =
    useReasoningStepsContext("ReasoningStep");

  useEffect(() => {
    if (status === "pending") {
      unregisterStep(id);
      return;
    }

    registerStep(id, { id, label, status });
    return () => unregisterStep(id);
  }, [id, label, registerStep, status, unregisterStep]);

  if (status === "pending") {
    return null;
  }

  const isActive = status === "active";

  return (
    <motion.li
      animate={{ height: "auto", opacity: 1 }}
      className={cn("overflow-hidden", className)}
      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
      transition={reduceMotion ? INSTANT : EXPAND_SPRING}
    >
      <div className="flex gap-3 pb-4">
        <div className="flex flex-col items-center">
          {/* h-5 matches the label's leading-5 line box, so the glyph
              centers on the same line instead of sitting flush at the top. */}
          <div className="flex h-5 items-center justify-center">
            <StepGlyph reduceMotion={reduceMotion} status={status} />
          </div>
          <span
            aria-hidden="true"
            className={cn(
              "reasoning-step-connector my-1 w-px flex-1 rounded-full transition-colors duration-500",
              status === "done" ? "bg-foreground/25" : "bg-foreground/10"
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[13px] leading-5 transition-colors duration-300",
              isActive ? "font-medium text-foreground" : "text-foreground/80"
            )}
          >
            {label}
          </p>
          {description ? (
            <p className="mt-0.5 text-[12px] text-muted-foreground leading-5">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </motion.li>
  );
}

interface ReasoningStepDetailsProps {
  summary: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

function ReasoningStepDetails({
  children,
  className,
  defaultOpen = false,
  summary,
}: ReasoningStepDetailsProps) {
  const { reduceMotion } = useReasoningStepsContext("ReasoningStepDetails");
  const [open, setOpen] = useState(defaultOpen);

  return (
    <CollapsiblePrimitive.Root
      className={cn("-mx-1 mt-1.5", className)}
      onOpenChange={setOpen}
      open={open}
    >
      <CollapsiblePrimitive.Trigger
        className="flex items-center gap-1.5 rounded-md px-1 py-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        render={(triggerProps) => (
          <button {...triggerProps} type="button">
            {summary}
          </button>
        )}
      />
      <MorphPanel
        contentClassName="px-1 pt-1 pb-0.5"
        open={open}
        reduceMotion={reduceMotion}
      >
        <div className="flex flex-col gap-1 text-[12px] text-muted-foreground leading-5">
          {children}
        </div>
      </MorphPanel>
    </CollapsiblePrimitive.Root>
  );
}

interface ReasoningStepSourcesProps {
  children: ReactNode;
  className?: string;
}

function ReasoningStepSources({
  children,
  className,
}: ReasoningStepSourcesProps) {
  return (
    <div className={cn("mt-2 flex flex-wrap gap-1.5", className)}>
      {children}
    </div>
  );
}

interface ReasoningStepSourceProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

function ReasoningStepSource({
  children,
  className,
  href,
}: ReasoningStepSourceProps) {
  const { reduceMotion } = useReasoningStepsContext("ReasoningStepSource");
  const pillClassName = cn(
    "inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-muted/60 px-2 py-0.5 text-[11px] text-foreground/70 transition-colors",
    href && "hover:bg-muted hover:text-foreground",
    className
  );

  if (href) {
    return (
      <motion.a
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        className={pillClassName}
        href={href}
        initial={
          reduceMotion
            ? false
            : { opacity: 0, scale: 0.85, filter: "blur(4px)" }
        }
        rel="noreferrer noopener"
        target="_blank"
        transition={GLYPH_SPRING}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.span
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      className={pillClassName}
      initial={
        reduceMotion ? false : { opacity: 0, scale: 0.85, filter: "blur(4px)" }
      }
      transition={GLYPH_SPRING}
    >
      {children}
    </motion.span>
  );
}

interface ReasoningStepImageProps {
  alt?: string;
  caption?: ReactNode;
  className?: string;
  src: string;
}

function ReasoningStepImage({
  alt = "",
  caption,
  className,
  src,
}: ReasoningStepImageProps) {
  const { reduceMotion } = useReasoningStepsContext("ReasoningStepImage");

  return (
    <motion.figure
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className={cn("mt-2", className)}
      initial={reduceMotion ? false : { opacity: 0, filter: "blur(4px)" }}
      transition={{ duration: 0.3, ease: CONTENT_EASE }}
    >
      {/* biome-ignore lint/performance/noImgElement: registry components stay framework-agnostic. */}
      <img
        alt={alt}
        className="w-full max-w-[220px] rounded-lg border border-foreground/10 object-cover"
        height={140}
        src={src}
        width={220}
      />
      {caption ? (
        <figcaption className="mt-1 text-[11px] text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

export {
  ReasoningSteps,
  ReasoningStepsTrigger,
  ReasoningStepsContent,
  ReasoningStep,
  ReasoningStepDetails,
  ReasoningStepSources,
  ReasoningStepSource,
  ReasoningStepImage,
};
export type {
  ReasoningStepStatus,
  ReasoningStepsProps,
  ReasoningStepsTriggerProps,
  ReasoningStepsContentProps,
  ReasoningStepProps,
  ReasoningStepDetailsProps,
  ReasoningStepSourcesProps,
  ReasoningStepSourceProps,
  ReasoningStepImageProps,
};
export default ReasoningSteps;
