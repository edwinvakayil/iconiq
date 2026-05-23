"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { motion } from "motion/react";
import { forwardRef, type HTMLAttributes, useEffect, useState } from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

const AVATAR_SIZE = 44;
const WHITESPACE_REGEX = /\s+/g;
const FALLBACK_SPLIT_REGEX = /[\s_-]+/;
const NON_ALPHANUMERIC_REGEX = /[^\p{L}\p{N}]+/gu;
const enterEase = [0.16, 1, 0.3, 1] as const;
const settleEase = [0.22, 1, 0.36, 1] as const;

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

export interface AvatarProps
  extends DivHTMLAttributesForMotion,
    ReducedMotionProp {
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

function getRootTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.14, ease: settleEase }
    : {
        type: "spring" as const,
        stiffness: 340,
        damping: 26,
        mass: 0.88,
      };
}

function getImageTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.16, ease: enterEase }
    : {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
        mass: 0.82,
      };
}

function getAccentTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.14, ease: settleEase }
    : { duration: 0.3, ease: enterEase };
}

function getHoverLift(
  reduceMotion: boolean,
  transition: ReturnType<typeof getRootTransition>
) {
  if (reduceMotion) {
    return undefined;
  }

  return { scale: 1.02, y: -1, transition };
}

function getPressMotion(reduceMotion: boolean) {
  if (reduceMotion) {
    return undefined;
  }

  return { scale: 0.995, y: 0, transition: { duration: 0.1 } };
}

function getAccentAnimate(imageStatus: ImageStatus) {
  return {
    opacity: imageStatus === "loaded" ? 0.18 : 0.34,
    scale: imageStatus === "loaded" ? 1.02 : 1,
    x: imageStatus === "loaded" ? 2 : 0,
    y: imageStatus === "loaded" ? -2 : 0,
  };
}

function getAccentHover(reduceMotion: boolean) {
  if (reduceMotion) {
    return undefined;
  }

  return { opacity: 0.28, scale: 1.03, x: 1, y: -1 };
}

function getFallbackAnimate(imageStatus: ImageStatus, reduceMotion: boolean) {
  if (imageStatus !== "loaded") {
    return { opacity: 1, scale: 1 };
  }

  if (reduceMotion) {
    return { opacity: 0 };
  }

  return { opacity: 0, scale: 0.94 };
}

function getFallbackHover(imageStatus: ImageStatus, reduceMotion: boolean) {
  if (reduceMotion || imageStatus === "loaded") {
    return undefined;
  }

  return { scale: 1.02 };
}

function getImageAnimate(imageStatus: ImageStatus, reduceMotion: boolean) {
  if (imageStatus === "loaded") {
    return { opacity: 1, scale: 1 };
  }

  if (reduceMotion) {
    return { opacity: 0 };
  }

  return { opacity: 0, scale: 1.04 };
}

function getImageHover(imageStatus: ImageStatus, reduceMotion: boolean) {
  if (reduceMotion) {
    return undefined;
  }

  return imageStatus === "loaded" ? { scale: 1.03 } : { scale: 1.015 };
}

function getRingAnimate(imageStatus: ImageStatus) {
  return {
    opacity: imageStatus === "loaded" ? 1 : 0.85,
    scale: imageStatus === "loaded" ? 1 : 0.985,
  };
}

function getRingHover(reduceMotion: boolean) {
  if (reduceMotion) {
    return undefined;
  }

  return { opacity: 0.92, scale: 1.015 };
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      fallback = "?",
      alt,
      name,
      loading = "eager",
      className,
      reducedMotion,
      ...props
    },
    ref
  ) => {
    const fallbackLabel = getFallbackLabel(fallback, name, alt);
    const altText = getAltText(alt, name);
    const reduceMotion = useResolvedReducedMotion(reducedMotion);
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

    const rootTransition = getRootTransition(reduceMotion);
    const imageTransition = getImageTransition(reduceMotion);
    const accentTransition = getAccentTransition(reduceMotion);
    const hoverLift = getHoverLift(reduceMotion, rootTransition);
    const pressMotion = getPressMotion(reduceMotion);

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={cn(
            registryTheme,
            "relative inline-flex h-11 w-11 shrink-0 items-center justify-center",
            className
          )}
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 3 }
          }
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
              whileHover={getAccentHover(reduceMotion)}
            />

            <motion.span
              animate={getFallbackAnimate(imageStatus, reduceMotion)}
              className="absolute inset-0 flex select-none items-center justify-center font-semibold text-sm uppercase tracking-[0.08em]"
              initial={false}
              transition={accentTransition}
              whileHover={getFallbackHover(imageStatus, reduceMotion)}
            >
              {fallbackLabel}
            </motion.span>

            {src ? (
              <motion.div
                animate={getImageAnimate(imageStatus, reduceMotion)}
                className="absolute inset-0 overflow-hidden rounded-full"
                initial={false}
                transition={imageTransition}
                whileHover={getImageHover(imageStatus, reduceMotion)}
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
              whileHover={getRingHover(reduceMotion)}
            />
          </AvatarPrimitive.Root>
        </motion.div>
      </ReducedMotionConfig>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar as avatar };
export { Avatar };
