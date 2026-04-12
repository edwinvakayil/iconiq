"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { SidebarNav } from "@/components/sidebar-nav";
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
  { value: "sm", label: "Small (sm)" },
  { value: "md", label: "Medium (md)" },
  { value: "lg", label: "Large (lg)" },
] as const;

type PreviewVariant = (typeof PREVIEW_VARIANTS)[number]["value"];
type PreviewSize = (typeof PREVIEW_SIZES)[number]["value"];

const previewDropdownTriggerClass = cn(
  "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-[14px] border border-neutral-200/70 bg-white px-3.5 font-sans text-neutral-900 text-sm outline-none transition-colors",
  "supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[24px]",
  "hover:border-neutral-300/80 hover:bg-neutral-50/60",
  "focus-visible:border-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-400/35",
  "dark:border-neutral-700/70 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-900/40",
  "dark:focus-visible:border-neutral-500 dark:focus-visible:ring-neutral-500/30"
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
    <div className="w-full min-w-0 sm:w-auto sm:min-w-60">
      <label
        className="mb-2 block font-medium text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400"
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
                "absolute left-0 z-50 mt-1.5 w-max min-w-full overflow-y-auto overflow-x-hidden overscroll-contain rounded-[12px] border border-neutral-200/70 bg-white py-1",
                "supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[20px]",
                "dark:border-neutral-700/70 dark:bg-neutral-950",
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
                        "flex w-full min-w-0 whitespace-nowrap rounded-[8px] px-3 py-2 pr-3.5 text-left font-sans text-sm transition-colors",
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

type DetailRow = { id: string; title: string; content: string };

const componentDetailsItems: DetailRow[] = [
  {
    id: "variant",
    title: "variant",
    content:
      "CVA-driven styles: default, destructive, outline, secondary, ghost, link — same vocabulary as typical shadcn buttons, tuned for motion and theme tokens.",
  },
  {
    id: "size",
    title: "size",
    content:
      "sm, md (default), lg, or custom (empty padding/height classes so you can size entirely with className).",
  },
  {
    id: "props",
    title: "Native button props",
    content:
      "Spreads onto motion.button: type, disabled, onClick, aria-*, data-*, etc. Ref forwarded for focus management or form libraries.",
  },
  {
    id: "buttonVariants",
    title: "buttonVariants",
    content:
      "Exported CVA config — compose the same classes on links or divs if you need a non-button affordance with matching visuals.",
  },
  {
    id: "framer-motion",
    title: "framer-motion",
    content:
      "motion.button drives the control; pointer ripples expand from the press point and fade out. Respects reduced motion (no ripple).",
  },
  {
    id: "cva",
    title: "class-variance-authority",
    content:
      "Variant and size maps merge with the base layout/ring/disabled classes. Install is listed as a registry peer dependency.",
  },
  {
    id: "a11y",
    title: "Accessibility",
    content:
      'focus-visible:ring-2 ring-ring matches the rest of the kit. Defaults to type="button" so it does not submit forms; pass type="submit" when it should.',
  },
  {
    id: "registry",
    title: "shadcn registry",
    content:
      "Add with the CLI; framer-motion and class-variance-authority are declared so they install alongside the component file.",
  },
];

function SectionLabel({
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

const bentoContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.07 },
  },
};

