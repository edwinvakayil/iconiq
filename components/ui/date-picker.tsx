"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { format, type Locale, startOfMonth } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  type ForwardedRef,
  forwardRef,
  type MouseEvent,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const datePickerTriggerCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const datePickerInputShellClassName = cn(
  "group flex w-full items-center border border-border bg-card text-left text-foreground text-sm transition-[border-color,box-shadow] focus-within:border-foreground/30 hover:border-foreground/30",
  "[&:has(input:disabled)]:cursor-not-allowed [&:has(input:disabled)]:opacity-50",
  "[&:has(input[aria-invalid=true])]:border-destructive"
);

const datePickerInputClassName = cn(
  "min-w-0 flex-1 cursor-pointer truncate bg-transparent py-0 text-left font-medium tracking-tight outline-none focus-visible:outline-none",
  "text-foreground placeholder:text-muted-foreground",
  "[-webkit-tap-highlight-color:transparent]"
);

export const DATE_PICKER_PANEL_WIDTH = {
  sm: 212,
  md: 240,
  lg: 282,
} as const;

export type DatePickerAlign = "start" | "end";
export type DatePickerSide = "top" | "bottom";

export const DEFAULT_DATE_PICKER_FORMAT = "EEE, MMM d, yyyy";
export const DEFAULT_DATE_PICKER_ARIA_FORMAT = "PPPP";
const DATE_PICKER_FORM_VALUE_FORMAT = "yyyy-MM-dd";

const PANEL_GAP_PX = 12;
const VIEWPORT_PADDING_PX = 8;
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getDatePickerPanelWidth(
  size: NonNullable<CalendarProps["size"]> = "md"
): number {
  return DATE_PICKER_PANEL_WIDTH[size];
}

export function resolveDatePickerViewMonth(
  value: Date | null | undefined,
  selected: Date | null | undefined,
  fallback: Date = new Date()
): Date {
  const source = value !== undefined ? value : selected;
  return startOfMonth(source ?? fallback);
}

export function formatDatePickerLabel(
  date: Date,
  dateFormat: string,
  locale?: Locale
): string {
  const options = locale ? { locale } : undefined;

  try {
    return format(date, dateFormat, options);
  } catch {
    return format(date, DEFAULT_DATE_PICKER_FORMAT, options);
  }
}

export function getDatePickerFormValue(date: Date): string {
  return format(date, DATE_PICKER_FORM_VALUE_FORMAT);
}

export function getDatePickerPanelPosition({
  align,
  gap = PANEL_GAP_PX,
  panelHeight,
  panelWidth,
  side,
  triggerRect,
  viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0,
  viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0,
}: {
  align: DatePickerAlign;
  gap?: number;
  panelHeight: number;
  panelWidth: number;
  side: DatePickerSide;
  triggerRect: Pick<DOMRect, "bottom" | "left" | "right" | "top">;
  viewportHeight?: number;
  viewportWidth?: number;
}): { left: number; side: DatePickerSide; top: number } {
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  let resolvedSide = side;

  if (
    panelHeight > 0 &&
    side === "bottom" &&
    spaceBelow < panelHeight + gap &&
    spaceAbove > spaceBelow
  ) {
    resolvedSide = "top";
  } else if (
    panelHeight > 0 &&
    side === "top" &&
    spaceAbove < panelHeight + gap &&
    spaceBelow > spaceAbove
  ) {
    resolvedSide = "bottom";
  }

  const top =
    resolvedSide === "bottom"
      ? triggerRect.bottom + gap
      : triggerRect.top - panelHeight - gap;

  let left =
    align === "start" ? triggerRect.left : triggerRect.right - panelWidth;

  left = Math.max(
    VIEWPORT_PADDING_PX,
    Math.min(left, viewportWidth - panelWidth - VIEWPORT_PADDING_PX)
  );

  return { left, side: resolvedSide, top };
}

type DatePickerCalendarProps = Omit<
  CalendarProps,
  | "selected"
  | "defaultSelected"
  | "onSelect"
  | "month"
  | "onMonthChange"
  | "mode"
  | "range"
  | "defaultRange"
  | "onRangeSelect"
  | "name"
>;

export type DatePickerProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  className?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  dateFormat?: string;
  name?: string;
  id?: string;
  "aria-invalid"?: boolean;
  side?: DatePickerSide;
  align?: DatePickerAlign;
  /** Props forwarded to the embedded Calendar, except selection and month state. */
  calendarProps?: DatePickerCalendarProps;
};

