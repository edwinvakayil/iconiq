"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AnimatedSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function AnimatedSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option…",
  label,
  className,
}: AnimatedSelectProps) {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = value ?? internalValue;
  const selectedOption = options.find((o) => o.value === selected);

  const handleSelect = (optionValue: string) => {
    setInternalValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <motion.label
          animate={{ opacity: 1, y: 0 }}
          className="mb-1.5 block font-medium text-foreground text-sm"
          htmlFor={id}
          initial={{ opacity: 0, y: -4 }}
        >
          {label}
        </motion.label>
      )}
      <motion.button
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
          "border-input bg-background text-foreground",
          "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
        id={id}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node))
            setIsOpen(false);
        }}
        onClick={() => setIsOpen((o) => !o)}
        type="button"
        whileTap={{ scale: 0.98 }}
      >
        <span className={cn(!selectedOption && "text-muted-foreground")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            animate={{ opacity: 1, y: 4, scaleY: 1 }}
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            exit={{
              opacity: 0,
              y: -6,
              scaleY: 0.95,
              transition: { duration: 0.12 },
            }}
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            style={{ transformOrigin: "top" }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
          >
            {options.map((option, i) => {
              const isSelected = option.value === selected;
              return (
                <motion.li
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -8 }}
                  key={option.value}
                  transition={{ delay: i * 0.03, duration: 0.15 }}
                >
                  <button
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                      "text-neutral-900 dark:text-neutral-100",
                      isSelected
                        ? "bg-neutral-100 font-medium dark:bg-neutral-800"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                    onClick={() => handleSelect(option.value)}
                    onMouseDown={(e) => e.preventDefault()}
                    type="button"
                  >
                    {option.icon && (
                      <span className="shrink-0">{option.icon}</span>
                    )}
                    <span className="flex-1 text-left">{option.label}</span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          initial={{ scale: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
