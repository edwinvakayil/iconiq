"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { motion } from "motion/react";
import { forwardRef, type HTMLAttributes, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const AVATAR_SIZE = 44;
const WHITESPACE_REGEX = /\s+/g;
const FALLBACK_SPLIT_REGEX = /[\s_-]+/;
const NON_ALPHANUMERIC_REGEX = /[^\p{L}\p{N}]+/gu;
const enterEase = [0.16, 1, 0.3, 1] as const;

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
  alt?: string;
  className?: string;
  fallback?: string;
  loading?: "eager" | "lazy";
  name?: string;
  src?: string;
}

type ImageStatus = "idle" | "loaded" | "error";

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

function resolveImageStatus(status: string): ImageStatus {
  if (status === "loaded") {
    return "loaded";
  }

  if (status === "error") {
    return "error";
  }

  return "idle";
}

const rootTransition = {
  type: "spring" as const,
  stiffness: 340,
  damping: 26,
  mass: 0.88,
};

const imageTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 24,
  mass: 0.82,
};

const accentTransition = { duration: 0.3, ease: enterEase };

const hoverLift = { scale: 1.02, y: -1, transition: rootTransition };

const pressMotion = { scale: 0.995, y: 0, transition: { duration: 0.1 } };

function getAccentAnimate(imageStatus: ImageStatus) {
  return {
    opacity: imageStatus === "loaded" ? 0.18 : 0.34,
    scale: imageStatus === "loaded" ? 1.02 : 1,
    x: imageStatus === "loaded" ? 2 : 0,
    y: imageStatus === "loaded" ? -2 : 0,
  };
}

const accentHover = { opacity: 0.28, scale: 1.03, x: 1, y: -1 };

function getFallbackAnimate(imageStatus: ImageStatus) {
  if (imageStatus !== "loaded") {
    return { opacity: 1, scale: 1 };
  }

  return { opacity: 0, scale: 0.94 };
}

function getFallbackHover(imageStatus: ImageStatus) {
  if (imageStatus === "loaded") {
    return undefined;
  }

  return { scale: 1.02 };
}

function getImageAnimate(imageStatus: ImageStatus) {
  if (imageStatus === "loaded") {
    return { opacity: 1, scale: 1 };
  }

  return { opacity: 0, scale: 1.04 };
}

function getImageHover(imageStatus: ImageStatus) {
  return imageStatus === "loaded" ? { scale: 1.03 } : { scale: 1.015 };
}

function getRingAnimate(imageStatus: ImageStatus) {
  return {
    opacity: imageStatus === "loaded" ? 1 : 0.85,
    scale: imageStatus === "loaded" ? 1 : 0.985,
  };
}

const ringHover = { opacity: 0.92, scale: 1.015 };

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { src, fallback = "?", alt, name, loading = "eager", className, ...props },
    ref
  ) => {
    const fallbackLabel = getFallbackLabel(fallback, name, alt);
    const altText = getAltText(alt, name);
    const [imageStatus, setImageStatus] = useState<ImageStatus>(
      src ? "idle" : "error"
    );

    useEffect(() => {
      if (!src) {
        setImageStatus("error");
        return;
      }

      let active = true;
      const image = new window.Image();

      const commitStatus = (status: ImageStatus) => {
        if (active) {
          setImageStatus(status);
        }
      };

      setImageStatus("idle");
      image.onload = () => commitStatus("loaded");
      image.onerror = () => commitStatus("error");
      image.src = src;

      if (image.complete) {
        commitStatus(image.naturalWidth > 0 ? "loaded" : "error");
      }

      return () => {
        active = false;
        image.onload = null;
        image.onerror = null;
      };
    }, [src]);

    return (
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn(
          componentThemeClassName,
          "relative inline-flex h-11 w-11 shrink-0 items-center justify-center",
          className
        )}
        initial={{ opacity: 0, scale: 0.96, y: 3 }}
        ref={ref}
        transition={rootTransition}
        whileHover={hoverLift}
        whileTap={pressMotion}
        {...props}
      >
        <AvatarPrimitive.Root className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-neutral-950 via-neutral-800 to-neutral-700 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 dark:text-neutral-900">
          <motion.div
            animate={getAccentAnimate(imageStatus)}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.38),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.6),transparent_58%)]"
            initial={false}
            transition={accentTransition}
            whileHover={accentHover}
          />

          <motion.span
            animate={getFallbackAnimate(imageStatus)}
            className="absolute inset-0 flex select-none items-center justify-center font-semibold text-sm uppercase tracking-[0.08em]"
            initial={false}
            transition={accentTransition}
            whileHover={getFallbackHover(imageStatus)}
          >
            {fallbackLabel}
          </motion.span>

          {src ? (
            <motion.div
              animate={getImageAnimate(imageStatus)}
              className="absolute inset-0 overflow-hidden rounded-full"
              initial={false}
              transition={imageTransition}
              whileHover={getImageHover(imageStatus)}
            >
              <AvatarPrimitive.Image
                alt={altText}
                className="h-full w-full object-cover"
                height={AVATAR_SIZE}
                loading={loading}
                onLoadingStatusChange={(status) => {
                  setImageStatus(resolveImageStatus(status));
                }}
                src={src}
                width={AVATAR_SIZE}
              />
            </motion.div>
          ) : null}

          <motion.div
            animate={getRingAnimate(imageStatus)}
            className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/16 ring-inset dark:ring-black/10"
            initial={false}
            transition={accentTransition}
            whileHover={ringHover}
          />
        </AvatarPrimitive.Root>
      </motion.div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar as avatar };
export { Avatar };
