"use client";

import { motion } from "motion/react";

import { SITE } from "@/constants";

export function BeatingHeartTitle() {
  return (
    <h1 className="text-center font-bold font-sans text-[32px] text-neutral-900 tracking-tight min-[640px]:text-[42px] dark:text-white">
      Support {SITE.NAME}{" "}
      <motion.span
        animate={{
          scale: [1, 1.2, 1, 1.15, 1],
        }}
        aria-hidden
        className="inline-block"
        transition={{
          duration: 3.4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.6, 0.8],
        }}
      >
        ❤️
      </motion.span>
    </h1>
  );
}
