"use client";

import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import type * as React from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const MotionChevron = motion.create(ChevronRight);

const EFFECTS_KEY = "sidebar-001-effects";
const SIDEBAR_BOTTOM_FADE_MASK =
  "linear-gradient(to top, rgba(0, 0, 0, 1) 22%, rgba(0, 0, 0, 0.88) 44%, transparent 100%)";

const EffectsContext = createContext<{ enabled: boolean; toggle: () => void }>({
  enabled: true,
  toggle: () => undefined,
});

function EffectsProvider({
  children,
  defaultEnabled = true,
}: {
  children: React.ReactNode;
  defaultEnabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return defaultEnabled;

    try {
      const stored = localStorage.getItem(EFFECTS_KEY);
      return stored !== null ? stored === "true" : defaultEnabled;
    } catch {
      return defaultEnabled;
    }
  });

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;

      try {
        localStorage.setItem(EFFECTS_KEY, String(next));
      } catch {
        // Ignore storage access failures so the sidebar still works.
      }

      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);

  return (
    <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>
  );
}

export function useSidebar001Effects() {
  return useContext(EffectsContext);
}

interface HoverRect {
  top: number;
  height: number;
  left: number;
}

const HoverContext = createContext<{
  hovered: string | null;
  hoverRect: HoverRect | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setHovered: (id: string | null, rect?: HoverRect | null) => void;
}>({
  hovered: null,
  hoverRect: null,
  containerRef: { current: null },
  setHovered: () => undefined,
});

function HoverProvider({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHoveredId] = useState<string | null>(null);
  const [hoverRect, setHoverRect] = useState<HoverRect | null>(null);

  const setHovered = useCallback(
    (id: string | null, rect?: HoverRect | null) => {
      setHoveredId(id);
      setHoverRect(rect ?? null);
    },
    []
  );

  const value = useMemo(
    () => ({ hovered, hoverRect, containerRef, setHovered }),
    [hovered, hoverRect, containerRef, setHovered]
  );

  return (
    <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
  );
}

function useScrollToActive(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolled = useRef(false);

  useEffect(() => {
    if (!active || scrolled.current || !ref.current) return;

    scrolled.current = true;
    const el = ref.current;
    const schedule =
      typeof requestIdleCallback !== "undefined"
        ? (cb: () => void) => requestIdleCallback(cb)
        : (cb: () => void) => setTimeout(cb, 100);
    const cancel =
      typeof cancelIdleCallback !== "undefined"
        ? cancelIdleCallback
        : clearTimeout;
    const id = schedule(() => {
      const viewport = el.closest("[data-scroll-viewport]");
      if (!(viewport instanceof HTMLElement)) return;

      const vpRect = viewport.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset =
        elRect.top - vpRect.top - vpRect.height / 2 + elRect.height / 2;

      if (Math.abs(offset) > 40) {
        viewport.scrollBy({ top: offset, behavior: "smooth" });
      }
    });

    return () => cancel(id as number);
  }, [active]);

  useEffect(() => {
    if (!active) scrolled.current = false;
  }, [active]);

  return ref;
}

