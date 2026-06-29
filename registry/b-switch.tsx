"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import {
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const spring = { type: "spring" as const, duration: 0.35, bounce: 0.3 };
const springFast = { type: "spring" as const, duration: 0.15, bounce: 0 };
const springSnap = { type: "spring" as const, duration: 0.4, bounce: 0.5 };

export type SwitchSize = "default" | "lg" | "sm";

type SwitchSizing = {
  gap: string;
  label: string;
  thumbMargin: number;
  thumbSize: number;
  thumbTravel: number;
  trackH: number;
  trackW: number;
};

const sizeStyles: Record<SwitchSize, Omit<SwitchSizing, "thumbTravel">> = {
  sm: {
    gap: "gap-2",
    label: "text-xs",
    thumbMargin: 2,
    thumbSize: 16,
    trackH: 20,
    trackW: 36,
  },
  default: {
    gap: "gap-2.5",
    label: "text-sm",
    thumbMargin: 2,
    thumbSize: 20,
    trackH: 26,
    trackW: 44,
  },
  lg: {
    gap: "gap-3",
    label: "text-base",
    thumbMargin: 2,
    thumbSize: 24,
    trackH: 32,
    trackW: 52,
  },
};

export interface SwitchProps {
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  description?: React.ReactNode;
  descriptionClassName?: string;
  disabled?: boolean;
  form?: string;
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  invalid?: boolean;
  label?: React.ReactNode;
  labelClassName?: string;
  labelSide?: "left" | "right";
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  readOnly?: boolean;
  required?: boolean;
  size?: SwitchSize;
  value?: string;
  wrapperClassName?: string;
}

type SwitchThumbMotion = {
  fillOpacity: MotionValue<number>;
  playPressSquash: () => void;
  playReleaseSquash: () => void;
  playToggleSquash: () => void;
  thumbScaleX: MotionValue<number>;
  thumbScaleY: MotionValue<number>;
  thumbX: MotionValue<number>;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function getSizing(size: SwitchSize): SwitchSizing {
  const base = sizeStyles[size];

  return {
    ...base,
    thumbTravel: Math.max(
      0,
      base.trackW - base.thumbSize - base.thumbMargin * 2
    ),
  };
}

function preventReadOnlyToggle(event: React.SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

function mergeHandlers<T extends React.SyntheticEvent>(
  theirs: ((event: T) => void) | undefined,
  ours: (event: T) => void
) {
  return (event: T) => {
    theirs?.(event);
    if (!event.defaultPrevented) {
      ours(event);
    }
  };
}

function joinAriaIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(" ");
  return value.length > 0 ? value : undefined;
}

type SwitchRootRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: React.Ref<HTMLButtonElement>;
};

type SwitchThumbRenderProps = React.HTMLAttributes<HTMLSpanElement>;

function splitRootRenderProps(rootProps: SwitchRootRenderProps) {
  const {
    className: rootClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onClick,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    onKeyDown,
    onPointerDown,
    onPointerLeave,
    onPointerUp,
    ref: rootRef,
    ...resolvedRootProps
  } = rootProps;

  return {
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerLeave,
    onPointerUp,
    resolvedRootProps,
    rootClassName,
    rootRef,
  };
}

function splitThumbRenderProps(thumbProps: SwitchThumbRenderProps) {
  const {
    className: thumbClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ...resolvedThumbProps
  } = thumbProps;

  return { resolvedThumbProps, thumbClassName };
}

function getRowClassName({
  disabled,
  gapClassName,
  readOnly,
  wrapperClassName,
}: {
  disabled: boolean;
  gapClassName: string;
  readOnly: boolean;
  wrapperClassName?: string;
}) {
  return cn(
    componentThemeClassName,
    "inline-flex select-none items-center",
    gapClassName,
    !(disabled || readOnly) && "cursor-pointer",
    disabled && "pointer-events-none cursor-not-allowed opacity-50",
    readOnly && !disabled && "cursor-default",
    wrapperClassName
  );
}

function getTrackClassName({
  className,
  disabled,
  hasText,
  invalid,
  readOnly,
}: {
  className?: string;
  disabled: boolean;
  hasText: boolean;
  invalid: boolean;
  readOnly: boolean;
}) {
  return cn(
    componentThemeClassName,
    "relative inline-flex shrink-0 items-center rounded-full",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    invalid && "ring-2 ring-destructive",
    !hasText && "disabled:cursor-not-allowed disabled:opacity-50",
    !(disabled || readOnly) && "cursor-pointer",
    readOnly && !disabled && "cursor-default",
    disabled && hasText && "opacity-100",
    className
  );
}

