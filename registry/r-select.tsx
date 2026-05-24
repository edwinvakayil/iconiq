"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

const MAX_MENU_HEIGHT = 320;
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_EASE = [0.55, 0.06, 0.68, 0.19] as const;
const CHECK_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.55,
} as const;
const PRESS_SPRING = {
  type: "spring",
  stiffness: 560,
  damping: 32,
  mass: 0.48,
} as const;

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  group?: string;
}

export interface SelectProps extends ReducedMotionProp {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type SelectSection = {
  items: Array<{
    index: number;
    option: SelectOption;
  }>;
  key: string;
  label?: string;
};

type SelectItemRowProps = {
  activeHighlightId: string;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  itemVariants: ReturnType<typeof getItemVariants>;
  option: SelectOption;
  reduceMotion: boolean;
  setHoveredValue: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function getSelectSections(options: SelectOption[]) {
  const nextSections: SelectSection[] = [];

  options.forEach((option, index) => {
    const groupLabel = option.group?.trim();
    const previousSection = nextSections.at(-1);

    if (groupLabel) {
      if (previousSection?.label === groupLabel) {
        previousSection.items.push({ index, option });
        return;
      }

      nextSections.push({
        items: [{ index, option }],
        key: `${groupLabel}-${nextSections.length}`,
        label: groupLabel,
      });
      return;
    }

    nextSections.push({
      items: [{ index, option }],
      key: `ungrouped-${index}`,
    });
  });

  return nextSections;
}

function getItemVariants(reduceMotion: boolean) {
  return {
    exit: (index: number) => ({
      opacity: 0,
      y: reduceMotion ? 0 : -2,
      transition: {
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.01,
        duration: reduceMotion ? 0.1 : 0.12,
        ease: reduceMotion ? ("easeOut" as const) : EXIT_EASE,
      },
    }),
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : -4,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.02,
        duration: reduceMotion ? 0.12 : 0.18,
        ease: reduceMotion ? ("easeOut" as const) : SOFT_EASE,
      },
    }),
  };
}

