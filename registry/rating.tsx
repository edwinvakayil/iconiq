"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { motion, useReducedMotion } from "motion/react";
import type {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const STAR_POINTS =
  "9 1.75 11.24 6.289 16.25 7.017 12.625 10.551 13.481 15.54 9 13.185 4.519 15.54 5.375 10.551 1.75 7.017 6.76 6.289 9 1.75";

const POP_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 7,
  mass: 0.9,
} as const;
const STAGGER_SECONDS = 0.025;

type StarIconProps = { className?: string; size?: number };

function StarIcon({ className, size = 24 }: StarIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 18 18"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points={STAR_POINTS} />
    </svg>
  );
}

// Reused across every RatingButton instance — a plain element with no
// per-instance state, so allocating it once avoids a fresh object per render.
const DEFAULT_ICON = <StarIcon />;
const DEFAULT_SIZE = 20;

type RatingContextValue = {
  value: number;
  readOnly: boolean;
  size: number;
  hoverValue: number | null;
  focusedStar: number | null;
  handleValueChange: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number
  ) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  setHoverValue: (value: number | null) => void;
  setFocusedStar: (value: number | null) => void;
};

const RatingContext = createContext<RatingContextValue | null>(null);

const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error("useRating must be used within a Rating component");
  }
  return context;
};

export type RatingButtonProps = {
  /** Icon element to render. Must accept size and className. @default <StarIcon /> */
  icon?: ReactElement<StarIconProps>;
  /** Icon size in pixels. Falls back to the parent Rating's size. @default 20 */
  size?: number;
  /** Optional class names applied to the button. */
  className?: string;
  /** Position in the scale. Injected automatically by Rating from child order — you don't need to pass it yourself. */
  index?: number;
};

// Renders a single star. Must be used inside Rating — reads shared state
// from context rather than taking a value prop directly.
export const RatingButton = ({
  index: providedIndex,
  size: sizeProp,
  className,
  icon = DEFAULT_ICON,
}: RatingButtonProps) => {
  const {
    value,
    readOnly,
    size: contextSize,
    hoverValue,
    focusedStar,
    handleValueChange,
    handleKeyDown,
    setHoverValue,
    setFocusedStar,
  } = useRating();
  const size = sizeProp ?? contextSize;
  const reduceMotion = useReducedMotion();

  const index = providedIndex ?? 0;
  const isActive = index < (hoverValue ?? focusedStar ?? value ?? 0);
  const isChecked = value === index + 1;
  const tabIndex = readOnly
    ? -1
    : isChecked || (value === 0 && index === 0)
      ? 0
      : -1;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      handleValueChange(event, isChecked ? 0 : index + 1);
    },
    [handleValueChange, index, isChecked]
  );

  const handleMouseEnter = useCallback(() => {
    if (!readOnly) {
      setHoverValue(index + 1);
    }
  }, [readOnly, setHoverValue, index]);

  const handleFocus = useCallback(() => {
    setFocusedStar(index + 1);
  }, [setFocusedStar, index]);

  const handleBlur = useCallback(() => {
    setFocusedStar(null);
  }, [setFocusedStar]);

  return (
    // biome-ignore lint/a11y/useSemanticElements: a native <input type="radio"> can't host the icon/motion content each star renders
    <button
      aria-checked={isChecked}
      aria-label={`Rate ${index + 1} star${index === 0 ? "" : "s"}`}
      className={cn(
        "rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ic-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ic-card)]",
        readOnly ? "cursor-default" : "cursor-pointer",
        className
      )}
      disabled={readOnly}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      role="radio"
      tabIndex={tabIndex}
      type="button"
    >
      <motion.span
        animate={{ scale: isActive ? 1 : 0.75 }}
        className="inline-flex"
        transition={
          reduceMotion
            ? { duration: 0 }
            : { ...POP_SPRING, delay: index * STAGGER_SECONDS }
        }
        whileHover={readOnly || reduceMotion ? undefined : { scale: 1.18 }}
        whileTap={readOnly || reduceMotion ? undefined : { scale: 0.82 }}
      >
        {cloneElement(icon, {
          size,
          className: cn(
            "transition-colors duration-200 ease-out",
            isActive
              ? "fill-current text-[var(--ic-primary)]"
              : "text-[var(--ic-border)]"
          ),
        })}
      </motion.span>
    </button>
  );
};

export type RatingProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> & {
  /** One RatingButton per star. Their count is the scale. */
  children?: ReactNode;
  /** Controlled rating value. Pair with onValueChange. */
  value?: number;
  /** Initial rating for uncontrolled usage. @default 0 */
  defaultValue?: number;
  /** Called with the new value on click or arrow key. */
  onValueChange?: (value: number) => void;
  /** Lower-level change handler that also receives the originating mouse or keyboard event. */
  onChange?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number
  ) => void;
  /** Renders every RatingButton as a native disabled button, for showing an existing rating without interaction. @default false */
  readOnly?: boolean;
  /** Icon size in pixels for all RatingButton children. @default 20 */
  size?: number;
};

// Compound star rating root. Manages the current value, icon size, and
// shared interaction state for its RatingButton children — tap a star to
// set the rating instantly, drag your focus with the Arrow keys, or tap the
// already-selected star again to clear it.
export const Rating = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue = 0,
  onChange,
  readOnly = false,
  size = DEFAULT_SIZE,
  className,
  children,
  ...props
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [focusedStar, setFocusedStar] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue,
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });

  // Children.toArray drops null/false/undefined entries and normalizes
  // keys, so conditionally rendered RatingButton children never leave a
  // gap in the index sequence or inflate the Home/End/Arrow-key total.
  const validChildren = Children.toArray(children).filter(
    Boolean
  ) as ReactElement<RatingButtonProps>[];
  const total = validChildren.length;

  const handleValueChange = useCallback(
    (
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
      newValue: number
    ) => {
      if (!readOnly) {
        onChange?.(event, newValue);
        onValueChange?.(newValue);
      }
    },
    [readOnly, onChange, onValueChange]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (readOnly || total === 0) {
        return;
      }

      let newValue = focusedStar !== null ? focusedStar : (value ?? 0);

      switch (event.key) {
        case "ArrowRight":
          if (event.shiftKey || event.metaKey) {
            newValue = total;
          } else {
            newValue = Math.min(total, newValue + 1);
          }
          break;
        case "ArrowLeft":
          if (event.shiftKey || event.metaKey) {
            newValue = 1;
          } else {
            newValue = Math.max(1, newValue - 1);
          }
          break;
        default:
          return;
      }

      event.preventDefault();
      setFocusedStar(newValue);
      handleValueChange(event, newValue);
    },
    [focusedStar, value, total, readOnly, handleValueChange]
  );

  useEffect(() => {
    if (focusedStar !== null && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll("button");
      buttons[focusedStar - 1]?.focus();
    }
  }, [focusedStar]);

  const contextValue: RatingContextValue = {
    value: value ?? 0,
    readOnly,
    size,
    hoverValue,
    focusedStar,
    handleValueChange,
    handleKeyDown,
    setHoverValue,
    setFocusedStar,
  };

  return (
    <RatingContext.Provider value={contextValue}>
      <div
        aria-label="Rating"
        aria-readonly={readOnly}
        className={cn("inline-flex items-center gap-0.5", className)}
        onMouseLeave={() => setHoverValue(null)}
        ref={containerRef}
        role="radiogroup"
        {...props}
      >
        {validChildren.map((child, index) => cloneElement(child, { index }))}
      </div>
    </RatingContext.Provider>
  );
};
