"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { faviconBadgeApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { faviconBadgePreviewCode } from "@/lib/component-v0-pages";
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

const usageCode = `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgePreview() {
  return (
    <FaviconBadge website="iconiqui.com" size="md" />
  );
}`;

function buildPreviewCode(website: string) {
  return `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgePreview() {
  return (
    <FaviconBadge website="${website}" size="md" />
  );
}`;
}

function FaviconBadgePreview({
  onWebsiteChange,
  website,
}: {
  onWebsiteChange: (website: string) => void;
  website: string;
}) {
  return (
    <div className="flex min-h-[14rem] w-full items-center justify-center px-4 py-10">
      <div className={cn(previewSentenceClassName, "max-w-2xl text-center")}>
        <span>Attributed to</span>
        <span className="inline-flex translate-y-px align-middle">
          <FaviconBadge size="md" website={website} />
        </span>
        <span>for</span>
        <InlineWebsiteField onChange={onWebsiteChange} value={website} />
        <span>.</span>
      </div>
    </div>
  );
}

export default function FaviconBadgePage() {
  const [website, setWebsite] = useState("iconiqui.com");
  const previewCode = useMemo(() => buildPreviewCode(website), [website]);

  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Favicon Badge" },
      ]}
      componentName="favicon-badge"
      description="Circular website favicon badge with optional label text."
      details={faviconBadgeApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/favicon-badge/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/favicon-badge"
      preview={
        <FaviconBadgePreview onWebsiteChange={setWebsite} website={website} />
      }
      previewClassName="min-h-[14rem] overflow-visible"
      previewCode={previewCode}
      previewDescription="Edit the website inline in the sentence to see the favicon badge update live."
      title="Favicon Badge"
      usageCode={usageCode}
      usageDescription={
        "Pass `website` with a domain or full URL to resolve the favicon through Google's favicon service. Add optional `label` for text beside the circular badge, and tune `size` or `faviconSize` when the default scale does not fit your layout."
      }
      v0PageCode={faviconBadgePreviewCode}
    />
  );
}
