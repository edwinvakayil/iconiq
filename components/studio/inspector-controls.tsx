"use client";

/**
 * Small, dependency-free form controls for the inspector. Studio chrome stays
 * deliberately lighter than the animated registry components it edits.
 */

import {
  ImagePlusIcon,
  Link2Icon,
  MinusIcon,
  PlusIcon,
  Unlink2Icon,
} from "lucide-react";
import { useId, useState } from "react";

import { SPACING_OPTIONS } from "@/lib/studio/tailwind";
import { type SpacingSides, uniformSides } from "@/lib/studio/types";
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

/**
 * Image URL input with a live thumbnail. Accepts absolute URLs or paths under
 * /public (e.g. /assets/av1.png). The thumbnail hides itself while the URL
 * doesn't resolve.
 */
export function ImageUrlControl({
  value,
  onChange,
  placeholder = "https://… or /assets/…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {value ? (
        // biome-ignore lint/performance/noImgElement: previews arbitrary user URLs; next/image needs domain config
        <img
          alt=""
          className="size-7 shrink-0 rounded-md border border-border object-cover"
          height={28}
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
          onLoad={(event) => {
            event.currentTarget.style.visibility = "visible";
          }}
          src={value}
          width={28}
        />
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border border-dashed text-muted-foreground/60">
          <ImagePlusIcon className="size-3" />
        </span>
      )}
      <input
        className={inputClassName}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
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

const SIDE_LABELS: Array<{ key: keyof SpacingSides; label: string }> = [
  { key: "top", label: "Top" },
  { key: "bottom", label: "Bottom" },
  { key: "left", label: "Left" },
  { key: "right", label: "Right" },
];

function sidesAreUniform(sides: SpacingSides): boolean {
  return (
    sides.top === sides.right &&
    sides.right === sides.bottom &&
    sides.bottom === sides.left
  );
}

/**
 * Box-model spacing editor. Linked mode edits all four sides at once;
 * unlinking reveals a per-side stepper for top / bottom / left / right.
 */
export function SpacingSidesControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SpacingSides | undefined;
  onChange: (value: SpacingSides) => void;
}) {
  const sides = value ?? uniformSides(0);
  const [linked, setLinked] = useState(() => sidesAreUniform(sides));

  return (
    <div className="flex flex-col gap-1.5 text-[12px]">
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground">{label}</span>
        <button
          aria-label={linked ? `Edit ${label} per side` : `Link ${label} sides`}
          className={cn(
            "flex size-5 cursor-pointer items-center justify-center rounded transition-colors",
            linked
              ? "text-muted-foreground hover:text-foreground"
              : "bg-accent text-foreground"
          )}
          onClick={() => {
            if (!linked) {
              // Re-linking collapses to the top value for all sides.
              onChange(uniformSides(sides.top));
            }
            setLinked(!linked);
          }}
          title={linked ? "Edit each side" : "Link all sides"}
          type="button"
        >
          {linked ? (
            <Link2Icon className="size-3" />
          ) : (
            <Unlink2Icon className="size-3" />
          )}
        </button>
      </div>
      {linked ? (
        <SteppedNumberControl
          format={(step) => `${step}px`}
          onChange={(next) => onChange(uniformSides(next))}
          steps={SPACING_OPTIONS}
          value={sides.top}
        />
      ) : (
        <div className="grid grid-cols-2 gap-1.5">
          {SIDE_LABELS.map(({ key, label: sideLabel }) => (
            <div className="flex flex-col gap-0.5" key={key}>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {sideLabel}
              </span>
              <SteppedNumberControl
                format={(step) => `${step}`}
                onChange={(next) => onChange({ ...sides, [key]: next })}
                steps={SPACING_OPTIONS}
                value={sides[key]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
