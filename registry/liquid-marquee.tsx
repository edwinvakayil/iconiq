"use client";

import { type ReactNode, useEffect, useRef } from "react";

export interface LiquidMarqueeProps {
  children: ReactNode;
  speed?: number; // pixels per second
  direction?: "left" | "right";
  className?: string;
  pauseOnHover?: boolean;
}

export function LiquidMarquee({
  children,
  speed = 45,
  direction = "left",
  className = "",
  pauseOnHover = true,
}: LiquidMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    let lastTime = performance.now();
    const dir = direction === "left" ? -1 : 1;

    function animate(now: number) {
      const track = trackRef.current;
      if (!track) return;

      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!isHoveredRef.current) {
        posRef.current += speed * dt * dir;
      }

      const itemWidth = track.scrollWidth / 2;
      if (dir < 0 && posRef.current <= -itemWidth) {
        posRef.current += itemWidth;
      } else if (dir > 0 && posRef.current >= 0) {
        posRef.current -= itemWidth;
      }

      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, direction]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => {
        if (pauseOnHover) isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        if (pauseOnHover) isHoveredRef.current = false;
      }}
      ref={containerRef}
    >
      {/* SVG liquid filter */}
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <filter id="liquid-distort">
            <feTurbulence
              baseFrequency="0.01 0.005"
              numOctaves="2"
              result="noise"
              type="fractalNoise"
            >
              <animate
                attributeName="baseFrequency"
                dur="20s"
                repeatCount="indefinite"
                values="0.01 0.005;0.015 0.008;0.01 0.005"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <filter id="liquid-glow">
            <feGaussianBlur result="blur" stdDeviation="3" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

      {/* Scrolling track */}
      <div
        className="flex items-center will-change-transform"
        ref={trackRef}
        style={{ filter: "url(#liquid-distort)" }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
