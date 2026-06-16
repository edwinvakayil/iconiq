"use client";

import type { Transition, Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const useLoop = (delay = 1000) => {
  const [key, setKey] = useState(0);

  const incrementKey = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(incrementKey, delay);
    return () => clearInterval(interval);
  }, [delay, incrementKey]);

  return { key };
};

function nodeText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(nodeText).join("");
  }

  if (isValidElement<{ children?: React.ReactNode }>(node)) {
    return nodeText(node.props.children);
  }

  return "";
}

export type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
};

function TextLoop({
  children,
  className,
  interval = 1,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
}: TextLoopProps) {
  const items = Children.toArray(children);
  const { key } = useLoop(interval * 1000);
  const currentIndex = useMemo(
    () => (items.length > 0 ? key % items.length : 0),
    [items.length, key]
  );
  const longestItem = useMemo(
    () =>
      items.reduce((longest, item) =>
        nodeText(item).length > nodeText(longest).length ? item : longest
      ),
    [items]
  );

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const motionVariants: Variants = {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "-100%" },
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <span
      className={cn(
        "relative inline-grid align-baseline leading-none",
        className
      )}
      style={{ verticalAlign: "baseline" }}
    >
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
      >
        {longestItem}
      </span>
      <span className="relative col-start-1 row-start-1 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            animate="animate"
            className="block whitespace-nowrap"
            exit="exit"
            initial="initial"
            key={key}
            transition={transition}
            variants={variants ?? motionVariants}
          >
            {items[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

export { TextLoop, useLoop };