type PanelPlacement = {
  left: number;
  top: number;
  width: number;
};

function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  returnFocusRef: RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    if (!(active && containerRef.current)) return;

    const container = containerRef.current;
    let frameId = 0;

    const focusFirst = () => {
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      if (focusable.length === 0) {
        frameId = window.requestAnimationFrame(focusFirst);
        return;
      }

      focusable[0]?.focus();
    };

    frameId = window.requestAnimationFrame(focusFirst);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !containerRef.current) return;

      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        return;
      }

      if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [active, containerRef, returnFocusRef]);
}

function useDismissiblePanel({
  open,
  rootRef,
  panelRef,
  setOpenState,
}: {
  open: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  setOpenState: (nextOpen: boolean) => void;
}) {
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpenState(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenState(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, panelRef, rootRef, setOpenState]);
}

function usePanelPlacement({
  align,
  anchorRef,
  hasRenderedPanel,
  open,
  panelRef,
  panelWidth,
  side,
}: {
  align: DatePickerAlign;
  anchorRef: RefObject<HTMLElement | null>;
  hasRenderedPanel: boolean;
  open: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  panelWidth: number;
  side: DatePickerSide;
}) {
  const [panelPlacement, setPanelPlacement] = useState<PanelPlacement | null>(
    null
  );

  const updatePanelPlacement = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!(anchor && panel)) return;

    const panelHeight = panel.offsetHeight;
    if (panelHeight === 0) return;

    const position = getDatePickerPanelPosition({
      align,
      panelHeight,
      panelWidth,
      side,
      triggerRect: anchor.getBoundingClientRect(),
    });

    setPanelPlacement({
      left: position.left,
      top: position.top,
      width: panelWidth,
    });
  }, [align, anchorRef, panelRef, panelWidth, side]);

  useLayoutEffect(() => {
    if (!(open && hasRenderedPanel)) return;

    updatePanelPlacement();

    const frameId = window.requestAnimationFrame(updatePanelPlacement);

    window.addEventListener("resize", updatePanelPlacement);
    window.addEventListener("scroll", updatePanelPlacement, true);

    const panel = panelRef.current;
    const resizeObserver =
      panel && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updatePanelPlacement)
        : null;

    if (panel && resizeObserver) {
      resizeObserver.observe(panel);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePanelPlacement);
      window.removeEventListener("scroll", updatePanelPlacement, true);
      resizeObserver?.disconnect();
    };
  }, [hasRenderedPanel, open, panelRef, updatePanelPlacement]);

  return panelPlacement;
}

function mergeTriggerRef(
  node: HTMLInputElement | null,
  triggerRef: RefObject<HTMLInputElement | null>,
  ref: ForwardedRef<HTMLInputElement>
) {
  triggerRef.current = node;

  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    ref.current = node;
  }
}

type DatePickerTriggerProps = {
  ariaInvalid?: boolean;
  ariaLabel: string;
  clearable: boolean;
  disabled: boolean;
  id?: string;
  labelId: string;
  onClear: (event: MouseEvent<HTMLButtonElement>) => void;
  onToggle: () => void;
  open: boolean;
  panelId: string;
  placeholder: string;
  selected: Date | null;
  setTriggerRef: (node: HTMLInputElement | null) => void;
  triggerLabel: string;
};

function DatePickerTrigger({
  ariaInvalid,
  ariaLabel,
  clearable,
  disabled,
  id,
  labelId,
  onClear,
  onToggle,
  open,
  panelId,
  placeholder,
  selected,
  setTriggerRef,
  triggerLabel,
}: DatePickerTriggerProps) {
  const handleActivate = () => {
    if (disabled) return;
    onToggle();
  };

  return (
    <div
      className={cn(
        datePickerInputShellClassName,
        "h-10 pr-2 pl-4",
        datePickerTriggerCornerClassName
      )}
    >
      <div className="relative flex min-w-0 flex-1 items-center">
        <CalendarIcon
          aria-hidden
          className="pointer-events-none absolute left-0 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground group-has-[input:disabled]:text-muted-foreground"
        />
        <InputPrimitive
          aria-controls={open ? panelId : undefined}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-invalid={ariaInvalid}
          aria-label={ariaLabel}
          disabled={disabled}
          id={id ?? labelId}
          onClick={handleActivate}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleActivate();
            }
          }}
          placeholder={placeholder}
          readOnly
          render={(inputProps) => {
            const {
              className: primitiveClassName,
              ref: primitiveRef,
              ...resolvedInputProps
            } = inputProps;

            return (
              <input
                {...resolvedInputProps}
                className={cn(
                  datePickerInputClassName,
                  "pl-7",
                  !selected && "text-muted-foreground",
                  primitiveClassName
                )}
                ref={(node) => {
                  setTriggerRef(node);

                  if (typeof primitiveRef === "function") {
                    primitiveRef(node);
                    return;
                  }

                  if (primitiveRef) {
                    primitiveRef.current = node;
                  }
                }}
              />
            );
          }}
          value={selected ? triggerLabel : ""}
        />
      </div>

      {clearable && selected && !disabled ? (
        <button
          aria-label="Clear selected date"
          className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
          onClick={onClear}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          type="button"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      ) : null}
    </div>
  );
}

