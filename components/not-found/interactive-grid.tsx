"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CELL_SIZE = 64;
const FADE_DURATION_MS = 650;

const FILL_COLORS = [
  "rgb(207 238 255 / 0.9)",
  "rgb(253 230 138 / 0.9)",
  "rgb(251 207 232 / 0.9)",
  "rgb(187 247 208 / 0.9)",
  "rgb(221 214 254 / 0.9)",
  "rgb(254 215 170 / 0.9)",
  "rgb(165 243 252 / 0.9)",
  "rgb(252 231 243 / 0.9)",
] as const;

const DARK_FILL_COLORS = [
  "rgb(14 116 144 / 0.55)",
  "rgb(161 98 7 / 0.5)",
  "rgb(157 23 77 / 0.45)",
  "rgb(21 128 61 / 0.45)",
  "rgb(91 33 182 / 0.45)",
  "rgb(194 65 12 / 0.45)",
  "rgb(8 145 178 / 0.5)",
  "rgb(190 24 93 / 0.45)",
] as const;

type FadeState = {
  fadeOut: boolean;
};

function cellKey(col: number, row: number) {
  return `${col}:${row}`;
}

function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setPrefersDark(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return prefersDark;
}

export function NotFoundInteractiveGrid() {
  const { width, height } = useViewportSize();
  const [hovered, setHovered] = useState<{ col: number; row: number } | null>(
    null
  );
  const [fadingCells, setFadingCells] = useState<Record<string, FadeState>>({});
  const fadeTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timers = fadeTimersRef.current;
    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  const prefersDark = usePrefersDark();
  const palette = isDark || prefersDark ? DARK_FILL_COLORS : FILL_COLORS;

  const { columns, rows } = useMemo(() => {
    if (width === 0 || height === 0) {
      return { columns: 0, rows: 0 };
    }

    return {
      columns: Math.ceil(width / CELL_SIZE),
      rows: Math.ceil(height / CELL_SIZE),
    };
  }, [width, height]);

  const cells = useMemo(() => {
    if (columns === 0 || rows === 0) return [];

    return Array.from({ length: columns * rows }, (_, index) => ({
      col: index % columns,
      row: Math.floor(index / columns),
    }));
  }, [columns, rows]);

  const startFade = useCallback((col: number, row: number) => {
    const key = cellKey(col, row);

    const existingTimer = fadeTimersRef.current.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    setFadingCells((current) => ({
      ...current,
      [key]: { fadeOut: false },
    }));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFadingCells((current) => {
          if (!current[key]) {
            return current;
          }

          return {
            ...current,
            [key]: { fadeOut: true },
          };
        });
      });
    });

    const timer = setTimeout(() => {
      setFadingCells((current) => {
        if (!current[key]) {
          return current;
        }

        const next = { ...current };
        delete next[key];
        return next;
      });
      fadeTimersRef.current.delete(key);
    }, FADE_DURATION_MS);

    fadeTimersRef.current.set(key, timer);
  }, []);

  const handleCellEnter = useCallback(
    (col: number, row: number) => {
      setHovered((current) => {
        if (current && (current.col !== col || current.row !== row)) {
          startFade(current.col, current.row);
        }

        return { col, row };
      });
    },
    [startFade]
  );

  const handleGridLeave = useCallback(() => {
    setHovered((current) => {
      if (current) {
        startFade(current.col, current.row);
      }

      return null;
    });
  }, [startFade]);

  if (cells.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0 grid"
      onMouseLeave={handleGridLeave}
      style={{
        gridTemplateColumns: `repeat(${columns}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
      }}
    >
      {cells.map(({ col, row }) => {
        const key = cellKey(col, row);
        const isHovered = hovered?.col === col && hovered?.row === row;
        const fadeState = fadingCells[key];
        const isFading = fadeState !== undefined;
        const color = palette[(col + row) % palette.length] ?? palette[0];
        const showColor = isHovered || isFading;

        let opacity = 1;
        if (isFading && !isHovered) {
          opacity = fadeState.fadeOut ? 0 : 1;
        }

        return (
          <div
            className="size-16 border border-black/[0.018] bg-transparent transition-opacity duration-[650ms] ease-out dark:border-white/[0.03]"
            key={key}
            onMouseEnter={() => handleCellEnter(col, row)}
            style={{
              backgroundColor: showColor ? color : undefined,
              opacity: showColor ? opacity : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
