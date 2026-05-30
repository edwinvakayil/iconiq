"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

/** Soft settle — fluid, low bounce (water-like). */
const springFlow = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
  mass: 0.65,
};

const springTap = {
  type: "spring" as const,
  stiffness: 520,
  damping: 36,
  mass: 0.35,
};

/** Snappy tick — must feel instant after click. */
const springCheck = {
  type: "spring" as const,
  stiffness: 720,
  damping: 34,
  mass: 0.38,
};

export interface CheckboxGroupOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  disabledReason?: string;
  group?: string;
}

interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  maxVisible?: number;
  showMoreLabel?: string;
  showLessLabel?: string;
}

interface CheckboxGroupSection {
  key: string;
  label?: string;
  options: CheckboxGroupOption[];
}

function buildSections(options: CheckboxGroupOption[]): CheckboxGroupSection[] {
  return options.reduce<CheckboxGroupSection[]>((sections, option, index) => {
    const label = option.group?.trim();
    const previousSection = sections.at(-1);

    if (previousSection && previousSection.label === label) {
      previousSection.options.push(option);
      return sections;
    }

    sections.push({
      key: label ? `${label}-${index}` : `section-${index}`,
      label,
      options: [option],
    });

    return sections;
  }, []);
}

function getOrderedValues(
  options: CheckboxGroupOption[],
  nextSelected: string[]
): string[] {
  const nextSet = new Set(nextSelected);
  const visibleValues = new Set(options.map((option) => option.value));

  const orderedVisibleValues = options
    .filter((option) => nextSet.has(option.value))
    .map((option) => option.value);

  const extraValues = nextSelected.filter((value) => !visibleValues.has(value));

  return [...orderedVisibleValues, ...extraValues];
}

function CheckboxGroup({
  options,
  value = [],
  onChange,
  className,
  maxVisible,
  showMoreLabel = "Show more",
  showLessLabel = "Show less",
}: CheckboxGroupProps) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setOptimisticValue(value);
  }, [value]);

  const canCollapse =
    typeof maxVisible === "number" &&
    maxVisible > 0 &&
    options.length > maxVisible;
  const forcedExpanded =
    canCollapse &&
    !expanded &&
    options
      .slice(maxVisible)
      .some((option) => optimisticValue.includes(option.value));
  const isExpanded = expanded || forcedExpanded;
  const visibleOptions =
    canCollapse && !isExpanded ? options.slice(0, maxVisible) : options;
  const hiddenCount = canCollapse ? options.length - visibleOptions.length : 0;
  const sections = buildSections(visibleOptions);

  const toggle = (optionValue: string) => {
    const nextSelected = optimisticValue.includes(optionValue)
      ? optimisticValue.filter((v) => v !== optionValue)
      : [...optimisticValue, optionValue];
    const next = getOrderedValues(options, nextSelected);

    setOptimisticValue(next);
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        componentThemeClassName,
        "flex flex-col gap-1.5",
        className
      )}
    >
      {sections.map((section) => (
        <div className="flex flex-col gap-1" key={section.key}>
          {section.label ? (
            <p className="px-4 pt-2 font-medium text-[11px] text-muted-foreground/80 uppercase tracking-[0.16em]">
              {section.label}
            </p>
          ) : null}

          {section.options.map((option) => {
            const checked = optimisticValue.includes(option.value);
            const disabled = option.disabled;

            return (
              <motion.button
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-left",
                  "transition-[background-color] duration-480 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "hover:bg-neutral-100/90 dark:hover:bg-neutral-800/50",
                  "active:bg-neutral-100 dark:active:bg-neutral-800/78",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "disabled:active:bg-transparent disabled:hover:bg-transparent",
                  "dark:disabled:active:bg-transparent dark:disabled:hover:bg-transparent"
                )}
                disabled={disabled}
                key={option.value}
                onClick={() => toggle(option.value)}
                transition={springTap}
                type="button"
                whileTap={
                  disabled
                    ? undefined
                    : {
                        scale: 0.985,
                        y: 0,
                        transition: springTap,
                      }
                }
              >
                <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                  <motion.div
                    className={cn(
                      "flex h-[18px] w-[18px] items-center justify-center rounded transition-[border-color] duration-420 ease-[cubic-bezier(0.25,0.85,0.3,1)]",
                      checked
                        ? "border-0 bg-transparent"
                        : [
                            "border-2 bg-transparent",
                            "border-neutral-300/90 group-hover:border-neutral-500/85",
                            "dark:border-neutral-600 dark:group-hover:border-neutral-400",
                          ]
                    )}
                    layout="position"
                    transition={springFlow}
                  >
                    <AnimatePresence initial={false} mode="sync">
                      {checked ? (
                        <motion.div
                          animate={{
                            opacity: 1,
                            rotate: 0,
                            scale: 1,
                          }}
                          className="flex items-center justify-center"
                          exit={{
                            opacity: 0,
                            rotate: -8,
                            scale: 0.86,
                            transition: {
                              duration: 0.12,
                              ease: [0.4, 0, 1, 1],
                            },
                          }}
                          initial={{
                            opacity: 0.92,
                            rotate: -5,
                            scale: 0.78,
                          }}
                          key="check"
                          transition={springCheck}
                        >
                          <Check
                            className="h-4 w-4 text-primary"
                            strokeWidth={3}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <div
                  className={cn(
                    "flex min-w-0 flex-col transition-transform duration-520 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "group-hover:translate-x-0.5"
                  )}
                >
                  <span className="font-medium text-foreground text-sm">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-muted-foreground text-xs">
                      {option.description}
                    </span>
                  )}
                  {disabled && option.disabledReason ? (
                    <span className="text-[11px] text-muted-foreground/90">
                      {option.disabledReason}
                    </span>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </div>
      ))}

      {canCollapse && !forcedExpanded ? (
        <button
          className={cn(
            "self-start rounded-md px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          onClick={() => setExpanded((previous) => !previous)}
          type="button"
        >
          {expanded ? showLessLabel : `${showMoreLabel} (${hiddenCount})`}
        </button>
      ) : null}
    </div>
  );
}

export { CheckboxGroup };
