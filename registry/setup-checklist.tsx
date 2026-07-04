"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { type ReactNode, useCallback, useEffect, useState } from "react";

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
const PIE_CIRCUMFERENCE = 2 * Math.PI * PIE_RADIUS;

export type SetupChecklistItem = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
};

export type SetupChecklistProps = {
  items: SetupChecklistItem[];
  title?: string;
  description?: string;
  /** Controlled list of completed item ids. */
  completedIds?: string[];
  /** Initial completed item ids for uncontrolled usage. */
  defaultCompletedIds?: string[];
  onCompletedChange?: (completedIds: string[]) => void;
  onItemToggle?: (id: string, completed: boolean) => void;
  /** Show the floating progress pill under the card. Defaults to true. */
  showProgress?: boolean;
  progressLabel?: string;
  className?: string;
};

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

function ProgressPie({ fraction }: { fraction: number }) {
  const reduceMotion = useReducedMotion() === true;
  const spring = useSpring(reduceMotion ? fraction : 0, {
    stiffness: 110,
    damping: 24,
  });

  useEffect(() => {
    spring.set(fraction);
  }, [fraction, spring]);

  const dashArray = useTransform(
    spring,
    (value) =>
      `${Math.min(Math.max(value, 0), 1) * PIE_CIRCUMFERENCE} ${PIE_CIRCUMFERENCE}`
  );

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
        className="text-foreground"
        cx="10"
        cy="10"
        fill="none"
        r={PIE_RADIUS}
        stroke="currentColor"
        strokeWidth={PIE_RADIUS * 2}
        style={{ strokeDasharray: dashArray }}
      />
    </svg>
  );
}

function ProgressPill({
  label,
  fraction,
}: {
  label: string;
  fraction: number;
}) {
  const reduceMotion = useReducedMotion() === true;
  const percentSpring = useSpring(reduceMotion ? fraction * 100 : 0, {
    stiffness: 110,
    damping: 24,
  });
  const [displayPercent, setDisplayPercent] = useState(() =>
    reduceMotion ? Math.round(fraction * 100) : 0
  );

  useEffect(() => {
    percentSpring.set(fraction * 100);
  }, [fraction, percentSpring]);

  useMotionValueEvent(percentSpring, "change", (value) => {
    setDisplayPercent(Math.round(Math.min(Math.max(value, 0), 100)));
  });

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2.5 rounded-full border border-foreground/1 bg-card py-3 pr-4 pl-5"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      transition={{ ...SPRING, delay: 0.25 }}
    >
      <span className="text-[13px] text-muted-foreground">
        {label}:{" "}
        <span className="font-medium text-foreground tabular-nums">
          {displayPercent}%
        </span>
      </span>
      <ProgressPie fraction={fraction} />
    </motion.div>
  );
}

function ChecklistRow({
  item,
  isCompleted,
  onToggle,
  variants,
}: {
  item: SetupChecklistItem;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  variants: Variants;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.li variants={variants}>
      <motion.button
        aria-pressed={isCompleted}
        className={cn(
          "relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors duration-300",
          isCompleted
            ? "border-transparent bg-muted/70"
            : "border-foreground/8 bg-transparent hover:bg-muted/40"
        )}
        onClick={() => onToggle(item.id)}
        type="button"
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      >
        {item.icon ? (
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl border border-foreground/8 text-foreground transition-opacity duration-300 [&_svg]:size-5",
              isCompleted && "opacity-60"
            )}
          >
            {item.icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 pr-6">
          <span
            className={cn(
              "block font-medium text-[15px] text-foreground transition-opacity duration-300",
              isCompleted && "opacity-70"
            )}
          >
            {item.title}
          </span>
          {item.description ? (
            <span className="mt-0.5 block text-[13px] text-muted-foreground leading-snug">
              {item.description}
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

export function SetupChecklist({
  items,
  title = "Onboarding Checklist",
  description = "Finish the remaining tasks to fully activate your workspace.",
  completedIds,
  defaultCompletedIds,
  onCompletedChange,
  onItemToggle,
  showProgress = true,
  progressLabel = "Onboarding Progress",
  className,
}: SetupChecklistProps) {
  const reduceMotion = useReducedMotion() === true;
  const isControlled = completedIds !== undefined;
  const [internalCompleted, setInternalCompleted] = useState<string[]>(
    () => defaultCompletedIds ?? []
  );

  const completed = isControlled ? completedIds : internalCompleted;
  const fraction = items.length > 0 ? completed.length / items.length : 0;

  const toggleItem = useCallback(
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

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? undefined
        : { staggerChildren: 0.07, delayChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: SPRING },
  };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <motion.section
        animate={{ opacity: 1, y: 0, scale: 1 }}
        aria-label={title}
        className="rounded-3xl border border-foreground/8 bg-card p-5 drop-shadow-xs sm:p-6"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        transition={SPRING}
      >
        <div>
          <h2 className="font-semibold text-base text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-[13px] text-muted-foreground leading-snug">
              {description}
            </p>
          ) : null}
        </div>

        <motion.ul
          animate="visible"
          className="mt-5 flex flex-col gap-3"
          initial={reduceMotion ? false : "hidden"}
          variants={listVariants}
        >
          {items.map((item) => (
            <ChecklistRow
              isCompleted={completed.includes(item.id)}
              item={item}
              key={item.id}
              onToggle={toggleItem}
              variants={itemVariants}
            />
          ))}
        </motion.ul>
      </motion.section>

      {showProgress ? (
        <div className="mt-4 flex justify-end">
          <ProgressPill fraction={fraction} label={progressLabel} />
        </div>
      ) : null}
    </div>
  );
}

export default SetupChecklist;
