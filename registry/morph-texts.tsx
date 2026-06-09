"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState } from "react";

import { cn } from "@/lib/utils";

const MORPH_EASE = [0.42, 0, 0.58, 1] as const;
const MORPH_TRANSITION_DURATION = 0.9;

const wordVariants = {
  initial: {
    opacity: 0,
    filter: "blur(20px)",
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: {
    opacity: 0,
    filter: "blur(20px)",
    scale: 1.2,
  },
};

export interface MorphTextProps {
  /** Array of words / phrases to cycle through. */
  words: string[];
  /**
   * Duration (ms) each word is displayed before transitioning.
   * @default 3000
   */
  interval?: number;
  /**
   * Optional subtext rendered beneath the morphing word.
   */
  subtext?: string;
  /**
   * Font size passed as a CSS value (e.g. "clamp(3rem, 15vw, 10rem)").
   * Defaults to a fluid clamp that scales with the viewport.
   */
  fontSize?: string;
  /**
   * Font family. Defaults to `"Space Grotesk", sans-serif`.
   */
  fontFamily?: string;
  /** Extra CSS classes on the root wrapper. */
  className?: string;
  /** Extra CSS classes on the morphing text container. */
  textClassName?: string;
  /** Extra CSS classes on the subtext element. */
  subtextClassName?: string;
}

export function MorphText({
  words,
  interval = 3000,
  subtext,
  fontSize = "clamp(3rem, 15vw, 10rem)",
  fontFamily = '"Space Grotesk", sans-serif',
  className,
  textClassName,
  subtextClassName,
}: MorphTextProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const uid = useId().replace(/:/g, "");
  const filterId = `morph-threshold-${uid}`;
  const activeWord = words[activeIndex] ?? words[0];

  useEffect(() => {
    if (words.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  const wordTransition = {
    duration: MORPH_TRANSITION_DURATION,
    ease: MORPH_EASE,
  };

  if (words.length === 0) {
    return null;
  }

  const longestWord = words.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    words[0]
  );

  const morphWord = (
    <span
      className={cn(
        "morph-text-container relative inline-grid align-baseline leading-none",
        textClassName
      )}
      style={{
        fontSize,
        filter: `url(#${filterId})`,
        fontFamily,
        verticalAlign: "baseline",
      }}
    >
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
      >
        {longestWord}
      </span>
      <span
        aria-live="polite"
        className="relative col-start-1 row-start-1 whitespace-nowrap"
      >
        <AnimatePresence>
          <motion.span
            animate="animate"
            className="morph-word absolute top-0 left-0 whitespace-nowrap"
            exit="exit"
            initial="initial"
            key={`${activeWord}-${activeIndex}`}
            style={{ transformOrigin: "0% 100%" }}
            transition={wordTransition}
            variants={wordVariants}
          >
            {activeWord}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );

  if (subtext) {
    return (
      <div
        className={cn(
          "morph-text-root relative flex flex-col items-center",
          className
        )}
      >
        <MorphTextFilter filterId={filterId} />
        {morphWord}
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "morph-subtext mt-8 text-[#888] uppercase tracking-[0.2em]",
            subtextClassName
          )}
          initial={{ opacity: 0, y: 20 }}
          style={{
            fontSize: "1.2rem",
            fontFamily,
          }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        >
          {subtext}
        </motion.p>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "morph-text-root relative inline-grid align-baseline leading-none",
        className
      )}
      style={{ verticalAlign: "baseline" }}
    >
      <MorphTextFilter filterId={filterId} />
      {morphWord}
    </span>
  );
}

function MorphTextFilter({ filterId }: { filterId: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <filter id={filterId}>
          <feColorMatrix
            in="SourceGraphic"
            result="goo"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

export default MorphText;
