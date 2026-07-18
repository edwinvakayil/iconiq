"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useDocsSidebar } from "@/components/docs/split/docs-sidebar-context";
import { DocsSidebarNavContent } from "@/components/docs-sidebar-nav-content";
import { Sidebar001 } from "@/components/sidebar-001";
import { cn } from "@/lib/utils";

const SIDEBAR_GAP = 8;

const SIDEBAR_TOP_DISSOLVE_MASK =
  "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.75) 10px, black 16px, black 100%)";

const SIDEBAR_RIGHT_MASK =
  "linear-gradient(to right, rgba(0,0,0,0.45) 0%, black 8%, black 68%, rgba(0,0,0,0.55) 84%, transparent 100%)";

const SIDEBAR_BLUR_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage: `${SIDEBAR_TOP_DISSOLVE_MASK}, ${SIDEBAR_RIGHT_MASK}`,
  maskImage: `${SIDEBAR_TOP_DISSOLVE_MASK}, ${SIDEBAR_RIGHT_MASK}`,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

const SIDEBAR_CONTENT_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage: SIDEBAR_RIGHT_MASK,
  maskImage: SIDEBAR_RIGHT_MASK,
};

function useSidebarLayout(
  anchorRef: React.RefObject<HTMLDivElement | null>,
  isOpen: boolean
) {
  const [layout, setLayout] = React.useState<{
    top: number;
    height: number;
  } | null>(null);

  React.useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!(anchor && isOpen)) {
      setLayout(null);
      return;
    }

    const updateLayout = () => {
      const rect = anchor.getBoundingClientRect();
      const top = rect.bottom + SIDEBAR_GAP;
      setLayout({
        top,
        height: Math.max(0, window.innerHeight - top),
      });
    };

    updateLayout();

    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateLayout, true);

    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout, true);
    };
  }, [anchorRef, isOpen]);

  return layout;
}

function useCloseOnClickOutside(
  isOpen: boolean,
  close: () => void,
  panelRef: React.RefObject<HTMLElement | null>,
  anchorRef: React.RefObject<HTMLDivElement | null>
) {
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (panelRef.current?.contains(target)) {
        return;
      }

      if (anchorRef.current?.contains(target)) {
        return;
      }

      close();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [anchorRef, close, isOpen, panelRef]);
}

export function FloatingDocsSidebarPanel() {
  const { isOpen, close, anchorRef } = useDocsSidebar();
  const panelRef = React.useRef<HTMLElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const layout = useSidebarLayout(anchorRef, isOpen);

  useCloseOnClickOutside(isOpen, close, panelRef, anchorRef);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence initial={false}>
      {isOpen && layout ? (
        <motion.aside
          animate={{ x: 0 }}
          className="fixed left-0 z-50 w-[min(20rem,88vw)] sm:w-80"
          exit={{ x: "-100%" }}
          initial={{ x: "-100%" }}
          ref={panelRef}
          style={{ top: layout.top, height: layout.height }}
          transition={{ type: "spring", duration: 0.38, bounce: 0 }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-xl backdrop-saturate-150 dark:bg-[#080808]/30"
            style={SIDEBAR_BLUR_MASK_STYLE}
          />

          <div
            className={cn(
              "relative z-10 flex h-full min-h-0 flex-col overflow-hidden",
              "[&_[aria-hidden=true].absolute]:bg-transparent [&_[aria-hidden=true].absolute]:backdrop-blur-none"
            )}
            style={SIDEBAR_CONTENT_MASK_STYLE}
          >
            <Sidebar001
              className="!bg-transparent h-full min-h-0 [&>div:last-child]:hidden"
              defaultWidth={320}
              maxWidth={320}
              minWidth={280}
            >
              <nav
                aria-label="Documentation navigation"
                className="flex min-h-0 flex-1"
              >
                <DocsSidebarNavContent contentClassName="!pt-6" />
              </nav>
            </Sidebar001>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
