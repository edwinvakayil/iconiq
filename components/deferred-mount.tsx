"use client";

import { type ReactNode, useEffect, useState } from "react";

let hasHydratedClient = false;

function scheduleAfterPaint(callback: () => void) {
  let frame = 0;
  let frameId = 0;

  const tick = () => {
    frame += 1;

    if (frame >= 2) {
      callback();
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
  };
}

/**
 * Mounts children after the current view transition (or the next paint) so route
 * changes stay responsive while heavy previews load.
 */
export function DeferredMount({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);

    let cancelled = false;
    let cleanupPaint: (() => void) | undefined;

    const mount = () => {
      if (cancelled) {
        return;
      }

      cleanupPaint?.();
      cleanupPaint = scheduleAfterPaint(() => {
        if (!cancelled) {
          setReady(true);
        }
      });
    };

    const supportsViewTransition =
      typeof document.startViewTransition === "function";

    if (!(hasHydratedClient && supportsViewTransition)) {
      hasHydratedClient = true;
      mount();
      return () => {
        cancelled = true;
        cleanupPaint?.();
      };
    }

    document.addEventListener("viewtransitionend", mount, { once: true });

    const fallbackTimer = window.setTimeout(mount, 180);

    return () => {
      cancelled = true;
      document.removeEventListener("viewtransitionend", mount);
      window.clearTimeout(fallbackTimer);
      cleanupPaint?.();
    };
  }, []);

  return ready ? children : fallback;
}
