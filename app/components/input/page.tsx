"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import Link from "next/link";
import {
  type HTMLInputTypeAttribute,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { RegistryInstallBlock } from "@/components/registry-install-block";
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

type DetailRow = {
  id: string;
  title: string;
  content: string;
  registryPath?: string;
};

const componentDetailsItems: DetailRow[] = [
  {
    id: "value-onChange",
    title: "value / onChange",
    content:
      "Controlled: pass value (string) and onChange (receives the string). Uncontrolled: omit both; the component keeps internal state starting empty.",
  },
  {
    id: "label",
    title: "label",
    content:
      "Always-visible label above the field (default text “Type here”). Associated with the input via htmlFor.",
  },
  {
    id: "type",
    title: "type",
    content:
      'Defaults to "text". Pass standard HTML types such as email, url, tel, search, or number — the animated overlay mirrors visible characters. For password, the field uses native masking (or plain text when revealed) with an eye / eye-off toggle. Search adds a minimal clear control (×) when there is text. Email sets a pattern plus blur validation and a destructive border when non-empty and invalid.',
  },
  {
    id: "native-props",
    title: "Native input props",
    content:
      "Other attributes are spread onto the underlying input: placeholder, autoComplete, name, disabled, min, max, step (for number), inputMode, etc.",
  },
  {
    id: "motion",
    title: "framer-motion",
    content:
      "Focus ring on the rounded-md field; per-character animation applies when type is not password.",
  },
  {
    id: "registry",
    title: "shadcn registry",
    content:
      "Peer dependency framer-motion is declared on the registry item so shadcn add can install it when needed.",
    registryPath: "input.json",
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
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
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
              Input
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
            Input
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Standard rounded field with a visible label above, focus ring
            motion, and animated characters on the visible layer. Framer Motion.
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
            <div className="relative mt-1 flex min-h-0 flex-1 flex-col items-center justify-center">
              <InputPreview />
            </div>
          </BentoMotion>

          <BentoMotion
            className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">Install</SectionLabel>
            <div className="min-w-0 flex-1 [&>div]:mt-0">
              <CodeBlockInstall componentName="input" />
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
            <ComponentActions name="input" />
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="04">Usage</SectionLabel>
            <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
              The export is lowercase{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                input
              </code>
              ; alias it (e.g.{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                input as Input
              </code>
              ) for JSX. Pass{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                type
              </code>{" "}
              for the native input kind (
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                &quot;text&quot;
              </code>{" "}
              by default; e.g.{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                email
              </code>
              ,{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                password
              </code>
              ,{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                search
              </code>
              ). Spread other native attributes onto the underlying element. See
              tile{" "}
              <span className="font-mono text-neutral-600 text-xs dark:text-neutral-300">
                05
              </span>{" "}
              for API detail.
            </p>
            <CodeBlock code={usageCode} language="tsx" variant="embedded" />
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-4 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="05">Dependencies</SectionLabel>
            <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
              Registry peers and how this component fits your app.
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
  );
}
