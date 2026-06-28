"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const controlCornerXsClassName =
  "rounded-[min(var(--radius-md),10px)] supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[12px]";

const controlCornerInheritClassName =
  "rounded-[inherit] supports-[corner-shape:squircle]:[corner-shape:inherit]";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

type ComboboxRootProps<
  Value,
  Multiple extends boolean | undefined = false,
> = ComboboxPrimitive.Root.Props<Value, Multiple>;

const INSTANT_TRANSITION = { duration: 0 } as const;

type ComboboxContextValue = {
  actionsRef: React.RefObject<ComboboxPrimitive.Root.Actions | null>;
  activeHighlightId: string;
  activeValue: unknown;
  open: boolean;
  prefersReducedMotion: boolean;
  setActiveValue: React.Dispatch<React.SetStateAction<unknown>>;
  setOpen: (open: boolean) => void;
  skipExitAnimationRef: React.MutableRefObject<boolean>;
};

type DivRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

type InputRenderProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
  style?: React.CSSProperties;
};

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext(componentName: string) {
  const context = React.useContext(ComboboxContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Combobox`);
  }

  return context;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function composeEventHandlers<Event extends React.SyntheticEvent>(
  originalEventHandler: ((event: Event) => void) | undefined,
  eventHandler: (event: Event) => void
) {
  return (event: Event) => {
    originalEventHandler?.(event);

    if (!event.defaultPrevented) {
      eventHandler(event);
    }
  };
}

function resolveStateClassName<State>(
  className: string | ((state: State) => string | undefined) | undefined,
  state: State
) {
  return typeof className === "function" ? className(state) : className;
}

function resolvePopupProps(popupProps: DivRenderProps) {
  const {
    children: _popupChildren,
    className: popupClassName,
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
    ref: popupRef,
    style: popupStyle,
    ...resolvedPopupProps
  } = popupProps;

  return {
    popupClassName,
    popupRef,
    popupStyle,
    resolvedPopupProps,
  };
}

function resolveItemProps(itemProps: DivRenderProps) {
  const {
    children: _itemChildren,
    className: itemClassName,
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
    ref: itemRef,
    style: itemStyle,
    ...resolvedItemProps
  } = itemProps;

  return {
    itemClassName,
    itemRef,
    itemStyle,
    resolvedItemProps,
  };
}

const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.4, 0, 0.6, 1] as const;

const POPUP_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.95,
};

const HIGHLIGHT_SPRING = {
  type: "spring" as const,
  stiffness: 460,
  damping: 40,
  mass: 0.82,
};

const chevronTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};

const checkmarkTransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 22,
};

const popupMotion = {
  animate: { opacity: 1, scale: 1, y: 0 },
  closed: { opacity: 0, scale: 0.985, y: -5 },
  initial: { opacity: 0, scale: 0.985, y: -5 },
  openTransition: {
    opacity: { duration: 0.34, ease: FLUID_EASE },
    scale: POPUP_SPRING,
    y: POPUP_SPRING,
  },
  closedTransition: {
    opacity: { duration: 0.22, ease: EXIT_EASE },
    scale: { duration: 0.22, ease: EXIT_EASE },
    y: { duration: 0.22, ease: EXIT_EASE },
  },
};

const comboboxInputShellClassName =
  "group flex w-full items-center gap-1 border border-input bg-background pl-3.5 pr-1 text-base transition-all sm:text-sm hover:border-ring/40 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/25 [&:has(input[aria-invalid=true])]:border-destructive [&:has(input[aria-invalid=true])]:ring-1 [&:has(input[aria-invalid=true])]:ring-destructive/20 dark:[&:has(input[aria-invalid=true])]:border-destructive/50 dark:[&:has(input[aria-invalid=true])]:ring-destructive/40";

const comboboxInputClassName =
  "h-full w-full flex-1 bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed sm:text-sm";

const comboboxPopupPanelClassName =
  "w-[var(--anchor-width)] max-w-[var(--available-width)] transform-gpu overflow-hidden border border-neutral-200/60 bg-white text-neutral-900 shadow-[var(--ic-shadow-soft)] dark:border-neutral-700/60 dark:bg-neutral-950 dark:text-neutral-100";

const comboboxListScrollbarClassName =
  "z-10 my-1.5 mr-0.5 w-1 shrink-0 touch-none select-none opacity-0 transition-opacity duration-150 before:absolute before:left-1/2 before:h-full before:w-5 before:-translate-x-1/2 before:content-[''] data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0";

const comboboxListThumbClassName =
  "relative rounded-full bg-muted-foreground/50 bg-[color:color-mix(in_oklch,var(--ic-muted-foreground),transparent_35%)]";

const comboboxSizeClassNames = {
  default: "h-11",
  sm: "h-9 pl-3 pr-1",
} as const;

function Combobox<Value, Multiple extends boolean | undefined = false>({
  actionsRef: actionsRefProp,
  autoComplete = "none",
  children,
  defaultOpen = false,
  highlightItemOnHover = true,
  modal = false,
  onItemHighlighted,
  onOpenChange,
  open: openProp,
  openOnInputClick = false,
  ...props
}: ComboboxRootProps<Value, Multiple>) {
  const internalActionsRef =
    React.useRef<ComboboxPrimitive.Root.Actions | null>(null);
  const actionsRef = actionsRefProp ?? internalActionsRef;
  const isOpenControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [activeValue, setActiveValue] = React.useState<unknown>();
  const open = isOpenControlled ? openProp : uncontrolledOpen;
  const activeHighlightId = React.useId();
  const skipExitAnimationRef = React.useRef(false);
  const prefersReducedMotion = useReducedMotion() === true;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen);
      }

      if (!nextOpen) {
        setActiveValue(undefined);
      }
    },
    [isOpenControlled]
  );

  const handleItemHighlighted = React.useCallback<
    NonNullable<
      ComboboxPrimitive.Root.Props<Value, Multiple>["onItemHighlighted"]
    >
  >(
    (highlightedValue, eventDetails) => {
      setActiveValue(highlightedValue);
      onItemHighlighted?.(highlightedValue, eventDetails);
    },
    [onItemHighlighted]
  );

  const handleOpenChange = React.useCallback<
    NonNullable<ComboboxPrimitive.Root.Props<Value, Multiple>["onOpenChange"]>
  >(
    (nextOpen, eventDetails) => {
      if (!nextOpen && eventDetails.reason === "item-press") {
        skipExitAnimationRef.current = true;
      } else if (nextOpen) {
        skipExitAnimationRef.current = false;
      }

      if (!eventDetails.isCanceled) {
        setOpen(nextOpen);
      }

      onOpenChange?.(nextOpen, eventDetails);
    },
    [onOpenChange, setOpen]
  );

  const contextValue = React.useMemo(
    () => ({
      actionsRef,
      activeHighlightId,
      activeValue,
      open,
      prefersReducedMotion,
      setActiveValue,
      setOpen,
      skipExitAnimationRef,
    }),
    [
      actionsRef,
      activeHighlightId,
      activeValue,
      open,
      prefersReducedMotion,
      setOpen,
    ]
  );

  return (
    <ComboboxContext.Provider value={contextValue}>
      <ComboboxPrimitive.Root
        {...props}
        actionsRef={actionsRef}
        autoComplete={autoComplete}
        defaultOpen={isOpenControlled ? undefined : defaultOpen}
        highlightItemOnHover={highlightItemOnHover}
        modal={modal}
        onItemHighlighted={handleItemHighlighted}
        onOpenChange={handleOpenChange}
        open={open}
        openOnInputClick={openOnInputClick}
      >
        {children}
      </ComboboxPrimitive.Root>
    </ComboboxContext.Provider>
  );
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxClear({
  className,
  disabled: disabledProp,
  ...props
}: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      disabled={disabledProp}
      {...props}
      render={(clearProps, clearState) => {
        const {
          className: _clearClassName,
          ref: clearRef,
          style: _clearStyle,
          ...resolvedClearProps
        } = clearProps as React.ComponentProps<"button"> & {
          ref?: React.Ref<HTMLButtonElement>;
        };

        return (
          <button
            {...resolvedClearProps}
            aria-hidden={!clearState.visible}
            aria-label="Clear selection"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md text-muted-foreground/70 transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
              !clearState.visible && "hidden",
              className
            )}
            data-slot="combobox-clear"
            ref={clearRef}
            tabIndex={clearState.visible ? resolvedClearProps.tabIndex : -1}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        );
      }}
    />
  );
}

function ComboboxTrigger({
  className,
  children,
  disabled = false,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  const { open, prefersReducedMotion } = useComboboxContext("ComboboxTrigger");

  return (
    <ComboboxPrimitive.Trigger
      aria-expanded={open}
      aria-label={open ? "Collapse options" : "Open options"}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center text-muted-foreground transition hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
        controlCornerClassName,
        className
      )}
      data-slot="combobox-trigger"
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={
          prefersReducedMotion ? INSTANT_TRANSITION : chevronTransition
        }
      >
        <ChevronsUpDown className="h-4 w-4" />
      </motion.span>
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  id: idProp,
  label,
  labelClassName,
  ref: refProp,
  render: userRender,
  showClear = true,
  showTrigger = true,
  size = "default",
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  label?: React.ReactNode;
  labelClassName?: string;
  showClear?: boolean;
  showTrigger?: boolean;
  size?: "sm" | "default";
}) {
  const { open, setOpen } = useComboboxContext("ComboboxInput");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const generatedId = React.useId();
  const inputId = idProp ?? generatedId;

  const inputGroup = (
    <ComboboxPrimitive.InputGroup
      className={cn(
        componentThemeClassName,
        controlCornerClassName,
        comboboxInputShellClassName,
        comboboxSizeClassNames[size],
        disabled && "cursor-not-allowed opacity-50",
        open && "border-ring ring-1 ring-ring/25",
        label ? undefined : className
      )}
      data-size={size}
      data-slot="combobox-input"
      onClick={(event) => {
        if (disabled) return;

        const target = event.target as HTMLElement;

        if (
          target.closest(
            '[data-slot="combobox-clear"], [data-slot="combobox-trigger"]'
          )
        ) {
          return;
        }

        inputRef.current?.focus();
      }}
    >
      <ComboboxPrimitive.Input
        {...props}
        disabled={disabled}
        id={inputId}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Tab") {
            setOpen(false);
          }
        })}
        render={(inputProps, inputState) => {
          if (userRender) {
            return typeof userRender === "function"
              ? userRender(inputProps, inputState)
              : userRender;
          }

          const {
            className: primitiveClassName,
            ref: primitiveRef,
            style: primitiveStyle,
            ...resolvedInputProps
          } = inputProps as InputRenderProps;

          return (
            <InputPrimitive
              {...resolvedInputProps}
              disabled={disabled}
              id={inputId}
              render={(baseInputProps) => {
                const {
                  className: baseClassName,
                  ref: baseRef,
                  style: baseStyle,
                  ...baseResolvedProps
                } = baseInputProps as InputRenderProps;

                return (
                  <input
                    {...baseResolvedProps}
                    autoComplete="off"
                    className={cn(
                      comboboxInputClassName,
                      primitiveClassName,
                      baseClassName
                    )}
                    data-slot="combobox-input-control"
                    readOnly={inputState.readOnly}
                    ref={(node) => {
                      inputRef.current = node;
                      setRef(primitiveRef, node);
                      setRef(baseRef, node);
                      setRef(refProp, node);
                    }}
                    style={{ ...primitiveStyle, ...baseStyle }}
                  />
                );
              }}
            />
          );
        }}
      />
      {showClear ? <ComboboxClear disabled={disabled} /> : null}
      {showTrigger ? <ComboboxTrigger disabled={disabled} /> : null}
      {children}
    </ComboboxPrimitive.InputGroup>
  );

  if (!label) {
    return inputGroup;
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <label
        className={cn("font-medium text-foreground text-sm", labelClassName)}
        htmlFor={inputId}
      >
        {label}
      </label>
      {inputGroup}
    </div>
  );
}

function ComboboxContentPanel({
  children,
  className,
  popupClassName,
  popupRef,
  popupState,
  popupStyle,
  resolvedPopupProps,
}: {
  children: React.ReactNode;
  className?:
    | string
    | ((state: ComboboxPrimitive.Popup.State) => string | undefined);
  popupClassName?: string;
  popupRef?: React.Ref<HTMLDivElement>;
  popupState: ComboboxPrimitive.Popup.State;
  popupStyle?: React.CSSProperties;
  resolvedPopupProps: Omit<
    DivRenderProps,
    "children" | "className" | "ref" | "style"
  >;
}) {
  const { actionsRef, prefersReducedMotion, skipExitAnimationRef } =
    useComboboxContext("ComboboxContentPanel");
  const isPopupVisible = popupState.open;
  const skipExitAnimation = !popupState.open && skipExitAnimationRef.current;

  return (
    <div
      {...resolvedPopupProps}
      ref={(node) => {
        setRef(popupRef, node);
      }}
      role="presentation"
      style={{
        ...popupStyle,
        transformOrigin: "var(--transform-origin)",
      }}
    >
      <motion.div
        animate={isPopupVisible ? popupMotion.animate : popupMotion.closed}
        className={cn(
          componentThemeClassName,
          controlCornerClassName,
          comboboxPopupPanelClassName,
          popupClassName,
          resolveStateClassName(className, popupState)
        )}
        initial={
          popupState.transitionStatus === "starting"
            ? popupMotion.initial
            : false
        }
        onAnimationComplete={() => {
          if (!popupState.open) {
            skipExitAnimationRef.current = false;
            actionsRef.current?.unmount();
          }
        }}
        style={{
          pointerEvents: isPopupVisible ? undefined : "none",
          transformOrigin: "var(--transform-origin)",
        }}
        transition={
          prefersReducedMotion
            ? INSTANT_TRANSITION
            : isPopupVisible
              ? popupMotion.openTransition
              : skipExitAnimation
                ? INSTANT_TRANSITION
                : popupMotion.closedTransition
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

function ComboboxContent({
  align = "start",
  alignOffset = 0,
  anchor,
  children,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "align" | "alignOffset" | "anchor" | "side" | "sideOffset"
  >) {
  return (
    <ComboboxPrimitive.Portal keepMounted>
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-[9999] outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          initialFocus={false}
          {...props}
          render={(popupProps, popupState) => {
            const { popupClassName, popupRef, popupStyle, resolvedPopupProps } =
              resolvePopupProps(popupProps as DivRenderProps);

            return (
              <ComboboxContentPanel
                className={className}
                popupClassName={popupClassName}
                popupRef={popupRef}
                popupState={popupState}
                popupStyle={popupStyle}
                resolvedPopupProps={resolvedPopupProps}
              >
                {children}
              </ComboboxContentPanel>
            );
          }}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({
  className,
  onPointerLeave,
  ...props
}: ComboboxPrimitive.List.Props) {
  const { setActiveValue } = useComboboxContext("ComboboxList");

  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative max-h-64 overflow-hidden", className)}
    >
      <ComboboxPrimitive.List
        data-slot="combobox-list"
        onPointerLeave={composeEventHandlers(onPointerLeave, () => {
          setActiveValue(undefined);
        })}
        {...props}
        render={(listProps) => {
          const {
            children: listChildren,
            className: listClassName,
            ref: listRef,
            style: listStyle,
            ...resolvedListProps
          } = listProps as DivRenderProps;

          return (
            <ScrollAreaPrimitive.Viewport
              {...resolvedListProps}
              className={cn(
                "max-h-64 min-h-0 overscroll-contain p-1 outline-none",
                listClassName
              )}
              ref={(node) => {
                setRef(listRef, node);
              }}
              style={listStyle}
            >
              {listChildren}
            </ScrollAreaPrimitive.Viewport>
          );
        }}
      />
      <ScrollAreaPrimitive.Scrollbar
        className={comboboxListScrollbarClassName}
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className={comboboxListThumbClassName} />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
}

function ComboboxItemHighlight({
  activeHighlightId,
  prefersReducedMotion,
  showHighlight,
}: {
  activeHighlightId: string;
  prefersReducedMotion: boolean;
  showHighlight: boolean;
}) {
  if (!showHighlight) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        "absolute inset-0 bg-accent",
        controlCornerInheritClassName
      )}
      layoutId={activeHighlightId}
      transition={prefersReducedMotion ? INSTANT_TRANSITION : HIGHLIGHT_SPRING}
    />
  );
}

function ComboboxItemCheckmark({
  prefersReducedMotion,
  selected,
}: {
  prefersReducedMotion: boolean;
  selected: boolean;
}) {
  return (
    <span className="relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
      <AnimatePresence>
        {selected ? (
          <motion.span
            animate={{ scale: 1, rotate: 0 }}
            className="text-primary"
            exit={prefersReducedMotion ? undefined : { scale: 0, rotate: 90 }}
            initial={prefersReducedMotion ? false : { scale: 0, rotate: -90 }}
            transition={
              prefersReducedMotion ? INSTANT_TRANSITION : checkmarkTransition
            }
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

function ComboboxItemPanel({
  activeHighlightId,
  activeValue,
  children,
  className,
  description,
  itemProps,
  itemState,
  prefersReducedMotion,
  setActiveValue,
  value,
}: {
  activeHighlightId: string;
  activeValue: unknown;
  children: React.ReactNode;
  className?:
    | string
    | ((state: ComboboxPrimitive.Item.State) => string | undefined);
  description?: React.ReactNode;
  itemProps: DivRenderProps;
  itemState: ComboboxPrimitive.Item.State;
  prefersReducedMotion: boolean;
  setActiveValue: React.Dispatch<React.SetStateAction<unknown>>;
  value: unknown;
}) {
  const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
    resolveItemProps(itemProps);
  const showHighlight = itemState.highlighted || Object.is(activeValue, value);

  const handlePointerHighlight = () => {
    if (!itemState.disabled) {
      setActiveValue(value);
    }
  };

  return (
    <motion.div
      {...resolvedItemProps}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex cursor-pointer select-none items-start gap-2 px-2.5 py-2 text-foreground text-sm transition-colors",
        controlCornerClassName,
        itemState.disabled &&
          "pointer-events-none cursor-not-allowed opacity-50",
        itemClassName,
        resolveStateClassName(className, itemState)
      )}
      initial={false}
      onMouseEnter={composeEventHandlers(
        resolvedItemProps.onMouseEnter,
        handlePointerHighlight
      )}
      onPointerMove={composeEventHandlers(
        resolvedItemProps.onPointerMove,
        handlePointerHighlight
      )}
      ref={(node) => {
        setRef(itemRef, node);
      }}
      style={itemStyle}
      transition={
        prefersReducedMotion
          ? INSTANT_TRANSITION
          : { duration: 0.12, ease: "easeOut" }
      }
    >
      <ComboboxItemHighlight
        activeHighlightId={activeHighlightId}
        prefersReducedMotion={prefersReducedMotion}
        showHighlight={showHighlight}
      />
      <ComboboxItemCheckmark
        prefersReducedMotion={prefersReducedMotion}
        selected={itemState.selected}
      />
      <span className="relative z-10 flex flex-col">
        <span className="font-medium leading-tight">{children}</span>
        {description ? (
          <span className="text-muted-foreground text-xs">{description}</span>
        ) : null}
      </span>
    </motion.div>
  );
}

function ComboboxItem({
  className,
  children,
  description,
  value,
  ...props
}: ComboboxPrimitive.Item.Props & {
  description?: React.ReactNode;
}) {
  const {
    activeHighlightId,
    activeValue,
    prefersReducedMotion,
    setActiveValue,
  } = useComboboxContext("ComboboxItem");

  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      value={value}
      {...props}
      render={(itemProps, itemState) => (
        <ComboboxItemPanel
          activeHighlightId={activeHighlightId}
          activeValue={activeValue}
          className={className}
          description={description}
          itemProps={itemProps as DivRenderProps}
          itemState={itemState}
          prefersReducedMotion={prefersReducedMotion}
          setActiveValue={setActiveValue}
          value={value}
        >
          {children}
        </ComboboxItemPanel>
      )}
    />
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      className={cn("py-1", className)}
      data-slot="combobox-group"
      {...props}
    />
  );
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      className={cn("px-2 py-1.5 text-muted-foreground text-xs", className)}
      data-slot="combobox-label"
      {...props}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

function ComboboxEmpty({
  className,
  children = "No results found.",
  ...props
}: ComboboxPrimitive.Empty.Props) {
  const { prefersReducedMotion } = useComboboxContext("ComboboxEmpty");

  return (
    <ComboboxPrimitive.Empty
      className={cn("text-center text-muted-foreground text-sm", className)}
      data-slot="combobox-empty"
      {...props}
    >
      <motion.span
        animate={{ opacity: 1 }}
        className="block px-3 py-6"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        transition={
          prefersReducedMotion ? INSTANT_TRANSITION : { duration: 0.18 }
        }
      >
        {children}
      </motion.span>
    </ComboboxPrimitive.Empty>
  );
}

function ComboboxStatus({
  className,
  ...props
}: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      className={cn("px-3 py-2 text-muted-foreground text-xs", className)}
      data-slot="combobox-status"
      {...props}
    />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="combobox-separator"
      {...props}
    />
  );
}

function ComboboxChips({
  className,
  size = "default",
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props & {
    size?: "sm" | "default";
  }) {
  return (
    <ComboboxPrimitive.Chips
      className={cn(
        componentThemeClassName,
        controlCornerClassName,
        "flex min-h-8 flex-wrap items-center gap-1 border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-data-[slot=combobox-chip]:px-1 has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        size === "sm" ? "min-h-8" : "min-h-9",
        className
      )}
      data-size={size}
      data-slot="combobox-chips"
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      className={cn(
        "flex h-[calc(var(--spacing)*5.25)] w-fit items-center justify-center gap-1 whitespace-nowrap bg-muted px-1.5 font-medium text-foreground text-xs has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-data-[slot=combobox-chip-remove]:pr-0 has-disabled:opacity-50",
        controlCornerXsClassName,
        className
      )}
      data-slot="combobox-chip"
      {...props}
    >
      {children}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          aria-label="Remove item"
          className={cn(
            "-ml-1 flex size-5 items-center justify-center opacity-50 transition hover:bg-accent/60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
            controlCornerXsClassName
          )}
          data-slot="combobox-chip-remove"
        >
          <X className="pointer-events-none size-3" />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({
  className,
  disabled = false,
  ref: refProp,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size">) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <ComboboxPrimitive.Input
      {...props}
      disabled={disabled}
      render={(inputProps) => {
        const {
          className: primitiveClassName,
          ref: primitiveRef,
          style: primitiveStyle,
          ...resolvedInputProps
        } = inputProps as InputRenderProps;

        return (
          <InputPrimitive
            {...resolvedInputProps}
            disabled={disabled}
            render={(baseInputProps) => {
              const {
                className: baseClassName,
                ref: baseRef,
                style: baseStyle,
                ...baseResolvedProps
              } = baseInputProps as InputRenderProps;

              return (
                <input
                  {...baseResolvedProps}
                  autoComplete="off"
                  className={cn(
                    "min-w-16 flex-1 bg-transparent outline-none disabled:cursor-not-allowed",
                    primitiveClassName,
                    baseClassName,
                    className
                  )}
                  data-slot="combobox-chip-input"
                  ref={(node) => {
                    inputRef.current = node;
                    setRef(primitiveRef, node);
                    setRef(baseRef, node);
                    setRef(refProp, node);
                  }}
                  style={{ ...primitiveStyle, ...baseStyle }}
                />
              );
            }}
          />
        );
      }}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

const useComboboxFilter = ComboboxPrimitive.useFilter;
const useFilteredComboboxItems = ComboboxPrimitive.useFilteredItems;

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
  useComboboxFilter,
  useFilteredComboboxItems,
};