type DatePickerPanelProps = {
  calendarClassName?: string;
  calendarSize: NonNullable<CalendarProps["size"]>;
  hasRenderedPanel: boolean;
  labelId: string;
  locale?: Locale;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date | null) => void;
  open: boolean;
  panelId: string;
  panelPlacement: PanelPlacement | null;
  panelRef: RefObject<HTMLDivElement | null>;
  panelTransition:
    | { duration: number }
    | { type: "spring"; stiffness: number; damping: number };
  panelWidth: number;
  reduceMotion: boolean | null;
  restCalendarProps: Omit<
    DatePickerCalendarProps,
    "className" | "locale" | "size"
  >;
  selected: Date | null;
  viewMonth: Date;
};

function DatePickerPanel({
  calendarClassName,
  calendarSize,
  hasRenderedPanel,
  labelId,
  locale,
  onMonthChange,
  onSelect,
  open,
  panelId,
  panelPlacement,
  panelRef,
  panelTransition,
  panelWidth,
  reduceMotion,
  restCalendarProps,
  selected,
  viewMonth,
}: DatePickerPanelProps) {
  if (!hasRenderedPanel) return null;

  return (
    <motion.div
      animate={{
        opacity: open ? 1 : 0,
        y: open || reduceMotion ? 0 : -6,
      }}
      aria-hidden={!open}
      aria-labelledby={labelId}
      aria-modal="true"
      className={cn(
        "fixed z-50",
        !(open && panelPlacement) && "pointer-events-none"
      )}
      id={panelId}
      initial={false}
      ref={panelRef}
      role="dialog"
      style={
        panelPlacement
          ? {
              left: panelPlacement.left,
              top: panelPlacement.top,
              width: panelPlacement.width,
              visibility: open ? undefined : "hidden",
            }
          : { visibility: "hidden", width: panelWidth }
      }
      transition={panelTransition}
    >
      <Calendar
        className={cn("!shadow-none", calendarClassName)}
        locale={locale}
        mode="single"
        month={viewMonth}
        onMonthChange={onMonthChange}
        onSelect={onSelect}
        selected={selected}
        size={calendarSize}
        {...restCalendarProps}
      />
    </motion.div>
  );
}

