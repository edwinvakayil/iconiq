"use client";

import { motion } from "motion/react";

import { SITE } from "@/constants";

export function BeatingHeartTitle() {
  return (
    <p className="max-w-2xl text-[15px] text-secondary leading-7">
      When {SITE.NAME} helps your work, small contributions keep docs, examples,
      and motion details moving forward{" "}
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
    </p>
  );
}
