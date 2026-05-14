"use client";

import { motion, useReducedMotion } from "motion/react";
import { forwardRef, type HTMLAttributes, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Keeps the visible avatar and image footprint aligned to a 44px target. */
const AVATAR_SIZE = 44;
const WHITESPACE_REGEX = /\s+/g;
const FALLBACK_SPLIT_REGEX = /[\s_-]+/;
const NON_ALPHANUMERIC_REGEX = /[^\p{L}\p{N}]+/gu;

type DivHTMLAttributesForMotion = Omit<
  HTMLAttributes<HTMLDivElement>,
  | "children"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

export interface AvatarProps extends DivHTMLAttributesForMotion {
  src?: string;
  fallback?: string;
  alt?: string;
  name?: string;
  loading?: "eager" | "lazy";
  className?: string;
}

const enterEase = [0.16, 1, 0.3, 1] as const;
const settleEase = [0.22, 1, 0.36, 1] as const;

function normalizeText(value?: string) {
  return value?.trim().replace(WHITESPACE_REGEX, " ") ?? "";
}

function firstCharacter(value: string) {
  return Array.from(value)[0] ?? "";
}

function getFallbackLabel(fallback?: string, name?: string, alt?: string) {
  const normalized = [fallback, name, alt].map(normalizeText).find(Boolean);

  if (!normalized) {
    return "?";
  }

  const words = normalized
    .split(FALLBACK_SPLIT_REGEX)
    .map((word) => word.replace(NON_ALPHANUMERIC_REGEX, ""))
    .filter(Boolean);

  if (words.length >= 2) {
    return `${firstCharacter(words[0])}${firstCharacter(words[1])}`.toUpperCase();
  }

  const compact = Array.from(
    words[0] ?? normalized.replace(WHITESPACE_REGEX, "")
  )
    .slice(0, 2)
    .join("");

  return compact.toUpperCase() || "?";
}

function getAltText(alt?: string, name?: string) {
  if (alt !== undefined) {
    return normalizeText(alt);
  }

  const normalizedName = normalizeText(name);
  return normalizedName || "Avatar";
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { src, fallback = "?", alt, name, loading = "eager", className, ...props },
    ref
  ) => {
    const reduceMotion = useReducedMotion();
    const fallbackLabel = getFallbackLabel(fallback, name, alt);
    const altText = getAltText(alt, name);
    const [imageStatus, setImageStatus] = useState<"idle" | "loaded" | "error">(
      src ? "idle" : "error"
    );

    useEffect(() => {
      setImageStatus(src ? "idle" : "error");
    }, [src]);

    const rootTransition = reduceMotion
      ? { duration: 0.16, ease: "easeOut" as const }
      : { duration: 0.2, ease: settleEase };

    const imageTransition = reduceMotion
      ? { duration: 0.14, ease: "easeOut" as const }
      : { duration: 0.22, ease: enterEase };

    const fallbackTransition = reduceMotion
      ? { duration: 0.12, ease: "easeOut" as const }
      : { duration: 0.18, ease: settleEase };

    return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-background",
          className
        )}
        initial={{ opacity: 0, scale: 0.98 }}
        ref={ref}
        transition={rootTransition}
        {...props}
      >
        <motion.span
          animate={
            imageStatus === "loaded"
              ? { opacity: 0, scale: 0.96 }
              : { opacity: 1, scale: 1 }
          }
          className="absolute inset-0 flex select-none items-center justify-center font-semibold text-sm uppercase tracking-[0.08em]"
          initial={false}
          transition={fallbackTransition}
        >
          {fallbackLabel}
        </motion.span>

        {src ? (
          <motion.div
            animate={
              imageStatus === "loaded"
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 1.02 }
            }
            className="relative h-full w-full overflow-hidden rounded-full"
            initial={false}
            transition={imageTransition}
          >
            {/* biome-ignore lint/performance/noImgElement: registry component stays framework-agnostic for shadcn consumers outside Next.js. */}
            <img
              alt={altText}
              className="h-full w-full object-cover"
              decoding="async"
              height={AVATAR_SIZE}
              loading={loading}
              onError={() => setImageStatus("error")}
              onLoad={() => setImageStatus("loaded")}
              src={src}
              width={AVATAR_SIZE}
            />
          </motion.div>
        ) : null}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20 ring-inset dark:ring-black/20"
        />
      </motion.div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar as avatar };
export { Avatar };
