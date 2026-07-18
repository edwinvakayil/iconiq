"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const springTap = {
  type: "spring" as const,
  stiffness: 520,
  damping: 36,
  mass: 0.35,
};

const labelTransition = { duration: 0.2 } as const;
const instantTransition = { duration: 0 } as const;
const pathEase = [0.65, 0, 0.35, 1] as const;

const checkmarkVariants = {
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.3, ease: pathEase },
      opacity: { duration: 0.05, delay: 0.06 },
    },
  },
  unchecked: {
    pathLength: 0,
    opacity: 0,
    transition: {
      pathLength: { duration: 0.25, ease: pathEase },
      opacity: { duration: 0.1, delay: 0.18 },
    },
  },
} as const;

const reducedCheckmarkVariants = {
  checked: { pathLength: 1, opacity: 1 },
  unchecked: { pathLength: 0, opacity: 0 },
} as const;

export type CheckboxGroupSize = "default" | "lg" | "sm";

const sizeStyles: Record<
  CheckboxGroupSize,
  {
    box: string;
    gap: string;
    icon: string;
    label: string;
    row: string;
  }
> = {
  sm: {
    box: "h-4 w-4",
    gap: "gap-2",
    icon: "h-3 w-3",
    label: "text-xs",
    row: "px-3 py-2.5",
  },
  default: {
    box: "h-[18px] w-[18px]",
    gap: "gap-3",
    icon: "h-4 w-4",
    label: "text-sm",
    row: "px-4 py-3",
  },
  lg: {
    box: "h-5 w-5",
    gap: "gap-3.5",
    icon: "h-4 w-4",
    label: "text-base",
    row: "px-4 py-3.5",
  },
};

export interface CheckboxGroupOption {
  description?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  group?: string;
  id?: string;
  label: React.ReactNode;
  readOnly?: boolean;
  value: string;
}

export interface CheckboxGroupProps {
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string[];
  disabled?: boolean;
  form?: string;
  invalid?: boolean;
  maxVisible?: number;
  name?: string;
  onChange?: (value: string[]) => void;
  options?: CheckboxGroupOption[];
  showLessLabel?: string;
  showMoreLabel?: string;
  size?: CheckboxGroupSize;
  value?: string[];
}

export interface CheckboxGroupSectionProps {
  children: React.ReactNode;
  disabled?: boolean;
  label?: string;
}

export interface CheckboxGroupItemProps {
  description?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  id?: string;
  label: React.ReactNode;
  readOnly?: boolean;
  value: string;
}

interface ParsedCheckboxGroupSection {
  disabled: boolean;
  key: string;
  label?: string;
  options: Array<{ index: number; option: CheckboxGroupOption }>;
}

interface CheckboxGroupModel {
  options: CheckboxGroupOption[];
  sections: ParsedCheckboxGroupSection[];
}

type CheckboxRootRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

type CheckboxGroupRowProps = {
  checked: boolean;
  descriptionId?: string;
  disabled: boolean;
  form?: string;
  groupDisabled: boolean;
  invalid: boolean;
  isHidden: boolean;
  labelId: string;
  name?: string;
  option: CheckboxGroupOption;
  prefersReducedMotion: boolean;
  sizing: (typeof sizeStyles)[CheckboxGroupSize];
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

function getGroupKey(option: CheckboxGroupOption) {
  return option.group?.trim() ?? "";
}

function buildSections(
  entries: Array<{ index: number; option: CheckboxGroupOption }>
): ParsedCheckboxGroupSection[] {
  return entries.reduce<ParsedCheckboxGroupSection[]>(
    (sections, entry, sectionIndex) => {
      const label = getGroupKey(entry.option);
      const previousSection = sections.at(-1);

      if (previousSection && previousSection.label === label) {
        previousSection.options.push(entry);
        return sections;
      }

      sections.push({
        disabled: false,
        key: label ? `${label}-${sectionIndex}` : `section-${sectionIndex}`,
        label: label || undefined,
        options: [entry],
      });

      return sections;
    },
    []
  );
}

function itemPropsToOption(props: CheckboxGroupItemProps): CheckboxGroupOption {
  const value = props.value.trim();

  if (!value) {
    warnInDevelopment("CheckboxGroupItem requires a non-empty value.");
  }

  return {
    description: props.description,
    disabled: props.disabled,
    disabledReason: props.disabledReason,
    id: props.id,
    label: props.label,
    readOnly: props.readOnly,
    value,
  };
}

function flattenCheckboxGroupChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type !== React.Fragment
  );
}

