"use client";

import { motion } from "motion/react";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface HoverExpandItem {
  label: string;
  /** e.g. country, year, category */
  sublabel?: string;
  image: string;
  imageAlt?: string;
  /** short descriptor shown when expanded */
  description?: string;
}

export interface HoverExpandProps {
  items: HoverExpandItem[];
  /**
   * Row height when collapsed, in pixels.
   * @default 76
   */
  collapsedHeight?: number;
  /**
   * Row height when expanded, in pixels.
   * @default 320
   */
  expandedHeight?: number;
  className?: string;
}

function RowBackground({
  isHovered,
  item,
}: {
  isHovered: boolean;
  item: HoverExpandItem;
}) {
  return (
    <motion.div
      animate={{
        opacity: isHovered ? 1 : 0,
        scale: isHovered ? 1 : 1.06,
      }}
      className="absolute inset-0 h-full w-full"
      initial={false}
      transition={{
        opacity: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
        scale: { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
      }}
    >
      <div className="relative h-full w-full">
        <Image
          alt={item.imageAlt?.trim() ? item.imageAlt : item.label}
          className="object-cover"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 800px"
          src={item.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      </div>
    </motion.div>
  );
}

function RowCaption({
  index,
  isHovered,
  item,
}: {
  item: HoverExpandItem;
  index: number;
  isHovered: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex px-5",
        isHovered ? "items-end pt-6 pb-4" : "items-center py-2.5"
      )}
    >
      <div
        className={cn(
          "flex w-full justify-between gap-4",
          isHovered ? "items-end" : "items-baseline"
        )}
      >
        <div className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1.5">
          <motion.span
            animate={{
              color: isHovered ? "#ffffff" : "currentColor",
              opacity: isHovered ? 0.5 : 0.4,
            }}
            className="shrink-0 text-xs tabular-nums opacity-40"
            transition={{ duration: 0.2 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          <motion.span
            animate={{
              color: isHovered ? "#ffffff" : "currentColor",
            }}
            className="min-w-0 break-words font-semibold tracking-tight"
            style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
            transition={{ duration: 0.2 }}
          >
            {item.label}
          </motion.span>

          {item.description && isHovered ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="col-start-2 min-w-0 text-sm text-white/70 leading-snug"
              initial={{ opacity: 0, y: 6 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {item.description}
            </motion.div>
          ) : null}
        </div>

        {item.sublabel ? (
          <motion.span
            animate={{
              color: isHovered ? "rgba(255,255,255,0.55)" : "currentColor",
              opacity: isHovered ? 1 : 0.45,
            }}
            className="shrink-0 text-xs uppercase tracking-widest"
            transition={{ duration: 0.2 }}
          >
            {item.sublabel}
          </motion.span>
        ) : null}
      </div>
    </div>
  );
}

function HoverExpandRow({
  collapsedHeight,
  expandedHeight,
  hoveredIndex,
  index,
  item,
  setHoveredIndex,
}: {
  item: HoverExpandItem;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
  collapsedHeight: number;
  expandedHeight: number;
}) {
  const isHovered = hoveredIndex === index;
  const isOtherHovered = hoveredIndex !== null && !isHovered;

  return (
    <>
      <motion.div
        animate={{
          height: isHovered ? expandedHeight : collapsedHeight,
          opacity: isOtherHovered ? 0.38 : 1,
        }}
        className="relative w-full cursor-default overflow-hidden"
        onHoverEnd={() => setHoveredIndex(null)}
        onHoverStart={() => setHoveredIndex(index)}
        transition={{
          height: {
            type: "spring",
            stiffness: 280,
            damping: 32,
            mass: 0.9,
          },
          opacity: { duration: 0.22, ease: "easeOut" },
        }}
      >
        <RowBackground isHovered={isHovered} item={item} />
        <RowCaption index={index} isHovered={isHovered} item={item} />
      </motion.div>

      <div className="w-full border-current border-t opacity-15" />
    </>
  );
}

export function HoverExpand({
  items,
  collapsedHeight = 76,
  expandedHeight = 320,
  className,
}: HoverExpandProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="w-full border-current border-t opacity-15" />

      {items.map((item, i) => (
        <HoverExpandRow
          collapsedHeight={collapsedHeight}
          expandedHeight={expandedHeight}
          hoveredIndex={hoveredIndex}
          index={i}
          item={item}
          key={`${item.label}-${i}`}
          setHoveredIndex={setHoveredIndex}
        />
      ))}
    </div>
  );
}