function useSwitchFieldIds({
  ariaDescribedBy,
  ariaLabelledBy,
  description,
  id,
  label,
}: {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  description?: React.ReactNode;
  id?: string;
  label?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const labelId = label ? `${controlId}-label` : undefined;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const textLabelId = labelId ?? descriptionId;
  const hasText = Boolean(label || description);

  return {
    ariaDescribedBy: joinAriaIds(
      ariaDescribedBy,
      description ? descriptionId : undefined
    ),
    ariaLabelledBy: hasText
      ? joinAriaIds(ariaLabelledBy, textLabelId)
      : ariaLabelledBy,
    controlId,
    descriptionId,
    hasText,
    labelId,
  };
}

function useSwitchThumbMotion(
  displayChecked: boolean,
  thumbTravel: number,
  prefersReducedMotion: boolean
): SwitchThumbMotion {
  const thumbTravelRef = React.useRef(thumbTravel);
  thumbTravelRef.current = thumbTravel;

  const thumbX = useMotionValue(displayChecked ? thumbTravel : 0);
  const thumbScaleX = useMotionValue(1);
  const thumbScaleY = useMotionValue(1);
  const fillOpacity = useTransform(thumbX, (x) => {
    const travel = thumbTravelRef.current;

    if (travel <= 0) {
      return 0;
    }

    return Math.min(1, Math.max(0, x / travel));
  });

  const prevChecked = React.useRef(displayChecked);
  const prevThumbTravel = React.useRef(thumbTravel);

  React.useEffect(() => {
    if (prevThumbTravel.current !== thumbTravel) {
      prevThumbTravel.current = thumbTravel;
      thumbX.set(displayChecked ? thumbTravel : 0);
      prevChecked.current = displayChecked;
    }
  }, [displayChecked, thumbTravel, thumbX]);

  React.useEffect(() => {
    const travel = thumbTravelRef.current;
    const nextX = displayChecked ? travel : 0;

    if (prevChecked.current === displayChecked && thumbX.get() === nextX) {
      return;
    }

    prevChecked.current = displayChecked;

    if (prefersReducedMotion) {
      thumbX.set(nextX);
      return;
    }

    const controls = animate(thumbX, nextX, spring);

    return () => {
      controls.stop();
    };
  }, [displayChecked, prefersReducedMotion, thumbX]);

  const playPressSquash = React.useCallback(() => {
    animate(thumbScaleX, 0.82, springFast);
    animate(thumbScaleY, 1.1, springFast);
  }, [thumbScaleX, thumbScaleY]);

  const playReleaseSquash = React.useCallback(() => {
    animate(thumbScaleX, 1, springSnap);
    animate(thumbScaleY, 1, springSnap);
  }, [thumbScaleX, thumbScaleY]);

  const playToggleSquash = React.useCallback(() => {
    animate(thumbScaleX, 1.15, springFast).then(() => {
      animate(thumbScaleX, 1, springSnap);
    });
    animate(thumbScaleY, 0.88, springFast).then(() => {
      animate(thumbScaleY, 1, springSnap);
    });
  }, [thumbScaleX, thumbScaleY]);

  React.useEffect(() => {
    return () => {
      thumbX.stop();
      thumbScaleX.stop();
      thumbScaleY.stop();
    };
  }, [thumbScaleX, thumbScaleY, thumbX]);

  return {
    fillOpacity,
    playPressSquash,
    playReleaseSquash,
    playToggleSquash,
    thumbScaleX,
    thumbScaleY,
    thumbX,
  };
}

function SwitchFieldText({
  description,
  descriptionClassName,
  descriptionId,
  label,
  labelClassName,
  labelId,
  labelSizeClassName,
  required,
}: {
  description?: React.ReactNode;
  descriptionClassName?: string;
  descriptionId?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  labelId?: string;
  labelSizeClassName: string;
  required: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      {label ? (
        <span
          className={cn("text-foreground", labelSizeClassName, labelClassName)}
          id={labelId}
        >
          {label}
          {required ? (
            <span aria-hidden className="text-destructive">
              {" "}
              *
            </span>
          ) : null}
        </span>
      ) : null}
      {description ? (
        <span
          className={cn(
            "text-muted-foreground text-xs leading-snug",
            descriptionClassName
          )}
          id={descriptionId}
        >
          {description}
        </span>
      ) : null}
    </span>
  );
}

function SwitchTrackLayers({
  fillOpacity,
}: {
  fillOpacity: MotionValue<number>;
}) {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: "var(--ic-accent)" }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: "var(--ic-foreground)",
          opacity: fillOpacity,
        }}
      />
    </>
  );
}