const bentoItem = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const bentoContainerStatic = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const bentoItemStatic = {
  hidden: { opacity: 1, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function BentoMotion({
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
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
          <motion.nav
            animate={{ opacity: 1, y: 0 }}
            aria-label="Breadcrumb"
            className="mb-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 35 }
            }
          >
            <ol className="flex flex-wrap items-center gap-1.5 font-sans text-neutral-400 text-xs dark:text-neutral-500">
              <li>
                <Link
                  className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                  href="/"
                >
                  Docs
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3 opacity-60" />
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                  href="/components/motion-accordion"
                >
                  Components
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3 opacity-60" />
              </li>
              <li
                aria-current="page"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Button
              </li>
            </ol>
          </motion.nav>

          <motion.header
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 max-w-2xl"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 340, damping: 34, delay: 0.05 }
            }
          >
            <h1 className="font-sans font-semibold text-3xl text-neutral-900 tracking-tight sm:text-[2rem] dark:text-white">
              Button
            </h1>
            <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
              CVA variants with spring hover and tap feedback. Forwards ref and
              standard button attributes — aligned with your theme tokens.
            </p>
          </motion.header>

          <motion.div
            animate="visible"
            className={cn(
              "grid auto-rows-min grid-cols-1 gap-3 sm:gap-4",
              "lg:grid-cols-12 lg:gap-x-5 lg:gap-y-5"
            )}
            initial="hidden"
            variants={containerVariants}
          >
            <BentoMotion
              className={cn(
                "relative overflow-hidden lg:col-span-8 lg:row-span-2",
                "rounded-3xl border-neutral-200/40 dark:border-neutral-700/30"
              )}
              variants={itemVariants}
            >
              <SectionLabel accent="01">Live preview</SectionLabel>
              <div className="relative mt-1 min-h-0 flex-1 space-y-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:gap-8">
                  <PreviewSelectField
                    ariaLabel="Button variant"
                    id="animated-button-preview-variant"
                    label="Variant"
                    menuMaxHeightClass="max-h-32"
                    onValueChange={(v) =>
                      setPreviewVariant(v as PreviewVariant)
                    }
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
                <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-neutral-200/40 bg-white/60 p-8 dark:border-neutral-700/40 dark:bg-neutral-950/40">
                  <Button size={previewSize} variant={previewVariant}>
                    Button
                  </Button>
                </div>
              </div>
            </BentoMotion>

            <BentoMotion
              className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="02">Install</SectionLabel>
              <div className="min-w-0 flex-1 [&>div]:mt-0">
                <CodeBlockInstall componentName="button" />
              </div>
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/90 border-dashed lg:col-span-4 lg:col-start-9 lg:row-start-2 dark:border-neutral-700/80"
              variants={itemVariants}
            >
              <SectionLabel accent="03">v0</SectionLabel>
              <p className="mb-5 flex-1 font-sans text-neutral-500 text-sm leading-snug dark:text-neutral-400">
                Ship the registry bundle to v0 and iterate on motion or layout
                with prompts.
              </p>
              <ComponentActions name="button" />
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/40 lg:col-span-8 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="04">Usage</SectionLabel>
              <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
                Minimal example — see tile{" "}
                <span className="font-mono text-neutral-600 text-xs dark:text-neutral-300">
                  05
                </span>{" "}
                for{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  variant
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  size
                </code>
                , and peer packages.
              </p>
              <CodeBlock code={usageCode} language="tsx" variant="embedded" />
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/40 bg-neutral-50/50 lg:col-span-4 lg:col-start-9 lg:row-start-3 dark:border-neutral-700/30 dark:bg-neutral-900/40"
              variants={itemVariants}
            >
              <SectionLabel accent="05">Dependencies</SectionLabel>
              <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                Registry peers and API surface —{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                  Button
                </code>{" "}
                is a forwardRef{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                  motion.button
                </code>
                .
              </p>
              <div className="rounded-xl border border-neutral-200/30 bg-white dark:border-neutral-700/25 dark:bg-neutral-950">
                <ul className="divide-y divide-neutral-100/90 dark:divide-neutral-800/60">
                  {componentDetailsItems.map((row) => (
                    <li className="px-3 py-2.5 sm:px-3.5 sm:py-3" key={row.id}>
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <code className="shrink-0 rounded bg-neutral-100 px-1 py-px font-mono text-[10px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                          {row.id}
                        </code>
                        <span className="font-medium text-neutral-900 text-xs dark:text-neutral-100">
                          {row.title}
                        </span>
                      </div>
                      <p className="mt-1.5 font-sans text-[12px] text-neutral-600 leading-relaxed dark:text-neutral-400">
                        {row.content}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </BentoMotion>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
