"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { FaviconBadge } from "@/registry/favicon-badge";

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const inlineWebsiteTextClassName =
  "font-medium text-lg leading-snug tracking-tight sm:text-xl";

const inlineWebsiteInputClassName =
  "relative z-10 border-0 bg-transparent p-0 text-neutral-800 caret-transparent outline-none placeholder:text-muted-foreground focus-visible:outline-none dark:text-neutral-100";

function BlinkingCaret({ left }: { left: number }) {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      aria-hidden
      className="pointer-events-none absolute top-1/2 h-[0.92em] w-px -translate-y-1/2 bg-neutral-800 dark:bg-neutral-100"
      style={{ left }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        times: [0, 0.49, 0.5, 1],
      }}
    />
  );
}

function InlineWebsiteField({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const valueMeasureRef = useRef<HTMLSpanElement>(null);
  const fieldMeasureRef = useRef<HTMLSpanElement>(null);
  const [valueWidth, setValueWidth] = useState(0);
  const [fieldWidth, setFieldWidth] = useState(0);

  const placeholder = "your site";
  const fieldMeasureText = value || placeholder;

  useLayoutEffect(() => {
    const measure = () => {
      setValueWidth(valueMeasureRef.current?.offsetWidth ?? 0);
      setFieldWidth(fieldMeasureRef.current?.offsetWidth ?? 0);
    };

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  });

  const caretLeft = value ? valueWidth : 0;
  const inputWidth = Math.max(fieldWidth, 12);

  return (
    <span
      className="group relative inline-block translate-y-px cursor-text align-baseline"
      onClick={() => inputRef.current?.focus()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          inputRef.current?.focus();
        }
      }}
      role="presentation"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none invisible absolute whitespace-pre",
          inlineWebsiteTextClassName
        )}
        ref={valueMeasureRef}
      >
        {value}
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none invisible absolute whitespace-pre",
          inlineWebsiteTextClassName
        )}
        ref={fieldMeasureRef}
      >
        {fieldMeasureText}
      </span>
      <input
        aria-label="Website"
        className={cn(inlineWebsiteInputClassName, inlineWebsiteTextClassName)}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        ref={inputRef}
        spellCheck={false}
        style={{ width: inputWidth }}
        type="text"
        value={value}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px origin-left scale-x-0 bg-neutral-800 transition-transform duration-200 group-focus-within:scale-x-100 dark:bg-neutral-100"
        style={{ width: inputWidth }}
      />
      <BlinkingCaret left={caretLeft} />
    </span>
  );
}

export function FaviconBadgeLivePreview({
  className,
  faviconSize,
  label,
  onWebsiteChange,
  size = "md",
  website,
}: {
  className?: string;
  faviconSize?: 16 | 32 | 64 | 128;
  label?: string;
  onWebsiteChange: (website: string) => void;
  size?: "sm" | "md" | "lg";
  website: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center px-4 py-2",
        className
      )}
    >
      <div className={cn(previewSentenceClassName, "max-w-2xl text-center")}>
        <span>Attributed to</span>
        <span className="inline-flex translate-y-px align-middle">
          <FaviconBadge
            faviconSize={faviconSize}
            label={label}
            size={size}
            website={website}
          />
        </span>
        <span>for</span>
        <InlineWebsiteField onChange={onWebsiteChange} value={website} />
        <span>.</span>
      </div>
    </div>
  );
}
