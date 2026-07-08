"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useId,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Glyph keyframes. Every path shares the same command structure
 * (M + 4 cubic curves + Z) so Motion can interpolate the `d` attribute
 * as one continuous liquid morph. The two blobs are deliberately
 * asymmetric — passing through them makes the sparkle wobble like a
 * droplet instead of collapsing on a straight line to the circle.
 */
const sparkle =
  "M 12 3 C 12.9 7.4 16.6 11.1 21 12 C 16.6 12.9 12.9 16.6 12 21 C 11.1 16.6 7.4 12.9 3 12 C 7.4 11.1 11.1 7.4 12 3 Z";

const blobA =
  "M 12 4.2 C 16.8 3.4 20.6 7.2 19.8 12 C 20.6 16.4 16.4 20.6 12 19.8 C 7.8 20.6 3.4 16.8 4.2 12 C 3.4 7.6 7.2 3.4 12 4.2 Z";

const circle =
  "M 12 5 C 15.87 5 19 8.13 19 12 C 19 15.87 15.87 19 12 19 C 8.13 19 5 15.87 5 12 C 5 8.13 8.13 5 12 5 Z";

const blobB =
  "M 12 3.6 C 16.4 4.6 18.6 8 19.2 12 C 18.6 16.2 16.2 19.4 12 20.4 C 8 19.4 5.2 16.4 4.8 12 C 5.4 7.8 7.6 4.4 12 3.6 Z";

/** Small companion star in the top-right gap of the main sparkle. It
 *  blooms at the midpoint of the cycle — exactly when the main glyph has
 *  condensed into the circle — then fades as the sparkle re-forms. */
const twinkle =
  "M 19 2.5 C 19.18 4.32 19.68 4.82 21.5 5 C 19.68 5.18 19.18 5.68 19 7.5 C 18.82 5.68 18.32 5.18 16.5 5 C 18.32 4.82 18.82 4.32 19 2.5 Z";

/** One shared timeline for the whole glyph, so the morph, the breathing
 *  scale, and the twinkle stay choreographed. */
const GLYPH_CYCLE = 4;
const GLYPH_TIMES = [0, 0.3, 0.5, 0.7, 1];

interface ThinkingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Status words cycled through while the indicator is visible, e.g.
   *  `["Thinking", "Reasoning", "Planning"]`. Pass a single word to pin
   *  the label without cycling. */
  words: string[];
  /** Milliseconds each word stays on screen before cycling. */
  interval?: number;
  /** Show the morphing sparkle glyph before the label. Set to `false`
   *  for a text-only indicator (e.g. inline before a streamed reply). */
  showIcon?: boolean;
}

