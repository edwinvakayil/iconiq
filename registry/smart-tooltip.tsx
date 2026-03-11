"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SmartTooltipProps {
  children: ReactNode;
  copyValue: string;
  className?: string;
  wrapperClassName?: string;
}

type InteractionState = {
  hasEverHovered: boolean;
  hasCopied: boolean;
  hasHoveredAfterCopy: boolean;
};

function getTooltipLabel(state: InteractionState) {
  if (!state.hasEverHovered) return "Hover first time";
  if (!state.hasCopied) return "Click to copy";
  if (!state.hasHoveredAfterCopy) return "Copied";
  return "Copied earlier";
}

export function SmartTooltip({
  children,
  copyValue,
  className,
  wrapperClassName,
}: SmartTooltipProps) {
  const [open, setOpen] = useState(false);
  const [interaction, setInteraction] = useState<InteractionState>({
    hasEverHovered: false,
    hasCopied: false,
    hasHoveredAfterCopy: false,
  });

  /* -----------------------------
     GLOBAL COPY DETECTION
  ----------------------------- */

  useEffect(() => {
    const handleGlobalCopy = (event: ClipboardEvent) => {
      const copiedText = event.clipboardData?.getData("text");

      if (copiedText !== copyValue) {
        setInteraction((prev) => ({
          ...prev,
          hasCopied: false,
          hasHoveredAfterCopy: false,
        }));
      }
    };

    document.addEventListener("copy", handleGlobalCopy);

    return () => {
      document.removeEventListener("copy", handleGlobalCopy);
    };
  }, [copyValue]);

  const handleMouseEnter = () => {
    setOpen(true);
    setInteraction((prev) => ({
      ...prev,
      hasEverHovered: true,
      hasHoveredAfterCopy:
        prev.hasCopied && !prev.hasHoveredAfterCopy
          ? true
          : prev.hasHoveredAfterCopy,
    }));
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClick = async () => {
    let didCopy = false;

    try {
      if (navigator.clipboard && "writeText" in navigator.clipboard) {
        await navigator.clipboard.writeText(copyValue);
        didCopy = true;
      }
    } catch {
      // Ignore clipboard errors; fallback will handle copying
    }

    if (!didCopy && typeof document !== "undefined") {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = copyValue;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (successful) didCopy = true;
      } catch {
        // Ignore fallback copy errors; tooltip state will simply not update
      }
    }

    if (didCopy) {
      setInteraction((prev) => ({
        ...prev,
        hasCopied: true,
      }));
    }
  };

  const label = getTooltipLabel(interaction);

  return (
    <div
      className={cn("relative inline-flex", wrapperClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {open && (
        <output
          className={cn(
            "pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-3 py-1 font-medium text-neutral-50 text-xs shadow-[0_18px_45px_rgba(15,23,42,0.28)]",
            className
          )}
        >
          {label}
        </output>
      )}

      <Button
        className="relative z-10"
        onClick={handleClick}
        type="button"
        variant="outline"
      >
        {children}
      </Button>
    </div>
  );
}