function SwitchThumbVisual({
  className,
  motionState,
  sizing,
}: {
  className?: string;
  motionState: SwitchThumbMotion;
  sizing: SwitchSizing;
}) {
  return (
    <motion.span
      aria-hidden
      className={cn("pointer-events-none z-10 block rounded-full", className)}
      style={{
        width: sizing.thumbSize,
        height: sizing.thumbSize,
        x: motionState.thumbX,
        scaleX: motionState.thumbScaleX,
        scaleY: motionState.thumbScaleY,
        marginLeft: sizing.thumbMargin,
        backgroundColor: "var(--ic-card)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    />
  );
}

function SwitchFieldRow({
  children,
  controlId,
  disabled,
  gapClassName,
  labelSide,
  readOnly,
  text,
  wrapperClassName,
}: {
  children: React.ReactNode;
  controlId: string;
  disabled: boolean;
  gapClassName: string;
  labelSide: "left" | "right";
  readOnly: boolean;
  text: React.ReactNode;
  wrapperClassName?: string;
}) {
  return (
    <label
      className={getRowClassName({
        disabled,
        gapClassName,
        readOnly,
        wrapperClassName,
      })}
      htmlFor={controlId}
    >
      {labelSide === "left" ? text : null}
      {children}
      {labelSide === "right" ? text : null}
    </label>
  );
}

function BaseSwitchControl({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  className,
  controlId,
  defaultChecked,
  disabled,
  displayChecked,
  form,
  hasText,
  inputRef,
  invalid,
  isControlled,
  motionState,
  name,
  onCheckedChange,
  prefersReducedMotion,
  readOnly,
  ref,
  required,
  sizing,
  value,
}: {
  ariaDescribedBy?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  controlId: string;
  defaultChecked: boolean;
  disabled: boolean;
  displayChecked: boolean;
  form?: string;
  hasText: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  invalid: boolean;
  isControlled: boolean;
  motionState: SwitchThumbMotion;
  name?: string;
  onCheckedChange: (checked: boolean) => void;
  prefersReducedMotion: boolean;
  readOnly: boolean;
  ref: React.ForwardedRef<HTMLButtonElement>;
  required: boolean;
  sizing: SwitchSizing;
  value?: string;
}) {
  const isInteractive = !(disabled || readOnly || prefersReducedMotion);

  const handlePointerDown = React.useCallback(() => {
    if (isInteractive) {
      motionState.playPressSquash();
    }
  }, [isInteractive, motionState]);

  const handlePointerUp = React.useCallback(() => {
    if (isInteractive) {
      motionState.playReleaseSquash();
    }
  }, [isInteractive, motionState]);

  const getReadOnlyKeyDown = React.useCallback(
    (theirs?: React.KeyboardEventHandler<HTMLButtonElement>) => {
      if (!readOnly) {
        return theirs;
      }

      return (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === " " || event.key === "Enter") {
          preventReadOnlyToggle(event);
          return;
        }

        theirs?.(event);
      };
    },
    [readOnly]
  );

  const trackClassName = getTrackClassName({
    className,
    disabled,
    hasText,
    invalid,
    readOnly,
  });

  const rootCheckedProps = isControlled
    ? ({ checked: displayChecked } as const)
    : ({ defaultChecked } as const);

  return (
    <SwitchPrimitive.Root
      {...rootCheckedProps}
      disabled={disabled}
      form={form}
      id={controlId}
      inputRef={inputRef}
      name={name}
      nativeButton
      onCheckedChange={onCheckedChange}
      readOnly={readOnly}
      render={(rootProps) => {
        const {
          onClick,
          onKeyDown,
          onPointerDown,
          onPointerLeave,
          onPointerUp,
          resolvedRootProps,
          rootClassName,
          rootRef,
        } = splitRootRenderProps(rootProps);

        return (
          <motion.button
            {...resolvedRootProps}
            aria-describedby={ariaDescribedBy}
            aria-invalid={invalid || undefined}
            aria-label={hasText ? undefined : ariaLabel}
            aria-labelledby={hasText ? ariaLabelledBy : undefined}
            aria-readonly={readOnly || undefined}
            aria-required={required || undefined}
            className={cn(trackClassName, rootClassName)}
            dir="ltr"
            disabled={disabled}
            initial={false}
            onClick={readOnly ? preventReadOnlyToggle : onClick}
            onKeyDown={getReadOnlyKeyDown(onKeyDown)}
            onPointerDown={mergeHandlers(onPointerDown, handlePointerDown)}
            onPointerLeave={mergeHandlers(onPointerLeave, handlePointerUp)}
            onPointerUp={mergeHandlers(onPointerUp, handlePointerUp)}
            ref={(node) => {
              setRef(rootRef, node);
              setRef(ref, node);
            }}
            style={{ width: sizing.trackW, height: sizing.trackH }}
            type="button"
          >
            <SwitchTrackLayers fillOpacity={motionState.fillOpacity} />
            {resolvedRootProps.children}
          </motion.button>
        );
      }}
      required={required}
      value={value}
    >
      <SwitchPrimitive.Thumb
        render={(thumbProps) => {
          const { thumbClassName } = splitThumbRenderProps(thumbProps);

          return (
            <SwitchThumbVisual
              className={thumbClassName}
              motionState={motionState}
              sizing={sizing}
            />
          );
        }}
      />
    </SwitchPrimitive.Root>
  );
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      checked,
      className,
      defaultChecked = false,
      description,
      descriptionClassName,
      disabled = false,
      form,
      id,
      inputRef,
      invalid = false,
      label,
      labelClassName,
      labelSide = "right",
      name,
      onCheckedChange,
      readOnly = false,
      required = false,
      size = "default",
      value,
      wrapperClassName,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion() === true;
    const sizing = getSizing(size);
    const field = useSwitchFieldIds({
      ariaDescribedBy,
      ariaLabelledBy,
      description,
      id,
      label,
    });

    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
      Boolean(defaultChecked)
    );
    const displayChecked = isControlled
      ? Boolean(checked)
      : uncontrolledChecked;

    const motionState = useSwitchThumbMotion(
      displayChecked,
      sizing.thumbTravel,
      prefersReducedMotion
    );

    const handleCheckedChange = React.useCallback(
      (next: boolean) => {
        if (disabled || readOnly) {
          return;
        }

        if (!prefersReducedMotion) {
          motionState.playToggleSquash();
        }

        if (!isControlled) {
          setUncontrolledChecked(next);
        }

        onCheckedChange?.(next);
      },
      [
        disabled,
        isControlled,
        motionState,
        onCheckedChange,
        prefersReducedMotion,
        readOnly,
      ]
    );

    const control = (
      <BaseSwitchControl
        ariaDescribedBy={field.ariaDescribedBy}
        ariaLabel={ariaLabel}
        ariaLabelledBy={field.ariaLabelledBy}
        className={className}
        controlId={field.controlId}
        defaultChecked={defaultChecked}
        disabled={disabled}
        displayChecked={displayChecked}
        form={form}
        hasText={field.hasText}
        inputRef={inputRef}
        invalid={invalid}
        isControlled={isControlled}
        motionState={motionState}
        name={name}
        onCheckedChange={handleCheckedChange}
        prefersReducedMotion={prefersReducedMotion}
        readOnly={readOnly}
        ref={ref}
        required={required}
        sizing={sizing}
        value={value}
      />
    );

    if (!field.hasText) {
      return control;
    }

    return (
      <SwitchFieldRow
        controlId={field.controlId}
        disabled={disabled}
        gapClassName={sizing.gap}
        labelSide={labelSide}
        readOnly={readOnly}
        text={
          <SwitchFieldText
            description={description}
            descriptionClassName={descriptionClassName}
            descriptionId={field.descriptionId}
            label={label}
            labelClassName={labelClassName}
            labelId={field.labelId}
            labelSizeClassName={sizing.label}
            required={required}
          />
        }
        wrapperClassName={wrapperClassName}
      >
        {control}
      </SwitchFieldRow>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
