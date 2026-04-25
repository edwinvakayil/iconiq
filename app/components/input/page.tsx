"use client";

import { ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  type HTMLInputTypeAttribute,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { inputApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { input as Input } from "@/registry/input";

const PREVIEW_INPUT_TYPES = [
  { value: "text", label: "text" },
  { value: "password", label: "password" },
  { value: "email", label: "email" },
  { value: "number", label: "number" },
  { value: "tel", label: "tel" },
  { value: "url", label: "url" },
  { value: "search", label: "search" },
] as const satisfies ReadonlyArray<{
  value: HTMLInputTypeAttribute;
  label: string;
}>;
type PreviewInputType = (typeof PREVIEW_INPUT_TYPES)[number]["value"];

const previewDropdownTriggerClass = cn(
  "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-neutral-200/80 bg-white px-3 font-sans text-neutral-900 text-sm outline-none transition-colors",
  "hover:border-neutral-300 hover:bg-neutral-50/80",
  "focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-400/20",
  "dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-900/50",
  "dark:focus-visible:border-neutral-500 dark:focus-visible:ring-neutral-500/25"
);

function PreviewSelectField({
  id,
  label,
  value,
  onValueChange,
  options,
  ariaLabel,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (next: string) => void;
  options: readonly { value: string; label: string }[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const listboxId = `${id}-listbox`;
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="w-full min-w-0">
      <label
        className="mb-1.5 block font-medium text-[10px] text-neutral-400 uppercase tracking-[0.14em] dark:text-neutral-500"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative" ref={rootRef}>
        <button
          aria-controls={listboxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          className={previewDropdownTriggerClass}
          id={id}
          onClick={() => setOpen((o) => !o)}
          type="button"
        >
          <span className="min-w-0 truncate">{selected.label}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="inline-flex shrink-0 text-neutral-400 dark:text-neutral-500"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 22 }
            }
          >
            <ChevronDown aria-hidden className="size-4" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open ? (
            <motion.ul
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-label={ariaLabel}
              className={cn(
                "absolute left-0 z-50 mt-1.5 w-max min-w-full overflow-y-auto overflow-x-hidden overscroll-contain rounded-md border border-neutral-200/80 bg-white py-1 shadow-sm",
                "max-h-36",
                "dark:border-neutral-700 dark:bg-neutral-950"
              )}
              exit={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.98, y: -4 }
              }
              id={listboxId}
              initial={
                reduceMotion ? false : { opacity: 0, scale: 0.98, y: -6 }
              }
              role="listbox"
              style={{ transformOrigin: "top center" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 420, damping: 30 }
              }
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li className="px-0.5" key={opt.value} role="presentation">
                    <button
                      aria-selected={isSelected}
                      className={cn(
                        "flex w-full min-w-0 whitespace-nowrap rounded-md px-3 py-1.5 text-left font-sans text-[13px] transition-colors",
                        isSelected
                          ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
                          : "text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900/70"
                      )}
                      onClick={() => {
                        onValueChange(opt.value);
                        setOpen(false);
                      }}
                      role="option"
                      type="button"
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

const usageCode = `import { input as Input } from "@/components/ui/input";
import { useState } from "react";

export function NamedField() {
  const [value, setValue] = useState("");
  return (
    <Input
      label="Display name"
      type="text"
      value={value}
      onChange={setValue}
      autoComplete="name"
    />
  );
}

export function EmailField() {
  return (
    <Input
      label="Work email"
      type="email"
      placeholder="name@company.com"
    />
  );
}`;

const componentDetailsItems = inputApiDetails;

function _SectionLabel({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {accent ? (
        <span
          aria-hidden
          className="font-mono text-[10px] text-neutral-300 tabular-nums dark:text-neutral-600"
        >
          {accent}
        </span>
      ) : null}
      <p className="font-medium text-[10px] text-neutral-400 uppercase tracking-[0.18em] dark:text-neutral-500">
        {children}
      </p>
      <span className="h-px min-w-6 flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-700" />
    </div>
  );
}

const bentoShell =
  "flex flex-col rounded-2xl border border-neutral-200/80 bg-white px-3 py-4 sm:px-5 sm:py-5 md:p-6 dark:border-neutral-800 dark:bg-neutral-950";

const _bentoContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.07 },
  },
};

const _bentoItem = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const _bentoContainerStatic = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const _bentoItemStatic = {
  hidden: { opacity: 1, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function _BentoMotion({
  children,
  className,
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants: Variants;
}) {
  return (
    <motion.div className={cn(bentoShell, className)} variants={variants}>
      {children}
    </motion.div>
  );
}

function InputPreview() {
  const [inputType, setInputType] = useState<PreviewInputType>("text");
  const [line, setLine] = useState("Glow");
  const helperByType: Record<PreviewInputType, string> = {
    text: "Freeform text with animated character reveal.",
    password: "Toggle visibility with the animated eye control.",
    email: "Includes blur validation with an email pattern.",
    number: "Supports min / max / step and native spinner behavior.",
    tel: "Phone keypad-friendly type with the same motion layer.",
    url: "URL entry with live animated glyph transitions.",
    search: "Search includes a clear action when content exists.",
  };
  const placeholderByType: Record<PreviewInputType, string> = {
    text: "Type a note",
    password: "Create a password",
    email: "name@example.com",
    number: "42",
    tel: "+1 (555) 010-0199",
    url: "https://example.com",
    search: "Search components...",
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 self-stretch px-4 py-7 sm:px-6 sm:py-8">
      <div className="flex w-full max-w-[300px] flex-col gap-3.5 sm:max-w-sm">
        <PreviewSelectField
          ariaLabel="Input type selector"
          id="input-preview-type"
          label="Input type"
          onValueChange={(next) => {
            setInputType(next as PreviewInputType);
            setLine("");
          }}
          options={PREVIEW_INPUT_TYPES}
          value={inputType}
        />
        <Input
          key={inputType}
          label="your turn"
          onChange={setLine}
          placeholder={placeholderByType[inputType]}
          type={inputType}
          value={line}
          {...(inputType === "number"
            ? { min: 0, max: 1_000_000, step: 1 }
            : {})}
        />
        <p className="text-neutral-500 text-xs leading-snug dark:text-neutral-400">
          {helperByType[inputType]}
        </p>
      </div>
      <p
        className={cn(
          "w-full max-w-lg text-center font-sans text-[13px] leading-relaxed sm:max-w-2xl sm:text-[14px] lg:max-w-3xl",
          "text-balance text-neutral-600 dark:text-neutral-300"
        )}
      >
        <span className="text-neutral-500 dark:text-neutral-400">
          Every field keeps the same feel —
        </span>{" "}
        <span className="font-medium text-violet-600 dark:text-violet-400">
          type-aware
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">,</span>{" "}
        <span className="text-emerald-600 dark:text-emerald-400">
          motion-consistent
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">
          {" "}
          — tuned for real form flows.
        </span>
      </p>
    </div>
  );
}

export default function InputPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Input" },
      ]}
      componentName="input"
      description="Standard field with a visible label above it, focused feedback, and a motion-driven visible layer. Built for real form flows, not just demos."
      details={componentDetailsItems}
      preview={
        <div className="flex min-h-[320px] items-center justify-center">
          <InputPreview />
        </div>
      }
      title="Input"
      usageCode={usageCode}
      usageDescription="Alias the lowercase export to `Input` in JSX, then use the API details to tune type, icons, container classes, and registry-file installs."
    />
  );
}