function HoverHighlight() {
  const { hoverRect, hovered } = useContext(HoverContext);
  const { enabled } = useContext(EffectsContext);

  return (
    <AnimatePresence>
      {enabled && hovered && hoverRect ? (
        <motion.div
          animate={{
            top: hoverRect.top + 2,
            height: hoverRect.height - 4,
            left: hoverRect.left,
            opacity: 1,
          }}
          className="pointer-events-none absolute z-0 rounded-md bg-accent/50"
          exit={{ opacity: 0 }}
          initial={false}
          key="sb001-hover-bg"
          style={{ right: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      ) : null}
    </AnimatePresence>
  );
}

export interface Sidebar001ItemProps {
  href: string;
  label: React.ReactNode;
  isActive: boolean;
  isNew?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const Sidebar001Item = memo(function Sidebar001Item({
  href,
  label,
  isActive,
  isNew,
  className,
  onClick,
}: Sidebar001ItemProps) {
  const { hovered, setHovered, containerRef } = useContext(HoverContext);
  const isHovered = hovered === href;
  const itemRef = useScrollToActive(isActive);

  const opacity = isActive
    ? 1
    : hovered !== null
      ? isHovered
        ? 1
        : 0.3
      : 0.55;
  const x = isActive ? 8 : isHovered ? 6 : 0;

  return (
    <div className="relative">
      {isActive ? (
        <motion.span
          animate={{ width: 23 }}
          className="pointer-events-none absolute top-1/2 left-[4px] z-10 h-[1.8px] -translate-y-1/2 rounded-full bg-accent-pro"
          layoutId="sb001-active-bar"
          transition={{ type: "spring", stiffness: 800, damping: 40 }}
        />
      ) : null}

      <motion.span
        animate={{ width: isActive ? 0 : isHovered ? 26 : 18 }}
        className="pointer-events-none absolute top-1/2 left-0 h-px -translate-y-1/2 bg-foreground/50"
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
      <motion.span className="pointer-events-none absolute top-1/4 left-0 h-px w-[13px] bg-foreground/30" />
      <motion.span className="pointer-events-none absolute top-0 left-0 h-px w-[16px] bg-foreground/30" />
      <motion.span className="pointer-events-none absolute top-3/4 left-0 h-px w-[13px] bg-foreground/30" />

      <motion.div
        animate={{ opacity, x }}
        ref={itemRef}
        style={{ transformOrigin: "left center" }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      >
        <Link
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "relative z-1 ml-2 flex select-none items-center gap-2 rounded-md py-1.5 pl-4 text-sm",
            className
          )}
          href={href}
          onClick={onClick}
          onMouseEnter={() => {
            const el = itemRef.current;
            const container = containerRef.current;

            if (el && container) {
              const elRect = el.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();

              setHovered(href, {
                top: elRect.top - containerRect.top,
                height: elRect.height,
                left: 25,
              });
            } else {
              setHovered(href);
            }
          }}
          onMouseLeave={() => setHovered(null)}
        >
          <span className="relative z-1 truncate">{label}</span>
          {isNew ? (
            <span className="size-1.5 shrink-0 rounded-full bg-accent-pro" />
          ) : null}
        </Link>
      </motion.div>
    </div>
  );
});

export function Sidebar001Separator({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-2 px-0 py-3.5 font-medium text-foreground/40 text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface Sidebar001GroupProps {
  label: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Sidebar001Group({
  label,
  children,
  defaultOpen = false,
  icon,
  className,
}: Sidebar001GroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();
  const { setHovered, containerRef } = useContext(HoverContext);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = useCallback(() => {
    const el = buttonRef.current;
    const container = containerRef.current;

    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setHovered(id, {
        top: elRect.top - containerRect.top,
        height: elRect.height,
        left: 0,
      });
    } else {
      setHovered(id);
    }
  }, [containerRef, id, setHovered]);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, [setHovered]);

  return (
    <div className={cn("flex flex-col", className)}>
      <button
        aria-expanded={isOpen}
        className="group relative z-1 flex w-full select-none items-center gap-1.5 py-1.5 pr-2 text-left"
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={buttonRef}
        type="button"
      >
        {icon ? (
          <>
            <span className="shrink-0 text-foreground/35 [&_svg]:size-3.5">
              {icon}
            </span>
            <span className="flex-1 text-foreground/45 text-sm transition-colors duration-150 group-hover:text-foreground/70">
              {label}
            </span>
            <MotionChevron
              animate={{ rotate: isOpen ? 90 : 0 }}
              className="mr-1 shrink-0 text-foreground/25"
              size={14}
              strokeWidth={2.5}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </>
        ) : (
          <>
            <MotionChevron
              animate={{ rotate: isOpen ? 90 : 0 }}
              className="shrink-0 text-foreground/35"
              size={11}
              strokeWidth={2.5}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            <span className="text-foreground/45 text-sm transition-colors duration-150 group-hover:text-foreground/70">
              {label}
            </span>
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="flex flex-col pl-3">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar001Section({
  label,
  children,
  className,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {label ? <Sidebar001Separator>{label}</Sidebar001Separator> : null}
      {children}
    </div>
  );
}

export function Sidebar001Content({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useContext(HoverContext).containerRef;

  return (
    <div className="relative flex min-h-0 flex-1">
      <div
        className={cn("no-scrollbar flex-1 overflow-y-auto py-4", className)}
        data-scroll-viewport
      >
        <div className="relative px-1 pb-24" ref={containerRef}>
          <HoverHighlight />
          {children}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-background via-background/75 to-transparent backdrop-blur-md"
        style={{
          WebkitMaskImage: SIDEBAR_BOTTOM_FADE_MASK,
          maskImage: SIDEBAR_BOTTOM_FADE_MASK,
        }}
      />
    </div>
  );
}

export interface Sidebar001Props {
  children: React.ReactNode;
  className?: string;
  defaultEffectsEnabled?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function Sidebar001({
  children,
  className,
  defaultEffectsEnabled = true,
  defaultWidth = 240,
  minWidth = 160,
  maxWidth = 400,
}: Sidebar001Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(defaultWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [width]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;

      const next = Math.min(
        maxWidth,
        Math.max(minWidth, startW.current + e.clientX - startX.current)
      );
      setWidth(next);
    },
    [maxWidth, minWidth]
  );

  const stopDragging = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <EffectsProvider defaultEnabled={defaultEffectsEnabled}>
      <HoverProvider containerRef={containerRef}>
        <aside
          className={cn(
            "relative flex h-full shrink-0 flex-col bg-background",
            className
          )}
          style={{ width }}
        >
          {children}

          <div
            className="group/handle absolute top-0 right-0 z-20 h-full w-1 cursor-col-resize touch-none"
            onLostPointerCapture={stopDragging}
            onPointerCancel={stopDragging}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDragging}
          >
            <div className="absolute top-0 right-0 h-full w-px bg-border/30 transition-colors duration-150 group-hover/handle:bg-border" />
          </div>
        </aside>
      </HoverProvider>
    </EffectsProvider>
  );
}

export function Sidebar001Header({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("shrink-0 px-3 pt-4 pb-2", className)}>{children}</div>
  );
}

export function Sidebar001Footer({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shrink-0 border-border/50 border-t px-3 pt-2 pb-4",
        className
      )}
    >
      {children}
    </div>
  );
}
