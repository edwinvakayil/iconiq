"use client";

import { CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { SidebarNav } from "@/components/sidebar-nav";
import { cn } from "@/lib/utils";
import Alert, { type AlertPosition } from "@/registry/alert";

const usageCode = `import Alert from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function SyncNotice() {
  return (
    <Alert
      dismissible
      icon={<CheckCircle2 aria-hidden className="size-[18px]" />}
      message="We saved your draft to the cloud."
      title="Synced"
    />
  );
}`;

type DetailRow = { id: string; title: string; content: string; registryPath?: string };

const componentDetailsItems: DetailRow[] = [
  {
    id: "icon",
    title: "icon — required",
    content:
      'ReactNode for the leading graphic. Pass any icon sized to ~18 px (e.g. a Lucide icon with className="size-[18px]"). The wrapper applies [&_svg]:h-[18px] [&_svg]:w-[18px] as a fallback.',
  },
  {
    id: "title",
    title: "title — required",
    content: "Primary bold line rendered above the message.",
  },
  {
    id: "message",
    title: "message — required",
    content: "Secondary descriptive text shown below the title.",
  },
  {
    id: "dismissible",
    title: "dismissible — optional · default true",
    content:
      "When true a ✕ close button is rendered. Clicking it hides the alert and fires onDismiss. Set to false to remove the button entirely — auto-timeout still applies unless timeout={0} is also passed.",
  },
  {
    id: "timeout",
    title: "timeout — optional · default 10 000 ms",
    content:
      "Auto-dismisses the alert after this many milliseconds. A thin progress bar at the bottom visualises the countdown. Pass 0 to disable auto-dismiss and keep the alert open until manually closed.",
  },
  {
    id: "position",
    title: "position — optional",
    content:
      "Fixes the alert to the viewport at the chosen corner via createPortal, escaping any ancestor transforms. On mobile (< 640 px) every value falls back to full-width top. Values: top-left · top-center · top-right · bottom-left · bottom-center · bottom-right. Omit for in-flow layout.",
  },
  {
    id: "onDismiss",
    title: "onDismiss — optional",
    content:
      "Callback fired after the alert is hidden — whether by the user clicking ✕ or by the auto-timeout. Internal visibility is cleared first.",
  },
  {
    id: "framer-motion",
    title: "framer-motion",
    content:
      "Drives all motion: spring entrance (opacity + blur + y), staggered children (icon → title → message → close button), linear progress bar countdown, and animated close button. Peer dependency — install separately.",
  },
  {
    id: "portal",
    title: "createPortal · react-dom",
    content:
      "When position is set the alert mounts on document.body so CSS transforms on ancestor elements (Framer Motion cards, modals, etc.) can never break fixed viewport positioning.",
  },
  {
    id: "registry",
    title: "shadcn registry",
    content: "Only peer dependency is framer-motion.",
    registryPath: "alert.json",
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
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  const [previewPosition, setPreviewPosition] =
    useState<AlertPosition>("top-right");
  const [previewKey, setPreviewKey] = useState(0);

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <main className="min-w-0 flex-1 overflow-x-hidden">
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
                Alert
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
              Alert
            </h1>
            <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
              Dismissible banners with your own leading icon, spring motion, and
              optional fixed positions. Built with Framer Motion and your theme
              tokens.
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
                "relative min-h-[220px] overflow-hidden sm:min-h-[260px] lg:col-span-8 lg:row-span-2",
                "rounded-3xl border-neutral-200/40 dark:border-neutral-700/30"
              )}
              variants={itemVariants}
            >
              <SectionLabel accent="01">Live preview</SectionLabel>
              <div className="relative z-10 mt-1 flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-1 pb-2 sm:gap-5">
                <div className="w-full max-w-xs sm:max-w-[220px]">
                  <PositionDropdown
                    onValueChange={(next) => {
                      setPreviewPosition(next);
                      if (previewKey > 0) setPreviewKey((k) => k + 1);
                    }}
                    value={previewPosition}
                  />
                </div>
                <motion.button
                  className={cn(
                    "group relative isolate flex items-center gap-2.5 overflow-hidden rounded-xl px-6 py-3",
                    "bg-neutral-900 font-medium font-sans text-[13px] text-white",
                    "shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_2px_10px_0_rgba(0,0,0,0.18)]",
                    "dark:bg-neutral-100 dark:text-neutral-900",
                    "dark:shadow-[0_1px_0_0_rgba(0,0,0,0.06)_inset,0_2px_10px_0_rgba(0,0,0,0.28)]"
                  )}
                  onClick={() => setPreviewKey((k) => k + 1)}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  type="button"
                  whileHover={
                    prefersReducedMotion ? {} : { scale: 1.03, y: -1 }
                  }
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97, y: 0 }}
                >
                  {/* shimmer sweep on hover */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent"
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    whileHover={
                      prefersReducedMotion ? {} : { translateX: "200%" }
                    }
                  />
                  {/* bell icon */}
                  <motion.span
                    className="relative flex size-[18px] items-center justify-center"
                    transition={{ type: "spring", stiffness: 500, damping: 14 }}
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : { rotate: [0, -18, 14, -8, 0] }
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
                  <span className="relative">Show alert</span>
                </motion.button>
                <p className="max-w-xs text-center font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                  Opens a dismissible alert at the chosen viewport corner.
                </p>
              </div>
              {previewKey > 0 ? (
                <Alert
                  icon={<CheckCircle2 aria-hidden className="size-[18px]" />}
                  key={previewKey}
                  message="This is a sample message for the live preview."
                  position={previewPosition}
                  title="Preview alert"
                />
              ) : null}
            </BentoMotion>

            <BentoMotion
              className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="02">Install</SectionLabel>
              <div className="min-w-0 flex-1 [&>div]:mt-0">
                <CodeBlockInstall componentName="alert" />
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
              <ComponentActions name="alert" />
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="04">Usage</SectionLabel>
              <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
                Default export — see tile{" "}
                <span className="font-mono text-neutral-600 text-xs dark:text-neutral-300">
                  05
                </span>{" "}
                for{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  icon
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  position
                </code>
                , and packages.
              </p>
              <CodeBlock code={usageCode} language="tsx" variant="embedded" />
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-4 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="05">Dependencies</SectionLabel>
              <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                Registry peers — default export{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                  Alert
                </code>
                .
              </p>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {componentDetailsItems.map((row) => (
                  <div
                    className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[180px_1fr] sm:gap-8 sm:py-4"
                    key={row.id}
                  >
                    <p className="pt-0.5 font-medium text-neutral-800 text-xs dark:text-neutral-200">
                      {row.title}
                    </p>
                    <div>
                      <p className="font-sans text-[13px] text-neutral-500 leading-relaxed dark:text-neutral-400">
                        {row.content}
                      </p>
                      {row.registryPath ? (
                        <RegistryInstallBlock registryPath={row.registryPath} />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </BentoMotion>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
