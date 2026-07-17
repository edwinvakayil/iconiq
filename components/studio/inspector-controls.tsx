"use client";

/**
 * Small, dependency-free form controls for the inspector. Studio chrome stays
 * deliberately lighter than the animated registry components it edits.
 */

import { MinusIcon, PlusIcon } from "lucide-react";
import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Layout wrapper for an inspector row. Deliberately a div, not a <label> —
 * children are often composite widgets (segmented controls, lists) rather
 * than single inputs; interactive children carry their own aria labels.
 */
export function Field({
  label,
  children,
  inline = false,
}: {
  label: string;
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-1.5 text-[12px]",
        inline ? "flex-row items-center justify-between" : "flex-col"
      )}
    >
      <span className="shrink-0 font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-md border border-border bg-background px-2 py-1.5 text-[12px] text-foreground outline-none transition-colors focus:border-ring";

export function TextControl({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputClassName}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );
}

export function TextareaControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      className={cn(inputClassName, "min-h-16 resize-y")}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
  );
}

export function SelectControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <select
      className={cn(inputClassName, "cursor-pointer appearance-none")}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function ToggleControl({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <button
      aria-checked={value}
      aria-labelledby={id}
      className={cn(
        "relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-150",
        value ? "bg-sky-500" : "bg-border"
      )}
      onClick={() => onChange(!value)}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-150",
          value && "translate-x-4"
        )}
      />
    </button>
  );
}

/** Segmented control for short enumerations (direction, alignment…). */
export function SegmentedControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: React.ReactNode; value: string; title?: string }>;
}) {
  return (
    <div className="flex w-full rounded-md border border-border bg-muted/40 p-0.5">
      {options.map((option) => (
        <button
          className={cn(
            "flex h-6 flex-1 cursor-pointer items-center justify-center rounded-[5px] px-1 text-[11px] transition-colors duration-100",
            option.value === value
              ? "bg-background font-medium text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          title={option.title}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Numeric stepper that walks a fixed list of allowed values. */
export function SteppedNumberControl({
  value,
  onChange,
  steps,
  format = (step) => `${step}`,
}: {
  value: number;
  onChange: (value: number) => void;
  steps: number[];
  format?: (step: number) => string;
}) {
  const index = steps.findIndex((step) => step >= value);
  const currentIndex = index === -1 ? steps.length - 1 : index;

  const step = (delta: -1 | 1) => {
    const next = Math.max(0, Math.min(steps.length - 1, currentIndex + delta));
    onChange(steps[next]);
  };

  return (
    <div className="flex w-full items-center rounded-md border border-border">
      <button
        aria-label="Decrease"
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        disabled={currentIndex === 0}
        onClick={() => step(-1)}
        type="button"
      >
        <MinusIcon className="size-3" />
      </button>
      <span className="flex-1 text-center text-[12px] text-foreground tabular-nums">
        {format(steps[currentIndex] ?? value)}
      </span>
      <button
        aria-label="Increase"
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        disabled={currentIndex === steps.length - 1}
        onClick={() => step(1)}
        type="button"
      >
        <PlusIcon className="size-3" />
      </button>
    </div>
  );
}
