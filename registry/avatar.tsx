"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/** Matches root box (h-[42px] w-[42px]) for the image element and CLS. */
const AVATAR_IMG_SIZE = 42;

export interface AvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

/** Smooth deceleration — less snappy than linear spring defaults. */
const enterEase = [0.16, 1, 0.3, 1] as [number, number, number, number];
const smoothEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function Avatar({ src, fallback = "?", className }: AvatarProps) {
  const reduceMotion = useReducedMotion();

  const rootTransition = reduceMotion
    ? { duration: 0.22, ease: "easeOut" as const }
    : {
        type: "spring" as const,
        stiffness: 142,
        damping: 25,
        mass: 1.05,
      };

  const hoverTransition = reduceMotion
    ? undefined
    : ({
        type: "spring" as const,
        stiffness: 340,
        damping: 36,
        mass: 0.62,
      } as const);

  const tapTransition = reduceMotion
    ? undefined
    : ({
        type: "spring" as const,
        stiffness: 480,
        damping: 42,
      } as const);

  const imageTransition = reduceMotion
    ? { duration: 0.2, ease: "easeOut" as const }
    : {
        opacity: { duration: 0.55, delay: 0.02, ease: enterEase },
        scale: { duration: 0.75, delay: 0, ease: enterEase },
        filter: { duration: 0.65, delay: 0.05, ease: smoothEase },
        clipPath: { duration: 0.7, delay: 0.03, ease: enterEase },
      };

  const fallbackTransition = reduceMotion
    ? { duration: 0.18, ease: "easeOut" as const }
    : {
        type: "spring" as const,
        stiffness: 260,
        damping: 30,
        mass: 0.72,
        delay: 0.05,
      };

  const ringTransition = reduceMotion
    ? undefined
    : {
        duration: 2.85,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut" as const,
      };

  return (
    <motion.div
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className={cn(
        "relative flex h-[42px] w-[42px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-sm",
        className
      )}
      initial={{ scale: 0.94, opacity: 0, y: 4 }}
      transition={rootTransition}
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.04,
              y: -1.5,
              boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
              transition: hoverTransition,
            }
      }
      whileTap={
        reduceMotion
          ? undefined
          : { scale: 0.988, y: 0, transition: tapTransition }
      }
    >
      {src ? (
        <motion.div
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  clipPath: "circle(50% at 50% 50%)",
                }
          }
          className="relative h-full w-full overflow-hidden rounded-full"
          initial={
            reduceMotion
              ? { opacity: 0, scale: 1 }
              : {
                  opacity: 0,
                  scale: 1.035,
                  filter: "blur(4px)",
                  clipPath: "circle(0% at 50% 50%)",
                }
          }
          transition={imageTransition}
        >
          {/* biome-ignore lint/performance/noImgElement: registry component stays framework-agnostic for shadcn consumers outside Next.js. */}
          <img
            alt="Avatar"
            className="object-cover"
            height={AVATAR_IMG_SIZE}
            loading="lazy"
            src={src}
            width={AVATAR_IMG_SIZE}
          />
        </motion.div>
      ) : (
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="select-none font-semibold text-white dark:text-neutral-950"
          initial={{ opacity: 0, y: 4 }}
          transition={fallbackTransition}
        >
          {fallback}
        </motion.span>
      )}

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/45 dark:border-neutral-950/50"
        initial={{ opacity: 0 }}
        whileHover={
          reduceMotion
            ? undefined
            : {
                opacity: [0.2, 0.92, 0.2],
                transition: ringTransition,
              }
        }
      />
    </motion.div>
  );
}

Avatar.displayName = "Avatar";

export { Avatar as avatar };
