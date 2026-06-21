"use client";

import * as React from "react";

export function useSmoothCodeHeight<const T extends readonly unknown[]>(
  ...deps: T
) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState<number | undefined>(
    undefined
  );

  const measureHeight = React.useCallback(() => {
    const el = contentRef.current;
    if (el) {
      setContentHeight(el.scrollHeight);
    }
  }, []);

  React.useLayoutEffect(() => {
    measureHeight();
  }, [measureHeight, ...deps]);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) {
      return;
    }

    const observer = new ResizeObserver(measureHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measureHeight, ...deps]);

  return {
    contentRef,
    contentHeight,
    wrapperProps: {
      className: "overflow-hidden transition-[height] duration-200 ease-out",
      style: {
        height: contentHeight !== undefined ? contentHeight : ("auto" as const),
      },
    },
  };
}
