"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Fragment,
  forwardRef,
  type HTMLAttributes,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface StreamingTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** The full text to stream in word by word. Newlines are preserved as
   *  paragraph breaks. Changing it restarts the stream from the first word. */
  text: string;
  /** Milliseconds between each word appearing. */
  speed?: number;
  /** Milliseconds to wait before the first word appears. */
  delay?: number;
  /** How long a word wears the blue gradient before settling into the
   *  theme foreground, in milliseconds. */
  settleDelay?: number;
  /** Show a small pulsing gradient dot riding the stream head. */
  showCursor?: boolean;
  /** Called once, after the last word has appeared. */
  onComplete?: () => void;
}

type StreamToken =
  | { type: "word"; value: string }
  | { type: "break"; value: string };

const lineBreaks = /(\n+)/;
const whitespace = /\s+/;

/** Split text into word and line-break tokens. Runs of spaces collapse to
 *  one; runs of newlines collapse to a single paragraph break. Each token
 *  costs one streaming tick, so a paragraph break reads as a natural beat. */
function tokenize(text: string): StreamToken[] {
  const tokens: StreamToken[] = [];
  for (const part of text.split(lineBreaks)) {
    if (part.startsWith("\n")) {
      tokens.push({ type: "break", value: part.length > 1 ? "\n\n" : "\n" });
    } else {
      for (const word of part.split(whitespace)) {
        if (word) {
          tokens.push({ type: "word", value: word });
        }
      }
    }
  }
  return tokens;
}

/** Freshly streamed words wear this gradient, then crossfade into
 *  text-foreground — black in light mode, white in dark — so the trail
 *  of blue always marks what just arrived. */
const gradientText =
  "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300";

/** Consecutive words sample a 3x-wide version of the gradient at stepped
 *  offsets that ping-pong across GRADIENT_PHASES positions, so the blue
 *  trail reads as one continuous ribbon of color flowing over several
 *  words instead of every word restarting at sky. Static paint — the
 *  offset never animates, so it costs nothing per frame. */
const GRADIENT_PHASES = 6;

function gradientOffset(index: number): string {
  const cycle = 2 * (GRADIENT_PHASES - 1);
  const step = index % cycle;
  const phase = step < GRADIENT_PHASES ? step : cycle - step;
  return `${(phase / (GRADIENT_PHASES - 1)) * 100}% 50%`;
}

/** How long the gradient → foreground crossfade runs once a word's settle
 *  delay has elapsed, in seconds. Together with settleDelay this bounds how
 *  many words are blue at once. */
const SETTLE_FADE = 0.45;

/** Entrance fade length in seconds. Deliberately much longer than the
 *  default streaming cadence: at any moment four to five words are mid-fade
 *  at staggered opacities, which turns the reveal into one continuous
 *  gradient wave instead of discrete word pops. */
const ENTER_FADE = 0.5;

const settleTransition = (settleDelay: number) => ({
  delay: settleDelay / 1000,
  duration: SETTLE_FADE,
  ease: [0.4, 0, 0.2, 1] as const,
});