function hasCompoundChildren(children: React.ReactNode) {
  return flattenCheckboxGroupChildren(children).some(
    (child) =>
      isCheckboxGroupItemElement(child) || isCheckboxGroupSectionElement(child)
  );
}

function warnInDevelopment(message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[CheckboxGroup] ${message}`);
  }
}

function appendItemToModel(
  model: CheckboxGroupModel,
  itemProps: CheckboxGroupItemProps
) {
  const option = itemPropsToOption(itemProps);
  const index = model.options.length;

  model.options.push(option);

  return { index, option };
}

function buildModelFromOptions(
  options: CheckboxGroupOption[]
): CheckboxGroupModel {
  const allEntries = options.map((option, index) => ({ index, option }));

  return {
    options,
    sections: buildSections(allEntries),
  };
}

function isCheckboxGroupSectionElement(
  child: React.ReactNode
): child is React.ReactElement<CheckboxGroupSectionProps> {
  return React.isValidElement(child) && child.type === CheckboxGroupSection;
}

function isCheckboxGroupItemElement(
  child: React.ReactNode
): child is React.ReactElement<CheckboxGroupItemProps> {
  return React.isValidElement(child) && child.type === CheckboxGroupItem;
}

function buildModelFromChildren(children: React.ReactNode): CheckboxGroupModel {
  const model: CheckboxGroupModel = {
    options: [],
    sections: [],
  };
  const bareItems: React.ReactElement<CheckboxGroupItemProps>[] = [];
  const childArray = flattenCheckboxGroupChildren(children);

  const flushBareItems = (sectionIndex: number) => {
    if (bareItems.length === 0) {
      return;
    }

    const sectionOptions: Array<{
      index: number;
      option: CheckboxGroupOption;
    }> = [];

    for (const itemChild of bareItems) {
      sectionOptions.push(appendItemToModel(model, itemChild.props));
    }

    model.sections.push({
      disabled: false,
      key: `section-${sectionIndex}`,
      options: sectionOptions,
    });
    bareItems.length = 0;
  };

  childArray.forEach((child, childIndex) => {
    if (isCheckboxGroupItemElement(child)) {
      bareItems.push(child);
      return;
    }

    flushBareItems(childIndex);

    if (!isCheckboxGroupSectionElement(child)) {
      warnInDevelopment(
        "Only CheckboxGroupSection and CheckboxGroupItem children are rendered. Other elements are ignored."
      );
      return;
    }

    const { children: sectionChildren, disabled = false, label } = child.props;
    const sectionOptions: Array<{
      index: number;
      option: CheckboxGroupOption;
    }> = [];

    for (const itemChild of flattenCheckboxGroupChildren(sectionChildren)) {
      if (!isCheckboxGroupItemElement(itemChild)) {
        warnInDevelopment(
          "CheckboxGroupSection only accepts CheckboxGroupItem children. Other elements are ignored."
        );
        continue;
      }

      sectionOptions.push(appendItemToModel(model, itemChild.props));
    }

    if (sectionOptions.length === 0) {
      warnInDevelopment(
        "CheckboxGroupSection requires at least one CheckboxGroupItem child."
      );
      return;
    }

    model.sections.push({
      disabled,
      key: label ? `${label}-${childIndex}` : `section-${childIndex}`,
      label: label?.trim() || undefined,
      options: sectionOptions,
    });
  });

  flushBareItems(model.sections.length);

  return model;
}

function dedupeCheckboxGroupModel(
  model: CheckboxGroupModel
): CheckboxGroupModel {
  const firstOptionByValue = new Map<string, CheckboxGroupOption>();
  const duplicateValues: string[] = [];

  for (const option of model.options) {
    if (firstOptionByValue.has(option.value)) {
      duplicateValues.push(option.value);
      continue;
    }

    firstOptionByValue.set(option.value, option);
  }

  const nextOptions = [...firstOptionByValue.values()];
  const nextSections = model.sections
    .map((section) => ({
      ...section,
      options: section.options.filter(
        ({ option }) => firstOptionByValue.get(option.value) === option
      ),
    }))
    .filter((section) => section.options.length > 0);

  if (duplicateValues.length > 0) {
    warnInDevelopment(
      `Duplicate option values were ignored: ${[...new Set(duplicateValues)].join(", ")}.`
    );
  }

  return {
    options: nextOptions,
    sections: nextSections,
  };
}

function buildCheckboxGroupModel(
  children: React.ReactNode | undefined,
  options?: CheckboxGroupOption[]
): CheckboxGroupModel {
  if (children != null && hasCompoundChildren(children)) {
    return dedupeCheckboxGroupModel(buildModelFromChildren(children));
  }

  return dedupeCheckboxGroupModel(
    buildModelFromOptions(
      (options ?? []).map((option) => ({
        ...option,
        value: option.value.trim(),
      }))
    )
  );
}

function getOrderedValues(
  options: CheckboxGroupOption[],
  nextSelected: string[]
): string[] {
  const nextSet = new Set(nextSelected);

  const orderedVisibleValues = options
    .filter((option) => nextSet.has(option.value))
    .map((option) => option.value);

  const optionValues = new Set(options.map((option) => option.value));
  const extraValues = nextSelected.filter((value) => !optionValues.has(value));

  return [...orderedVisibleValues, ...extraValues];
}

function withReadOnlySelections(
  options: CheckboxGroupOption[],
  selectedValues: string[]
) {
  const nextSet = new Set(selectedValues);

  for (const option of options) {
    if (option.readOnly) {
      nextSet.add(option.value);
    }
  }

  return getOrderedValues(options, [...nextSet]);
}

function areValueArraysEqual(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

function getModelStructureKey(model: CheckboxGroupModel) {
  return model.sections
    .map((section) => {
      const optionValues = section.options
        .map(
          ({ option }) =>
            `${option.value}:${option.disabled ? 1 : 0}:${option.readOnly ? 1 : 0}`
        )
        .join(",");

      return `${section.label ?? ""}:${section.disabled}:${optionValues}`;
    })
    .join("|");
}

function getChangedOptions(
  options: CheckboxGroupOption[],
  previousSelected: string[],
  nextSelected: string[]
) {
  const previousSet = new Set(previousSelected);
  const nextSet = new Set(nextSelected);

  return options.filter((option) => {
    const wasSelected = previousSet.has(option.value);
    const isSelected = nextSet.has(option.value);

    return wasSelected !== isSelected;
  });
}

function getCommittedValue(
  isControlled: boolean,
  value: string[] | undefined,
  internalValue: string[]
) {
  return isControlled ? (value ?? []) : internalValue;
}

function getSectionDisabledForOption(
  sections: ParsedCheckboxGroupSection[],
  optionValue: string
) {
  for (const section of sections) {
    if (section.options.some(({ option }) => option.value === optionValue)) {
      return section.disabled;
    }
  }

  return false;
}

function canToggleOption({
  disabled,
  isSelected,
  option,
  sectionDisabled,
}: {
  disabled: boolean;
  isSelected: boolean;
  option: CheckboxGroupOption;
  sectionDisabled: boolean;
}) {
  const { rowDisabled, rowReadOnly } = getRowInteractionState({
    disabled,
    groupDisabled: sectionDisabled,
    option,
  });

  if (rowReadOnly && !isSelected) {
    return false;
  }

  return !(rowDisabled || rowReadOnly);
}

function sectionsHaveNamedGroups(sections: ParsedCheckboxGroupSection[]) {
  return sections.some((section) => Boolean(section.label));
}

function getLabeledSections(sections: ParsedCheckboxGroupSection[]) {
  return sections.filter((section) => section.label);
}

function getGroupedDisclosureState({
  expanded,
  maxVisible,
  sections,
  selectedValues,
}: {
  expanded: boolean;
  maxVisible?: number;
  sections: ParsedCheckboxGroupSection[];
  selectedValues: string[];
}) {
  if (!sectionsHaveNamedGroups(sections)) {
    return {
      canCollapse: false,
      hiddenSectionCount: 0,
      isSectionVisible: () => true,
      shouldShowLess: false,
      shouldShowMore: false,
    };
  }

  const labeledSections = getLabeledSections(sections);
  const unlabeledSectionKeys = new Set(
    sections.filter((section) => !section.label).map((section) => section.key)
  );
  const canCollapse =
    typeof maxVisible === "number" &&
    maxVisible > 0 &&
    labeledSections.length > maxVisible;

  if (!canCollapse) {
    return {
      canCollapse: false,
      hiddenSectionCount: 0,
      isSectionVisible: () => true,
      shouldShowLess: false,
      shouldShowMore: false,
    };
  }

  const hiddenLabeledSections = labeledSections.slice(maxVisible);
  const hiddenValues = new Set(
    hiddenLabeledSections.flatMap((section) =>
      section.options.map(({ option }) => option.value)
    )
  );
  const hasHiddenSelection = selectedValues.some((value) =>
    hiddenValues.has(value)
  );
  const forcedExpanded = !expanded && hasHiddenSelection;
  const isExpanded = expanded || forcedExpanded;
  const visibleLabeledKeys = new Set(
    (isExpanded ? labeledSections : labeledSections.slice(0, maxVisible)).map(
      (section) => section.key
    )
  );

  return {
    canCollapse: true,
    hiddenSectionCount: hiddenLabeledSections.length,
    isSectionVisible: (sectionKey: string) =>
      unlabeledSectionKeys.has(sectionKey) ||
      visibleLabeledKeys.has(sectionKey),
    shouldShowLess: isExpanded && !hasHiddenSelection,
    shouldShowMore: !isExpanded,
  };
}

function resolveRootRenderProps(rootProps: CheckboxRootRenderProps) {
  const {
    children: rowChildren,
    className: rootClassName,
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
    ref: rootRef,
    style: rootStyle,
    ...resolvedRootProps
  } = rootProps;

  return {
    resolvedRootProps,
    rootClassName,
    rootRef,
    rootStyle,
    rowChildren,
  };
}

function getRowInteractionState({
  disabled,
  groupDisabled,
  option,
}: {
  disabled: boolean;
  groupDisabled: boolean;
  option: CheckboxGroupOption;
}) {
  const rowDisabled = disabled || groupDisabled || Boolean(option.disabled);
  const rowReadOnly = Boolean(option.readOnly);

  return {
    rowDisabled,
    rowReadOnly,
    rowInteractive: !(rowDisabled || rowReadOnly),
  };
}

function CheckboxGroupIndicator({
  checked,
  iconClassName,
  invalid,
  prefersReducedMotion,
}: {
  checked: boolean;
  iconClassName: string;
  invalid: boolean;
  prefersReducedMotion: boolean;
}) {
  const checkVariants = prefersReducedMotion
    ? reducedCheckmarkVariants
    : checkmarkVariants;

  return (
    <motion.svg
      aria-hidden
      className={cn(iconClassName, invalid && !checked && "text-destructive")}
      fill="none"
      initial={false}
      viewBox="0 0 24 24"
    >
      <motion.path
        animate={checked ? "checked" : "unchecked"}
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        variants={checkVariants}
      />
    </motion.svg>
  );
}

function CheckboxGroupCopy({
  checked,
  descriptionId,
  labelId,
  labelMotionTransition,
  option,
  sizing,
}: {
  checked: boolean;
  descriptionId?: string;
  labelId: string;
  labelMotionTransition: typeof labelTransition | typeof instantTransition;
  option: CheckboxGroupOption;
  sizing: (typeof sizeStyles)[CheckboxGroupSize];
}) {
  const disabledReasonId =
    option.disabled && option.disabledReason
      ? `${labelId}-disabled-reason`
      : undefined;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col",
        "transition-transform duration-520 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "group-hover:translate-x-0.5"
      )}
    >
      <motion.span
        animate={{ opacity: checked ? 0.55 : 1 }}
        className={cn("font-medium text-foreground", sizing.label)}
        id={labelId}
        transition={labelMotionTransition}
      >
        {option.label}
      </motion.span>
      {option.description ? (
        <span className="text-muted-foreground text-xs" id={descriptionId}>
          {option.description}
        </span>
      ) : null}
      {option.disabled && option.disabledReason ? (
        <span
          className="text-[11px] text-muted-foreground/90"
          id={disabledReasonId}
        >
          {option.disabledReason}
        </span>
      ) : null}
    </div>
  );
}

function CheckboxGroupRow({
  checked,
  descriptionId,
  disabled,
  form,
  groupDisabled,
  invalid,
  isHidden,
  labelId,
  name,
  option,
  prefersReducedMotion,
  sizing,
}: CheckboxGroupRowProps) {
  const { rowDisabled, rowInteractive, rowReadOnly } = getRowInteractionState({
    disabled,
    groupDisabled,
    option,
  });
  const labelMotionTransition = prefersReducedMotion
    ? instantTransition
    : labelTransition;
  const describedBy = [
    descriptionId,
    option.disabled && option.disabledReason
      ? `${labelId}-disabled-reason`
      : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const whileTap =
    rowInteractive && !prefersReducedMotion
      ? {
          scale: 0.96,
          y: 0,
          transition: springTap,
        }
      : undefined;

  return (
    <div aria-hidden={isHidden || undefined} hidden={isHidden || undefined}>
      <CheckboxPrimitive.Root
        aria-describedby={describedBy || undefined}
        aria-labelledby={labelId}
        aria-readonly={rowReadOnly || undefined}
        disabled={rowDisabled}
        form={form}
        name={name}
        nativeButton
        readOnly={rowReadOnly}
        render={(rootProps) => {
          const {
            resolvedRootProps,
            rootClassName,
            rootRef,
            rootStyle,
            rowChildren,
          } = resolveRootRenderProps(rootProps);

          return (
            <motion.button
              {...resolvedRootProps}
              aria-invalid={invalid || undefined}
              className={cn(
                "group relative flex w-full appearance-none items-center rounded-lg text-left",
                sizing.gap,
                sizing.row,
                "transition-[background-color] duration-480 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:bg-accent/60 dark:hover:bg-accent/60",
                "active:bg-neutral-100 dark:active:bg-neutral-800/78",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "disabled:active:bg-transparent disabled:hover:bg-transparent",
                "dark:disabled:active:bg-transparent dark:disabled:hover:bg-transparent",
                rowReadOnly &&
                  !rowDisabled &&
                  "cursor-default hover:bg-transparent active:bg-transparent",
                rootClassName
              )}
              ref={(node) => {
                setRef(rootRef, node);
              }}
              style={rootStyle}
              tabIndex={isHidden ? -1 : undefined}
              transition={springTap}
              type="button"
              whileTap={whileTap}
            >
              {rowChildren}
            </motion.button>
          );
        }}
        value={option.value}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center",
            sizing.box
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded bg-transparent transition-[border-color] duration-420 ease-[cubic-bezier(0.25,0.85,0.3,1)]",
              sizing.box,
              checked
                ? "border-0 bg-transparent"
                : [
                    "border-2 bg-transparent",
                    invalid
                      ? "border-destructive/80"
                      : "border-neutral-300/90 group-hover:border-neutral-500/85 dark:border-neutral-600 dark:group-hover:border-neutral-400",
                  ]
            )}
          >
            <CheckboxPrimitive.Indicator
              keepMounted
              render={(indicatorProps) => {
                const {
                  className: indicatorClassName,
                  children: _children,
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
                  ..._resolvedIndicatorProps
                } = indicatorProps;

                return (
                  <CheckboxGroupIndicator
                    checked={checked}
                    iconClassName={cn(
                      sizing.icon,
                      "text-primary",
                      indicatorClassName
                    )}
                    invalid={invalid}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                );
              }}
            />
          </div>
        </div>

        <CheckboxGroupCopy
          checked={checked}
          descriptionId={descriptionId}
          labelId={labelId}
          labelMotionTransition={labelMotionTransition}
          option={option}
          sizing={sizing}
        />
      </CheckboxPrimitive.Root>
    </div>
  );
}

function areCheckboxGroupRowPropsEqual(
  previous: CheckboxGroupRowProps,
  next: CheckboxGroupRowProps
) {
  return (
    previous.checked === next.checked &&
    previous.descriptionId === next.descriptionId &&
    previous.disabled === next.disabled &&
    previous.form === next.form &&
    previous.groupDisabled === next.groupDisabled &&
    previous.invalid === next.invalid &&
    previous.isHidden === next.isHidden &&
    previous.labelId === next.labelId &&
    previous.name === next.name &&
    previous.option.description === next.option.description &&
    previous.option.disabled === next.option.disabled &&
    previous.option.disabledReason === next.option.disabledReason &&
    previous.option.id === next.option.id &&
    previous.option.label === next.option.label &&
    previous.option.readOnly === next.option.readOnly &&
    previous.option.value === next.option.value &&
    previous.prefersReducedMotion === next.prefersReducedMotion &&
    previous.sizing === next.sizing
  );
}

const MemoizedCheckboxGroupRow = React.memo(
  CheckboxGroupRow,
  areCheckboxGroupRowPropsEqual
);
MemoizedCheckboxGroupRow.displayName = "CheckboxGroupRow";

function CheckboxGroupSection(_props: CheckboxGroupSectionProps) {
  return null;
}
CheckboxGroupSection.displayName = "CheckboxGroupSection";

function CheckboxGroupItem(_props: CheckboxGroupItemProps) {
  return null;
}
CheckboxGroupItem.displayName = "CheckboxGroupItem";

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      children,
      className,
      defaultValue,
      disabled = false,
      form,
      invalid = false,
      maxVisible,
      name,
      onChange,
      options,
      showLessLabel = "Show less",
      showMoreLabel = "Show more",
      size = "default",
      value,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const prefersReducedMotion = useReducedMotion() === true;
    const sizing = sizeStyles[size];
    const isControlled = value !== undefined;
    const model = React.useMemo(
      () => buildCheckboxGroupModel(children, options),
      [children, options]
    );
    const { options: resolvedOptions, sections } = model;
    const [internalValue, setInternalValue] = React.useState<string[]>(
      () => defaultValue ?? []
    );
    const normalizedCommittedValue = React.useMemo(
      () =>
        withReadOnlySelections(
          resolvedOptions,
          getCommittedValue(isControlled, value, internalValue)
        ),
      [internalValue, isControlled, resolvedOptions, value]
    );
    const [optimisticValue, setOptimisticValue] = React.useState<string[]>(
      normalizedCommittedValue
    );
    const optimisticValueRef = React.useRef(optimisticValue);
    const [expanded, setExpanded] = React.useState(false);

    optimisticValueRef.current = optimisticValue;

    const modelStructureKey = React.useMemo(
      () => getModelStructureKey(model),
      [model]
    );
    const collapseSignature = React.useMemo(
      () => `${maxVisible ?? ""}:${modelStructureKey}`,
      [maxVisible, modelStructureKey]
    );
    const collapseSignatureRef = React.useRef(collapseSignature);
    const selectedSet = React.useMemo(
      () => new Set(optimisticValue),
      [optimisticValue]
    );
    const disclosure = React.useMemo(
      () =>
        getGroupedDisclosureState({
          expanded,
          maxVisible,
          sections,
          selectedValues: optimisticValue,
        }),
      [expanded, maxVisible, optimisticValue, sections]
    );

    const handleExpand = React.useCallback(() => {
      setExpanded(true);
    }, []);

    const handleCollapse = React.useCallback(() => {
      setExpanded(false);
    }, []);

    const handleValueChange = React.useCallback(
      (nextSelected: string[], eventDetails?: { isCanceled?: boolean }) => {
        if (disabled || eventDetails?.isCanceled) {
          return;
        }

        const previousSelected = optimisticValueRef.current;
        const next = withReadOnlySelections(
          resolvedOptions,
          getOrderedValues(resolvedOptions, nextSelected)
        );

        if (areValueArraysEqual(previousSelected, next)) {
          return;
        }

        const changedOptions = getChangedOptions(
          resolvedOptions,
          previousSelected,
          next
        );

        for (const option of changedOptions) {
          if (
            !canToggleOption({
              disabled,
              isSelected: next.includes(option.value),
              option,
              sectionDisabled: getSectionDisabledForOption(
                sections,
                option.value
              ),
            })
          ) {
            return;
          }
        }

        setOptimisticValue(next);

        if (!isControlled) {
          setInternalValue(next);
        }

        onChange?.(next);
      },
      [disabled, isControlled, onChange, resolvedOptions, sections]
    );

    React.useEffect(() => {
      setOptimisticValue((current) =>
        areValueArraysEqual(current, normalizedCommittedValue)
          ? current
          : normalizedCommittedValue
      );
    }, [normalizedCommittedValue]);

    React.useEffect(() => {
      if (isControlled) {
        return;
      }

      setInternalValue((current) => {
        const normalized = withReadOnlySelections(resolvedOptions, current);

        return areValueArraysEqual(current, normalized) ? current : normalized;
      });
    }, [isControlled, resolvedOptions]);

    React.useEffect(() => {
      if (collapseSignatureRef.current === collapseSignature) {
        return;
      }

      collapseSignatureRef.current = collapseSignature;
      setExpanded(false);
    }, [collapseSignature]);

    if (resolvedOptions.length === 0) {
      return null;
    }

    const groupValueProps = isControlled
      ? { value: optimisticValue }
      : {
          defaultValue: withReadOnlySelections(
            resolvedOptions,
            defaultValue ?? []
          ),
        };

    return (
      <CheckboxGroupPrimitive
        {...groupValueProps}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          componentThemeClassName,
          "flex flex-col gap-1.5",
          className
        )}
        disabled={disabled}
        onValueChange={handleValueChange}
        ref={ref}
      >
        {sections.map((section) => {
          const isSectionVisible = disclosure.isSectionVisible(section.key);
          const sectionBody = section.options.map(({ index, option }) => {
            const optionId = option.id ?? `${generatedId}-option-${index}`;
            const labelId = `${optionId}-label`;
            const descriptionId = option.description
              ? `${optionId}-description`
              : undefined;
            const optionKey = option.id ?? `${option.value}-${index}`;

            return (
              <MemoizedCheckboxGroupRow
                checked={
                  selectedSet.has(option.value) || Boolean(option.readOnly)
                }
                descriptionId={descriptionId}
                disabled={disabled}
                form={form}
                groupDisabled={section.disabled}
                invalid={invalid}
                isHidden={!isSectionVisible}
                key={optionKey}
                labelId={labelId}
                name={name}
                option={option}
                prefersReducedMotion={prefersReducedMotion}
                sizing={sizing}
              />
            );
          });

          if (section.label) {
            return (
              <fieldset
                className="m-0 flex min-w-0 flex-col gap-1 border-0 p-0"
                disabled={section.disabled || disabled || undefined}
                hidden={!isSectionVisible || undefined}
                key={section.key}
              >
                <legend className="px-4 pt-2 font-medium text-[11px] text-muted-foreground/80 uppercase tracking-[0.16em]">
                  {section.label}
                </legend>
                {sectionBody}
              </fieldset>
            );
          }

          return (
            <fieldset
              className="m-0 flex min-w-0 flex-col gap-1 border-0 p-0"
              key={section.key}
            >
              {sectionBody}
            </fieldset>
          );
        })}

        {disclosure.shouldShowMore ? (
          <button
            aria-expanded={false}
            className={cn(
              "self-start rounded-md px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            onClick={handleExpand}
            type="button"
          >
            {`${showMoreLabel} (${disclosure.hiddenSectionCount})`}
          </button>
        ) : null}
        {disclosure.shouldShowLess ? (
          <button
            aria-expanded={true}
            className={cn(
              "self-start rounded-md px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            onClick={handleCollapse}
            type="button"
          >
            {showLessLabel}
          </button>
        ) : null}
      </CheckboxGroupPrimitive>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup as checkboxGroup };
export { CheckboxGroup, CheckboxGroupItem, CheckboxGroupSection };
