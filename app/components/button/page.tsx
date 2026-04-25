"use client";

import { ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { buttonApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/button";

const PREVIEW_VARIANTS = [
  { value: "default", label: "Default" },
  { value: "destructive", label: "Destructive" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "link", label: "Link" },
] as const;

const PREVIEW_SIZES = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
] as const;

type PreviewVariant = (typeof PREVIEW_VARIANTS)[number]["value"];
type PreviewSize = (typeof PREVIEW_SIZES)[number]["value"];

/** Caption hue tracks the selected button variant for a tighter preview read. */
const previewCaptionClassByVariant: Record<PreviewVariant, string> = {
  default: "text-primary",
  destructive: "text-red-600 dark:text-red-400",
  outline: "text-slate-600 dark:text-slate-400",
  secondary: "text-neutral-800 dark:text-neutral-300",
  ghost: "text-neutral-500 dark:text-neutral-400",
  link: "text-sky-700 dark:text-sky-400",
};

const previewDropdownTriggerClass = cn(
  "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-neutral-200/80 bg-white px-3 font-sans text-[13px] text-neutral-900 outline-none transition-colors",
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
  menuMaxHeightClass = "max-h-[min(240px,50vh)]",
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (next: string) => void;
  options: readonly { value: string; label: string }[];
  ariaLabel: string;
  /** Tailwind max-height for the list panel; smaller values enable scroll. */
  menuMaxHeightClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const listboxId = `${id}-listbox`;
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
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
                "absolute left-0 z-50 mt-1.5 w-max min-w-full overflow-y-auto overflow-x-hidden overscroll-contain rounded-xl border border-neutral-200/80 bg-white py-1 shadow-sm",
                "dark:border-neutral-700 dark:bg-neutral-950",
                menuMaxHeightClass
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
                        "flex w-full min-w-0 whitespace-nowrap rounded-lg px-3 py-1.5 pr-3 text-left font-sans text-[13px] transition-colors",
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

const usageCode = `import { Button } from "@/components/ui/button";

export function SaveBar() {
  return (
    <div className="flex gap-2">
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  );
}`;

const componentDetailsItems = buttonApiDetails;

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

export default function ButtonPage() {
  const [previewVariant, setPreviewVariant] =
    useState<PreviewVariant>("default");
  const [previewSize, setPreviewSize] = useState<PreviewSize>("md");
  const prefersReducedMotion = useReducedMotion();

  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Button" },
      ]}
      componentName="button"
      description="CVA variants with spring hover and tap feedback. Forwards refs and standard button attributes while staying aligned with the rest of the system."
      details={componentDetailsItems}
      preview={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
            <PreviewSelectField
              ariaLabel="Button variant"
              id="animated-button-preview-variant"
              label="Variant"
              menuMaxHeightClass="max-h-32"
              onValueChange={(v) => setPreviewVariant(v as PreviewVariant)}
              options={PREVIEW_VARIANTS}
              value={previewVariant}
            />
            <PreviewSelectField
              ariaLabel="Button size"
              id="animated-button-preview-size"
              label="Size"
              onValueChange={(v) => setPreviewSize(v as PreviewSize)}
              options={PREVIEW_SIZES}
              value={previewSize}
            />
          </div>

          <div className="flex min-h-[280px] flex-col items-center justify-center gap-9 px-4 py-2">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              key={previewVariant}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 340, damping: 30 }
              }
            >
              <blockquote className="mx-auto max-w-xl text-center">
                <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-3 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:gap-x-2 sm:text-xl dark:text-neutral-100">
                  <span>Win the press,</span>
                  <span className="font-normal text-neutral-500 dark:text-neutral-400">
                    then
                  </span>
                  <span className="inline-flex translate-y-px align-middle">
                    <Button size={previewSize} variant={previewVariant}>
                      Continue
                    </Button>
                  </span>
                  <span>the break</span>
                  <span className="w-full basis-full font-normal text-[0.92em] text-neutral-500 dark:text-neutral-400">
                    - that's the half in two beats.
                  </span>
                </p>
              </blockquote>
            </motion.div>
            <p className="max-w-md text-center text-[13px] text-secondary leading-relaxed">
              <span className="text-emerald-600 dark:text-emerald-400">
                Shape it above
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">
                {" "}
                ·{" "}
              </span>
              <span
                className={cn(
                  "transition-colors duration-300 ease-out",
                  previewCaptionClassByVariant[previewVariant]
                )}
              >
                Press on purpose
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">
                {" "}
                ·{" "}
              </span>
              <span className="text-violet-600 dark:text-violet-400">
                Ripple follows
              </span>
            </p>
          </div>
        </div>
      }
      title="Button"
      usageCode={usageCode}
      usageDescription="Use the default button first, then branch into variant, size, Motion behavior, and peer dependencies through the API panel."
    />
  );
}