const ThinkingIndicator = forwardRef<HTMLDivElement, ThinkingIndicatorProps>(
  ({ className, words, interval = 3200, showIcon = true, ...props }, ref) => {
    const [index, setIndex] = useState(0);
    const gradientId = useId();
    // Reduced motion drops the glyph morph, the shimmer sweep, and the word
    // cycling — a static glyph and label carry the same meaning without the
    // movement.
    const reduceMotion = useReducedMotion() ?? false;

    const word = words.length > 0 ? words[index % words.length] : "";
    const longestWord = words.reduce(
      (a, b) => (a.length >= b.length ? a : b),
      ""
    );

    useEffect(() => {
      if (reduceMotion || words.length <= 1) {
        return;
      }
      const timer = setInterval(() => {
        setIndex((i) => (i + 1) % words.length);
      }, interval);
      return () => clearInterval(timer);
    }, [reduceMotion, words.length, interval]);

    return (
      // biome-ignore lint/a11y/useSemanticElements: output is form-associated; a div with role=status is the right fit for a chat loading row.
      <div
        className={cn(
          // Typography is inherited and the glyph and gap are sized in em,
          // so the whole indicator scales with whatever font-size the
          // consumer sets. Only the default color is opinionated.
          "flex items-center gap-[0.6em] text-muted-foreground",
          className
        )}
        ref={ref}
        role="status"
        {...props}
      >
        {/* Static announcement — the cycling word display below is aria-hidden
            so screen readers hear one announcement instead of one per cycle. */}
        {words.length > 0 && <span className="sr-only">{words[0]}…</span>}
        {showIcon && (
          /* The glyph is exactly one line box tall (1lh), so it always
             matches the label's rendered height; the em attributes are a
             fallback for browsers without lh support. */
          <svg
            aria-hidden="true"
            className="h-[1lh] w-[1lh] shrink-0"
            fill="none"
            height="1.5em"
            viewBox="0 0 24 24"
            width="1.5em"
          >
            <defs>
              {/* Depth without a hardcoded palette: both stops are
                  currentColor, only the opacity ramps. */}
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id={gradientId}
                x1="5"
                x2="20"
                y1="4"
                y2="20"
              >
                <stop offset="0" stopColor="currentColor" stopOpacity="1" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {reduceMotion ? (
              <>
                <path d={sparkle} fill={`url(#${gradientId})`} />
                <path d={twinkle} fill="currentColor" opacity={0.5} />
              </>
            ) : (
              <>
                <motion.path
                  animate={{
                    d: [sparkle, blobA, circle, blobB, sparkle],
                    rotate: 360,
                    scale: [1, 0.9, 0.78, 0.9, 1],
                  }}
                  d={sparkle}
                  fill={`url(#${gradientId})`}
                  style={{
                    transformBox: "view-box",
                    transformOrigin: "center",
                  }}
                  transition={{
                    d: {
                      duration: GLYPH_CYCLE,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                      times: GLYPH_TIMES,
                    },
                    scale: {
                      duration: GLYPH_CYCLE,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                      times: GLYPH_TIMES,
                    },
                    rotate: {
                      duration: GLYPH_CYCLE,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    },
                  }}
                />
                <motion.path
                  animate={{
                    opacity: [0, 0, 1, 0, 0],
                    rotate: [0, 45, 90, 135, 180],
                    scale: [0.2, 0.5, 1, 0.5, 0.2],
                  }}
                  d={twinkle}
                  fill="currentColor"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                  transition={{
                    duration: GLYPH_CYCLE,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    times: GLYPH_TIMES,
                  }}
                />
              </>
            )}
          </svg>
        )}
        {words.length > 0 && (
          <span aria-hidden="true" className="inline-grid overflow-hidden">
            {/* Invisible longest word reserves the column width so the layout
              never shifts as words of different lengths cycle through. */}
            <span className="invisible col-start-1 row-start-1">
              {longestWord}
            </span>
            {reduceMotion ? (
              <span className="col-start-1 row-start-1">{words[0]}</span>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  animate={{
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    backgroundPosition: "0% center",
                  }}
                  className={cn(
                    "col-start-1 row-start-1 bg-[length:250%_100%,auto] bg-clip-text text-transparent",
                    // Theme tokens, not a hardcoded palette: the resting text
                    // is the theme's muted foreground and the sweeping sheen
                    // is its full foreground, in light and dark alike.
                    "[--ti-base:var(--muted-foreground)] [--ti-sheen:var(--foreground)]",
                    "[background-repeat:no-repeat,padding-box]"
                  )}
                  exit={{
                    y: "-70%",
                    opacity: 0,
                    filter: "blur(3px)",
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                  }}
                  initial={{
                    y: "70%",
                    opacity: 0,
                    filter: "blur(3px)",
                    backgroundPosition: "100% center",
                  }}
                  key={word}
                  style={
                    {
                      "--ti-spread": `${word.length * 2}px`,
                      backgroundImage:
                        "linear-gradient(90deg,#0000 calc(50% - var(--ti-spread)),var(--ti-sheen),#0000 calc(50% + var(--ti-spread))), linear-gradient(var(--ti-base),var(--ti-base))",
                    } as CSSProperties
                  }
                  transition={{
                    y: { type: "spring", stiffness: 420, damping: 34 },
                    opacity: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                    filter: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                    backgroundPosition: {
                      duration: 2,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    },
                  }}
                >
                  {word}
                </motion.span>
              </AnimatePresence>
            )}
          </span>
        )}
      </div>
    );
  }
);

ThinkingIndicator.displayName = "ThinkingIndicator";

export { ThinkingIndicator };
export type { ThinkingIndicatorProps };
export default ThinkingIndicator;
