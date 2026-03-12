"use client";

import { gsap } from "gsap";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MagicPenProps = {
  children: ReactNode;
  className?: string;
  clipRadiusPx?: number;
  defaultOpen?: boolean;
  toggleOnClick?: boolean;
  baseClassName?: string;
  overlayClassName?: string;
};

/**
 * "Magic Pen" overlay reveal:
 * - A dark overlay clipped by a circle following the cursor (CSS vars `--x`, `--y`)
 * - Click the button to expand the clip-path and reveal everything
 */
export function MagicPen({
  children,
  className,
  clipRadiusPx = 100,
  defaultOpen = false,
  toggleOnClick = true,
  baseClassName,
  overlayClassName,
}: MagicPenProps) {
  const overlayRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const clipRadius = Math.max(1, Math.round(clipRadiusPx));
  const toggle = () => setIsOpen((v) => !v);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);

      gsap.to(overlay, {
        "--x": `${x}%`,
        "--y": `${y}%`,
        duration: 0.15,
        ease: "sine.out",
        overwrite: true,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.killTweensOf(overlay);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-background text-foreground",
        className
      )}
      {...(toggleOnClick
        ? { role: "button" as const, tabIndex: 0, "aria-pressed": isOpen }
        : {})}
      onClick={toggleOnClick ? toggle : undefined}
      onKeyDown={
        toggleOnClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }
          : undefined
      }
    >
      <div
        className={cn(
          "relative min-h-[420px] p-8 text-(--magicpen-fg) sm:p-12",
          baseClassName
        )}
        style={
          {
            "--magicpen-bg": "var(--color-background)",
            "--magicpen-fg": "var(--color-foreground)",
          } as React.CSSProperties
        }
      >
        {children}
      </div>

      <section
        className={cn(
          "absolute inset-0 bg-foreground p-8 text-background sm:p-12",
          isOpen ? "duration-1300" : "duration-100"
        )}
        ref={overlayRef}
        style={
          {
            clipPath: isOpen
              ? "circle(200% at 100% 100%)"
              : `circle(${clipRadius}px at var(--x, 50%) var(--y, 50%))`,
            transitionProperty: "clip-path",
            transitionTimingFunction: isOpen
              ? "cubic-bezier(1,-0.01,.01,.99)"
              : "ease",
          } as React.CSSProperties
        }
      >
        <div
          className={cn("min-h-[420px] text-(--magicpen-fg)", overlayClassName)}
          style={
            {
              "--magicpen-bg": "var(--color-foreground)",
              "--magicpen-fg": "var(--color-background)",
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </section>
    </div>
  );
}
