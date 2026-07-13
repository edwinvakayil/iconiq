"use client";

import {
  type AnimationPlaybackControls,
  animate,
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type CSSProperties,
  createContext,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const HIDE_ANGLE = Math.PI / 2 - 0.04;
const MAX_ANGLE = Math.PI / 2;
const RUBBER_BAND = 0.32;
const FLICK_POWER = 0.22;

export type WheelPickerOption =
  | string
  | { value: string; label?: ReactNode; disabled?: boolean };

type NormalizedOption = {
  value: string;
  label: ReactNode;
  disabled: boolean;
};

export interface WheelPickerProps {
  children: ReactNode;
  className?: string;
  itemHeight?: number;
  visibleCount?: 3 | 5 | 7;
  lens?: boolean;
  "aria-label"?: string;
}

export interface WheelPickerColumnProps {
  options: WheelPickerOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (
    value: string,
    option: { value: string; label: ReactNode }
  ) => void;
  onValueCommit?: (
    value: string,
    option: { value: string; label: ReactNode }
  ) => void;
  loop?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

type WheelPickerContextValue = {
  itemHeight: number;
  visibleCount: number;
  lens: boolean;
};

const WheelPickerContext = createContext<WheelPickerContextValue>({
  itemHeight: 44,
  visibleCount: 5,
  lens: true,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeOption(option: WheelPickerOption): NormalizedOption {
  if (typeof option === "string") {
    return { value: option, label: option, disabled: false };
  }

  return {
    value: option.value,
    label: option.label ?? option.value,
    disabled: option.disabled ?? false,
  };
}

function WheelPickerItem({
  index,
  itemHeight,
  itemId,
  label,
  loopSize,
  offset,
  optionDisabled,
  selected,
  visibleCount,
}: {
  index: number;
  itemHeight: number;
  itemId: string;
  label: ReactNode;
  loopSize: number;
  offset: MotionValue<number>;
  optionDisabled: boolean;
  selected: boolean;
  visibleCount: number;
}) {
  const step = Math.PI / (visibleCount + 2);
  const radius = itemHeight / step;

  const distance = useTransform(offset, (current: number) => {
    let delta = index * itemHeight - current;

    if (loopSize > 0) {
      delta = ((delta % loopSize) + loopSize) % loopSize;
      if (delta > loopSize / 2) {
        delta -= loopSize;
      }
    }

    return delta / itemHeight;
  });

  const angle = useTransform(distance, (d) =>
    clamp(d * step, -MAX_ANGLE, MAX_ANGLE)
  );
  const y = useTransform(angle, (a) => radius * Math.sin(a));
  const rotateX = useTransform(angle, (a) => `${(-a * 180) / Math.PI}deg`);
  const opacity = useTransform(distance, (d) => {
    const a = Math.abs(d) * step;

    if (a >= HIDE_ANGLE) {
      return 0;
    }

    return Math.cos(a) ** 1.15;
  });
  const visibility = useTransform(distance, (d) =>
    Math.abs(d) * step >= HIDE_ANGLE ? "hidden" : "visible"
  );
  const emphasis = useTransform(distance, (d) => clamp(1 - Math.abs(d), 0, 1));
  const mixPercent = useTransform(emphasis, (e) => (e * 100).toFixed(1));
  const color = useMotionTemplate`color-mix(in oklab, var(--foreground) ${mixPercent}%, var(--muted-foreground))`;

  return (
    <motion.div
      aria-disabled={optionDisabled || undefined}
      aria-selected={selected}
      className="absolute inset-x-0 top-1/2"
      id={itemId}
      role="option"
      style={{
        backfaceVisibility: "hidden",
        height: itemHeight,
        marginTop: -itemHeight / 2,
        opacity,
        rotateX,
        visibility,
        y,
      }}
    >
      <motion.span
        className={cn(
          "absolute inset-0 flex items-center justify-center truncate px-1 font-medium text-[17px] tabular-nums leading-none",
          optionDisabled && "text-muted-foreground/40"
        )}
        style={optionDisabled ? undefined : { color }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

export function WheelPickerColumn({
  options,
  value,
  defaultValue,
  onChange,
  onValueCommit,
  loop = false,
  disabled = false,
  name,
  className,
  id: idProp,
  "aria-label": ariaLabel,
}: WheelPickerColumnProps) {
  const { itemHeight, visibleCount, lens } = useContext(WheelPickerContext);
  const generatedId = useId();
  const id = idProp ?? `wheel-column-${generatedId.replace(/[«»:]/g, "")}`;
  const prefersReducedMotion = useReducedMotion();

  const items = useMemo(() => options.map(normalizeOption), [options]);
  const count = items.length;
  const canLoop = loop && count >= visibleCount + 2;
  const loopSize = canLoop ? count * itemHeight : 0;
  const maxOffset = Math.max(0, (count - 1) * itemHeight);
  const step = Math.PI / (visibleCount + 2);
  const radius = itemHeight / step;

  const initialIndexRef = useRef<number | null>(null);

  if (initialIndexRef.current === null) {
    const initial = value ?? defaultValue;
    const initialIndex =
      initial == null ? -1 : items.findIndex((item) => item.value === initial);
    const firstEnabled = items.findIndex((item) => !item.disabled);
    initialIndexRef.current =
      initialIndex >= 0 ? initialIndex : Math.max(0, firstEnabled);
  }

  const offset = useMotionValue(initialIndexRef.current * itemHeight);
  const [activeIndex, setActiveIndex] = useState(initialIndexRef.current);

  const activeIndexRef = useRef(activeIndex);
  const committedIndexRef = useRef(activeIndex);
  const itemsRef = useRef(items);
  const onChangeRef = useRef(onChange);
  const onValueCommitRef = useRef(onValueCommit);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startClientY: number;
    startOffset: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    itemsRef.current = items;
    onChangeRef.current = onChange;
    onValueCommitRef.current = onValueCommit;
  });

  const wrapIndex = useCallback(
    (index: number) => {
      if (count === 0) {
        return 0;
      }

      if (canLoop) {
        return ((index % count) + count) % count;
      }

      return clamp(index, 0, count - 1);
    },
    [canLoop, count]
  );

  const nearestEnabled = useCallback(
    (index: number, direction: number) => {
      if (count === 0 || !items[wrapIndex(index)]?.disabled) {
        return index;
      }

      const preferred = direction === 0 ? [1, -1] : [direction, -direction];

      for (let span = 1; span < count; span += 1) {
        for (const sign of preferred) {
          const candidate = index + sign * span;

          if (!canLoop && (candidate < 0 || candidate > count - 1)) {
            continue;
          }

          if (!items[wrapIndex(candidate)]?.disabled) {
            return candidate;
          }
        }
      }

      return index;
    },
    [canLoop, count, items, wrapIndex]
  );

  const stopAnimation = useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;
  }, []);

  const commit = useCallback(() => {
    const index = activeIndexRef.current;

    if (committedIndexRef.current === index) {
      return;
    }

    committedIndexRef.current = index;
    const item = itemsRef.current[index];

    if (item) {
      onValueCommitRef.current?.(item.value, {
        value: item.value,
        label: item.label,
      });
    }
  }, []);

  const animateTo = useCallback(
    (target: number, velocity = 0) => {
      stopAnimation();

      if (prefersReducedMotion) {
        animationRef.current = animate(offset, target, {
          duration: 0.16,
          ease: "easeOut",
          onComplete: commit,
        });
        return;
      }

      animationRef.current = animate(offset, target, {
        type: "spring",
        stiffness: 200,
        damping: 24,
        mass: 0.9,
        velocity,
        restDelta: 0.25,
        restSpeed: 2,
        onComplete: commit,
      });
    },
    [commit, offset, prefersReducedMotion, stopAnimation]
  );

  const snapToIndex = useCallback(
    (index: number, velocity = 0) => {
      if (count === 0) {
        return;
      }

      const safeIndex = clamp(wrapIndex(index), 0, count - 1);
      let target: number;

      if (canLoop) {
        const current = Math.round(offset.get() / itemHeight);
        let diff = (((safeIndex - wrapIndex(current)) % count) + count) % count;

        if (diff > count / 2) {
          diff -= count;
        }

        target = (current + diff) * itemHeight;
      } else {
        target = safeIndex * itemHeight;
      }

      animateTo(target, velocity);
    },
    [animateTo, canLoop, count, itemHeight, offset, wrapIndex]
  );

  const settle = useCallback(() => {
    if (count === 0) {
      return;
    }

    const velocity = offset.getVelocity();
    let projected = offset.get() + velocity * FLICK_POWER;

    if (!canLoop) {
      projected = clamp(projected, 0, maxOffset);
    }

    const direction = velocity > 20 ? 1 : velocity < -20 ? -1 : 0;
    const index = nearestEnabled(Math.round(projected / itemHeight), direction);
    snapToIndex(wrapIndex(index), velocity);
  }, [
    canLoop,
    count,
    itemHeight,
    maxOffset,
    nearestEnabled,
    offset,
    snapToIndex,
    wrapIndex,
  ]);

  useEffect(
    () =>
      offset.on("change", (current) => {
        const index = wrapIndex(Math.round(current / itemHeight));

        if (index === activeIndexRef.current) {
          return;
        }

        activeIndexRef.current = index;
        setActiveIndex(index);
        const item = itemsRef.current[index];

        if (item) {
          onChangeRef.current?.(item.value, {
            value: item.value,
            label: item.label,
          });
        }
      }),
    [itemHeight, offset, wrapIndex]
  );

  useEffect(() => {
    if (value == null) {
      return;
    }

    const index = items.findIndex((item) => item.value === value);

    if (index < 0 || index === activeIndexRef.current || dragRef.current) {
      return;
    }

    snapToIndex(index);
  }, [items, snapToIndex, value]);

  useEffect(() => {
    if (count === 0 || dragRef.current || animationRef.current) {
      return;
    }

    const maxIndex = count - 1;

    if (activeIndexRef.current > maxIndex) {
      snapToIndex(maxIndex);
    }
  }, [count, snapToIndex]);

  useEffect(() => {
    if (dragRef.current || animationRef.current) {
      return;
    }

    offset.set(activeIndexRef.current * itemHeight);
  }, [itemHeight, offset]);

  useEffect(() => {
    if (canLoop || count === 0 || dragRef.current) {
      return;
    }

    if (offset.get() > maxOffset) {
      snapToIndex(count - 1);
    }
  }, [canLoop, count, maxOffset, offset, snapToIndex]);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || disabled) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      stopAnimation();

      const delta =
        event.deltaMode === 1 ? event.deltaY * (itemHeight / 2) : event.deltaY;
      let next = offset.get() + delta * 0.55;

      if (!canLoop) {
        next = clamp(next, 0, maxOffset);
      }

      offset.set(next);

      if (wheelTimerRef.current) {
        clearTimeout(wheelTimerRef.current);
      }

      wheelTimerRef.current = setTimeout(() => {
        wheelTimerRef.current = null;
        settle();
      }, 130);
    };

    node.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", handleWheel);
    };
  }, [canLoop, disabled, itemHeight, maxOffset, offset, settle, stopAnimation]);

  useEffect(
    () => () => {
      animationRef.current?.stop();

      if (wheelTimerRef.current) {
        clearTimeout(wheelTimerRef.current);
      }
    },
    []
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || event.button > 0) {
      return;
    }

    stopAnimation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startClientY: event.clientY,
      startOffset: offset.get(),
      moved: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const delta = drag.startClientY - event.clientY;

    if (Math.abs(delta) > 3) {
      drag.moved = true;
    }

    let next = drag.startOffset + delta;

    if (!canLoop) {
      if (next < 0) {
        next *= RUBBER_BAND;
      } else if (next > maxOffset) {
        next = maxOffset + (next - maxOffset) * RUBBER_BAND;
      }
    }

    offset.set(next);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;

    if (drag.moved || event.type === "pointercancel") {
      settle();
      return;
    }

    const node = containerRef.current;

    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const tapY = event.clientY - (rect.top + rect.height / 2);
    const steps = Math.round(Math.asin(clamp(tapY / radius, -1, 1)) / step);

    if (steps === 0) {
      commit();
      return;
    }

    const current = Math.round(offset.get() / itemHeight);
    const index = nearestEnabled(current + steps, steps > 0 ? 1 : -1);
    snapToIndex(wrapIndex(index));
  };

  const moveBy = useCallback(
    (delta: number) => {
      const current = Math.round(offset.get() / itemHeight);
      const index = nearestEnabled(current + delta, delta > 0 ? 1 : -1);
      snapToIndex(wrapIndex(index));
    },
    [itemHeight, nearestEnabled, offset, snapToIndex, wrapIndex]
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveBy(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveBy(-1);
        break;
      case "PageDown":
        event.preventDefault();
        moveBy(visibleCount);
        break;
      case "PageUp":
        event.preventDefault();
        moveBy(-visibleCount);
        break;
      case "Home":
        event.preventDefault();
        snapToIndex(nearestEnabled(0, 1));
        break;
      case "End":
        event.preventDefault();
        snapToIndex(nearestEnabled(count - 1, -1));
        break;
      default:
        break;
    }
  };

  return (
    <div
      aria-activedescendant={
        disabled ? undefined : `${id}-option-${activeIndex}`
      }
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      aria-orientation="vertical"
      className={cn(
        "relative min-w-0 flex-1 cursor-pointer touch-none select-none overflow-hidden outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring/60 active:cursor-grabbing",
        "[mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.14)_10%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.72)_28%,black_38%,black_62%,rgba(0,0,0,0.72)_72%,rgba(0,0,0,0.4)_80%,rgba(0,0,0,0.14)_90%,transparent_100%)]",
        disabled && "pointer-events-none opacity-45",
        className
      )}
      id={id}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      ref={containerRef}
      role="listbox"
      style={{ height: itemHeight * visibleCount }}
      tabIndex={disabled ? -1 : 0}
    >
      {lens ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-1 top-1/2 h-[var(--wheel-item-height)] -translate-y-1/2 rounded-xl bg-foreground/5"
          style={{ "--wheel-item-height": `${itemHeight}px` } as CSSProperties}
        />
      ) : null}
      <motion.div
        className="absolute inset-0"
        style={{ perspective: itemHeight * 21, transformStyle: "preserve-3d" }}
      >
        {items.map((item, index) => (
          <WheelPickerItem
            index={index}
            itemHeight={itemHeight}
            itemId={`${id}-option-${index}`}
            key={`${item.value}-${index}`}
            label={item.label}
            loopSize={loopSize}
            offset={offset}
            optionDisabled={item.disabled}
            selected={index === activeIndex}
            visibleCount={visibleCount}
          />
        ))}
      </motion.div>
      {name ? (
        <input
          name={name}
          type="hidden"
          value={items[activeIndex]?.value ?? ""}
        />
      ) : null}
    </div>
  );
}

export function WheelPicker({
  children,
  className,
  itemHeight = 44,
  visibleCount = 5,
  lens = true,
  "aria-label": ariaLabel,
}: WheelPickerProps) {
  const context = useMemo(
    () => ({ itemHeight, visibleCount, lens }),
    [itemHeight, lens, visibleCount]
  );

  return (
    <WheelPickerContext.Provider value={context}>
      {/* biome-ignore lint/a11y/useSemanticElements: fieldset chrome would fight the barrel layout; a grouped div matches the listbox columns. */}
      <div
        aria-label={ariaLabel}
        className={cn("flex w-full min-w-0 items-stretch", className)}
        role="group"
      >
        {children}
      </div>
    </WheelPickerContext.Provider>
  );
}
