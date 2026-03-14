"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface SystemAlertProps {
  id: string;
  variant: AlertVariant;
  title: string;
  description?: string;
  isVisible: boolean;
  onClose: (id: string) => void;
  autoDismiss?: number;
}

/** Colors kept in component; no CSS variables required. */
const variantConfig: Record<
  AlertVariant,
  {
    icon: typeof CheckCircle2;
    bg: string;
    text: string;
    iconColor: string;
    ring: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-900 dark:text-emerald-100",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-200 dark:ring-emerald-800",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50 dark:bg-red-950/50",
    text: "text-red-900 dark:text-red-100",
    iconColor: "text-red-600 dark:text-red-400",
    ring: "ring-red-200 dark:ring-red-800",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-900 dark:text-amber-100",
    iconColor: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-200 dark:ring-amber-800",
  },
  info: {
    icon: Info,
    bg: "bg-sky-50 dark:bg-sky-950/50",
    text: "text-sky-900 dark:text-sky-100",
    iconColor: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-200 dark:ring-sky-800",
  },
};

export function SystemAlert({
  id,
  variant,
  title,
  description,
  isVisible,
  onClose,
  autoDismiss = 5,
}: SystemAlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={cn(
            "relative flex w-full max-w-sm gap-3 overflow-hidden rounded-xl p-3 shadow-sm ring-1 ring-inset backdrop-blur-md",
            config.bg,
            config.text,
            config.ring
          )}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          layout
          role="alert"
          transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.2 }}
        >
          <div className="shrink-0">
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>

          <div className="flex-1 pt-0.5">
            <h3 className="font-semibold text-sm leading-none tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="mt-1.5 text-pretty text-xs leading-relaxed opacity-80">
                {description}
              </p>
            )}
          </div>

          <button
            aria-label="Close alert"
            className="group shrink-0 rounded-md p-1 transition-colors hover:bg-foreground/5"
            onClick={() => onClose(id)}
            type="button"
          >
            <X className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
          </button>

          <motion.div
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-current opacity-10"
            initial={{ scaleX: 0 }}
            transition={{ duration: autoDismiss, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
