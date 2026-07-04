"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  Children,
  createContext,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 32,
};

const BADGE_SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 28,
};

const PIE_RADIUS = 4.5;

type SetupChecklistContextValue = {
  completed: string[];
  fraction: number;
  toggle: (id: string) => void;
};

const SetupChecklistContext = createContext<SetupChecklistContextValue | null>(
  null
);

function useSetupChecklistContext(component: string) {
  const context = useContext(SetupChecklistContext);

  if (!context) {
    throw new Error(`${component} must be used within <SetupChecklist>.`);
  }

  return context;
}

/** Walks the composed children and collects the ids of every SetupChecklistItem. */
function collectItemIds(children: ReactNode, ids: string[]): string[] {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const type = child.type as { isSetupChecklistItem?: boolean };

    if (type === SetupChecklistItem || type.isSetupChecklistItem === true) {
      const { id } = child.props as SetupChecklistItemProps;

      if (id && !ids.includes(id)) {
        ids.push(id);
      }

      return;
    }

    const nested = (child.props as { children?: ReactNode }).children;

    if (nested) {
      collectItemIds(nested, ids);
    }
  });

  return ids;
}

export type SetupChecklistProps = {
  children: ReactNode;
  /** Controlled list of completed item ids. */
  completedIds?: string[];
  /** Initial completed item ids for uncontrolled usage. */
  defaultCompletedIds?: string[];
  onCompletedChange?: (completedIds: string[]) => void;
  onItemToggle?: (id: string, completed: boolean) => void;
  className?: string;
};

export function SetupChecklist({
  children,
  completedIds,
  defaultCompletedIds,
  onCompletedChange,
  onItemToggle,
  className,
}: SetupChecklistProps) {
  const isControlled = completedIds !== undefined;
  const [internalCompleted, setInternalCompleted] = useState<string[]>(
    () => defaultCompletedIds ?? []
  );
  const itemIds = useMemo(() => collectItemIds(children, []), [children]);

  const completed = isControlled ? completedIds : internalCompleted;

  const toggle = useCallback(
    (id: string) => {
      const isCompleted = completed.includes(id);
      const next = isCompleted
        ? completed.filter((value) => value !== id)
        : [...completed, id];

      if (!isControlled) {
        setInternalCompleted(next);
      }
      onCompletedChange?.(next);
      onItemToggle?.(id, !isCompleted);
    },
    [completed, isControlled, onCompletedChange, onItemToggle]
  );

  const value = useMemo(() => {
    const completedCount = itemIds.filter((id) =>
      completed.includes(id)
    ).length;

    return {
      completed,
      fraction: itemIds.length > 0 ? completedCount / itemIds.length : 0,
      toggle,
    };
  }, [completed, itemIds, toggle]);

  return (
    <SetupChecklistContext.Provider value={value}>
      <div className={cn("w-full max-w-md", className)}>{children}</div>
    </SetupChecklistContext.Provider>
  );
}

export function SetupChecklistCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.section
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "rounded-3xl border border-foreground/8 bg-card p-5 sm:p-6",
        className
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
      transition={SPRING}
    >
      {children}
    </motion.section>
  );
}

export function SetupChecklistHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function SetupChecklistTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("font-semibold text-base text-foreground", className)}>
      {children}
    </h2>
  );
}

export function SetupChecklistDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mt-1 text-[13px] text-muted-foreground leading-snug",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SetupChecklistList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() === true;

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? undefined
        : { staggerChildren: 0.07, delayChildren: 0.08 },
    },
  };

  return (
    <motion.ul
      animate="visible"
      className={cn("mt-5 flex flex-col gap-3", className)}
      initial={reduceMotion ? false : "hidden"}
      variants={listVariants}
    >
      {children}
    </motion.ul>
  );
}