export const AnimatedDatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function AnimatedDatePicker(props, ref) {
    const {
      value,
      defaultValue = null,
      onChange,
      className,
      defaultOpen = false,
      open: openProp,
      onOpenChange,
      placeholder = "Select a date",
      disabled = false,
      clearable = false,
      closeOnSelect = true,
      dateFormat = DEFAULT_DATE_PICKER_FORMAT,
      name,
      id,
      "aria-invalid": ariaInvalid,
      side = "bottom",
      align = "start",
      calendarProps,
    } = props;

    const isValueControlled = value !== undefined;
    const isOpenControlled = openProp !== undefined;
    const reduceMotion = useReducedMotion();

    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const panelId = useId();
    const labelId = useId();

    const [mounted, setMounted] = useState(false);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [hasRenderedPanel, setHasRenderedPanel] = useState(defaultOpen);
    const [internalSelected, setInternalSelected] = useState<Date | null>(
      defaultValue
    );
    const [viewMonth, setViewMonth] = useState<Date>(() =>
      resolveDatePickerViewMonth(value, defaultValue)
    );

    const open = isOpenControlled ? Boolean(openProp) : uncontrolledOpen;
    const selected = isValueControlled ? (value ?? null) : internalSelected;

    const {
      className: calendarClassName,
      locale,
      size,
      ...restCalendarProps
    } = calendarProps ?? {};
    const calendarSize = size ?? "md";
    const panelWidth = getDatePickerPanelWidth(calendarSize);

    const setOpenState = useCallback(
      (nextOpen: boolean) => {
        if (disabled && nextOpen) return;

        if (nextOpen) {
          setHasRenderedPanel(true);
        }

        if (!isOpenControlled) {
          setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [disabled, isOpenControlled, onOpenChange]
    );

    const panelPlacement = usePanelPlacement({
      align,
      anchorRef: rootRef,
      hasRenderedPanel,
      open,
      panelRef,
      panelWidth,
      side,
    });

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!isValueControlled) return;
      setViewMonth(resolveDatePickerViewMonth(value, selected));
    }, [isValueControlled, selected, value]);

    useEffect(() => {
      if (!open) return;
      setViewMonth(resolveDatePickerViewMonth(selected, selected));
    }, [open, selected]);

    useEffect(() => {
      if (disabled && open) {
        setOpenState(false);
      }
    }, [disabled, open, setOpenState]);

    useDismissiblePanel({ open, panelRef, rootRef, setOpenState });
    useFocusTrap(
      panelRef,
      triggerRef,
      open && hasRenderedPanel && panelPlacement !== null
    );

    const handleSelect = useCallback(
      (date: Date | null) => {
        if (!isValueControlled) {
          setInternalSelected(date);
        }

        if (date) {
          setViewMonth(startOfMonth(date));
        }

        onChange?.(date);

        if (closeOnSelect && date) {
          setOpenState(false);
        }
      },
      [closeOnSelect, isValueControlled, onChange, setOpenState]
    );

    const handleClear = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (!isValueControlled) {
          setInternalSelected(null);
        }

        onChange?.(null);
        setOpenState(false);
        triggerRef.current?.focus();
      },
      [isValueControlled, onChange, setOpenState]
    );

    const handleMonthChange = useCallback((month: Date) => {
      setViewMonth(startOfMonth(month));
    }, []);

    const setTriggerRef = useCallback(
      (node: HTMLInputElement | null) => {
        mergeTriggerRef(node, triggerRef, ref);
      },
      [ref]
    );

    const triggerLabel = selected
      ? formatDatePickerLabel(selected, dateFormat, locale)
      : placeholder;

    const ariaLabel = selected
      ? `Selected date, ${formatDatePickerLabel(selected, DEFAULT_DATE_PICKER_ARIA_FORMAT, locale)}`
      : placeholder;

    const triggerId = id ?? labelId;

    const panelTransition = reduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 260, damping: 28 };

    const panel = (
      <DatePickerPanel
        calendarClassName={calendarClassName}
        calendarSize={calendarSize}
        hasRenderedPanel={hasRenderedPanel}
        labelId={triggerId}
        locale={locale}
        onMonthChange={handleMonthChange}
        onSelect={handleSelect}
        open={open}
        panelId={panelId}
        panelPlacement={panelPlacement}
        panelRef={panelRef}
        panelTransition={panelTransition}
        panelWidth={panelWidth}
        reduceMotion={reduceMotion}
        restCalendarProps={restCalendarProps}
        selected={selected}
        viewMonth={viewMonth}
      />
    );

    return (
      <div
        className={cn("relative w-full", className)}
        ref={rootRef}
        style={{ maxWidth: panelWidth }}
      >
        {name ? (
          <InputPrimitive
            aria-hidden
            className="sr-only"
            name={name}
            readOnly
            render={(inputProps) => <input {...inputProps} tabIndex={-1} />}
            tabIndex={-1}
            value={selected ? getDatePickerFormValue(selected) : ""}
          />
        ) : null}

        <DatePickerTrigger
          ariaInvalid={ariaInvalid}
          ariaLabel={ariaLabel}
          clearable={clearable}
          disabled={disabled}
          id={id}
          labelId={labelId}
          onClear={handleClear}
          onToggle={() => setOpenState(!open)}
          open={open}
          panelId={panelId}
          placeholder={placeholder}
          selected={selected}
          setTriggerRef={setTriggerRef}
          triggerLabel={triggerLabel}
        />

        {mounted && panel ? createPortal(panel, document.body) : null}
      </div>
    );
  }
);

AnimatedDatePicker.displayName = "DatePicker";

export { AnimatedDatePicker as DatePicker };
