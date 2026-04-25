"use client";

import { CheckCircle2, ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { alertApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import Alert, { type AlertPosition } from "@/registry/alert";

const usageCode = `import Alert from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function FullTimeNotice() {
  return (
    <Alert
      dismissible
      icon={<CheckCircle2 aria-hidden className="size-[18px]" />}
      message="Three points in the bag — debrief in five minutes."
      title="Full time"
    />
  );
}`;

const componentDetailsItems = alertApiDetails;

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

const dropdownTriggerClass = cn(
  "flex h-10 w-full items-center justify-between gap-2 rounded-[14px] border border-neutral-200/70 bg-white px-3.5 font-sans text-neutral-900 text-sm outline-none transition-colors",
  "supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[24px]",
  "hover:border-neutral-300/80 hover:bg-neutral-50/60",
  "focus-visible:border-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-400/35",
  "dark:border-neutral-700/70 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-900/40",
  "dark:focus-visible:border-neutral-500 dark:focus-visible:ring-neutral-500/30"
);

const ALERT_POSITIONS: { value: AlertPosition; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-center", label: "Top center" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" },
];

function PositionDropdown({
  value,
  onValueChange,
}: {
  value: AlertPosition;
  onValueChange: (v: AlertPosition) => void;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const selected =
    ALERT_POSITIONS.find((o) => o.value === value) ?? ALERT_POSITIONS[0];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    // Capture trigger position for portal panel
    setRect(triggerRef.current?.getBoundingClientRect() ?? null);

    const onPointerDown = (e: PointerEvent) => {
      if (
        !triggerRef.current
          ?.closest("[data-dropdown-root]")
          ?.contains(e.target as Node)
      )
        setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = () =>
      setRect(triggerRef.current?.getBoundingClientRect() ?? null);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const panel = rect && (
    <AnimatePresence>
      {open && (
        <motion.ul
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed z-[400] w-max min-w-[var(--trigger-w)] overflow-hidden rounded-[12px] border border-neutral-200/70 bg-white py-1 shadow-lg dark:border-neutral-700/70 dark:bg-neutral-950"
          data-dropdown-panel
          exit={
            reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97, y: -4 }
          }
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: -6 }}
          role="listbox"
          style={{
            top: rect.bottom + 6,
            left: rect.left,
            transformOrigin: "top left",
            ["--trigger-w" as string]: `${rect.width}px`,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 30 }
          }
        >
          {ALERT_POSITIONS.map((opt) => {
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
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full min-w-0" data-dropdown-root>
      <p
        className="mb-2 font-medium text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400"
        id="position-label"
      >
        Position
      </p>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby="position-label"
        className={dropdownTriggerClass}
        onClick={() => {
          setRect(triggerRef.current?.getBoundingClientRect() ?? null);
          setOpen((o) => !o);
        }}
        ref={triggerRef}
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
      {mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}

export default function AlertPage() {
  const prefersReducedMotion = useReducedMotion();
  const [previewPosition, setPreviewPosition] =
    useState<AlertPosition>("top-right");
  const [previewKey, setPreviewKey] = useState(0);

  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Alert" },
      ]}
      componentName="alert"
      description="Dismissible banners with your own leading icon, spring motion, and optional fixed positions. Built for system feedback that feels clear instead of heavy."
      details={componentDetailsItems}
      preview={
        <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center gap-5 pb-2">
          <div className="w-full max-w-xs sm:max-w-[220px]">
            <PositionDropdown
              onValueChange={(next) => {
                setPreviewPosition(next);
                if (previewKey > 0) {
                  setPreviewKey((k) => k + 1);
                }
              }}
              value={previewPosition}
            />
          </div>
          <motion.button
            className={cn(
              "group relative isolate flex items-center gap-2.5 overflow-hidden rounded-xl px-6 py-3",
              "bg-neutral-900 font-medium text-[13px] text-white",
              "shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_2px_10px_0_rgba(0,0,0,0.18)]",
              "dark:bg-neutral-100 dark:text-neutral-900",
              "dark:shadow-[0_1px_0_0_rgba(0,0,0,0.06)_inset,0_2px_10px_0_rgba(0,0,0,0.28)]"
            )}
            onClick={() => setPreviewKey((k) => k + 1)}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            type="button"
            whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -1 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97, y: 0 }}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent"
              transition={{ duration: 0.45, ease: "easeOut" }}
              whileHover={prefersReducedMotion ? {} : { translateX: "200%" }}
            />
            <motion.span
              className="relative flex size-[18px] items-center justify-center"
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
              whileHover={
                prefersReducedMotion ? {} : { rotate: [0, -18, 14, -8, 0] }
              }
            >
              <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
                <path
                  d="M8 2a4.5 4.5 0 0 0-4.5 4.5c0 2.1-.6 3.3-1.1 4 .5.5 1.4.5 1.6.5h8c.2 0 1.1 0 1.6-.5-.5-.7-1.1-1.9-1.1-4A4.5 4.5 0 0 0 8 2Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.3"
                />
                <path
                  d="M6.5 11.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.3"
                />
              </svg>
            </motion.span>
            <span className="relative">Flash the board</span>
          </motion.button>
          <p className="max-w-md text-center text-[13px] text-secondary leading-relaxed">
            Use the launcher above to preview the alert at different fixed
            positions, then click again to replay the entry state.
          </p>
          {previewKey > 0 ? (
            <Alert
              icon={<CheckCircle2 aria-hidden className="size-[18px]" />}
              key={previewKey}
              message="Three points in the bag - debrief in five minutes."
              position={previewPosition}
              title="Full time"
            />
          ) : null}
        </div>
      }
      previewClassName="overflow-visible lg:col-span-8"
      title="Alert"
      usageCode={usageCode}
      usageDescription="Default export. Start with the inline alert below, then expand into fixed positions, auto-dismiss, and portal behavior in the API details."
    />
  );
}