function SelectItemRow({
  activeHighlightId,
  index,
  isHovered,
  isSelected,
  itemVariants,
  option,
  reduceMotion,
  setHoveredValue,
}: SelectItemRowProps) {
  const pressTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : PRESS_SPRING;
  const hoverTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 600, damping: 38 };
  const checkTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : CHECK_SPRING;

  return (
    <SelectPrimitive.Item asChild textValue={option.label} value={option.value}>
      <motion.div
        animate="visible"
        className={cn(
          "relative flex min-h-11 cursor-pointer touch-manipulation select-none items-center gap-3 rounded-lg px-3 py-2.5 text-foreground text-sm outline-none transition-colors"
        )}
        custom={index}
        exit="exit"
        initial="hidden"
        onMouseEnter={() => {
          setHoveredValue(option.value);
        }}
        onPointerMove={() => {
          setHoveredValue(option.value);
        }}
        transition={pressTransition}
        variants={itemVariants}
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      >
        {isHovered ? (
          <motion.span
            className="absolute inset-0 rounded-lg bg-accent"
            layoutId={activeHighlightId}
            transition={hoverTransition}
          />
        ) : null}
        {option.icon ? (
          <span className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
            {option.icon}
          </span>
        ) : null}
        <span className="relative z-10 min-w-0 flex-1 text-left">
          <SelectPrimitive.ItemText className="block truncate">
            {option.label}
          </SelectPrimitive.ItemText>
        </span>
        <span className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center">
          <AnimatePresence>
            {isSelected ? (
              <motion.span
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="text-primary"
                exit={{ opacity: 0, scale: 0.8, y: 1 }}
                initial={{ opacity: 0, scale: 0.8, y: 1 }}
                transition={checkTransition}
              >
                <Check className="h-4 w-4" />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
      </motion.div>
    </SelectPrimitive.Item>
  );
}

function SelectMenuSection({
  activeHighlightId,
  hoveredValue,
  itemVariants,
  reduceMotion,
  section,
  setHoveredValue,
  value,
}: {
  activeHighlightId: string;
  hoveredValue?: string;
  itemVariants: ReturnType<typeof getItemVariants>;
  reduceMotion: boolean;
  section: SelectSection;
  setHoveredValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  value?: string;
}) {
  const items = section.items.map((option) => (
    <SelectItemRow
      activeHighlightId={activeHighlightId}
      index={option.index}
      isHovered={option.option.value === hoveredValue}
      isSelected={option.option.value === value}
      itemVariants={itemVariants}
      key={option.option.value}
      option={option.option}
      reduceMotion={reduceMotion}
      setHoveredValue={setHoveredValue}
    />
  ));

  if (!section.label) {
    return <div className="space-y-1">{items}</div>;
  }

  return (
    <SelectPrimitive.Group className="pt-2 first:pt-0">
      <SelectPrimitive.Label className="px-3 pb-1.5 font-medium text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
        {section.label}
      </SelectPrimitive.Label>
      <div className="space-y-1">{items}</div>
    </SelectPrimitive.Group>
  );
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option…",
  className,
  reducedMotion,
}: SelectProps) {
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const [open, setOpen] = React.useState(false);
  const [hoveredValue, setHoveredValue] = React.useState<string | undefined>();
  const selected = options.find((option) => option.value === value);
  const itemVariants = React.useMemo(
    () => getItemVariants(reduceMotion),
    [reduceMotion]
  );
  const buttonTransition = reduceMotion
    ? { duration: 0.1, ease: "easeOut" as const }
    : PRESS_SPRING;
  const panelTransition = reduceMotion
    ? { duration: 0.14, ease: "easeOut" as const }
    : { duration: 0.22, ease: SOFT_EASE };
  const chevronTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { duration: 0.2, ease: SOFT_EASE };
  const sections = React.useMemo(() => getSelectSections(options), [options]);

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <div className={cn(registryTheme, "relative w-72 max-w-full", className)}>
        <SelectPrimitive.Root
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            setHoveredValue(undefined);
          }}
          onValueChange={onChange}
          open={open}
          value={value}
        >
          <SelectPrimitive.Trigger asChild>
            <motion.button
              aria-label={selected ? selected.label : placeholder}
              className="flex min-h-11 w-full touch-manipulation items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground text-sm transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-state={open ? "open" : "closed"}
              transition={buttonTransition}
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  selected ? "text-foreground" : "text-muted-foreground"
                )}
                title={selected ? selected.label : placeholder}
              >
                {selected ? selected.label : placeholder}
              </span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                className="shrink-0"
                transition={chevronTransition}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.span>
            </motion.button>
          </SelectPrimitive.Trigger>

          <AnimatePresence>
            {open ? (
              <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                  align="start"
                  asChild
                  collisionPadding={12}
                  position="popper"
                  sideOffset={8}
                >
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      registryTheme,
                      "z-[300] overflow-hidden rounded-lg border border-border bg-card shadow-lg"
                    )}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                    key="select-dropdown"
                    style={{
                      maxHeight: `min(var(--radix-select-content-available-height), ${MAX_MENU_HEIGHT}px)`,
                      transformOrigin:
                        "var(--radix-select-content-transform-origin)",
                      width: "var(--radix-select-trigger-width)",
                    }}
                    transition={panelTransition}
                  >
                    <SelectPrimitive.Viewport
                      className="overflow-y-auto overscroll-contain p-1.5 outline-none"
                      onPointerLeave={() => {
                        setHoveredValue(undefined);
                      }}
                    >
                      {options.length === 0 ? (
                        <div className="px-3 py-3 text-muted-foreground text-sm">
                          No options available.
                        </div>
                      ) : (
                        sections.map((section) => (
                          <SelectMenuSection
                            activeHighlightId="select-active-option"
                            hoveredValue={hoveredValue}
                            itemVariants={itemVariants}
                            key={section.key}
                            reduceMotion={reduceMotion}
                            section={section}
                            setHoveredValue={setHoveredValue}
                            value={value}
                          />
                        ))
                      )}
                    </SelectPrimitive.Viewport>
                  </motion.div>
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            ) : null}
          </AnimatePresence>
        </SelectPrimitive.Root>
      </div>
    </ReducedMotionConfig>
  );
}

export { Select as select };
