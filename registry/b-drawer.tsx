"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

const EASE = [0.22, 1, 0.36, 1] as const;
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([type='hidden']):not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export type DrawerSide = "left" | "right" | "top" | "bottom";
type PanelMotion = {
  x?: string | number;
  y?: string | number;
  opacity?: number;
};

export interface DrawerProps extends ReducedMotionProp {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  lockBodyScroll?: boolean;
}

function useMeasure<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  { width: number; height: number },
] {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((element) => !element.hasAttribute("disabled"))
    .filter((element) => element.getAttribute("aria-hidden") !== "true")
    .filter((element) => element.getClientRects().length > 0);
}

function getActiveHTMLElement() {
  return document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
}

function trapTabKey(event: KeyboardEvent, panel: HTMLElement) {
  const focusableElements = getFocusableElements(panel);

  if (focusableElements.length === 0) {
    event.preventDefault();
    panel.focus();
    return;
  }

  const [first] = focusableElements;
  const last = focusableElements.at(-1);

  if (!(first && last)) {
    event.preventDefault();
    panel.focus();
    return;
  }

  const activeElement = getActiveHTMLElement();
  const activeElementInsidePanel =
    activeElement && panel.contains(activeElement) ? activeElement : null;

  if (event.shiftKey) {
    if (!activeElementInsidePanel || activeElementInsidePanel === first) {
      event.preventDefault();
      last.focus();
    }
    return;
  }

  if (!activeElementInsidePanel || activeElementInsidePanel === last) {
    event.preventDefault();
    first.focus();
  }
}

const panelVariants: Record<
  DrawerSide,
  {
    initial: PanelMotion;
    animate: PanelMotion;
    exit: PanelMotion;
    className: string;
  }
> = {
  right: {
    initial: { x: "112%", opacity: 0.9 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "106%", opacity: 0.96 },
    className: "top-0 right-0 h-full w-full max-w-md border-l",
  },
  left: {
    initial: { x: "-112%", opacity: 0.9 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-106%", opacity: 0.96 },
    className: "top-0 left-0 h-full w-full max-w-md border-r",
  },
  top: {
    initial: { y: "-108%", opacity: 0.9 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-104%", opacity: 0.96 },
    className:
      "top-0 left-0 w-full max-h-[min(90svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-0.75rem))] rounded-b-[1.75rem] border-b",
  },
  bottom: {
    initial: { y: "108%", opacity: 0.9 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "104%", opacity: 0.96 },
    className:
      "bottom-0 left-0 w-full max-h-[min(90svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-0.75rem))] rounded-t-[1.75rem] border-t",
  },
};

const containerStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.03, delayChildren: 0.04 },
  },
  exit: {
    transition: { staggerChildren: 0.015, staggerDirection: -1 },
  },
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

const PANEL_TRANSITION: Transition = {
  duration: 0.42,
  ease: EASE,
};

