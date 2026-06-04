"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { ChevronsUpDown, X } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

type AutocompleteRootProps<Value> = ReducedMotionProp &
  Omit<AutocompletePrimitive.Root.Props<Value>, "items"> & {
    items: readonly Value[];
  };

type AutocompleteContextValue = {
  actionsRef: React.RefObject<AutocompletePrimitive.Root.Actions | null>;
  activeHighlightId: string;
  activeValue: unknown;
  open: boolean;
  reduceMotion: boolean;
  setActiveValue: React.Dispatch<React.SetStateAction<unknown>>;
  setOpen: (open: boolean) => void;
};

type DivRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

const AutocompleteContext =
  React.createContext<AutocompleteContextValue | null>(null);

function useAutocompleteContext(componentName: string) {
  const context = React.useContext(AutocompleteContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Autocomplete`);
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

const HIGHLIGHT_SPRING = {
  type: "spring" as const,
  stiffness: 460,
  damping: 40,
  mass: 0.82,
};

function getChevronTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.1, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };
}

function Autocomplete<Value>({
  actionsRef: actionsRefProp,
  autoHighlight = true,
  children,
  defaultOpen = false,
  highlightItemOnHover = true,
  items,
  modal = false,
  mode = "list",
  onOpenChange,
  open: openProp,
  openOnInputClick = false,
  reducedMotion,
  ...props
}: AutocompleteRootProps<Value>) {
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const internalActionsRef =
    React.useRef<AutocompletePrimitive.Root.Actions | null>(null);
  const actionsRef = actionsRefProp ?? internalActionsRef;
  const isOpenControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [activeValue, setActiveValue] = React.useState<unknown>();
  const open = isOpenControlled ? openProp : uncontrolledOpen;
  const activeHighlightId = React.useId();

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

  const handleOpenChange = React.useCallback<
    NonNullable<AutocompletePrimitive.Root.Props<Value>["onOpenChange"]>
  >(
    (nextOpen, eventDetails) => {
      if (!nextOpen && reduceMotion) {
        requestAnimationFrame(() => {
          actionsRef.current?.unmount();
        });
      }

      if (!eventDetails.isCanceled) {
        setOpen(nextOpen);
      }

      onOpenChange?.(nextOpen, eventDetails);
    },
    [actionsRef, onOpenChange, reduceMotion, setOpen]
  );

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <AutocompleteContext.Provider
        value={{
          actionsRef,
          activeHighlightId,
          activeValue,
          open,
          reduceMotion,
          setActiveValue,
          setOpen,
        }}
      >
        <AutocompletePrimitive.Root
          {...props}
          actionsRef={actionsRef}
          autoHighlight={autoHighlight}
          highlightItemOnHover={highlightItemOnHover}
          items={items}
          modal={modal}
          mode={mode}
          onOpenChange={handleOpenChange}
          open={open}
          openOnInputClick={openOnInputClick}
        >
          {children}
        </AutocompletePrimitive.Root>
      </AutocompleteContext.Provider>
    </ReducedMotionConfig>
  );
}

function AutocompleteValue({ ...props }: AutocompletePrimitive.Value.Props) {
  return (
    <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />
  );
}

function AutocompleteTrigger({
  className,
  children,
  ...props
}: AutocompletePrimitive.Trigger.Props) {
  const { open, reduceMotion } = useAutocompleteContext("AutocompleteTrigger");

  return (
    <AutocompletePrimitive.Trigger
      className={cn(
        "flex shrink-0 items-center justify-center text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="autocomplete-trigger"
      type="button"
      {...props}
    >
      {children}
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={getChevronTransition(reduceMotion)}
      >
        <ChevronsUpDown className="h-4 w-4" />
      </motion.span>
    </AutocompletePrimitive.Trigger>
  );
}

function AutocompleteClear({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props) {
  return (
    <AutocompletePrimitive.Clear
      aria-label="Clear input"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-70 transition hover:bg-accent/60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        className
      )}
      data-slot="autocomplete-clear"
      keepMounted={false}
      {...props}
    >
      <X className="h-3.5 w-3.5" />
    </AutocompletePrimitive.Clear>
  );
}

function AutocompleteInput({
  className,
  children,
  disabled = false,
  id: idProp,
  label,
  labelClassName,
  ref: refProp,
  showClear = true,
  showTrigger = false,
  ...props
}: AutocompletePrimitive.Input.Props & {
  label?: React.ReactNode;
  labelClassName?: string;
  showClear?: boolean;
  showTrigger?: boolean;
}) {
  const { open, setOpen } = useAutocompleteContext("AutocompleteInput");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const generatedId = React.useId();
  const inputId = idProp ?? generatedId;

  const inputGroup = (
    <AutocompletePrimitive.InputGroup
      className={cn(
        componentThemeClassName,
        "group flex h-11 w-full items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-base transition-all sm:text-sm",
        "hover:border-ring/40",
        "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/25",
        disabled && "cursor-not-allowed opacity-50",
        open && "border-ring ring-1 ring-ring/25",
        label ? undefined : className
      )}
      data-slot="autocomplete-input"
      onClick={() => {
        if (disabled) return;

        inputRef.current?.focus();
      }}
    >
      <AutocompletePrimitive.Input
        autoComplete="off"
        className="h-full w-full min-w-0 flex-1 bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed sm:text-sm"
        disabled={disabled}
        id={inputId}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Tab") {
            setOpen(false);
          }
        })}
        ref={(node) => {
          inputRef.current = node;
          setRef(refProp, node);
        }}
        {...props}
      />
      {showClear ? <AutocompleteClear disabled={disabled} /> : null}
      {showTrigger ? <AutocompleteTrigger disabled={disabled} /> : null}
      {children}
    </AutocompletePrimitive.InputGroup>
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

function AutocompleteContent({
  align = "start",
  alignOffset = 0,
  anchor,
  children,
  className,
  side = "bottom",
  sideOffset = 6,
  ...props
}: AutocompletePrimitive.Popup.Props &
  Pick<
    AutocompletePrimitive.Positioner.Props,
    "align" | "alignOffset" | "anchor" | "side" | "sideOffset"
  >) {
  const { actionsRef, reduceMotion } = useAutocompleteContext(
    "AutocompleteContent"
  );

  return (
    <AutocompletePrimitive.Portal keepMounted>
      <AutocompletePrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-[9999] outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-content"
          initialFocus={false}
          {...props}
          render={(popupProps, popupState) => {
            const { popupClassName, popupRef, popupStyle, resolvedPopupProps } =
              resolvePopupProps(popupProps as DivRenderProps);

            return (
              <motion.div
                {...resolvedPopupProps}
                animate={
                  popupState.open
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: reduceMotion ? 0 : -4 }
                }
                className={cn(
                  componentThemeClassName,
                  "w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-hidden rounded-lg border border-neutral-200/60 bg-white text-neutral-900 shadow-none dark:border-neutral-700/60 dark:bg-neutral-950 dark:text-neutral-100",
                  popupClassName,
                  resolveStateClassName(className, popupState)
                )}
                initial={
                  popupState.transitionStatus === "starting"
                    ? { opacity: 0, y: reduceMotion ? 0 : -6 }
                    : false
                }
                onAnimationComplete={() => {
                  if (!popupState.open) {
                    actionsRef.current?.unmount();
                  }
                }}
                ref={(node) => {
                  setRef(popupRef, node);
                }}
                role="presentation"
                style={popupStyle}
                transition={{
                  duration: reduceMotion ? 0.1 : 0.18,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                {children}
              </motion.div>
            );
          }}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

function AutocompleteList({
  className,
  onPointerLeave,
  ...props
}: AutocompletePrimitive.List.Props) {
  const { setActiveValue } = useAutocompleteContext("AutocompleteList");

  return (
    <AutocompletePrimitive.List
      className={cn("max-h-64 overflow-y-auto p-1", className)}
      data-slot="autocomplete-list"
      onPointerLeave={composeEventHandlers(onPointerLeave, () => {
        setActiveValue(undefined);
      })}
      {...props}
    />
  );
}

function AutocompleteItem({
  className,
  children,
  description,
  value,
  ...props
}: AutocompletePrimitive.Item.Props & {
  description?: React.ReactNode;
}) {
  const { activeHighlightId, activeValue, reduceMotion, setActiveValue } =
    useAutocompleteContext("AutocompleteItem");

  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      value={value}
      {...props}
      render={(itemProps, itemState) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as DivRenderProps);
        const showHighlight =
          itemState.highlighted || Object.is(activeValue, value);

        return (
          <motion.div
            {...resolvedItemProps}
            animate={{ opacity: 1 }}
            className={cn(
              "relative flex cursor-pointer select-none items-start rounded-lg px-2.5 py-2 text-foreground text-sm",
              itemClassName,
              resolveStateClassName(className, itemState)
            )}
            initial={reduceMotion ? false : { opacity: 0 }}
            onMouseEnter={composeEventHandlers(
              resolvedItemProps.onMouseEnter,
              () => {
                setActiveValue(value);
              }
            )}
            onPointerMove={composeEventHandlers(
              resolvedItemProps.onPointerMove,
              () => {
                setActiveValue(value);
              }
            )}
            ref={(node) => {
              setRef(itemRef, node);
            }}
            style={itemStyle}
            transition={{
              duration: reduceMotion ? 0.1 : 0.14,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {showHighlight ? (
              <motion.div
                className="absolute inset-0 rounded-lg bg-accent"
                layoutId={activeHighlightId}
                transition={reduceMotion ? { duration: 0.1 } : HIGHLIGHT_SPRING}
              />
            ) : null}

            <span className="relative z-10 flex flex-col">
              <span className="font-medium leading-tight">{children}</span>
              {description ? (
                <span className="text-muted-foreground text-xs">
                  {description}
                </span>
              ) : null}
            </span>
          </motion.div>
        );
      }}
    />
  );
}

function AutocompleteGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      className={cn(className)}
      data-slot="autocomplete-group"
      {...props}
    />
  );
}

function AutocompleteLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      className={cn("px-2 py-1.5 text-muted-foreground text-xs", className)}
      data-slot="autocomplete-label"
      {...props}
    />
  );
}

function AutocompleteCollection({
  ...props
}: AutocompletePrimitive.Collection.Props) {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  );
}

function AutocompleteEmpty({
  className,
  children = "No results found.",
  ...props
}: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      className={cn("text-center text-muted-foreground text-sm", className)}
      data-slot="autocomplete-empty"
      {...props}
    >
      <motion.span animate={{ opacity: 1 }} className="block px-3 py-6">
        {children}
      </motion.span>
    </AutocompletePrimitive.Empty>
  );
}

function AutocompleteSeparator({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="autocomplete-separator"
      {...props}
    />
  );
}

function useAutocompleteAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Autocomplete,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteTrigger,
  AutocompleteValue,
  useAutocompleteAnchor,
};
