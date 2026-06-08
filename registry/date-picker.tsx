"use client";

import { format, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export type DatePickerProps = {
  value?: Date | null;
  onChange?: (date: Date) => void;
  className?: string;
  defaultOpen?: boolean;
  placeholder?: string;
  /** Props forwarded to the embedded Calendar, except selection and month state. */
  calendarProps?: Omit<
    CalendarProps,
    "selected" | "defaultSelected" | "onSelect" | "month" | "onMonthChange"
  >;
};

export function AnimatedDatePicker({
  value,
  onChange,
  className,
  defaultOpen = false,
  placeholder = "Select a date",
  calendarProps,
}: DatePickerProps) {
  const isValueControlled = value !== undefined;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [hasRenderedPanel, setHasRenderedPanel] = useState(defaultOpen);
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(
    value ?? undefined
  );
  const [viewMonth, setViewMonth] = useState<Date>(
    startOfMonth(value ?? new Date())
  );

  const selected = isValueControlled ? (value ?? undefined) : internalSelected;

  useEffect(() => {
    if (!isValueControlled) return;

    if (value) {
      setViewMonth(startOfMonth(value));
    }
  }, [isValueControlled, value]);

  useEffect(() => {
    if (!open) return;

    if (selected) {
      setViewMonth(startOfMonth(selected));
    }

    setHasRenderedPanel(true);
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (date: Date) => {
    if (!isValueControlled) {
      setInternalSelected(date);
    }

    setViewMonth(startOfMonth(date));
    onChange?.(date);
  };

  const { className: calendarClassName, ...restCalendarProps } =
    calendarProps ?? {};

  return (
    <div
      className={cn("relative w-full max-w-[240px]", className)}
      ref={rootRef}
    >
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          selected ? `Selected date, ${format(selected, "PPPP")}` : placeholder
        }
        className="group flex w-full items-center rounded-lg border border-border bg-card px-4 py-3 text-left text-foreground text-sm transition-all hover:border-foreground/30"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-3">
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
          <span className="truncate font-medium tracking-tight">
            {selected ? format(selected, "EEE, MMM d, yyyy") : placeholder}
          </span>
        </span>
      </button>

      {hasRenderedPanel && (
        <motion.div
          animate={{
            opacity: open ? 1 : 0,
            y: open ? 0 : -6,
          }}
          aria-hidden={!open}
          className={cn(
            "absolute top-full left-0 z-20 mt-3 w-full",
            !open && "pointer-events-none"
          )}
          id={panelId}
          initial={false}
          role="dialog"
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <Calendar
            className={calendarClassName}
            month={viewMonth}
            onMonthChange={(month) => setViewMonth(startOfMonth(month))}
            onSelect={handleSelect}
            selected={selected}
            size="md"
            {...restCalendarProps}
          />
        </motion.div>
      )}
    </div>
  );
}

export { AnimatedDatePicker as DatePicker };