function DrawnCheck() {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.svg
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.5}
      viewBox="0 0 24 24"
    >
      <motion.path
        animate={{ pathLength: 1 }}
        d="M4.5 12.5l5 5L19.5 6.5"
        initial={reduceMotion ? false : { pathLength: 0 }}
        transition={{ delay: 0.06, duration: 0.28, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/** Footer slot inside the card for a CTA, e.g. a submit button. */
export function SetupChecklistAction({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn("mt-5 flex justify-end gap-2", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      transition={{ ...SPRING, delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export type SetupChecklistItemProps = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Called on row click alongside the completion toggle. */
  onClick?: (id: string) => void;
  className?: string;
};

export function SetupChecklistItem({
  id,
  title,
  description,
  icon,
  onClick,
  className,
}: SetupChecklistItemProps) {
  const { completed, toggle } = useSetupChecklistContext("SetupChecklistItem");
  const reduceMotion = useReducedMotion() === true;

  const isCompleted = completed.includes(id);

  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: SPRING },
  };

  return (
    <motion.li variants={itemVariants}>
      <motion.button
        aria-pressed={isCompleted}
        className={cn(
          "relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors duration-300",
          isCompleted
            ? "border-transparent bg-muted/70"
            : "border-foreground/8 bg-transparent hover:bg-muted/40",
          className
        )}
        onClick={() => {
          toggle(id);
          onClick?.(id);
        }}
        type="button"
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      >
        {icon ? (
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl border border-foreground/8 text-foreground transition-opacity duration-300 [&_svg]:size-5",
              isCompleted && "opacity-60"
            )}
          >
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 pr-6">
          <span
            className={cn(
              "block font-medium text-[15px] text-foreground transition-opacity duration-300",
              isCompleted && "opacity-70"
            )}
          >
            {title}
          </span>
          {description ? (
            <span className="mt-0.5 block text-[13px] text-muted-foreground leading-snug">
              {description}
            </span>
          ) : null}
        </span>
        <AnimatePresence>
          {isCompleted ? (
            <motion.span
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white"
              exit={{ scale: 0.4, opacity: 0 }}
              initial={
                reduceMotion
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0.4, opacity: 0 }
              }
              transition={BADGE_SPRING}
            >
              <DrawnCheck />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.button>
    </motion.li>
  );
}

/** Identity-independent marker so children traversal survives HMR module swaps. */
SetupChecklistItem.isSetupChecklistItem = true;

const PROGRESS_SPRING = {
  type: "spring" as const,
  stiffness: 110,
  damping: 24,
};

function clampFraction(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function ProgressPie({
  fraction,
  onFrame,
  reduceMotion,
}: {
  fraction: number;
  onFrame: (fraction: number) => void;
  reduceMotion: boolean;
}) {
  return (
    <svg aria-hidden="true" className="size-5 -rotate-90" viewBox="0 0 20 20">
      <circle
        className="text-foreground"
        cx="10"
        cy="10"
        fill="none"
        r="8.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <motion.circle
        animate={{
          // Slight overshoot at 100% closes the hairline seam SVG leaves
          // where the dash meets its own start.
          pathLength:
            clampFraction(fraction) >= 1 ? 1.05 : clampFraction(fraction),
        }}
        className="text-foreground"
        cx="10"
        cy="10"
        fill="none"
        initial={reduceMotion ? false : { pathLength: 0 }}
        onUpdate={(latest) => {
          if (typeof latest.pathLength === "number") {
            onFrame(latest.pathLength);
          }
        }}
        r={PIE_RADIUS}
        stroke="currentColor"
        strokeWidth={PIE_RADIUS * 2}
        transition={reduceMotion ? { duration: 0 } : PROGRESS_SPRING}
      />
    </svg>
  );
}

export function SetupChecklistProgress({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { fraction } = useSetupChecklistContext("SetupChecklistProgress");
  const reduceMotion = useReducedMotion() === true;
  const [animatedFraction, setAnimatedFraction] = useState(0);

  const shownFraction = reduceMotion ? fraction : animatedFraction;
  const displayPercent = Math.round(clampFraction(shownFraction) * 100);

  return (
    <div className={cn("mt-4 flex justify-end", className)}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2.5 rounded-full border border-foreground/8 bg-card py-3 pr-4 pl-5"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        transition={{ ...SPRING, delay: 0.25 }}
      >
        <span className="text-[13px] text-muted-foreground">
          {children ? <>{children}: </> : null}
          <span className="font-medium text-foreground tabular-nums">
            {displayPercent}%
          </span>
        </span>
        <ProgressPie
          fraction={fraction}
          onFrame={setAnimatedFraction}
          reduceMotion={reduceMotion}
        />
      </motion.div>
    </div>
  );
}

export default SetupChecklist;
