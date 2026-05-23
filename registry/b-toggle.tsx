import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useAnimationControls } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

type BaseToggleRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

function hasTextContent(node: React.ReactNode): boolean {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim().length > 0;
  }

  if (Array.isArray(node)) {
    return node.some(hasTextContent);
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return hasTextContent(node.props.children);
  }

  return false;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

const toggleVariants = cva(
  "group/toggle relative inline-flex touch-manipulation select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md font-medium text-sm transition-[color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-foreground hover:bg-muted hover:text-foreground",
        outline:
          "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-4.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type BaseToggleProps = Omit<
  React.ComponentPropsWithoutRef<typeof TogglePrimitive>,
  "onPressedChange"
> &
  VariantProps<typeof toggleVariants> &
  ReducedMotionProp & {
    onPressedChange?: (pressed: boolean) => void;
  };

const contentTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 20,
  mass: 0.85,
};

const Toggle = React.forwardRef<HTMLButtonElement, BaseToggleProps>(
  (
    {
      children,
      className,
      onPressedChange,
      reducedMotion,
      size,
      variant,
      ...props
    },
    ref
  ) => {
    const buttonControls = useAnimationControls();
    const iconControls = useAnimationControls();
    const resolvedReducedMotion = useResolvedReducedMotion(reducedMotion);
    const isIconOnly = !hasTextContent(children);
    const canAnimate = !(props.disabled || resolvedReducedMotion);
    const isPressedControlled = props.pressed !== undefined;
    const [uncontrolledPressed, setUncontrolledPressed] = React.useState(
      props.defaultPressed ?? false
    );
    const pressed = isPressedControlled
      ? props.pressed === true
      : uncontrolledPressed;

    const ariaLabel = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") {
        return;
      }

      if (!(isIconOnly && !(ariaLabel || ariaLabelledBy))) {
        return;
      }

      console.warn(
        "Toggle: icon-only toggles should include aria-label or aria-labelledby so the control has a clear accessible name."
      );
    }, [ariaLabel, ariaLabelledBy, isIconOnly]);

    const runPressedMotion = React.useCallback(
      (nextPressed: boolean) => {
        buttonControls.start({
          scale: nextPressed ? [1, 0.968, 1.022, 1] : [1, 0.982, 1.01, 1],
          y: nextPressed ? [0, -0.8, 0] : [0, -0.3, 0],
          transition: {
            duration: 0.34,
            ease: [0.22, 1, 0.36, 1],
          },
        });

        iconControls.start({
          scale: nextPressed ? [1, 0.9, 1.08, 1] : [1, 0.96, 1.02, 1],
          rotate: nextPressed ? [0, -8, 0] : [0, 4, 0],
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 18,
            mass: 0.8,
          },
        });
      },
      [buttonControls, iconControls]
    );

    const handlePressedChange = (nextPressed: boolean) => {
      if (!isPressedControlled) {
        setUncontrolledPressed(nextPressed);
      }

      if (canAnimate) {
        runPressedMotion(nextPressed);
      }

      onPressedChange?.(nextPressed);
    };

    const selectedClasses =
      "border-border bg-accent text-accent-foreground shadow-sm";
    const overlayTransition = canAnimate
      ? {
          duration: 0.26,
          ease: [0.22, 1, 0.36, 1] as const,
        }
      : { duration: 0.14 };
    const hoverAnimation = canAnimate
      ? {
          scale: 1.01,
          y: -0.5,
          transition: { type: "spring" as const, stiffness: 300, damping: 24 },
        }
      : undefined;
    const tapAnimation = canAnimate ? { scale: 0.985, y: 0.15 } : undefined;

    const renderButton = React.useCallback(
      (rootProps: BaseToggleRenderProps) => {
        const {
          children: _children,
          className: rootClassName,
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
          onPointerDown: rootOnPointerDown,
          ref: rootRef,
          style: rootStyle,
          ...resolvedRootProps
        } = rootProps;

        return (
          <motion.button
            {...resolvedRootProps}
            animate={buttonControls}
            className={cn(
              registryTheme,
              toggleVariants({ variant, size }),
              pressed && selectedClasses,
              isIconOnly && "px-0",
              rootClassName,
              className
            )}
            onPointerDown={(event) => {
              rootOnPointerDown?.(event);
            }}
            ref={(node) => {
              setRef(rootRef, node);
              setRef(ref, node);
            }}
            style={rootStyle}
            whileHover={hoverAnimation}
            whileTap={tapAnimation}
          >
            <motion.span
              animate={
                pressed
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }
                  : {
                      opacity: 0,
                      scale: 0.92,
                      y: 2,
                    }
              }
              aria-hidden
              className="absolute inset-0 z-0 rounded-[inherit] bg-accent"
              initial={false}
              transition={overlayTransition}
            />
            <motion.span
              animate={
                canAnimate
                  ? {
                      x: pressed ? 0.8 : 0,
                    }
                  : undefined
              }
              className="relative z-10 inline-flex items-center gap-2"
              initial={false}
              transition={contentTransition}
            >
              <motion.span
                animate={iconControls}
                className={cn(
                  "inline-flex items-center gap-2 transition-colors duration-200",
                  pressed ? "text-accent-foreground" : "text-foreground",
                  isIconOnly && "gap-0"
                )}
                style={{ transformOrigin: "center" }}
              >
                {children}
              </motion.span>
            </motion.span>
          </motion.button>
        );
      },
      [
        buttonControls,
        canAnimate,
        children,
        className,
        hoverAnimation,
        iconControls,
        isIconOnly,
        overlayTransition,
        pressed,
        ref,
        size,
        tapAnimation,
        variant,
      ]
    );

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <TogglePrimitive
          onPressedChange={handlePressedChange}
          render={renderButton}
          {...props}
        />
      </ReducedMotionConfig>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
