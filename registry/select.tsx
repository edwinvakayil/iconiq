"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface selectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const itemVariants = {
  hidden: () => ({
    opacity: 0,
    y: -8,
    scale: 0.96,
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -4,
    scale: 0.97,
    transition: {
      delay: i * 0.02,
      duration: 0.15,
      ease: [0.55, 0.06, 0.68, 0.19] as [number, number, number, number],
    },
  }),
};

export function select({
  options,
  value,
  onChange,
  placeholder = "Select an option…",
}: selectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-72" ref={ref}>
      {/* Trigger */}
      <motion.button
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 font-medium text-foreground text-sm transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen((v) => !v)}
        type="button"
        whileTap={{ scale: 0.98 }}
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {selected ? selected.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg"
            exit={{ opacity: 0, y: -4, scaleY: 0.92 }}
            initial={{ opacity: 0, y: -4, scaleY: 0.92 }}
            style={{ originY: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="p-1.5">
              {options.map((option, i) => {
                const isSelected = option.value === value;
                return (
                  <motion.button
                    animate="visible"
                    className={
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-foreground text-sm transition-colors hover:bg-accent"
                    }
                    custom={i}
                    exit="exit"
                    initial="hidden"
                    key={option.value}
                    onClick={() => {
                      onChange?.(option.value);
                      setOpen(false);
                    }}
                    transition={{ duration: 0.15 }}
                    type="button"
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                  >
                    {option.icon && (
                      <span className="text-muted-foreground">
                        {option.icon}
                      </span>
                    )}
                    <span className="flex-1 text-left">{option.label}</span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          initial={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