function getSafeAreaStyle(side: DrawerSide) {
  if (side === "bottom") {
    return { paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.5rem)" };
  }

  if (side === "top") {
    return { paddingTop: "max(env(safe-area-inset-top, 0px), 0.5rem)" };
  }

  return undefined;
}

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  description,
  footer,
  children,
  reducedMotion,
  lockBodyScroll = true,
}: DrawerProps) {
  const variant = panelVariants[side];
  const reduce = useResolvedReducedMotion(reducedMotion);
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const isVertical = side === "top" || side === "bottom";
  const [headerRef, headerBounds] = useMeasure<HTMLDivElement>();
  const [bodyRef, bodyBounds] = useMeasure<HTMLDivElement>();
  const [footerRef, footerBounds] = useMeasure<HTMLDivElement>();

  const measuredHeight = Math.ceil(
    headerBounds.height + bodyBounds.height + (footer ? footerBounds.height : 0)
  );

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    previousFocusRef.current = getActiveHTMLElement();

    const previousOverflow = document.body.style.overflow;

    if (lockBodyScroll) {
      document.body.style.overflow = "hidden";
    }

    let focusFrame = 0;
    const frame = requestAnimationFrame(() => {
      focusFrame = requestAnimationFrame(() => {
        const preferredFocus =
          panel.querySelector<HTMLElement>("[data-autofocus], [autofocus]") ??
          getFocusableElements(panel)[0] ??
          closeButtonRef.current ??
          panel;

        preferredFocus.focus();
      });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        trapTabKey(event, panel);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      if (lockBodyScroll) {
        document.body.style.overflow = previousOverflow;
      }

      if (
        previousFocusRef.current &&
        document.contains(previousFocusRef.current)
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [lockBodyScroll, open, onClose]);

  const spring: Transition = reduce ? { duration: 0.16 } : PANEL_TRANSITION;

  const panelAnimate = isVertical
    ? {
        ...variant.animate,
        height: measuredHeight > 0 ? measuredHeight : "auto",
      }
    : variant.animate;

  const safeAreaStyle = getSafeAreaStyle(side);

  const drawerContent = (
    <AnimatePresence>
      {open && (
        <DrawerPrimitive.Root defaultOpen modal={false}>
          <div
            className={cn(
              componentThemeClassName,
              "fixed inset-0 z-[2147483647]"
            )}
          >
            <motion.div
              animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
              className="absolute inset-0 bg-foreground/30 will-change-[opacity,backdrop-filter]"
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              onClick={onClose}
              transition={{ duration: reduce ? 0.12 : 0.26, ease: EASE }}
            />
            <motion.aside
              animate={panelAnimate}
              aria-describedby={description ? descriptionId : undefined}
              aria-labelledby={title ? titleId : undefined}
              aria-modal="true"
              className={`absolute flex transform-gpu flex-col overflow-hidden border-neutral-200/80 bg-background shadow-2xl outline-none will-change-transform dark:border-neutral-800 ${variant.className}`}
              exit={variant.exit}
              initial={variant.initial}
              ref={panelRef}
              role="dialog"
              style={safeAreaStyle}
              tabIndex={-1}
              transition={spring}
            >
              <motion.div
                animate={{ opacity: 1 }}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-muted/30 to-transparent"
                initial={{ opacity: 0 }}
                transition={{ delay: reduce ? 0 : 0.08, duration: 0.24 }}
              />

              <div ref={headerRef}>
                <motion.header
                  animate="show"
                  className="relative flex items-start justify-between gap-4 border-neutral-200/80 border-b px-6 py-4 sm:px-7 sm:py-5 dark:border-neutral-800"
                  exit="exit"
                  initial="hidden"
                  variants={containerStagger}
                >
                  <div className="max-w-[min(100%,18rem)] space-y-1.5 pr-2">
                    {title && (
                      <motion.h2
                        className="font-medium text-[17px] text-foreground tracking-[-0.03em] sm:text-[18px]"
                        id={titleId}
                        variants={itemFade}
                      >
                        {title}
                      </motion.h2>
                    )}
                    {description && (
                      <motion.p
                        className="max-w-sm text-[13px] text-secondary leading-5"
                        id={descriptionId}
                        variants={itemFade}
                      >
                        {description}
                      </motion.p>
                    )}
                  </div>
                  <DrawerPrimitive.Close
                    aria-label="Close drawer"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors duration-150 hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={onClose}
                    ref={closeButtonRef}
                    render={<motion.button variants={itemFade} />}
                    type="button"
                  >
                    <X className="size-[15px]" />
                  </DrawerPrimitive.Close>
                </motion.header>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div ref={bodyRef}>
                  <motion.div
                    animate="show"
                    className="relative px-6 py-5 text-foreground text-sm"
                    exit="exit"
                    initial="hidden"
                    variants={containerStagger}
                  >
                    <motion.div variants={itemFade}>{children}</motion.div>
                  </motion.div>
                </div>
              </div>

              {footer && (
                <div ref={footerRef}>
                  <motion.footer
                    animate="show"
                    className="relative border-neutral-200/80 border-t bg-background/95 px-6 py-4 backdrop-blur sm:px-7 dark:border-neutral-800"
                    exit="exit"
                    initial="hidden"
                    variants={containerStagger}
                  >
                    <motion.div variants={itemFade}>{footer}</motion.div>
                  </motion.footer>
                </div>
              )}
            </motion.aside>
          </div>
        </DrawerPrimitive.Root>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") {
    return drawerContent;
  }

  return createPortal(drawerContent, document.body);
}