// Memoized so the words already on screen skip React entirely on every
// streaming tick — only the newly revealed word mounts and animates.
const StreamedWord = memo(function StreamedWord({
  word,
  index,
  settleDelay,
}: {
  word: string;
  index: number;
  settleDelay: number;
}) {
  return (
    // The word is a grid stacking two copies of itself: the gradient copy
    // on top fades out while the foreground copy fades in, so the color
    // handoff is a true crossfade and stays theme-correct in both modes.
    // Every animated value here is opacity — nothing that forces the
    // browser to repaint text mid-stream — so the stream stays lag-free.
    <motion.span
      // The entrance is a plain opacity fade — no movement, no scale, no
      // blur. Anything else smears or wobbles the glyphs as they land.
      animate={{ opacity: 1 }}
      className="inline-grid align-baseline"
      initial={{ opacity: 0 }}
      transition={{ duration: ENTER_FADE, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.span
        animate={{ opacity: 1 }}
        className="col-start-1 row-start-1 text-foreground"
        initial={{ opacity: 0 }}
        transition={settleTransition(settleDelay)}
      >
        {word}
      </motion.span>
      <motion.span
        animate={{ opacity: 0 }}
        className={cn("col-start-1 row-start-1", gradientText)}
        initial={{ opacity: 1 }}
        style={{
          backgroundSize: "300% 100%",
          backgroundPosition: gradientOffset(index),
        }}
        transition={settleTransition(settleDelay)}
      >
        {word}
      </motion.span>
    </motion.span>
  );
});

const StreamingText = forwardRef<HTMLSpanElement, StreamingTextProps>(
  (
    {
      className,
      text,
      speed = 120,
      delay = 0,
      settleDelay = 300,
      showCursor = true,
      onComplete,
      ...props
    },
    ref
  ) => {
    const tokens = useMemo(() => tokenize(text), [text]);
    const [count, setCount] = useState(0);
    // Reduced motion skips the stream entirely — the full text renders
    // static in the foreground color, no gradient, no cursor.
    const reduceMotion = useReducedMotion() ?? false;

    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;
    const startRef = useRef(0);

    // Reset during render, not in an effect: an effect would let one frame
    // paint the new text sliced by the old count before restarting.
    const [prevText, setPrevText] = useState(text);
    if (prevText !== text) {
      setPrevText(text);
      setCount(0);
    }

    useEffect(() => {
      if (reduceMotion || tokens.length === 0 || count >= tokens.length) {
        return;
      }
      if (count === 0) {
        startRef.current = performance.now();
      }
      // Every token is scheduled against the stream's start time instead of
      // chaining timeouts, so render latency can never accumulate into a
      // drifting, stuttering cadence.
      const target =
        startRef.current + delay + (count + 1) * Math.max(speed, 16);
      const timer = setTimeout(
        () => {
          setCount(count + 1);
          // Completion fires from the tick that reveals the last token —
          // exactly once, immune to effect re-runs after the stream ends.
          if (count + 1 >= tokens.length) {
            onCompleteRef.current?.();
          }
        },
        Math.max(0, target - performance.now())
      );
      return () => clearTimeout(timer);
    }, [count, tokens.length, speed, delay, reduceMotion]);

    // Reduced motion shows everything immediately, so completion is
    // immediate too — consumers chaining UI on onComplete never hang.
    useEffect(() => {
      if (reduceMotion && tokens.length > 0) {
        onCompleteRef.current?.();
      }
    }, [reduceMotion, tokens]);

    const streaming = !reduceMotion && count < tokens.length;

    return (
      <span
        className={cn(
          // Typography is fully inherited: the component only decides how
          // words arrive and settle, never how they're set. pre-wrap keeps
          // the paragraph breaks the tokenizer preserves.
          "whitespace-pre-wrap text-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        {reduceMotion ? (
          text
        ) : (
          <>
            {/* Screen readers get the full text once; the animated
                word-by-word display below is decorative. */}
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
              {/* Positional keys are correct here: the token list is derived
                  from `text` alone and only ever appends while streaming. */}
              {tokens.slice(0, count).map((token, index) =>
                token.type === "break" ? (
                  <span key={`break-${index}`}>{token.value}</span>
                ) : (
                  <Fragment key={`word-${index}`}>
                    <StreamedWord
                      index={index}
                      settleDelay={settleDelay}
                      word={token.value}
                    />{" "}
                  </Fragment>
                )
              )}
              {showCursor && (
                <AnimatePresence>
                  {streaming && (
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
                      className={cn(
                        "inline-block size-[0.55em] rounded-full align-baseline",
                        "bg-gradient-to-br from-sky-400 to-indigo-500 dark:from-sky-300 dark:to-indigo-400",
                        // The glow rides the dot's animated opacity, so it
                        // breathes with the pulse at zero per-frame cost.
                        "shadow-[0_0_0.7em_rgba(56,189,248,0.55)] dark:shadow-[0_0_0.7em_rgba(125,211,252,0.45)]"
                      )}
                      exit={{ opacity: 0, scale: 0 }}
                      initial={{ opacity: 0, scale: 0 }}
                      transition={{
                        opacity: {
                          duration: 1.2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        },
                        scale: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                      }}
                    />
                  )}
                </AnimatePresence>
              )}
            </span>
          </>
        )}
      </span>
    );
  }
);

StreamingText.displayName = "StreamingText";

export { StreamingText };
export type { StreamingTextProps };
export default StreamingText;
